'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraStreamViewerProps {
  roomId: string;
  mode: 'webrtc' | 'websocket';
  className?: string;
}

export default function CameraStreamViewer({ roomId, mode, className = '' }: CameraStreamViewerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === 'webrtc') {
      setupWebRTC();
    } else {
      setupWebSocket();
    }

    return () => {
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, mode]);

  const cleanup = () => {
    if (pcRef.current) {
      pcRef.current.close();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsConnected(false);
  };

  const setupWebRTC = async () => {
    try {
      // Create peer connection
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      });

      // Set up video element for remote stream
      pcRef.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
        }
      };

      // Poll for signaling data (simplified approach)
      const pollSignaling = async () => {
        try {
          const response = await fetch('/api/webrtc-signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'get-signal', roomId })
          });

          const data = await response.json();
          
          if (data.offer && !pcRef.current?.remoteDescription) {
            await pcRef.current?.setRemoteDescription(data.offer);
            const answer = await pcRef.current?.createAnswer();
            await pcRef.current?.setLocalDescription(answer!);
            
            // Send answer
            await fetch('/api/webrtc-signal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'answer', roomId, answer })
            });
          }
          
          // Add any new ICE candidates
          for (const candidate of data.iceCandidates || []) {
            await pcRef.current?.addIceCandidate(candidate);
          }
        } catch (err) {
          console.error('Signaling error:', err);
        }
      };

      // Poll every second
      intervalRef.current = setInterval(pollSignaling, 1000);
      
    } catch (err) {
      console.error('WebRTC setup error:', err);
      setError('WebRTC connection failed. Try WebSocket mode.');
    }
  };

  const setupWebSocket = () => {
    // Poll for frames
    const fetchFrame = async () => {
      try {
        const apiUrl = window.location.hostname === 'localhost' 
          ? `/api/camera-stream?roomId=${roomId}`
          : `${window.location.origin}/api/camera-stream?roomId=${roomId}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          console.log('Stream fetch failed:', response.status);
          setIsConnected(false);
          return;
        }
        
        const data = await response.json();
        console.log('Received frame data:', data.frame ? 'Yes' : 'No', 'Room:', roomId);
        
        if (data.frame && canvasRef.current) {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && canvas) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              setIsConnected(true);
            }
          };
          img.src = data.frame;
        }
      } catch (err) {
        console.error('Frame fetch error:', err);
        setIsConnected(false);
      }
    };

    // Fetch frames at 10 FPS
    intervalRef.current = setInterval(fetchFrame, 100);
    fetchFrame(); // Initial fetch
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {mode === 'webrtc' ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
      )}
      
      {/* Connection Status Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <span className="text-white text-sm font-semibold">
          {isConnected ? 'Connected' : 'Waiting for stream...'}
        </span>
      </div>
      
      {/* Mode indicator */}
      <div className="absolute top-4 right-4">
        <span className="text-white text-xs bg-gray-800 px-2 py-1 rounded">
          {mode === 'webrtc' ? 'WebRTC' : 'WebSocket'}
        </span>
      </div>
      
      {error && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-red-500/90 text-white text-sm p-2 rounded">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}