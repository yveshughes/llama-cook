'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  className?: string;
  onSessionCreated?: (sessionId: string) => void;
}

export default function QRCodeDisplay({ className = '', onSessionCreated }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [serverUrl, setServerUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Get the SAM2 server URL from environment or use default
        const sam2ServerUrl = process.env.NEXT_PUBLIC_SAM2_SERVER_URL || 'http://localhost:5000';
        
        // Get the camera base URL - this should be your computer's IP or a public URL
        const cameraBaseUrl = process.env.NEXT_PUBLIC_CAMERA_BASE_URL || window.location.origin;
        
        // Create URL for camera page with server parameter
        const sessionId = `session_${Date.now()}`;
        const cameraUrl = `${cameraBaseUrl}/camera?server=${encodeURIComponent(sam2ServerUrl)}&session=${sessionId}`;
        
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
        setServerUrl(sam2ServerUrl);
        setIsLoading(false);
        
        // Notify parent component of session ID
        if (onSessionCreated) {
          onSessionCreated(sessionId);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [onSessionCreated]);

  // Check server health
  useEffect(() => {
    if (serverUrl) {
      const checkHealth = async () => {
        try {
          const response = await fetch(`${serverUrl}/health`);
          if (!response.ok) {
            setError('SAM2 server is not responding');
          }
        } catch {
          setError('Cannot connect to SAM2 server');
        }
      };
      
      checkHealth();
      // Check every 5 seconds
      const interval = setInterval(checkHealth, 5000);
      return () => clearInterval(interval);
    }
  }, [serverUrl]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-herb-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-red-500 mt-2">
            Make sure the SAM2 server is running at {serverUrl}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan to Start Camera</h3>
        <p className="text-sm text-gray-600 mb-6">Use your iPhone to begin live tracking</p>
        
        {/* QR Code */}
        <div className="w-64 h-64 mx-auto mb-6 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
          ) : (
            <div className="text-gray-400">Generating QR Code...</div>
          )}
        </div>
        
        {/* Server Status */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">SAM2 Server Active</span>
        </div>
        
        <p className="text-xs text-gray-500">
          Camera feed will appear here once connected
        </p>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 text-left">
            <p className="font-mono break-all">Camera URL: {process.env.NEXT_PUBLIC_CAMERA_BASE_URL || 'Not configured'}</p>
            <p className="font-mono break-all mt-1">Server: {serverUrl}</p>
            <p className="font-mono mt-1">Status: {error ? 'Error' : 'Ready'}</p>
          </div>
        )}
      </div>
    </div>
  );
}