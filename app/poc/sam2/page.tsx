'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import POCNavigation from '@/components/POCNavigation';
import VideoPlayer, { VideoPlayerRef } from './components/VideoPlayer';
import AROverlay from './components/AROverlay';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import { videos } from './data/videos';
import { sequences, getDetectionsAtTime, interpolateDetection, Detection } from './data/detections';

export default function SAM2POC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [isOverlayEnabled, setIsOverlayEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoMetadata, setVideoMetadata] = useState({ width: 640, height: 480 });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const lastDetectionsRef = useRef<Map<string, Detection>>(new Map());

  // Use the only video - Caprese Salad
  const currentVideo = videos[0];
  const currentVideoId = currentVideo.id;

  // Handle video time updates
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    
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
  const handleLoadedMetadata = useCallback((width: number, height: number) => {
    setVideoMetadata({ width, height });
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

      {/* Compact Hero Section */}
      <section className="pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-herb-green/10 px-3 py-1 text-sm font-medium text-herb-green">
                  SAM2
                </span>
                Live Demo
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Real-time ingredient detection and tracking
              </p>
            </div>
            
            {/* Mode Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('demo')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  mode === 'demo' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setMode('live')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  mode === 'live' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Live
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo/Live Section */}
      {mode === 'live' ? (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan to Start Camera</h3>
                    <p className="text-sm text-gray-600 mb-6">Use your iPhone to begin live tracking</p>
                    
                    {/* QR Code Placeholder */}
                    <div className="w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                      <div className="grid grid-cols-5 gap-1 p-4">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 ${
                              [0, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24].includes(i)
                                ? 'bg-gray-900'
                                : [1, 3, 5, 9, 11, 13, 15, 17, 19, 21, 23].includes(i)
                                ? 'bg-gray-700'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Camera feed will appear here once connected
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Live indicators */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                LIVE
              </div>
            </div>
          </div>
        </section>
      ) : currentVideo ? (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <VideoPlayer
                      ref={videoPlayerRef}
                      video={currentVideo}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      className="w-full h-full"
                    />
                    <AROverlay
                      detections={currentDetections}
                      videoWidth={videoMetadata.width}
                      videoHeight={videoMetadata.height}
                      isEnabled={isOverlayEnabled}
                      highlightedId={highlightedId}
                      className="absolute inset-0"
                    />
                  </div>
                </motion.div>

                {/* Control Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <ControlPanel
                    isOverlayEnabled={isOverlayEnabled}
                    onOverlayToggle={setIsOverlayEnabled}
                    playbackSpeed={playbackSpeed}
                    onSpeedChange={setPlaybackSpeed}
                  />
                </motion.div>
              </div>

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <InfoPanel
                  detections={currentDetections}
                  onHighlight={setHighlightedId}
                  currentTime={currentTime}
                />

                {/* Recipe Info */}
                <div className="bg-tomato/5 rounded-lg p-4 border border-tomato/20">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">About Caprese Salad</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    A timeless Italian classic featuring the colors of the Italian flag - red tomatoes, 
                    white mozzarella, and green basil. Perfect for showcasing SAM2&apos;s ability to track 
                    multiple ingredients through preparation stages.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white border border-gray-200">
                      🍅 2 Tomatoes
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white border border-gray-200">
                      🧀 Fresh Mozzarella
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white border border-gray-200">
                      🌿 Fresh Basil
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white border border-gray-200">
                      🫒 Olive Oil
                    </span>
                  </div>
                </div>

                {/* Technical Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">Technical Details</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-mono text-gray-900">SAM2-Large</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">FPS:</span>
                      <span className="font-mono text-gray-900">30</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Resolution:</span>
                      <span className="font-mono text-gray-900">{videoMetadata.width}x{videoMetadata.height}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Latency:</span>
                      <span className="font-mono text-gray-900">~50ms</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <Link 
                      href="/poc/llama"
                      className="inline-flex items-center text-xs font-medium text-herb-green hover:text-herb-green/80"
                    >
                      <span>View Llama Integration</span>
                      <svg className="ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ) : null}

      {/* POC Navigation */}
      <POCNavigation />
    </main>
  );
}