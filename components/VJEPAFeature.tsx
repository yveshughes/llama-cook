'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VJEPAFeature() {
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
            <span className="inline-flex items-center rounded-full bg-herb-red/10 px-4 py-2 text-sm font-medium text-herb-red mb-4">
              Step 4: Prediction AI
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              V-JEPA 2 anticipates your next move
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Keeps your recipe on track by predicting and guiding each step
            </p>
          </motion.div>
        </div>

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
                Your Predictive Cooking Assistant
              </h3>
              <p className="text-lg text-gray-600">
                V-JEPA 2&apos;s world model watches your cooking progress and anticipates what comes next, 
                providing timely reminders and preventing common mistakes before they happen.
              </p>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                className="bg-herb-red/5 rounded-lg p-6 border border-herb-red/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-herb-red mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">Anticipating Your Actions</p>
                    <p className="text-sm text-gray-700 mt-1">
                      &quot;I see you&apos;re about to slice the tomatoes. Remember to use a sharp knife and cut them 1/4 inch thick for even layering.&quot;
                    </p>
                    <div className="mt-3 flex items-center text-xs text-herb-red">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Predicted next: Tomato slicing in ~30 seconds
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
                <h4 className="font-semibold text-gray-900 mb-3">Real-Time Guidance</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-herb-green rounded-full mr-3 animate-pulse"></div>
                    <p className="text-sm text-gray-700">Currently: Arranging mozzarella slices</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-golden rounded-full mr-3"></div>
                    <p className="text-sm text-gray-700">Next: Layer tomato slices</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-olive rounded-full mr-3"></div>
                    <p className="text-sm text-gray-700">Then: Add fresh basil leaves</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                    <p className="text-sm text-gray-700">Finally: Drizzle olive oil</p>
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
                <h4 className="font-semibold text-gray-900 mb-3">Mistake Prevention</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-tomato/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-tomato">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Timing Alert</p>
                      <p className="text-sm text-gray-600">Don&apos;t forget to season between layers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-herb-green/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-herb-green">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Technique Check</p>
                      <p className="text-sm text-gray-600">Good knife angle for clean cuts</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-4 bg-herb-red/5 rounded-lg border border-herb-red/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-herb-red">V-JEPA 2 Technology:</span> World model • 62+ hours training • Motion prediction
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
                href="/poc/vjepa"
                className="inline-flex items-center px-6 py-3 bg-herb-red text-white rounded-lg hover:bg-herb-red/90 transition-colors font-medium"
              >
                Try Prediction AI
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200"
              >
                Next: Live Demo
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
            <div className="bg-gradient-to-br from-herb-red/10 to-olive/10 rounded-xl p-8 border border-herb-red/20">
              {/* Prediction Timeline */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Motion Prediction Timeline</h4>
                
                {/* Timeline visualization */}
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <motion.div 
                    className="relative space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Past action */}
                    <div className="flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-gray-400 rounded-full"></div>
                      <div className="ml-12 opacity-60">
                        <p className="text-xs text-gray-500">30s ago</p>
                        <p className="text-sm font-medium text-gray-700">Washed basil leaves</p>
                      </div>
                    </div>
                    
                    {/* Current action */}
                    <motion.div 
                      className="flex items-start"
                      animate={{
                        x: [0, 2, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <div className="absolute left-3 w-6 h-6 bg-herb-green rounded-full animate-pulse"></div>
                      <div className="ml-12">
                        <p className="text-xs text-herb-green font-medium">Now</p>
                        <p className="text-sm font-medium text-gray-900">Slicing mozzarella</p>
                      </div>
                    </motion.div>
                    
                    {/* Predicted actions */}
                    <div className="flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-golden border-2 border-white rounded-full"></div>
                      <div className="ml-12">
                        <p className="text-xs text-golden">In 45s</p>
                        <p className="text-sm font-medium text-gray-700">Start tomato slicing</p>
                        <p className="text-xs text-gray-500 mt-1">Confidence: 92%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-olive border-2 border-white rounded-full"></div>
                      <div className="ml-12">
                        <p className="text-xs text-olive">In 2m</p>
                        <p className="text-sm font-medium text-gray-700">Layer ingredients</p>
                        <p className="text-xs text-gray-500 mt-1">Confidence: 87%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-herb-red border-2 border-white rounded-full"></div>
                      <div className="ml-12">
                        <p className="text-xs text-herb-red">In 3m</p>
                        <p className="text-sm font-medium text-gray-700">Add olive oil drizzle</p>
                        <p className="text-xs text-gray-500 mt-1">Confidence: 95%</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Model confidence indicator */}
              <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Model Confidence</span>
                  <span className="text-xs font-bold text-herb-red">94%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-herb-red to-golden"
                    initial={{ width: "0%" }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}