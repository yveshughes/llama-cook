'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import POCNavigation from '@/components/POCNavigation';

export default function VJEPAPOC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [currentStep, setCurrentStep] = useState(0);
  const [predictions, setPredictions] = useState<string[]>([]);

  const cookingSteps = [
    { 
      action: "Slicing tomatoes",
      prediction: "Next: You'll need to slice the mozzarella to match thickness",
      tip: "Keep slices 1/4 inch thick for best presentation"
    },
    {
      action: "Arranging ingredients",
      prediction: "Next: Basil leaves will go between slices",
      tip: "Alternate tomato and mozzarella for visual appeal"
    },
    {
      action: "Adding basil",
      prediction: "Next: Drizzle with olive oil",
      tip: "Tuck basil leaves gently to avoid bruising"
    },
    {
      action: "Final seasoning",
      prediction: "Complete: Ready to serve!",
      tip: "A pinch of flaky salt elevates the dish"
    }
  ];

  const handleNextStep = () => {
    if (currentStep < cookingSteps.length - 1) {
      setPredictions([...predictions, cookingSteps[currentStep].prediction]);
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-herb-green">
              Llama Cook
            </Link>
            <Link 
              href="/#vjepa" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Compact Hero Section */}
      <section className="pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-tomato/10 px-3 py-1 text-sm font-medium text-tomato">
                  V-JEPA 2
                </span>
                Predictive Cooking AI
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                World model for proactive cooking assistance
              </p>
            </div>
            
            {/* Mode Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('demo')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  mode === 'demo' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setMode('live')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  mode === 'live' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Live
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo/Live */}
      {mode === 'live' ? (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl font-medium mb-2">Live V-JEPA 2 Predictions</p>
                  <p className="text-sm text-gray-400 mb-4">Real-time cooking predictions from video feed</p>
                  <button className="px-6 py-3 bg-tomato text-white rounded-lg hover:bg-tomato/90 transition-colors">
                    Start Live Prediction
                  </button>
                </div>
              </div>
              
              {/* Live indicators */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                LIVE
              </div>
              
              {/* Prediction overlay */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Next Step Prediction</h4>
                <p className="text-sm text-gray-600">Waiting for video input...</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Prediction Interface */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-tomato to-herb-red p-4">
                  <h3 className="text-white font-semibold">Cooking Progress Tracker</h3>
                </div>
                
                {/* Current Action */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Current Step</h4>
                    <span className="text-sm text-gray-500">Step {currentStep + 1} of {cookingSteps.length}</span>
                  </div>
                  
                  <div className="bg-olive/10 p-4 rounded-lg mb-4">
                    <p className="font-medium text-gray-900 mb-2">{cookingSteps[currentStep].action}</p>
                    <p className="text-sm text-gray-600">{cookingSteps[currentStep].tip}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-herb-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / cookingSteps.length) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === cookingSteps.length - 1}
                    className="w-full px-4 py-2 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === cookingSteps.length - 1 ? 'Complete!' : 'Next Step'}
                  </button>
                </div>

                {/* Predictions */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">V-JEPA 2 Predictions</h4>
                  <div className="space-y-2">
                    <div className="flex items-start p-3 bg-tomato/5 rounded-lg border border-tomato/20">
                      <svg className="w-5 h-5 text-tomato mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Next Action Prediction</p>
                        <p className="text-sm text-gray-600 mt-1">{cookingSteps[currentStep].prediction}</p>
                      </div>
                    </div>
                    
                    {predictions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Previous Predictions</p>
                        {predictions.map((pred, idx) => (
                          <div key={idx} className="text-sm text-gray-600 pl-8">
                            ✓ {pred}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How V-JEPA 2 Works</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-tomato/5 rounded-lg border border-tomato/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Visual Understanding</h3>
                    <p className="text-sm text-gray-600">
                      Analyzes video input to understand the current state of ingredients and cooking progress in real-time.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-herb-green/5 rounded-lg border border-herb-green/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Predictive Modeling</h3>
                    <p className="text-sm text-gray-600">
                      Uses world modeling to predict likely next steps based on current actions and cooking patterns.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-golden/5 rounded-lg border border-golden/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Proactive Assistance</h3>
                    <p className="text-sm text-gray-600">
                      Provides timely suggestions and warnings before mistakes happen, improving cooking outcomes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Architecture */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Model Output Example</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "timestamp": "2024-01-21T10:31:22.456Z",
  "current_action": {
    "detected": "slicing",
    "object": "tomato",
    "confidence": 0.97
  },
  "predictions": [
    {
      "next_action": "slice_mozzarella",
      "probability": 0.89,
      "timing": "within_2_minutes"
    },
    {
      "next_action": "arrange_platter",
      "probability": 0.76,
      "timing": "within_5_minutes"
    }
  ],
  "suggestions": [
    "Match mozzarella slice thickness to tomatoes",
    "Prepare serving platter now"
  ],
  "boundaryml_confidence": 0.98  // Structured output validation
}`}
                  </pre>
                </div>
              </div>

              {/* Integration Benefits */}
              <div className="p-6 bg-olive/10 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Integration Benefits</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-herb-green mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Prevents common cooking mistakes before they happen
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-herb-green mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Optimizes workflow by suggesting parallel tasks
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-herb-green mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Adapts to individual cooking patterns over time
                  </li>
                </ul>
                <Link 
                  href="/poc/voice"
                  className="inline-flex items-center mt-4 text-sm font-medium text-herb-green hover:text-herb-green/80"
                >
                  See Voice Integration →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

          </div>
        </section>
      )}

      {/* Use Cases */}
      {mode === 'demo' && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">V-JEPA 2 Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Timing Optimization</h3>
                <p className="text-sm text-gray-600">
                  Suggests when to start parallel tasks for efficient meal preparation
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Error Prevention</h3>
                <p className="text-sm text-gray-600">
                  Warns about potential mistakes based on visual cues and patterns
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Skill Development</h3>
                <p className="text-sm text-gray-600">
                  Provides contextual tips to improve technique over time
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POC Navigation */}
      <POCNavigation />
    </main>
  );
}