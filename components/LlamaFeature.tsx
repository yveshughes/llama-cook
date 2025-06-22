'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import TypewriterText from './TypewriterText';

export default function LlamaFeature() {
  const [showTranscription, setShowTranscription] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    // Listen for custom event from Voice section
    const handleTransitionTrigger = () => {
      setShowTranscription(true);
      setTimeout(() => {
        setShowResponse(true);
      }, 1000);
    };

    window.addEventListener('triggerLlamaTransition', handleTransitionTrigger);

    return () => window.removeEventListener('triggerLlamaTransition', handleTransitionTrigger);
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full bg-golden/10 px-4 py-2 text-sm font-medium text-golden mb-4">
              Step 2: AI Analysis
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Llama 4 sees what we&apos;re working with
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI instantly analyzes your ingredients and suggests perfect recipes
            </p>
          </motion.div>
        </div>

        {/* Animated Transcription Box */}
        <AnimatePresence>
          {showTranscription && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-800 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Processing Request</h4>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-golden rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-golden">Analyzing</span>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 font-mono">
                  <p className="text-sm mb-2">
                    <span className="text-orange-400">&quot;</span>
                    <span className="text-herb-green font-bold">Sous Chef</span>
                    <span className="text-white">, what can I do with these ingredients?</span>
                    <span className="text-orange-400">&quot;</span>
                  </p>
                  {showResponse && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <span className="text-golden text-xs">Llama-4-Scout-17B:</span>
                      <p className="text-white text-sm mt-1">
                        <TypewriterText 
                          text="I can see you have fresh tomatoes, mozzarella, and basil. These are perfect for a classic Caprese Salad! Would you like me to guide you through the preparation?"
                          speed={30}
                          className="text-white"
                        />
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                From Ingredients to Inspiration in Milliseconds
              </h3>
              <p className="text-lg text-gray-600">
                Once you&apos;ve asked about your ingredients, Llama-4-Scout-17B instantly processes what you have, 
                understands dietary preferences, and generates personalized recipe suggestions tailored to your kitchen.
              </p>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                className="bg-golden/5 rounded-lg p-6 border border-golden/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-golden mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">Understanding Your Kitchen</p>
                    <p className="text-sm text-gray-700 mt-1">
                      &quot;I see you have tomatoes, mozzarella, and fresh basil. These are perfect for Italian dishes!&quot;
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
                        🍅 Tomatoes
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
                        🧀 Mozzarella
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
                        🌿 Fresh Basil
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-3">Instant Recipe Suggestions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Classic Caprese Salad</p>
                      <p className="text-sm text-gray-600">5 min • No cooking required</p>
                    </div>
                    <span className="text-sm font-medium text-herb-green">98% match</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Margherita Flatbread</p>
                      <p className="text-sm text-gray-600">15 min • Oven required</p>
                    </div>
                    <span className="text-sm font-medium text-golden">85% match</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Tomato Mozzarella Pasta</p>
                      <p className="text-sm text-gray-600">20 min • Stovetop</p>
                    </div>
                    <span className="text-sm font-medium text-olive">75% match</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-gray-900 mb-3">Contextual Understanding</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-herb-red/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-herb-red">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Ingredient Recognition</p>
                      <p className="text-sm text-gray-600">Identifies fresh vs. stored ingredients</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-olive/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-olive">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dietary Awareness</p>
                      <p className="text-sm text-gray-600">Remembers preferences from conversation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-golden/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-golden">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Skill Adaptation</p>
                      <p className="text-sm text-gray-600">Adjusts complexity to your cooking level</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-4 bg-golden/5 rounded-lg border border-golden/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-golden">Powered by Llama-4-Scout-17B:</span> 16 experts • 1M token context • Sub-100ms response time
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-4"
            >
              <Link
                href="/poc/llama"
                className="inline-flex items-center px-6 py-3 bg-golden text-white rounded-lg hover:bg-golden/90 transition-colors font-medium"
              >
                Try Recipe AI
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#sam2"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200"
              >
                Next: Vision Tracking
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right side - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-golden/10 to-olive/10 rounded-xl p-8 border border-golden/20">
              <div className="space-y-6">
                {/* AI Thinking Process */}
                <div className="text-center mb-8">
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4"
                  >
                    <svg className="w-10 h-10 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </motion.div>
                  <p className="text-lg font-semibold text-gray-800">Llama-4-Scout Processing</p>
                </div>

                {/* Analysis Steps */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="w-2 h-2 bg-herb-green rounded-full mr-3"></div>
                    <p className="text-sm text-gray-700">Analyzing: tomatoes, mozzarella, basil...</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="w-2 h-2 bg-golden rounded-full mr-3"></div>
                    <p className="text-sm text-gray-700">Matching with 10,000+ Italian recipes...</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="w-2 h-2 bg-olive rounded-full mr-3"></div>
                    <p className="text-sm text-gray-700">Considering freshness and preparation time...</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                    className="flex items-center bg-white rounded-lg p-4 shadow-sm border-2 border-herb-green"
                  >
                    <div className="w-2 h-2 bg-herb-green rounded-full mr-3 animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-900">Perfect match: Caprese Salad!</p>
                  </motion.div>
                </div>

                {/* Response time */}
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-500">Total processing time: 47ms</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}