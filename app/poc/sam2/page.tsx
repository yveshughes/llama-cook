'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import POCNavigation from '@/components/POCNavigation';
import VideoPlayer, { VideoPlayerRef } from './components/VideoPlayer';
import InfoPanel from './components/InfoPanel';
import QRCodeDisplay from './components/QRCodeDisplay';
import LiveCameraView from './components/LiveCameraView';
import { videos } from './data/videos';
import { sequences, getDetectionsAtTime, interpolateDetection, Detection } from './data/detections';

export default function SAM2POC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [currentTime, setCurrentTime] = useState(0);
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  const [liveSessionId, setLiveSessionId] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(true);
  
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const lastDetectionsRef = useRef<Map<string, Detection>>(new Map());
  const lastUpdateTimeRef = useRef<number>(0);

  // Use the only video - Caprese Salad
  const currentVideo = videos[0];
  const currentVideoId = currentVideo.id;

  // Handle video time updates with throttling
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    
    // Throttle detection updates to every 100ms to improve performance
    if (time - lastUpdateTimeRef.current < 100) {
      return;
    }
    lastUpdateTimeRef.current = time;
    
    const sequence = sequences[currentVideoId as keyof typeof sequences];
    if (!sequence) return;
    
    // Get raw detections at current time
    const rawDetections = getDetectionsAtTime(sequence, time);
    
    // Interpolate positions for smooth movement
    const interpolatedDetections = rawDetections.map(detection => {
      const lastDetection = lastDetectionsRef.current.get(detection.id);
      return interpolateDetection(lastDetection, detection, time);
    });
    
    // Update last detections reference
    interpolatedDetections.forEach(d => {
      lastDetectionsRef.current.set(d.id, d);
    });
    
    // Clean up old detections
    const currentIds = new Set(interpolatedDetections.map(d => d.id));
    for (const id of lastDetectionsRef.current.keys()) {
      if (!currentIds.has(id)) {
        lastDetectionsRef.current.delete(id);
      }
    }
    
    setCurrentDetections(interpolatedDetections);
  }, [currentVideoId]);

  // Handle video metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    // Metadata is loaded but we don't need to store it without AR overlays
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-herb-green">
              Llama Cook
            </Link>
            <Link 
              href="/#sam2" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-herb-green/10 px-4 py-2 text-sm font-medium text-herb-green">
                  SAM2
                </span>
                <span className="text-2xl">👁️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Real-Time Ingredient Detection
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Powered by Meta&apos;s Segment Anything Model 2
                </p>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('demo')}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  mode === 'demo' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Watch Demo
              </button>
              <button
                onClick={() => setMode('live')}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  mode === 'live' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Try Live
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo/Live Section */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Area */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {mode === 'live' ? (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    {showQRCode ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <QRCodeDisplay 
                          onSessionCreated={(sessionId) => {
                            setLiveSessionId(sessionId);
                          }}
                        />
                      </div>
                    ) : (
                      <LiveCameraView 
                        sessionId={liveSessionId}
                        serverUrl={process.env.NEXT_PUBLIC_SAM2_SERVER_URL || 'http://localhost:5000'}
                      />
                    )}
                    
                    {liveSessionId && (
                      <button
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition-colors"
                      >
                        {showQRCode ? 'Show Live View' : 'Show QR Code'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <VideoPlayer
                      ref={videoPlayerRef}
                      video={currentVideo}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Side Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Live Detections */}
              <InfoPanel
                detections={currentDetections}
                currentTime={currentTime}
              />

              {/* How It Works */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How SAM2 Works
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-herb-green/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Real-time Detection</p>
                      <p className="text-sm text-gray-600">Identifies ingredients as they appear in frame</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-herb-green/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Object Tracking</p>
                      <p className="text-sm text-gray-600">Follows ingredients as they move and transform</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-herb-green/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">State Recognition</p>
                      <p className="text-sm text-gray-600">Understands when ingredients are chopped, mixed, or cooked</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration with Llama */}
              <div className="bg-golden/5 rounded-lg p-6 border border-golden/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Powers Intelligent Cooking
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  SAM2&apos;s detections feed directly into Llama, enabling:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-golden mt-0.5">•</span>
                    <span>Automatic recipe suggestions based on available ingredients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-golden mt-0.5">•</span>
                    <span>Real-time cooking guidance and technique tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-golden mt-0.5">•</span>
                    <span>Smart substitution recommendations</span>
                  </li>
                </ul>
                <Link 
                  href="/poc/llama"
                  className="inline-flex items-center text-sm font-medium text-herb-green hover:text-herb-green/80 mt-4"
                >
                  <span>See Llama Integration</span>
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POC Navigation */}
      <POCNavigation />
    </main>
  );
}