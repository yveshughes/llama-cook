'use client';

import { motion } from 'framer-motion';

const techStack = [
  { name: 'Meta Llama API', category: 'AI' },
  { name: 'Meta SAM2', category: 'Vision' },
  { name: 'Meta V-JEPA 2', category: 'Prediction' },
  { name: 'AWS Transcribe', category: 'Speech-to-Text' },
  { name: 'AWS Polly', category: 'Text-to-Speech' },
  { name: 'BoundaryML', category: 'Structure' },
];

export default function TechStackBanner() {
  return (
    <div className="w-full bg-herb-red text-white py-2 overflow-hidden">
      <div className="flex animate-scroll">
        <div className="flex items-center space-x-8 px-4 whitespace-nowrap">
          {techStack.map((tech, index) => (
            <motion.div
              key={`${tech.name}-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-sm font-medium">{tech.name}</span>
              <span className="text-xs opacity-75">• {tech.category}</span>
            </motion.div>
          ))}
          {/* Duplicate for seamless scrolling */}
          {techStack.map((tech) => (
            <div
              key={`${tech.name}-2`}
              className="flex items-center space-x-2"
            >
              <span className="text-sm font-medium">{tech.name}</span>
              <span className="text-xs opacity-75">• {tech.category}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}