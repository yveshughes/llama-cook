'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLiveMode } from '@/contexts/LiveModeContext';
import { TranscribeClient, TranscriptSegment } from '@/services/aws-transcribe-client';
import DualModeQRDisplay from '@/components/DualModeQRDisplay';
import CameraStreamViewer from '@/components/CameraStreamViewer';

interface VoiceFeatureProps {
  onLlamaResponse?: (data: {
    question: string;
    image: string | null;
    response: string;
    isProcessing: boolean;
  }) => void;
}

export default function VoiceFeature({ onLlamaResponse }: VoiceFeatureProps) {
  const { isLiveMode } = useLiveMode();
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [transcribeClient] = useState(() => new TranscribeClient());
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [cameraView, setCameraView] = useState<'connect' | 'stream'>('stream');
  const [llamaResponse, setLlamaResponse] = useState<string | null>(null);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [commandBuffer, setCommandBuffer] = useState<string>('');
  const [showFlash, setShowFlash] = useState(false);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Start transcription when in live mode
  useEffect(() => {
    if (isLiveMode && !isListening) {
      startListening();
    } else if (!isLiveMode && isListening) {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLiveMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        transcribeClient.stopTranscription();
      }
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }
    };
  }, [isListening, transcribeClient]);

  // Auto-scroll to bottom when new transcripts are added with smooth behavior
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcripts]);

  const startListening = async () => {
    try {
      setError(null);
      setIsListening(true);
      setTranscripts([]);
      setCommandBuffer('');
      
      await transcribeClient.startTranscription(
        async (segment) => {
          setTranscripts(prev => {
            // If this is a final result, remove any partial results with the same base ID
            if (segment.isFinal && segment.resultId) {
              const baseId = segment.resultId.split('-')[0];
              const filtered = prev.filter(s => {
                if (!s.resultId) return true;
                const sBaseId = s.resultId.split('-')[0];
                return sBaseId !== baseId || s.isFinal;
              });
              return [...filtered, segment];
            }
            // For partial results, update existing partial with same ID or add new
            else if (!segment.isFinal && segment.resultId) {
              const existingIndex = prev.findIndex(s => s.resultId === segment.resultId);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = segment;
                return updated;
              }
            }
            return [...prev, segment];
          });
          
          // Handle command mode text
          if (segment.isCommand) {
            const text = segment.text.trim();
            
            // Skip if it's just the wake word itself
            if (text.toLowerCase() === 'sous chef' || text === '') {
              return;
            }
            
            // Clear any existing timeout
            if (commandTimeoutRef.current) {
              clearTimeout(commandTimeoutRef.current);
            }
            
            // Only accumulate text that comes after the wake word
            // and only if it's a final segment (to avoid duplicates)
            if (segment.isFinal) {
              setCommandBuffer(prev => {
                // If buffer is empty, this is the first command text
                const newBuffer = prev ? prev + ' ' + text : text;
                return newBuffer;
              });
              
              // Set a new timeout to process after pause (1.5 seconds of silence)
              commandTimeoutRef.current = setTimeout(() => {
                setCommandBuffer(currentBuffer => {
                  const trimmedBuffer = currentBuffer.trim();
                  if (trimmedBuffer.length > 3) { // Only process if we have meaningful text
                    processQuestion(trimmedBuffer);
                  }
                  return ''; // Clear buffer after processing
                });
              }, 1500); // Wait 1.5 seconds of silence before processing
            }
          }
        },
        (error) => {
          console.error('Transcription error:', error);
          // Don't show technical AWS errors to users
          if (error.message.includes('BadRequestException')) {
            console.log('AWS Transcribe session issue - this is normal when switching modes');
          } else {
            setError('Voice recognition temporarily unavailable');
          }
          setIsListening(false);
        }
      );
    } catch (err) {
      console.error('Error starting transcription:', err);
      setError(err instanceof Error ? err.message : 'Failed to start transcription');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await transcribeClient.stopTranscription();
      setIsListening(false);
      // Clear any pending command processing
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
      setCommandBuffer('');
    } catch (err) {
      console.error('Error stopping transcription:', err);
    }
  };

  const processQuestion = async (question: string) => {
    console.log('Processing question:', question);
    setIsProcessingQuestion(true);
    setLlamaResponse(null);
    setLastQuestion(question);
    setCommandBuffer(''); // Clear buffer immediately to prevent re-processing
    
    // Notify that processing is starting (use setTimeout to avoid render-time state update)
    if (isLiveMode && onLlamaResponse) {
      setTimeout(() => {
        onLlamaResponse({
          question,
          image: null,
          response: '',
          isProcessing: true
        });
      }, 0);
    }
    
    try {
      // Switch to stream view to ensure we have the latest frame
      setCameraView('stream');
      
      // Small delay to ensure stream view is loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the current frame before processing
      let currentCapturedImage: string | null = null;
      const frameResponse = await fetch(`/api/camera-stream?roomId=demo-room-001`);
      if (frameResponse.ok) {
        const frameData = await frameResponse.json();
        if (frameData.frame) {
          currentCapturedImage = frameData.frame;
          setCapturedImage(frameData.frame);
        }
      }
      
      // Trigger camera flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300); // Flash duration
      
      // Play camera shutter sound if available
      const audio = new Audio('/sounds/camera-shutter.mp3');
      audio.play().catch(() => {}); // Ignore if sound file doesn't exist
      
      // Send question to API
      const response = await fetch('/api/process-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          roomId: 'demo-room-001'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process question');
      }
      
      const data = await response.json();
      setLlamaResponse(data.answer);
      
      // Log debug info if available
      if (data.debug) {
        console.log('API Debug info:', data.debug);
      }
      
      // Call the callback if in live mode (use setTimeout to avoid render-time state update)
      if (isLiveMode && onLlamaResponse) {
        setTimeout(() => {
          onLlamaResponse({
            question,
            image: currentCapturedImage,
            response: data.answer,
            isProcessing: false
          });
        }, 0);
      }
      
    } catch (err) {
      console.error('Error processing question:', err);
      // Don't show error to user - they can just try again
      setLlamaResponse('I couldn\'t process that. Please try asking again.');
    } finally {
      setIsProcessingQuestion(false);
    }
  };

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
                    ? 'text-orange-400' 
                    : 'text-white'
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
    <section className="py-24 sm:py-32 bg-gradient-to-br from-cream to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full bg-herb-green/10 px-4 py-2 text-sm font-medium text-herb-green mb-4">
              Step 1: Voice Command
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              &quot;What can I do with these ingredients?&quot;
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Start your cooking journey with a simple voice command
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Video */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="space-y-4">
              {/* AWS Transcription Block */}
              <motion.div 
                className="bg-black rounded-xl shadow-lg p-6 border border-gray-800"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">AWS Transcription</h4>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                      isLiveMode && isListening ? 'bg-red-500' : 'bg-herb-green'
                    }`}></div>
                    <span className={`text-xs ${
                      isLiveMode && isListening ? 'text-red-500' : 'text-herb-green'
                    }`}>
                      {isLiveMode ? (isListening ? 'Live' : 'Ready') : 'Demo'}
                    </span>
                  </div>
                </div>
                <div 
                  ref={transcriptContainerRef}
                  className="bg-gray-900 rounded-lg p-4 font-mono min-h-[60px] max-h-[120px] overflow-y-auto scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {!isLiveMode ? (
                    <div className="w-full">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-sm">
                          <span className="text-orange-400">&quot;</span>
                          <span className="text-herb-green font-bold">Sous Chef</span>
                          <span className="text-white">, what can I do with these ingredients?</span>
                          <span className="text-orange-400">&quot;</span>
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="w-full">
                      {transcripts.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          <span className="inline-block animate-pulse">Listening for speech...</span>
                        </p>
                      ) : (
                        <p className="text-sm leading-relaxed">
                          {formatTranscriptText(transcripts)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {!isLiveMode ? 'Wake word detected' : 'Real-time transcription'}
                  </div>
                  {isLiveMode && !commandBuffer && (
                    <span className="text-gray-500">Say &quot;Sous Chef&quot; to activate</span>
                  )}
                  {isLiveMode && commandBuffer && (
                    <motion.span 
                      className="text-herb-green font-medium flex items-center gap-1"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Listening for command...
                    </motion.span>
                  )}
                </div>
                {/* Error Display */}
                {error && isLiveMode && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-400">
                    {error}
                  </div>
                )}
              </motion.div>
              
              {/* Video Stream Block */}
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 border border-golden/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">
                      {isLiveMode ? 'Camera Input' : 'iPhone Camera Stream'}
                    </h4>
                    {isLiveMode && (
                      <>
                        <button 
                          onClick={() => setCameraView('connect')}
                          className={`text-xs underline transition-colors ${
                            cameraView === 'connect' 
                              ? 'text-herb-green font-semibold' 
                              : 'text-gray-500 hover:text-herb-green'
                          }`}
                        >
                          Connect Camera
                        </button>
                        <button 
                          onClick={() => setCameraView('stream')}
                          className={`text-xs underline transition-colors ${
                            cameraView === 'stream' 
                              ? 'text-herb-green font-semibold' 
                              : 'text-gray-500 hover:text-herb-green'
                          }`}
                        >
                          Live Stream
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                      isLiveMode ? 'bg-gray-400' : 'bg-golden'
                    }`}></div>
                    <span className={`text-xs ${
                      isLiveMode ? 'text-gray-500' : 'text-golden'
                    }`}>
                      {isLiveMode ? 'Ready' : 'Streaming'}
                    </span>
                  </div>
                </div>
                {!isLiveMode ? (
                  <div className="rounded-lg overflow-hidden">
                    <video
                      src="/videos/ingr.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  cameraView === 'connect' ? (
                    <DualModeQRDisplay 
                      className="w-full"
                      onSessionCreated={(sessionId, mode) => {
                        console.log(`Camera session created: ${sessionId} (${mode} mode)`);
                      }}
                    />
                  ) : (
                    <div className="relative">
                      <CameraStreamViewer
                        roomId="demo-room-001"
                        mode="websocket"
                        className="aspect-video rounded-lg bg-black"
                      />
                      
                      {/* Camera Flash Effect */}
                      {showFlash && (
                        <motion.div 
                          className="absolute inset-0 bg-white rounded-lg pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.9, 0] }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      )}
                      
                      {/* Camera Icon Animation */}
                      {showFlash && (
                        <motion.div 
                          className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.2, 1],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  )
                )}
              </motion.div>
              
              {/* Llama Response Block - Only show in demo mode */}
              {!isLiveMode && (isProcessingQuestion || llamaResponse) && (
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 border border-herb-green/20 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Sous Chef Response</h4>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                        isProcessingQuestion ? 'bg-yellow-500' : 'bg-herb-green'
                      }`}></div>
                      <span className={`text-xs ${
                        isProcessingQuestion ? 'text-yellow-600' : 'text-herb-green'
                      }`}>
                        {isProcessingQuestion ? 'Thinking...' : 'Ready'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Show question and captured image in Live mode */}
                  {isLiveMode && lastQuestion && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Your question:</p>
                      <p className="text-sm text-gray-600 italic">&ldquo;{lastQuestion}&rdquo;</p>
                      
                      {capturedImage && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Captured image:</p>
                          <img 
                            src={capturedImage} 
                            alt="Captured ingredients" 
                            className="w-32 h-24 object-cover rounded border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isProcessingQuestion ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-herb-green"></div>
                    </div>
                  ) : llamaResponse ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">{llamaResponse}</p>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </div>
            
            {/* Visual elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-golden/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-herb-green/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.5,
              }}
            />
          </motion.div>
          
          {/* Right side - Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your Hands-Free Kitchen Journey Begins Here
              </h3>
              <p className="text-lg text-gray-600">
                With just your voice, unlock personalized recipes based on what&apos;s in your kitchen. 
                No typing, no scrolling – just natural conversation with your AI sous chef.
              </p>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-herb-green/10 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-herb-green">1</span>
                  Wake Word Detection
                </h4>
                <p className="text-gray-600 ml-11">
                  Simply say &quot;Sous Chef&quot; to activate your assistant. Powered by AWS Transcribe&apos;s 
                  real-time streaming, it&apos;s always ready when you are.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-golden/10 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-golden">2</span>
                  Natural Language Understanding
                </h4>
                <p className="text-gray-600 ml-11">
                  Ask naturally: &quot;What can I make with tomatoes and mozzarella?&quot; 
                  The system understands context and cooking intent.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-tomato/10 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-tomato">3</span>
                  Instant Voice Response
                </h4>
                <p className="text-gray-600 ml-11">
                  Get immediate, conversational responses through Amazon Polly&apos;s neural voices. 
                  Sub-100ms latency keeps the conversation flowing naturally.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-6 bg-herb-green/5 rounded-lg border border-herb-green/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-herb-green mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">Try it yourself:</p>
                  <p className="text-sm text-gray-700 mt-1">
                    &quot;Sous Chef, I have fresh tomatoes, mozzarella, and basil. What can we make?&quot;
                  </p>
                  <p className="text-sm text-herb-green mt-2 italic">
                    → &quot;Perfect! With those ingredients, we can make a classic Caprese Salad. Would you like me to guide you through it?&quot;
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-4"
            >
              <Link
                href="/poc/voice"
                className="inline-flex items-center px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors font-medium"
              >
                Try Voice Demo
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#llama"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200"
              >
                Next: AI Analysis
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}