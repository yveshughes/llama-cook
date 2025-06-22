'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const setupSteps = [
  {
    id: 'prerequisites',
    title: 'Prerequisites',
    content: `Before starting, ensure you have:
• Node.js 18+ installed
• Python 3.10+ with pip
• CUDA-capable GPU (for SAM2)
• iPhone and MacBook on same network
• Meta AI API keys`
  },
  {
    id: 'terminal1',
    title: 'Terminal 1: Backend Server',
    content: `# Clone and setup backend
git clone [repo-url]
cd llama-cook/backend

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables
export LLAMA_MODEL="llama-4-scout-17b-16e-instruct"
export LLAMA_API_KEY="your-key"
export AWS_ACCESS_KEY="your-key"
export AWS_SECRET_KEY="your-secret"

# Start the backend server
python server.py
# Server will run on http://localhost:8000`
  },
  {
    id: 'terminal2',
    title: 'Terminal 2: Frontend',
    content: `# In a new terminal
cd llama-cook

# Install dependencies
npm install

# Start Next.js development server
npm run dev
# Frontend will run on http://localhost:3000`
  },
  {
    id: 'terminal3',
    title: 'Terminal 3: SAM2 Service',
    content: `# In another terminal
cd llama-cook/server

# Install dependencies
pip install flask flask-cors opencv-python pillow

# Start SAM2 service (use mock for testing)
python sam2_mock_server.py
# Service will run on http://localhost:5000`
  },
  {
    id: 'terminal4',
    title: 'Terminal 4: ngrok Tunnel',
    content: `# In another terminal, expose SAM2 with ngrok
ngrok http 5000

# You'll see output like:
# Forwarding  https://abc123xyz.ngrok-free.app -> http://localhost:5000

# Copy the https URL and add to .env.local:
# NEXT_PUBLIC_SAM2_SERVER_URL=https://abc123xyz.ngrok-free.app

# Restart the Next.js server (Terminal 2) after updating .env.local`
  },
  {
    id: 'iphone',
    title: 'iPhone Setup',
    content: `1. Open Safari on iPhone
2. Navigate to http://[your-mac-ip]:3000/camera
3. Allow camera permissions
4. Position phone to show cooking area
5. Tap "Start Streaming"

Note: iPhone and MacBook must be on same WiFi network`
  },
  {
    id: 'testing',
    title: 'Testing the Demo',
    content: `1. Open http://localhost:3000 on MacBook
2. Navigate to SAM2 POC: http://localhost:3000/poc/sam2
3. Click "Live" mode to see QR code
4. Scan QR code with iPhone camera
5. Allow camera permissions and start streaming

For voice demo:
1. Click "Demo It" on homepage
2. Say "Sous Chef" to activate
3. Show ingredients to camera
4. Follow the AI guidance

Troubleshooting:
• Check all services are running
• Verify ngrok URL in .env.local
• Ensure iPhone and MacBook on same WiFi
• Check browser console for errors`
  }
];

export default function SetupInstructions() {
  const [activeStep, setActiveStep] = useState('prerequisites');

  return (
    <motion.section 
      className="py-24 sm:py-32 bg-white"
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
          <h2 className="text-3xl font-bold tracking-tight text-olive sm:text-4xl">
            Setup Instructions
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Get the demo running in minutes
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <motion.div 
              className="mb-8 lg:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <nav className="space-y-1">
                {setupSteps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`${
                      activeStep === step.id
                        ? 'bg-cream border-herb-red text-herb-red'
                        : 'border-transparent text-gray-600 hover:bg-mozzarella hover:text-olive'
                    } group w-full border-l-4 px-3 py-2 text-left text-sm font-medium transition-all`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    {step.title}
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {setupSteps.map((step) => (
                  activeStep === step.id && (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="bg-mozzarella rounded-lg p-6 border border-cream"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <h3 className="text-lg font-semibold text-olive mb-4">
                          {step.title}
                        </h3>
                        <motion.pre 
                          className="text-sm text-gray-100 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-lg overflow-x-auto"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {step.content}
                        </motion.pre>
                      </motion.div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div 
            className="mt-12 bg-golden/10 rounded-lg p-6 border border-golden/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex">
              <motion.div 
                className="flex-shrink-0"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
              >
                <svg className="h-5 w-5 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-olive">Quick Start Tip</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>For the hackathon demo, we recommend running all services locally on the MacBook for best performance. The setup can be completed in under 10 minutes with all dependencies installed.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}