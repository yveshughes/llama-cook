'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VoiceFeature() {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isLiveMode) return; // Only work in demo mode

    const handleScroll = () => {
      const voiceSection = document.getElementById('voice');
      const llamaSection = document.getElementById('llama');
      
      if (!voiceSection || !llamaSection) return;
      
      const voiceRect = voiceSection.getBoundingClientRect();
      
      // Calculate when voice section is scrolling out and llama section is coming in
      const voiceBottom = voiceRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Start transition when voice section is halfway out of view
      if (voiceBottom < windowHeight * 0.5 && !triggerTransition) {
        setTriggerTransition(true);
        // Trigger the Llama section animation
        setTimeout(() => {
          window.dispatchEvent(new Event('triggerLlamaTransition'));
        }, 300);
      }
      
      // Calculate scroll progress for smooth animation
      const progress = Math.max(0, Math.min(1, (windowHeight - voiceBottom) / windowHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLiveMode, triggerTransition]);

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
              {/* Mode Toggle */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setIsLiveMode(false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !isLiveMode 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Demo Mode
                  </button>
                  <button
                    onClick={() => setIsLiveMode(true)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isLiveMode 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Live Mode
                  </button>
                </div>
              </motion.div>

              {/* AWS Transcription Block */}
              <motion.div 
                className="bg-black rounded-xl shadow-lg p-6 border border-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: !isLiveMode && scrollProgress > 0.8 ? 0 : 1,
                  y: !isLiveMode ? scrollProgress * 300 : 0,
                  scale: !isLiveMode ? 1 + (scrollProgress * 0.1) : 1,
                  zIndex: !isLiveMode && scrollProgress > 0 ? 50 : 'auto'
                }}
                style={{
                  position: !isLiveMode && scrollProgress > 0.1 ? 'fixed' : 'relative',
                  top: !isLiveMode && scrollProgress > 0.1 ? '20vh' : 'auto',
                  left: !isLiveMode && scrollProgress > 0.1 ? '50%' : 'auto',
                  transform: !isLiveMode && scrollProgress > 0.1 ? 'translateX(-50%)' : 'none',
                  maxWidth: !isLiveMode && scrollProgress > 0.1 ? '600px' : '100%',
                  width: !isLiveMode && scrollProgress > 0.1 ? '90%' : '100%',
                }}
                transition={{ 
                  duration: 0.1,
                  ease: "linear"
                }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">AWS Transcription</h4>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                      isLiveMode ? 'bg-red-500' : 'bg-herb-green'
                    }`}></div>
                    <span className={`text-xs ${
                      isLiveMode ? 'text-red-500' : 'text-herb-green'
                    }`}>
                      {isLiveMode ? 'Live' : 'Listening'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 font-mono min-h-[60px] flex items-center">
                  {!isLiveMode ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="w-full"
                    >
                      <p className="text-sm">
                        <span className="text-orange-400">&quot;</span>
                        <span className="text-herb-green font-bold">Sous Chef</span>
                        <span className="text-white">, what can I do with these ingredients?</span>
                        <span className="text-orange-400">&quot;</span>
                      </p>
                    </motion.div>
                  ) : (
                    <div className="w-full">
                      <p className="text-sm text-gray-500">
                        <span className="inline-block animate-pulse">Listening for &quot;Sous Chef&quot;...</span>
                      </p>
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
                  {isLiveMode && (
                    <span className="text-gray-500">Say &quot;Sous Chef&quot; to activate</span>
                  )}
                  {!isLiveMode && scrollProgress < 0.1 && (
                    <span className="text-gray-400 text-xs">Scroll down to process</span>
                  )}
                </div>
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
                  <h4 className="font-semibold text-gray-900">
                    {isLiveMode ? 'Camera Input' : 'iPhone Camera Stream'}
                  </h4>
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
                    <img 
                      src="/screens/sam2-sample.png" 
                      alt="Kitchen ingredients sample"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="flex justify-center gap-8 mb-4">
                        {/* Upload Image */}
                        <label className="cursor-pointer group">
                          <input type="file" className="hidden" accept="image/*" />
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700 mt-2">Upload Image</span>
                          </div>
                        </label>
                        
                        {/* QR Code */}
                        <button className="group">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h8m-4 0v.01M12 12v8m-8-4h2m0 0v4m0-11v3" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700 mt-2">Scan QR Code</span>
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Connect your iPhone camera or upload an image
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
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