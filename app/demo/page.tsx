'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState<'all' | 'sam2' | 'llama' | 'vjepa' | 'voice'>('all');

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
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-herb-green to-golden px-4 py-2 text-sm font-medium text-white mb-4">
              Full Integration Demo
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Everything Working Together
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Experience the full power of Llama Cook with all AI systems working in harmony to revolutionize your cooking experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Selector */}
      <section className="py-6 sticky top-20 bg-white/80 backdrop-blur-sm z-40 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Features', color: 'bg-gradient-to-r from-herb-green to-golden' },
              { id: 'sam2', label: 'SAM2 Vision', color: 'bg-basil' },
              { id: 'llama', label: 'Llama AI', color: 'bg-golden' },
              { id: 'vjepa', label: 'V-JEPA 2', color: 'bg-tomato' },
              { id: 'voice', label: 'Voice', color: 'bg-orange-500' }
            ].map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id as any)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFeature === feature.id 
                    ? `${feature.color} text-white` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {feature.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Interface */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xl font-medium mb-2">Live Camera Feed</p>
                    <p className="text-sm text-gray-400 mb-4">Connect your iPhone to start</p>
                    <button className="px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors">
                      Connect Camera
                    </button>
                  </div>
                </div>
                
                {/* Feature Overlays */}
                {(activeFeature === 'all' || activeFeature === 'sam2') && (
                  <div className="absolute top-4 left-4 bg-basil/90 text-white px-3 py-1 rounded-full text-sm">
                    SAM2: Tracking 4 ingredients
                  </div>
                )}
                
                {(activeFeature === 'all' || activeFeature === 'vjepa') && (
                  <div className="absolute top-4 right-4 bg-tomato/90 text-white px-3 py-1 rounded-full text-sm">
                    V-JEPA 2: Predicting next step
                  </div>
                )}
                
                {(activeFeature === 'all' || activeFeature === 'voice') && (
                  <div className="absolute bottom-4 left-4 bg-orange-500/90 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                    🎤 Listening for "Sous Chef"
                  </div>
                )}
              </div>

              {/* Detected Ingredients Grid */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                {['Tomato', 'Mozzarella', 'Basil', 'Olive Oil'].map((ingredient, idx) => (
                  <motion.div
                    key={ingredient}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-4 rounded-lg border border-gray-200 text-center"
                  >
                    <div className="text-2xl mb-2">
                      {ingredient === 'Tomato' && '🍅'}
                      {ingredient === 'Mozzarella' && '🧀'}
                      {ingredient === 'Basil' && '🌿'}
                      {ingredient === 'Olive Oil' && '🫒'}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{ingredient}</p>
                    <p className="text-xs text-gray-500">Detected</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Assistant Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Llama Chat */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-golden to-herb-green p-4">
                  <h3 className="text-white font-semibold flex items-center">
                    <span className="text-2xl mr-2">🦙</span>
                    Llama-4-Scout Assistant
                  </h3>
                </div>
                
                <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-700">
                        I can see you have fresh tomatoes, mozzarella, basil, and olive oil. Perfect for a Caprese Salad!
                      </p>
                    </div>
                    <div className="bg-herb-green/10 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Next Step:</strong> Start by slicing the tomatoes into 1/4 inch rounds.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-herb-green"
                  />
                </div>
              </div>

              {/* V-JEPA Predictions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-tomato rounded-full mr-2"></span>
                  V-JEPA 2 Predictions
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Next: Slice mozzarella (89% confidence)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-gray-600">Tip: Match tomato thickness</span>
                  </div>
                </div>
              </div>

              {/* Voice Status */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  Voice Control Active
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Say "Sous Chef" followed by your command
                </p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Last command:</p>
                  <p className="text-sm text-gray-700 italic">
                    "Sous Chef, how long should I let it rest?"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Real-Time Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-basil mb-2">24 FPS</div>
              <div className="text-sm text-gray-600">SAM2 Tracking</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-golden mb-2">87ms</div>
              <div className="text-sm text-gray-600">Llama Response</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-tomato mb-2">150ms</div>
              <div className="text-sm text-gray-600">V-JEPA Prediction</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">437ms</div>
              <div className="text-sm text-gray-600">Voice Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Try Individual POCs */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Individual Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/poc/sam2" className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-herb-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-herb-green">SAM2 Vision</h3>
                <p className="text-sm text-gray-600">Real-time ingredient tracking</p>
              </div>
            </Link>
            <Link href="/poc/llama" className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-herb-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-herb-green">Llama AI</h3>
                <p className="text-sm text-gray-600">Recipe generation & guidance</p>
              </div>
            </Link>
            <Link href="/poc/vjepa" className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-herb-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-herb-green">V-JEPA 2</h3>
                <p className="text-sm text-gray-600">Predictive cooking assistance</p>
              </div>
            </Link>
            <Link href="/poc/voice" className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-herb-green transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-herb-green">Voice Control</h3>
                <p className="text-sm text-gray-600">Hands-free interaction</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}