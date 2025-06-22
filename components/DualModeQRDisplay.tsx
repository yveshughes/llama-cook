'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface DualModeQRDisplayProps {
  className?: string;
  onSessionCreated?: (sessionId: string, mode: 'webrtc' | 'websocket') => void;
}

export default function DualModeQRDisplay({ className = '', onSessionCreated }: DualModeQRDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [connectionMode, setConnectionMode] = useState<'webrtc' | 'websocket'>('webrtc');
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Use fixed session ID for demo
    setSessionId('demo-room-001');
  }, []);

  useEffect(() => {
    if (sessionId) {
      generateQRCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionMode, sessionId]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get the camera base URL
      const cameraBaseUrl = process.env.NEXT_PUBLIC_CAMERA_BASE_URL || window.location.origin;
      
      // Create URL for camera page with mode and session parameters
      const cameraUrl = `${cameraBaseUrl}/camera?mode=${connectionMode}&room=${sessionId}`;
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(cameraUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      setQrCodeUrl(qrDataUrl);
      setIsLoading(false);
      
      // Notify parent component
      if (onSessionCreated) {
        onSessionCreated(sessionId, connectionMode);
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: 'webrtc' | 'websocket') => {
    setConnectionMode(mode);
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Camera Input</h3>
        
        {/* Connection Mode Selection */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Choose Connection Mode:</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleModeChange('webrtc')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                connectionMode === 'webrtc'
                  ? 'bg-herb-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🏠</span>
              <div className="text-left">
                <div className="text-sm">Same Network</div>
                <div className="text-xs opacity-75">Low latency</div>
              </div>
            </button>
            
            <button
              onClick={() => handleModeChange('websocket')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                connectionMode === 'websocket'
                  ? 'bg-herb-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">🌐</span>
              <div className="text-left">
                <div className="text-sm">Internet</div>
                <div className="text-xs opacity-75">Works anywhere</div>
              </div>
            </button>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="w-64 h-64 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-herb-green"></div>
          ) : qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
          ) : (
            <div className="text-gray-400">Generating QR Code...</div>
          )}
        </div>
        
        {/* Instructions */}
        <p className="text-sm text-gray-600 mb-2">Scan with iPhone camera</p>
        
        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span className="text-xs text-gray-600">
            Waiting for connection...
          </span>
        </div>
        
        {/* Mode-specific instructions */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
          {connectionMode === 'webrtc' ? (
            <>
              <p className="font-semibold mb-1">Same Network Mode:</p>
              <p>Ensure both devices are on the same WiFi network for best performance.</p>
            </>
          ) : (
            <>
              <p className="font-semibold mb-1">Internet Mode:</p>
              <p>Works across different networks but may have slight delay.</p>
            </>
          )}
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}