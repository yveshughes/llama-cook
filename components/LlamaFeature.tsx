'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';

interface LlamaFeatureProps {
  liveResponse?: {
    question: string;
    image: string | null;
    response: string;
    isProcessing: boolean;
  };
}

export default function LlamaFeature({ liveResponse }: LlamaFeatureProps) {
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const llamaSection = document.getElementById('llama');
      if (!llamaSection) return;
      
      const rect = llamaSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Show response when section is in view
      if (rect.top < windowHeight * 0.5 && rect.bottom > 0 && !showResponse) {
        setTimeout(() => setShowResponse(true), 600);
      }
      
      // Reset when scrolling away
      if ((rect.top > windowHeight || rect.bottom < 0) && showResponse) {
        setShowResponse(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showResponse]);

  return (
    <section className="py-24 sm:py-32 bg-white" id="llama">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full bg-herb-green/10 px-4 py-2 text-sm font-medium text-herb-green mb-4">
              Step 2: Send to Llama API
            </span>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Bullet Points */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              AI-Powered Recipe Generation
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-herb-green rounded-full"></div>
                </div>
                <p className="ml-4 text-gray-600">
                  <span className="font-semibold text-gray-900">Contextual Understanding:</span> Llama-4-Scout analyzes your ingredients and dietary preferences
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-golden rounded-full"></div>
                </div>
                <p className="ml-4 text-gray-600">
                  <span className="font-semibold text-gray-900">Instant Suggestions:</span> Get personalized recipe ideas in under 100ms
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-tomato rounded-full"></div>
                </div>
                <p className="ml-4 text-gray-600">
                  <span className="font-semibold text-gray-900">Step-by-Step Guidance:</span> Conversational cooking instructions tailored to your skill level
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-basil rounded-full"></div>
                </div>
                <p className="ml-4 text-gray-600">
                  <span className="font-semibold text-gray-900">Adaptive Learning:</span> Remembers your preferences for future recommendations
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-herb-green rounded-full"></div>
                </div>
                <p className="ml-4 text-gray-600">
                  <span className="font-semibold text-gray-900">Structured Output:</span> Powered by BoundaryML for consistent, well-formatted recipe suggestions
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Response Block (Demo or Live) */}
          {liveResponse ? (
            /* Live Mode Response */
            <motion.div
              className="bg-gray-800 rounded-xl shadow-lg p-6 border border-golden/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">Sous Chef Live Response</h4>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                    liveResponse.isProcessing ? 'bg-yellow-500' : 'bg-golden'
                  }`}></div>
                  <span className={`text-xs ${
                    liveResponse.isProcessing ? 'text-yellow-500' : 'text-golden'
                  }`}>
                    {liveResponse.isProcessing ? 'Thinking...' : 'Ready'}
                  </span>
                </div>
              </div>
              
              {/* Show captured image(s) */}
              {liveResponse.image && (
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium text-gray-400 mb-2">Captured image:</p>
                  <img 
                    src={liveResponse.image} 
                    alt="Captured ingredients" 
                    className="w-full rounded-lg border border-gray-700"
                  />
                </motion.div>
              )}
              
              <div className="bg-gray-900 rounded-lg p-4 font-mono">
                {/* Question section */}
                {liveResponse.question && (
                  <div className="mb-3 pb-3 border-b border-gray-700">
                    <p className="text-sm text-gray-400">
                      <span className="text-orange-400">&quot;</span>
                      <span className="text-gray-300">{liveResponse.question}</span>
                      <span className="text-orange-400">&quot;</span>
                    </p>
                  </div>
                )}
                
                {/* Response section */}
                <div>
                  {liveResponse.isProcessing ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  ) : liveResponse.response ? (
                    <motion.div 
                      className="text-white text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {liveResponse.response.split('\n').map((line, index) => {
                        if (line.trim().startsWith('*')) {
                          return (
                            <div key={index} className="ml-4 my-1">
                              <span className="text-golden">•</span>
                              <span className="ml-2">{line.substring(1).trim()}</span>
                            </div>
                          );
                        }
                        return line.trim() ? <p key={index} className="my-2">{line}</p> : null;
                      })}
                    </motion.div>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {liveResponse.response ? 'Response generated' : 'Analyzing ingredients'}
                </div>
                <span className="text-gray-500">
                  Real-time processing
                </span>
              </div>
            </motion.div>
          ) : (
            /* Demo Mode Response */
            <motion.div 
              className="bg-black rounded-xl shadow-lg p-6 border border-gray-800 w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">Llama-4-Scout-17B Response</h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full animate-pulse mr-2 bg-golden"></div>
                  <span className="text-xs text-golden">
                    {showResponse ? 'Complete' : 'Processing'}
                  </span>
                </div>
              </div>
              {/* Show demo ingredients image when response is shown */}
              {showResponse && (
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium text-gray-400 mb-2">Captured image:</p>
                  <img 
                    src="/ingredients.png" 
                    alt="Demo ingredients" 
                    className="w-full rounded-lg border border-gray-700"
                  />
                </motion.div>
              )}
              
              <div className="bg-gray-900 rounded-lg p-4 font-mono min-h-[120px]">
                {!showResponse ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-golden rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <div className="mb-3 pb-3 border-b border-gray-700">
                      <p className="text-sm text-gray-400">
                        <span className="text-orange-400">&quot;</span>
                        <span className="text-herb-green font-bold">Sous Chef</span>
                        <span className="text-gray-400">, what can I do with these ingredients?</span>
                        <span className="text-orange-400">&quot;</span>
                      </p>
                    </div>
                    <div className="text-white text-sm">
                      <TypewriterText 
                        text="Looks like we can make a delicious Caprese Salad! It's a perfect appetizer that only takes about 5 minutes to prepare."
                        speed={30}
                        className="text-white block mb-3"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 0.5 }}
                      >
                        <p className="mb-2">You&apos;ve got all the ingredients:</p>
                        <div className="ml-4 space-y-1">
                          <div><span className="text-golden">•</span><span className="ml-2">Fresh tomatoes</span></div>
                          <div><span className="text-golden">•</span><span className="ml-2">Mozzarella cheese</span></div>
                          <div><span className="text-golden">•</span><span className="ml-2">Fresh basil leaves</span></div>
                          <div><span className="text-golden">•</span><span className="ml-2">Extra virgin olive oil</span></div>
                          <div><span className="text-golden">•</span><span className="ml-2">Salt</span></div>
                          <div><span className="text-golden">•</span><span className="ml-2">Black pepper</span></div>
                          <div><span className="text-golden">•</span><span className="ml-2">Balsamic vinegar (optional)</span></div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {showResponse ? 'Response generated' : 'Analyzing ingredients'}
                </div>
                <span className="text-gray-500">
                  {showResponse ? '< 100ms latency' : 'Processing...'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}