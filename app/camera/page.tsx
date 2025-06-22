'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CameraPageContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const serverUrl = searchParams.get('server') || process.env.NEXT_PUBLIC_SAM2_SERVER_URL || 'http://localhost:5000';
  const sessionId = searchParams.get('session') || `session_${Date.now()}`;

  useEffect(() => {
    startCamera();
  }, []);

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
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const startStreaming = async () => {
    setIsStreaming(true);
    setError('');
    
    // Send frames every 100ms (10 FPS)
    const interval = setInterval(async () => {
      if (!isStreaming) {
        clearInterval(interval);
        return;
      }
      
      const frameData = captureFrame();
      if (!frameData) return;
      
      try {
        const response = await fetch(`${serverUrl}/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            frame: frameData,
            timestamp: Date.now()
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to send frame:', response.statusText);
        }
      } catch (err) {
        console.error('Error sending frame:', err);
        setError('Failed to connect to server. Please check your connection.');
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 100);
    
    // Store interval ID for cleanup
    return () => clearInterval(interval);
  };

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Llama-Cook Camera</h1>
        
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
            <p><span className="text-gray-500">Server:</span> {serverUrl}</p>
            <p><span className="text-gray-500">Session:</span> {sessionId}</p>
            <p><span className="text-gray-500">Status:</span> {isStreaming ? 'Streaming' : 'Ready'}</p>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-900 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Allow camera permissions when prompted</li>
            <li>Position camera to show ingredients</li>
            <li>Tap &quot;Start Streaming&quot; to begin</li>
            <li>Video will be sent to SAM2 for analysis</li>
            <li>View results on desktop display</li>
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