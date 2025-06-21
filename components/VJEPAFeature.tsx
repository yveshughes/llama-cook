'use client';

import { motion } from 'framer-motion';

export default function VJEPAFeature() {
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
              <span className="inline-flex items-center rounded-full bg-herb-red/10 px-3 py-1 text-sm font-medium text-herb-red mb-4">
                V-JEPA 2 World Model
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Anticipate Your Next Move
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              V-JEPA 2's world model predicts cooking actions and outcomes, providing proactive guidance before you even ask.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Motion Prediction</h3>
                  <p className="mt-1 text-gray-600">Anticipates your cutting, stirring, and plating movements</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Proactive Assistance</h3>
                  <p className="mt-1 text-gray-600">Suggests next steps based on visual understanding</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Visual Reasoning</h3>
                  <p className="mt-1 text-gray-600">Understands cooking physics and technique outcomes</p>
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
                <span className="font-semibold text-herb-red">World Model:</span> Self-supervised learning • 62+ hours training • Zero-shot task adaptation
              </p>
            </motion.div>
            
            <motion.div 
              className="mt-4 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="bg-herb-red/5 rounded-lg p-3 border border-herb-red/20">
                <div className="text-2xl font-bold text-herb-red">Predictive</div>
                <p className="text-xs text-gray-600 mt-1">Anticipates actions</p>
              </div>
              <div className="bg-olive/5 rounded-lg p-3 border border-olive/20">
                <div className="text-2xl font-bold text-olive">Adaptive</div>
                <p className="text-xs text-gray-600 mt-1">Learns from context</p>
              </div>
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
            <div className="aspect-video bg-gradient-to-br from-herb-red/30 to-olive/30 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-700 text-center">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </motion.div>
                  <p className="text-lg font-medium">V-JEPA 2 Predicting Actions</p>
                  <p className="text-sm text-gray-600 mt-2">World model in action</p>
                </div>
              </div>
            </div>
            
            {/* Animated prediction elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-herb-red/20 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-olive/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}