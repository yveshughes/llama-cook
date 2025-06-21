'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
      className="py-24 sm:py-32 bg-cream"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Try the Demo
          </h2>
          <p className="text-lg text-gray-600 mb-8">Experience the future of cooking with AI assistance</p>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-golden/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-olive mb-4">
                What You'll Need
              </h3>
              <div className="text-left max-w-md mx-auto space-y-3 text-gray-600">
                {[
                  'iPhone with camera (for video streaming)',
                  'MacBook Pro (for running the demo)',
                  'Fresh ingredients (tomatoes, basil, mozzarella)'
                ].map((req, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-herb-green mr-2">•</span>
                    <span>{req}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="border-t border-golden/20 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-lg font-medium text-gray-900 mb-6">
                Scan to Start Cooking
              </p>
              
              {qrCodeUrl && (
                <motion.div 
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.8,
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
                      width={300}
                      height={300}
                      className="block"
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
              )}
              
              <motion.p 
                className="mt-6 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Or visit: <code className="bg-mozzarella px-2 py-1 rounded">http://localhost:3000/demo</code>
              </motion.p>
            </motion.div>

            <motion.div 
              className="mt-8 pt-8 border-t border-golden/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center justify-center space-x-2 text-tomato"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium">Make sure the server is running first</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}