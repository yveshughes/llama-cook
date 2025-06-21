'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const technologies = [
  {
    id: 'sam2',
    name: 'SAM2',
    title: 'Segment Anything Model 2',
    description: 'Real-time object detection and tracking. Identifies ingredients and monitors your cooking progress.',
    videoUrl: '/videos/sam2-demo.mp4',
    features: [
      'Identifies all ingredients instantly',
      'Tracks objects across video frames',
      'Works with any cooking ingredient'
    ]
  },
  {
    id: 'llama',
    name: 'Llama',
    title: 'Large Language Model',
    description: 'Generates personalized recipes and provides step-by-step guidance based on your ingredients.',
    videoUrl: '/videos/llama-demo.mp4',
    features: [
      'Creates recipes from available ingredients',
      'Adapts instructions in real-time',
      'Provides cooking tips and alternatives'
    ]
  },
  {
    id: 'voice',
    name: 'Voice AI',
    title: 'Natural Voice Interaction',
    description: 'Hands-free cooking assistance with natural speech recognition and synthesis.',
    videoUrl: '/videos/voice-demo.mp4',
    features: [
      'Wake word activation: "Sous Chef"',
      'Natural conversation flow',
      'Clear step-by-step instructions'
    ]
  }
];

export default function TechShowcase() {
  const [activeTab, setActiveTab] = useState('sam2');

  return (
    <motion.section 
      className="py-24 sm:py-32 bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Powered by Meta AI
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Three cutting-edge AI technologies working together
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <nav className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1" aria-label="Tabs">
              {technologies.map((tech, index) => (
                <motion.button
                  key={tech.id}
                  onClick={() => setActiveTab(tech.id)}
                  className={`${
                    activeTab === tech.id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  } px-4 py-2 text-sm font-medium rounded-md transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {tech.name}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          <AnimatePresence mode="wait">
            {technologies.map((tech) => (
              activeTab === tech.id && (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          {tech.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {tech.description}
                        </p>
                        <ul className="space-y-3">
                          {tech.features.map((feature, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <span className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                              <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                      <motion.div 
                        className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="text-white text-center"
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>Video Demo Placeholder</p>
                            <p className="text-sm text-gray-400 mt-2">{tech.videoUrl}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}