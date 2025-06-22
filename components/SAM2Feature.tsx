'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SAM2Feature() {
  return (
    <section className="py-24 sm:py-32 bg-cream/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full bg-basil/10 px-4 py-2 text-sm font-medium text-basil mb-4">
              Step 3: Vision Tracking
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              SAM2 keeps watch of ingredients and their state
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Real-time tracking ensures nothing is overlooked during preparation
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-basil/10 to-tomato/10 rounded-xl p-8 border border-basil/20">
              {/* Kitchen View */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                  {/* Simulated video feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
                    {/* Ingredient boxes with tracking */}
                    <motion.div
                      className="absolute top-12 left-16 w-20 h-20 border-2 border-basil rounded-lg"
                      animate={{
                        borderColor: ["#8B9467", "#a3b574", "#8B9467"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-basil text-white text-xs px-2 py-1 rounded">
                        Basil - Fresh
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute top-20 right-24 w-24 h-24 border-2 border-tomato rounded-lg"
                      animate={{
                        borderColor: ["#E85D04", "#ff6b35", "#E85D04"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5,
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-tomato text-white text-xs px-2 py-1 rounded">
                        Tomato - Whole
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-16 left-32 w-28 h-20 border-2 border-golden rounded-lg"
                      animate={{
                        borderColor: ["#D4A574", "#e6b885", "#D4A574"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1,
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-golden text-white text-xs px-2 py-1 rounded">
                        Mozzarella - Whole
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-basil/10 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-basil">Basil</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">Tracked</div>
                </div>
                <div className="bg-tomato/10 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-tomato">Tomato</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">Ready</div>
                </div>
                <div className="bg-golden/10 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-golden">Mozzarella</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">Waiting</div>
                </div>
              </div>
            </div>
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
                Your AI Kitchen Observer
              </h3>
              <p className="text-lg text-gray-600">
                SAM2&apos;s advanced segmentation technology watches your ingredients throughout the cooking process, 
                tracking their location and state changes to ensure perfect timing and coordination.
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
                  <span className="w-8 h-8 bg-basil/10 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-basil">1</span>
                  Automatic Detection
                </h4>
                <p className="text-gray-600 ml-11">
                  SAM2 identifies and tracks each ingredient without manual labeling, understanding what needs attention.
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
                  <span className="w-8 h-8 bg-tomato/10 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-tomato">2</span>
                  State Recognition
                </h4>
                <p className="text-gray-600 ml-11">
                  Monitors changes like chopping, mixing, or cooking, alerting you when ingredients need attention.
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
                  <span className="w-8 h-8 bg-golden/10 rounded-full flex items-center justify-center mr-3 text-sm font-bold text-golden">3</span>
                  Position Tracking
                </h4>
                <p className="text-gray-600 ml-11">
                  Keeps track of where everything is, even if temporarily obscured or moved around the kitchen.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-4 bg-basil/5 rounded-lg border border-basil/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-basil">SAM2 Technology:</span> Zero-shot segmentation • Real-time tracking • 51K+ videos trained
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
                href="/poc/sam2"
                className="inline-flex items-center px-6 py-3 bg-basil text-white rounded-lg hover:bg-basil/90 transition-colors font-medium"
              >
                Try Vision AI
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#vjepa"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200"
              >
                Next: Prediction AI
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