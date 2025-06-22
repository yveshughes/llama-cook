'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  text: string;
  className?: string;
}

export default function AudioPlayer({ text, className = '' }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate audio when component mounts or text changes
  useEffect(() => {
    generateAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const generateAudio = async () => {
    if (!text) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }
      
      const data = await response.json();
      setAudioSrc(data.audio);
    } catch (err) {
      console.error('Error generating audio:', err);
      setError('Audio generation unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !audioSrc) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  if (error) {
    return null; // Silently fail if audio generation is not available
  }

  return (
    <motion.div 
      className={`inline-flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 0.5 }}
    >
      <button
        onClick={togglePlayPause}
        disabled={isLoading || !audioSrc}
        className={`
          group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200 ${
          isLoading || !audioSrc
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-herb-green text-white hover:bg-herb-green/90 active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generating audio...</span>
          </>
        ) : isPlaying ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pause</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Listen to Sous Chef</span>
          </>
        )}
      </button>
      
      {/* Audio element - hidden */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={handleAudioEnd}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}
      
      {/* Visual indicator when playing */}
      {isPlaying && (
        <div className="flex items-center gap-1">
          <motion.div
            className="w-1 h-3 bg-herb-green rounded-full"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.div
            className="w-1 h-3 bg-herb-green rounded-full"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.1 }}
          />
          <motion.div
            className="w-1 h-3 bg-herb-green rounded-full"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
          />
        </div>
      )}
    </motion.div>
  );
}