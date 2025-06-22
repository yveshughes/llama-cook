'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DemoSection() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  useEffect(() => {
    // Get the current URL for the demo
    const demoUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/demo` 
      : 'http://localhost:3000/demo';
    
    // Generate QR code URL using qr-server.com API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(demoUrl)}`;
    setQrCodeUrl(qrUrl);
  }, []);

  return (
    <motion.section 
      className="py-24 sm:py-32 bg-gradient-to-br from-cream to-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full bg-herb-green/10 px-4 py-2 text-sm font-medium text-herb-green mb-4">
              Step 5: Experience It All
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              See the complete AI cooking experience
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Watch all the technologies work together in real-time
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Demo Access */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-herb-green/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to Cook with AI?
              </h3>
              
              <div className="space-y-6">
                <div className="bg-herb-green/5 rounded-lg p-6 border border-herb-green/20">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Start Guide</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-herb-green/10 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-herb-green">1</span>
                      <p>Set up your iPhone camera streaming</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-golden/10 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-golden">2</span>
                      <p>Place ingredients on your counter</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-tomato/10 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-tomato">3</span>
                      <p>Say &quot;Sous Chef&quot; to activate voice</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-basil/10 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-basil">4</span>
                      <p>Follow AI guidance to create your dish</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                {qrCodeUrl && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 mb-4">
                      Scan to Launch Demo
                    </p>
                    <motion.div 
                      className="relative inline-block"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                    >
                      <motion.div 
                        className="bg-white p-4 rounded-lg shadow-lg border-2 border-herb-green/20"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={qrCodeUrl}
                          alt="QR Code for Demo"
                          width={200}
                          height={200}
                          className="block"
                          loading="lazy"
                        />
                      </motion.div>
                      
                      {/* Scanning animation */}
                      <motion.div
                        className="absolute inset-0 border-2 border-herb-green rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.8, 1.1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                    </motion.div>
                    
                    <p className="mt-4 text-xs text-gray-500">
                      Or visit: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/demo</code>
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/demo"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors font-medium"
                  >
                    Launch Full Demo
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="#setup"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200"
                  >
                    Setup Instructions
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Features in Action */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-herb-green/5 to-golden/5 rounded-xl p-8 border border-golden/20">
                <h4 className="text-lg font-bold text-gray-900 mb-6">All Technologies Working Together</h4>
                
                {/* Feature Status */}
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-herb-green rounded-full animate-pulse mr-3"></div>
                      <span className="font-medium text-gray-900">Voice AI</span>
                    </div>
                    <span className="text-sm text-herb-green">Active</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-golden rounded-full animate-pulse mr-3"></div>
                      <span className="font-medium text-gray-900">Llama-4-Scout</span>
                    </div>
                    <span className="text-sm text-golden">Processing</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-basil rounded-full animate-pulse mr-3"></div>
                      <span className="font-medium text-gray-900">SAM2 Vision</span>
                    </div>
                    <span className="text-sm text-basil">Tracking</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-herb-red rounded-full animate-pulse mr-3"></div>
                      <span className="font-medium text-gray-900">V-JEPA 2</span>
                    </div>
                    <span className="text-sm text-herb-red">Predicting</span>
                  </motion.div>
                </div>
                
                {/* Live Metrics */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-herb-green">47ms</div>
                    <p className="text-xs text-gray-600 mt-1">Response Time</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-golden">98%</div>
                    <p className="text-xs text-gray-600 mt-1">Accuracy</p>
                  </div>
                </div>
              </div>

              {/* Requirements Notice */}
              <motion.div 
                className="bg-tomato/5 rounded-lg p-4 border border-tomato/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-tomato mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Demo Requirements</p>
                    <p className="text-gray-600 mt-1">iPhone with camera + MacBook Pro + Local server running</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}