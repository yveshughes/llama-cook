'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SAM2Feature() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Video */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative lg:order-1"
          >
            <div className="aspect-video bg-gradient-to-br from-basil/30 to-olive/30 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-700 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-lg font-medium">SAM2 Video Segmentation</p>
                  <p className="text-sm text-gray-600 mt-2">Interactive object tracking</p>
                </div>
              </div>
            </div>
            
            {/* Natural element */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-tomato/40 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
          
          {/* Right side - Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:order-2"
          >
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-basil/10 px-3 py-1 text-sm font-medium text-basil mb-4">
                Segment Anything Model 2
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Zero-Shot Video Segmentation in Real-Time
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              SAM2&apos;s streaming architecture processes video frames individually with per-session memory, enabling real-time interactive object tracking with a single click.
            </p>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-tomato/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-tomato" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Zero-Shot Performance</h3>
                  <p className="mt-1 text-gray-600">Segments unfamiliar objects without prior training</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-basil/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-basil" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Persistent Object Tracking</h3>
                  <p className="mt-1 text-gray-600">Tracks objects even when temporarily out of view</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Streaming Inference</h3>
                  <p className="mt-1 text-gray-600">Per-frame processing for minimal latency</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-4 bg-cream rounded-lg border border-golden/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-olive">Performance:</span> Trained on SA-V dataset • 600K+ masklets • 51K videos • Outperforms existing VOS models
              </p>
            </motion.div>
            
            <motion.div 
              className="mt-4 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="bg-basil/5 rounded-lg p-3 border border-basil/20">
                <div className="text-2xl font-bold text-basil">1-Click</div>
                <p className="text-xs text-gray-600 mt-1">Object selection</p>
              </div>
              <div className="bg-tomato/5 rounded-lg p-3 border border-tomato/20">
                <div className="text-2xl font-bold text-tomato">Real-time</div>
                <p className="text-xs text-gray-600 mt-1">Video processing</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <Link
                href="/poc/sam2"
                className="inline-flex items-center px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors font-medium"
              >
                See POC in Action
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}