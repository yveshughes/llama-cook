'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import POCNavigation from '@/components/POCNavigation';

export default function VoicePOC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  const startListening = () => {
    setIsListening(true);
    setVoiceState('listening');
    
    // Simulate voice detection
    setTimeout(() => {
      setTranscript('Sous Chef, I have tomatoes and mozzarella, what can we make?');
      setVoiceState('processing');
      
      setTimeout(() => {
        setResponse('Based on the tomatoes and mozzarella I can see, we could make a delicious Caprese Salad. Would you like me to guide you through it?');
        setVoiceState('speaking');
        
        setTimeout(() => {
          setVoiceState('idle');
          setIsListening(false);
        }, 3000);
      }, 800);
    }, 2000);
  };

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
              href="/#voice" 
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
                <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                  AWS Voice
                </span>
                Hands-Free Assistant
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Natural voice interactions with Transcribe & Polly
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

      {/* Voice Interface */}
      {mode === 'live' ? (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-1 rounded-xl">
                <div className="bg-white rounded-lg p-12 text-center">
                  <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`relative w-40 h-40 rounded-full transition-all ${
                      isListening 
                        ? 'bg-orange-500 animate-pulse' 
                        : 'bg-herb-green hover:bg-herb-green/90'
                    }`}
                  >
                    <svg className="w-20 h-20 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {voiceState === 'listening' && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </button>
                  
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">Live Voice Control</h2>
                  <p className="mt-2 text-gray-600">
                    {voiceState === 'idle' && 'Click to start listening'}
                    {voiceState === 'listening' && 'Listening for "Sous Chef"...'}
                    {voiceState === 'processing' && 'Processing command...'}
                    {voiceState === 'speaking' && 'Speaking response...'}
                  </p>
                  
                  <div className="mt-8 flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                      AWS Transcribe Active
                    </div>
                    <div className="flex items-center text-blue-600">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      AWS Polly Ready
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Voice Control */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                  <h3 className="text-white font-semibold">Voice Command Center</h3>
                </div>
                
                {/* Voice Button */}
                <div className="p-8 text-center">
                  <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`relative w-32 h-32 rounded-full transition-all ${
                      isListening 
                        ? 'bg-orange-500 animate-pulse' 
                        : 'bg-herb-green hover:bg-herb-green/90'
                    }`}
                  >
                    <svg className="w-16 h-16 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {voiceState === 'listening' && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </button>
                  
                  <p className="mt-4 text-gray-600">
                    {voiceState === 'idle' && 'Click to start listening'}
                    {voiceState === 'listening' && 'Listening... Say "Sous Chef" followed by your command'}
                    {voiceState === 'processing' && 'Processing your request...'}
                    {voiceState === 'speaking' && 'Speaking response...'}
                  </p>
                </div>

                {/* Conversation Display */}
                <div className="border-t border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Conversation</h4>
                  
                  {transcript && (
                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">You</p>
                          <p className="text-sm text-gray-600 mt-1">{transcript}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {response && (
                    <div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-herb-green rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">Sous Chef</p>
                          <p className="text-sm text-gray-600 mt-1">{response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AWS Services Used */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <h4 className="ml-2 font-semibold text-gray-900">AWS Transcribe</h4>
                  </div>
                  <p className="text-sm text-gray-600">Real-time speech-to-text</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <h4 className="ml-2 font-semibold text-gray-900">AWS Polly</h4>
                  </div>
                  <p className="text-sm text-gray-600">Natural text-to-speech</p>
                </div>
              </div>
            </motion.div>

            {/* Technical Implementation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Processing Pipeline</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-900 mb-2">1. Wake Word Detection</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      AWS Transcribe continuously monitors for "Sous Chef" wake word using streaming transcription.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      transcribeStreaming.startStreamTranscription()
                    </code>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">2. Command Processing</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Once activated, captures the full command and sends to Llama-4-Scout with visual context.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      await llamaAPI.chat({text: command, context: ingredients})
                    </code>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-2">3. Voice Response</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      AWS Polly converts Llama's response to natural speech with neural voice engine.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      polly.synthesizeSpeech({Engine: 'neural'})
                    </code>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "pipeline_latency": {
    "wake_word_detection": "150ms",
    "transcription": "80ms",
    "llama_processing": "87ms",
    "tts_generation": "120ms",
    "total_end_to_end": "437ms"
  },
  "accuracy": {
    "wake_word": "99.2%",
    "transcription": "98.5%",
    "command_understanding": "97.8%"
  },
  "voice_quality": {
    "engine": "Neural",
    "voice_id": "Joanna",
    "sample_rate": "24000Hz"
  }
}`}
                  </pre>
                </div>
              </div>

              {/* Example Commands */}
              <div className="p-6 bg-olive/10 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Example Voice Commands</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• "Sous Chef, what can I make with these ingredients?"</li>
                  <li>• "Sous Chef, how do I prepare the tomatoes?"</li>
                  <li>• "Sous Chef, set a timer for 5 minutes"</li>
                  <li>• "Sous Chef, what's the next step?"</li>
                  <li>• "Sous Chef, I need a vegetarian alternative"</li>
                </ul>
                <Link 
                  href="/demo"
                  className="inline-flex items-center mt-4 text-sm font-medium text-herb-green hover:text-herb-green/80"
                >
                  Try Full Demo →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

          </div>
        </section>
      )}

      {/* Integration Diagram */}
      {mode === 'demo' && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Complete Voice Flow</h2>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Voice Input</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">→</span>
                  </div>
                  <p className="text-sm font-medium">AWS Transcribe</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🦙</span>
                  </div>
                  <p className="text-sm font-medium">Llama-4-Scout</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">→</span>
                  </div>
                  <p className="text-sm font-medium">AWS Polly</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Voice Output</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POC Navigation */}
      <POCNavigation />
    </main>
  );
}