'use client';

import { useEffect, useState, useRef } from 'react';
import AROverlay from './AROverlay';
import { Detection } from '../data/detections';

interface LiveCameraViewProps {
  sessionId: string;
  serverUrl: string;
}

export default function LiveCameraView({ sessionId, serverUrl }: LiveCameraViewProps) {
  const [detections] = useState<Detection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastFrame] = useState<string>('');
  const [frameSize] = useState({ width: 640, height: 480 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Poll for updates from the server
    const checkForUpdates = async () => {
      try {
        const response = await fetch(`${serverUrl}/sessions`);
        if (response.ok) {
          const data = await response.json();
          const session = data.sessions[sessionId];
          
          if (session && session.status === 'active') {
            setIsConnected(true);
            
            // In a real implementation, you'd get the actual frame and detections
            // For now, we'll use the mock data from the server
            // You could also implement WebSocket for real-time updates
          }
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Start polling with longer interval to reduce load
    checkForUpdates();
    intervalRef.current = setInterval(checkForUpdates, 3000); // Poll every 3 seconds instead of 1

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId, serverUrl]);

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {!isConnected ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">Waiting for Camera Connection</p>
            <p className="text-sm text-gray-400">Scan the QR code with your iPhone to start</p>
            <p className="text-xs text-gray-500 mt-4">Session: {sessionId}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Camera feed would go here */}
          {lastFrame && (
            <img 
              src={lastFrame} 
              alt="Live camera feed" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* AR Overlay for detections */}
          <AROverlay
            detections={detections}
            videoWidth={frameSize.width}
            videoHeight={frameSize.height}
            isEnabled={true}
            className="absolute inset-0"
          />
          
          {/* Live indicator */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            LIVE
          </div>
          
          {/* Connection info */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
            <p>Connected to iPhone</p>
            <p className="text-gray-300">Detecting ingredients...</p>
          </div>
        </>
      )}
    </div>
  );
}