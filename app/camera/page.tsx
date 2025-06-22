'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CameraPage() {
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
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const startStreaming = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    setIsStreaming(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    // Notify server that streaming is starting
    try {
      await fetch(`${serverUrl}/stream/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          client_info: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (err) {
      console.error('Error starting stream:', err);
    }

    // Stream frames to server
    const streamFrame = async () => {
      if (!isStreaming || !ctx) return;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = imageData.split(',')[1];

      // Send to server
      try {
        const response = await fetch(`${serverUrl}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            image: base64Data,
            timestamp: Date.now()
          })
        });

        if (response.ok) {
          const data = await response.json();
          // Could display detection results here
          console.log('Detections:', data.detections);
        }
      } catch (err) {
        console.error('Error sending frame:', err);
      }

      // Continue streaming at ~10 FPS
      if (isStreaming) {
        setTimeout(streamFrame, 100);
      }
    };

    streamFrame();
  };

  const stopStreaming = async () => {
    setIsStreaming(false);
    
    // Notify server that streaming is stopping
    try {
      await fetch(`${serverUrl}/stream/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
    } catch (err) {
      console.error('Error stopping stream:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Llama Cook Camera</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Hidden canvas for frame capture */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="hidden"
          />

          {/* Status overlay */}
          {isStreaming && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              STREAMING
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          {!isStreaming ? (
            <button
              onClick={startStreaming}
              className="px-8 py-3 bg-herb-green text-white rounded-lg font-semibold hover:bg-herb-green/90 transition-colors"
              disabled={!!error}
            >
              Start Streaming
            </button>
          ) : (
            <button
              onClick={stopStreaming}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Stop Streaming
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Session ID: {sessionId}</p>
          <p>Server: {serverUrl}</p>
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