'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import POCNavigation from '@/components/POCNavigation';
import { TranscribeClient, TranscriptSegment } from '@/services/aws-transcribe-client';

export default function VoicePOC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [demoTranscript, setDemoTranscript] = useState('');
  const [demoResponse, setDemoResponse] = useState('');

  // Create transcribe client instance
  const [transcribeClient] = useState(() => new TranscribeClient());

  // Real AWS Transcribe implementation
  const startRealListening = async () => {
    try {
      setError(null);
      setIsListening(true);
      setVoiceState('listening');
      setTranscripts([]);
      
      console.log('Starting AWS Transcribe...');
      
      await transcribeClient.startTranscription(
        // On transcript received
        (segment) => {
          console.log(`Transcript segment:`, segment);
          setTranscripts(prev => [...prev, segment]);
          
          // If it's a command and final, show a response after a delay
          if (segment.isCommand && segment.isFinal && segment.text.length > 0) {
            setTimeout(() => {
              const responseSegment: TranscriptSegment = {
                text: `I heard your command: "${segment.text}". (Llama API integration coming soon!)`,
                isCommand: false,
                isFinal: true,
                timestamp: new Date()
              };
              setTranscripts(prev => [...prev, responseSegment]);
            }, 500);
          }
        },
        // On error
        (error) => {
          console.error('Transcription error in UI:', error);
          setError(error.message);
          setIsListening(false);
          setVoiceState('idle');
        }
      );
    } catch (err) {
      console.error('Error starting transcription:', err);
      setError(err instanceof Error ? err.message : 'Failed to start transcription');
      setIsListening(false);
      setVoiceState('idle');
    }
  };

  const stopRealListening = async () => {
    try {
      await transcribeClient.stopTranscription();
      setIsListening(false);
      setVoiceState('idle');
    } catch (err) {
      console.error('Error stopping transcription:', err);
    }
  };

  // Demo mode implementation (existing)
  const startDemoListening = () => {
    setIsListening(true);
    setVoiceState('listening');
    
    // Simulate voice detection
    setTimeout(() => {
      setDemoTranscript('Sous Chef, I have tomatoes and mozzarella, what can we make?');
      setVoiceState('processing');
      
      setTimeout(() => {
        setDemoResponse('Based on the tomatoes and mozzarella I can see, we could make a delicious Caprese Salad. Would you like me to guide you through it?');
        setVoiceState('speaking');
        
        setTimeout(() => {
          setVoiceState('idle');
          setIsListening(false);
        }, 3000);
      }, 800);
    }, 2000);
  };

  const startListening = mode === 'live' ? startRealListening : startDemoListening;
  const stopListening = mode === 'live' ? stopRealListening : () => setIsListening(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening && mode === 'live') {
        transcribeClient.stopTranscription();
      }
    };
  }, [isListening, mode, transcribeClient]);

  // Format transcripts for display
  const formatTranscriptText = (segments: TranscriptSegment[]) => {
    return segments.map((segment, index) => {
      const words = segment.text.split(' ');
      return (
        <span key={index}>
          {words.map((word, wordIndex) => {
            const isWakeWord = word.toLowerCase().includes('sous') || 
                             (words[wordIndex + 1] && words[wordIndex + 1].toLowerCase().includes('chef'));
            return (
              <span
                key={`${index}-${wordIndex}`}
                className={
                  isWakeWord 
                    ? 'text-herb-green font-bold' 
                    : segment.isCommand 
                    ? 'text-orange-600' 
                    : 'text-gray-800'
                }
              >
                {word}{' '}
              </span>
            );
          })}
        </span>
      );
    });
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
                onClick={() => {
                  if (isListening) stopListening();
                  setMode('demo');
                  setTranscripts([]);
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  mode === 'demo' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => {
                  if (isListening) stopListening();
                  setMode('live');
                  setTranscripts([]);
                }}
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
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-1 rounded-xl">
                <div className="bg-white rounded-lg p-8">
                  <div className="flex items-start gap-8">
                    {/* Left side - Control */}
                    <div className="flex-shrink-0 text-center">
                      <button
                        onClick={() => isListening ? stopListening() : startListening()}
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
                      
                      <h2 className="mt-4 text-lg font-bold text-gray-900">Live Voice Control</h2>
                      <p className="mt-2 text-sm text-gray-600">
                        {!isListening && 'Click to start'}
                        {isListening && 'Listening...'}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-center text-xs">
                        <div className={`flex items-center ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className={`w-2 h-2 rounded-full mr-1 ${
                            isListening ? 'bg-green-600 animate-pulse' : 'bg-gray-400'
                          }`}></span>
                          AWS Transcribe {isListening ? 'Active' : 'Ready'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Transcript */}
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] max-h-[400px] overflow-y-auto">
                        <h3 className="font-semibold text-gray-900 mb-4">Transcript</h3>
                        
                        {transcripts.length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            Start speaking to see your transcript here. Say &quot;Sous Chef&quot; followed by a command to highlight it.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm leading-relaxed">
                              {formatTranscriptText(transcripts)}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-600">
                        <p className="font-semibold mb-1">Color Guide:</p>
                        <div className="flex gap-4">
                          <span className="flex items-center">
                            <span className="w-3 h-3 bg-herb-green rounded-full mr-1"></span>
                            Wake Word
                          </span>
                          <span className="flex items-center">
                            <span className="w-3 h-3 bg-orange-600 rounded-full mr-1"></span>
                            Command
                          </span>
                          <span className="flex items-center">
                            <span className="w-3 h-3 bg-gray-800 rounded-full mr-1"></span>
                            Regular Speech
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
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
                    {voiceState === 'idle' && 'Click to start demo'}
                    {voiceState === 'listening' && 'Demo: Listening for "Sous Chef"...'}
                    {voiceState === 'processing' && 'Demo: Processing command...'}
                    {voiceState === 'speaking' && 'Demo: Speaking response...'}
                  </p>
                </div>

                {/* Conversation Display */}
                <div className="border-t border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Conversation</h4>
                  
                  {demoTranscript && (
                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">You</p>
                          <p className="text-sm text-gray-600 mt-1">{demoTranscript}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {demoResponse && (
                    <div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-herb-green rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">Sous Chef</p>
                          <p className="text-sm text-gray-600 mt-1">{demoResponse}</p>
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
                    <h3 className="font-semibold text-gray-900 mb-2">1. Continuous Transcription</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      AWS Transcribe converts all speech to text in real-time, highlighting commands after &quot;Sous Chef&quot;.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      transcribeStreaming.startStreamTranscription()
                    </code>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">2. Wake Word Detection</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      When &quot;Sous Chef&quot; is detected, subsequent text is highlighted as a command for 10 seconds.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {`if (text.includes('sous chef')) { activateCommand() }`}
                    </code>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-2">3. Command Processing</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Highlighted commands are sent to Llama-4-Scout for recipe generation and guidance.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {`await llamaAPI.chat({command, context})`}
                    </code>
                  </div>
                </div>
              </div>

              {/* Example Commands */}
              <div className="p-6 bg-olive/10 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Everything you say is transcribed. When you say &quot;Sous Chef&quot;, 
                  the following words are highlighted as a command:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Regular: &quot;Let me check what we have...&quot;</span>
                  </p>
                  <p>
                    <span className="text-herb-green font-semibold">Sous Chef</span>
                    <span className="text-orange-600">, what can I make with tomatoes?</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Regular: &quot;I also have some basil...&quot;</span>
                  </p>
                  <p>
                    <span className="text-herb-green font-semibold">Sous Chef</span>
                    <span className="text-orange-600">, add basil to the recipe</span>
                  </p>
                </div>
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