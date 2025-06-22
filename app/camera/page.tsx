'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// WebRTC configuration with free STUN servers
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

function CameraPageContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [autoStarting, setAutoStarting] = useState(true);
  
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'webrtc' | 'websocket' || 'websocket';
  const roomId = searchParams.get('room') || '';
  const [actualRoomId, setActualRoomId] = useState('');
  
  // WebRTC refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  // WebSocket streaming ref
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Use fixed room ID for demo
    setActualRoomId(roomId || 'demo-room-001');
    startCamera();
    // Auto-start streaming after camera is ready
    const autoStartTimer = setTimeout(() => {
      if (!isStreaming && videoRef.current?.srcObject) {
        setAutoStarting(false);
        startStreaming();
      }
    }, 2500); // Give camera 2.5 seconds to initialize
    return () => {
      clearTimeout(autoStartTimer);
      cleanup();
    };
  }, [roomId]);

  const cleanup = () => {
    if (pcRef.current) {
      pcRef.current.close();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log('Camera access denied');
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('Video not ready yet');
      return null;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Use lower quality for faster transmission
    return canvas.toDataURL('image/jpeg', 0.5);
  };

  const startWebRTCStreaming = async () => {
    setConnectionStatus('connecting');
    
    try {
      // Create WebSocket connection for signaling
      // Note: This won't work with Next.js, but we'll try anyway and fallback
      const wsUrl = window.location.protocol === 'https:' 
        ? `wss://${window.location.host}/api/webrtc-signal`
        : `ws://${window.location.host}/api/webrtc-signal`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        // Join room
        wsRef.current?.send(JSON.stringify({
          type: 'join',
          roomId: actualRoomId,
          role: 'sender'
        }));
      };
      
      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'joined':
            await initWebRTC();
            break;
          case 'answer':
            if (pcRef.current) {
              await pcRef.current.setRemoteDescription(data.answer);
            }
            break;
          case 'ice-candidate':
            if (pcRef.current) {
              await pcRef.current.addIceCandidate(data.candidate);
            }
            break;
        }
      };
      
      wsRef.current.onerror = () => {
        // Don't log error object as it causes console errors
        console.log('WebRTC signaling not available, falling back to WebSocket mode');
        setConnectionStatus('disconnected');
        // Automatically fallback to WebSocket streaming
        if (!isStreaming) {
          startWebSocketStreaming();
        }
      };
      
    } catch (err) {
      console.log('WebRTC not available, using WebSocket mode');
      setConnectionStatus('disconnected');
      // Automatically fallback to WebSocket streaming
      startWebSocketStreaming();
    }
  };

  const initWebRTC = async () => {
    pcRef.current = new RTCPeerConnection(rtcConfig);
    
    // Add local stream
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => {
        pcRef.current?.addTrack(track, stream);
      });
    }
    
    // Handle ICE candidates
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          roomId: actualRoomId,
          candidate: event.candidate
        }));
      }
    };
    
    pcRef.current.onconnectionstatechange = () => {
      if (pcRef.current?.connectionState === 'connected') {
        setConnectionStatus('connected');
        setIsStreaming(true);
      }
    };
    
    // Create and send offer
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    
    wsRef.current?.send(JSON.stringify({
      type: 'offer',
      roomId: actualRoomId,
      offer
    }));
  };

  const startWebSocketStreaming = async () => {
    setConnectionStatus('connecting');
    setIsStreaming(true);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Send frames every 100ms (10 FPS)
    streamIntervalRef.current = setInterval(async () => {
      const frameData = captureFrame();
      if (!frameData) return;
      
      try {
        // Use absolute URL for API calls when not on localhost
        const apiUrl = window.location.hostname === 'localhost' 
          ? '/api/camera-stream'
          : `${window.location.origin}/api/camera-stream`;
          
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: actualRoomId,
            frame: frameData,
            timestamp: Date.now()
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send frame');
        }
        
        successCount++;
        failureCount = 0; // Reset failure count on success
        
        // Only set connected after first successful frame
        if (successCount === 1) {
          setConnectionStatus('connected');
        }
      } catch (err) {
        failureCount++;
        console.log('Stream attempt failed, retry #' + failureCount);
        
        // Show error after 5 consecutive failures
        if (failureCount > 5) {
          setError('Unable to connect to streaming server. Please check your connection.');
          setIsStreaming(false);
          setConnectionStatus('disconnected');
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
          }
        }
      }
    }, 100);
  };

  const startStreaming = async () => {
    setError('');
    if (mode === 'webrtc') {
      await startWebRTCStreaming();
    } else {
      await startWebSocketStreaming();
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setConnectionStatus('disconnected');
    cleanup();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Llama-Cook Camera</h1>
        
        {autoStarting && !error && (
          <div className="bg-blue-500/10 border border-blue-500 text-blue-400 p-4 rounded-lg mb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span>Auto-starting stream...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {isStreaming && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">LIVE</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 mb-6">
          {!isStreaming ? (
            <button
              onClick={startStreaming}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Streaming
            </button>
          ) : (
            <button
              onClick={stopStreaming}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Stop Streaming
            </button>
          )}
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Connection Details</h2>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-500">Mode:</span> {mode === 'webrtc' ? 'Same Network (WebRTC)' : 'Internet (WebSocket)'}</div>
            <div><span className="text-gray-500">Room ID:</span> {actualRoomId}</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Status:</span>
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-900 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Allow camera permissions when prompted</li>
            <li>Position camera to show ingredients</li>
            <li>Tap &quot;Start Streaming&quot; to begin</li>
            <li>View the stream on your desktop display</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function CameraPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading camera...</p>
        </div>
      </div>
    }>
      <CameraPageContent />
    </Suspense>
  );
}