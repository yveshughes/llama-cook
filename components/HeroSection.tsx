'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex justify-center">
              <img 
                src="/logo.svg" 
                alt="Llama-Cook" 
                className="h-96 sm:h-[28rem] lg:h-[32rem] w-auto"
              />
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Your lightning-fast AI cooking companion, delivering instant guidance and predictive assistance through every step.
            </p>
            
            <div className="space-y-4 mb-8">
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <svg className="w-6 h-6 text-tomato mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">Lightning-Fast Response</h3>
                  <p className="text-gray-600">Llama-4-Scout delivers instant answers with 1M token context</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <svg className="w-6 h-6 text-basil mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Visual Recognition</h3>
                  <p className="text-gray-600">SAM2 + Llama-4-Scout identify ingredients instantly</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <svg className="w-6 h-6 text-golden mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900">Low-Latency Voice Control</h3>
                  <p className="text-gray-600">Scout&apos;s efficiency enables seamless hands-free cooking</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right side - Video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="text-gray-700 text-center"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">Watch Sous Chef in Action</p>
                  <p className="text-sm text-gray-500 mt-2">Creating fresh, healthy meals</p>
                </motion.div>
              </div>
            </div>
            
            {/* Natural decorative elements */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-basil/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 bg-golden/20 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}