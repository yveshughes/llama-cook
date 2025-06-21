'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import POCNavigation from '@/components/POCNavigation';

export default function SAM2POC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');

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
                Real-Time Tracking
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Computer vision for ingredient detection
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
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl font-medium mb-2">Live SAM2 Feed</p>
                  <p className="text-sm text-gray-400 mb-4">Connect your camera to see real-time tracking</p>
                  <button className="px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors">
                    Start Live Tracking
                  </button>
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
      ) : (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Live Camera Feed */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                <div className="h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Camera Feed</p>
                    <p className="text-sm text-gray-400">iPhone camera stream will appear here</p>
                    <button className="mt-4 px-4 py-2 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors">
                      Start Camera
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Detected Ingredients */}
              <div className="mt-6 p-4 bg-mozzarella rounded-lg border border-cream">
                <h3 className="font-semibold text-gray-900 mb-3">Detected Ingredients:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'].map((ingredient) => (
                    <span 
                      key={ingredient}
                      className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How SAM2 Works</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-herb-green/5 rounded-lg border border-herb-green/20">
                    <h3 className="font-semibold text-gray-900 mb-2">1. Real-Time Segmentation</h3>
                    <p className="text-sm text-gray-600">
                      SAM2 uses advanced computer vision to segment objects in real-time, identifying individual ingredients as they appear in frame.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-golden/5 rounded-lg border border-golden/20">
                    <h3 className="font-semibold text-gray-900 mb-2">2. Multi-Object Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Tracks multiple ingredients simultaneously, maintaining consistent IDs even when objects move or partially occlude.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-tomato/5 rounded-lg border border-tomato/20">
                    <h3 className="font-semibold text-gray-900 mb-2">3. Contextual Understanding</h3>
                    <p className="text-sm text-gray-600">
                      Recognizes ingredient states (whole, chopped, cooked) and provides this context to Llama for intelligent recipe suggestions.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Example */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">API Response Example</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "frame_id": 1234,
  "timestamp": "2024-01-21T10:30:45.123Z",
  "detections": [
    {
      "id": "obj_001",
      "label": "tomato",
      "confidence": 0.98,
      "bbox": [120, 80, 180, 140],
      "state": "whole",
      "tracking_id": "tom_1"
    },
    {
      "id": "obj_002",
      "label": "mozzarella",
      "confidence": 0.95,
      "bbox": [200, 100, 280, 160],
      "state": "fresh",
      "tracking_id": "mozz_1"
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              {/* Integration */}
              <div className="p-6 bg-olive/10 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Integration with Llama</h3>
                <p className="text-sm text-gray-600">
                  SAM2's detections are structured by BoundaryML before being sent to Llama-4-Scout, ensuring consistent ingredient data format.
                </p>
                <Link 
                  href="/poc/llama"
                  className="inline-flex items-center mt-3 text-sm font-medium text-herb-green hover:text-herb-green/80"
                >
                  See Llama POC →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* POC Navigation */}
      <POCNavigation />
    </main>
  );
}