'use client';

import { motion } from 'framer-motion';

export default function LlamaFeature() {
  return (
    <section className="py-24 sm:py-32 bg-cream/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-golden/20 px-3 py-1 text-sm font-medium text-olive mb-4">
                Llama-4-Scout-17B Model
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Lightning-Fast Culinary Intelligence
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              Powered by Llama-4-Scout-17B with 16 experts and 1M token context, delivering instant recipe creation and cooking guidance at unprecedented speed.
            </p>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-herb-red/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-herb-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Instant Recipe Generation</h3>
                  <p className="mt-1 text-gray-600">Scout's 16-expert architecture creates recipes in milliseconds</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-olive/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Real-Time Conversation</h3>
                  <p className="mt-1 text-gray-600">1M token context remembers your entire cooking session</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-golden/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Low-Latency Responses</h3>
                  <p className="mt-1 text-gray-600">Optimized for voice interactions with minimal delay</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-4 bg-white rounded-lg border border-herb-red/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-herb-red">Performance Stats:</span> Llama-4-Scout-17B • 17B active parameters • 16 experts • 1M context • Runs on single H100
              </p>
            </motion.div>
          </motion.div>
          
          {/* Right side - Video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-golden/30 to-olive/30 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-700 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">Llama-4-Scout in Action</p>
                  <p className="text-sm text-gray-600 mt-2">Lightning-fast recipe generation</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}