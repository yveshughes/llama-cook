'use client';

import { useState } from 'react';
import DualModeQRDisplay from '@/components/DualModeQRDisplay';
import CameraStreamViewer from '@/components/CameraStreamViewer';

export default function CameraStreamDemo() {
  const [sessionInfo, setSessionInfo] = useState<{
    roomId: string;
    mode: 'webrtc' | 'websocket';
  } | null>({ roomId: 'demo-room-001', mode: 'websocket' }); // Default to fixed room ID

  const handleSessionCreated = (roomId: string, mode: 'webrtc' | 'websocket') => {
    setSessionInfo({ roomId, mode });
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Camera Stream Demo</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div>
            <DualModeQRDisplay 
              onSessionCreated={handleSessionCreated}
              className="mb-4"
            />
          </div>
          
          {/* Stream Display Section */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Stream</h3>
              
              {sessionInfo ? (
                <CameraStreamViewer
                  roomId={sessionInfo.roomId}
                  mode={sessionInfo.mode}
                  className="aspect-video"
                />
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Waiting for camera connection...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-3">How to Test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Choose your connection mode (Same Network for best performance)</li>
            <li>Scan the QR code with your iPhone</li>
            <li>Allow camera permissions when prompted</li>
            <li>Tap "Start Streaming" on your phone</li>
            <li>The video feed will appear on this page</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> WebRTC mode requires both devices to be on the same network. 
              If it fails, the WebSocket mode will work from anywhere but with slightly higher latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}