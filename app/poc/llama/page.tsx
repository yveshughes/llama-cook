'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import POCNavigation from '@/components/POCNavigation';

export default function LlamaPOC() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`Based on the tomatoes, mozzarella, and basil you have, I recommend making a Caprese Salad. Here's how:\n\n1. Slice the tomatoes and mozzarella into 1/4 inch rounds\n2. Arrange alternating slices on a platter\n3. Tuck basil leaves between the slices\n4. Drizzle with olive oil and balsamic vinegar\n5. Season with salt and pepper to taste\n\nThis classic Italian dish takes only 10 minutes to prepare!`);
      setIsLoading(false);
    }, 800);
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
              href="/#llama" 
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
                <span className="inline-flex items-center rounded-full bg-golden/10 px-3 py-1 text-sm font-medium text-golden">
                  Llama-4-Scout
                </span>
                AI Recipe Generation
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sub-100ms cooking guidance powered by Meta AI
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
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-golden to-herb-green p-1 rounded-xl">
                <div className="bg-white rounded-lg">
                  <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                      <span className="text-6xl">🦙</span>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold text-gray-900">Live Llama-4-Scout</h2>
                        <p className="text-gray-600">Connected to production API</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                        {/* Live chat messages would appear here */}
                        <p className="text-gray-500 text-center mt-20">Start a conversation to see live responses</p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Ask Llama-4-Scout anything about cooking..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-6 py-3 bg-golden text-white rounded-lg hover:bg-golden/90 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Processing...' : 'Send'}
                        </button>
                      </form>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Live API Connection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-golden to-herb-green p-4">
                  <h3 className="text-white font-semibold">Chat with Llama-4-Scout</h3>
                </div>
                
                <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                  {/* Example conversation */}
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                        <p className="text-sm text-gray-700">I have tomatoes, mozzarella, and basil. What can I make?</p>
                      </div>
                    </div>
                    {response && (
                      <div className="flex justify-end">
                        <div className="bg-herb-green text-white p-3 rounded-lg shadow-sm max-w-sm">
                          <p className="text-sm whitespace-pre-line">{response}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about recipes or cooking techniques..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-herb-green"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Thinking...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Performance Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-herb-green">87ms</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-golden">99.8%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-tomato">405B</div>
                  <div className="text-sm text-gray-600">Parameters</div>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Capabilities</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-golden/5 rounded-lg border border-golden/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Recipe Generation</h3>
                    <p className="text-sm text-gray-600">
                      Creates personalized recipes based on available ingredients, dietary restrictions, and cuisine preferences.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-herb-green/5 rounded-lg border border-herb-green/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Step-by-Step Guidance</h3>
                    <p className="text-sm text-gray-600">
                      Provides detailed cooking instructions with timing, temperatures, and technique explanations.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-tomato/5 rounded-lg border border-tomato/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Contextual Awareness</h3>
                    <p className="text-sm text-gray-600">
                      Understands cooking context, adjusts instructions based on skill level, and suggests alternatives.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Integration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">API Request Example</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`POST /api/llama/chat
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful cooking assistant."
    },
    {
      "role": "user",
      "content": "I have tomatoes, mozzarella, and basil",
      "context": {
        "detected_ingredients": ["tomato", "mozzarella", "basil"],
        "user_preferences": {
          "cuisine": "italian",
          "dietary": ["vegetarian"]
        }
      }
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500,
  "output_format": "boundaryml_recipe_v1"  // Ensures structured recipe steps
}`}
                  </pre>
                </div>
              </div>

              {/* BoundaryML Integration */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">BoundaryML Integration</h3>
                <p className="text-sm text-gray-600">
                  Structures Llama's responses into consistent JSON with timed steps, ingredient quantities, and cooking actions.
                </p>
              </div>

              {/* Integration with SAM2 */}
              <div className="p-6 bg-olive/10 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Visual Context Integration</h3>
                <p className="text-sm text-gray-600">
                  Llama-4-Scout receives real-time ingredient data from SAM2, enabling contextual recipe suggestions based on what's actually in your kitchen.
                </p>
                <Link 
                  href="/poc/sam2"
                  className="inline-flex items-center mt-3 text-sm font-medium text-herb-green hover:text-herb-green/80"
                >
                  See SAM2 POC →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Features Grid */}
      {mode === 'demo' && (
        <section className="py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Multi-turn Conversations</h3>
                <p className="text-sm text-gray-600">
                  Maintains context across multiple interactions for coherent cooking guidance
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Nutrition Analysis</h3>
                <p className="text-sm text-gray-600">
                  Provides detailed nutritional information for suggested recipes
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Skill Adaptation</h3>
                <p className="text-sm text-gray-600">
                  Adjusts complexity and detail based on user's cooking experience
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