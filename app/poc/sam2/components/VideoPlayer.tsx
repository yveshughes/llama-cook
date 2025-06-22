'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { VideoConfig } from '../data/videos';

interface VideoPlayerProps {
  video: VideoConfig;
  onTimeUpdate?: (currentTime: number) => void;
  onLoadedMetadata?: (width: number, height: number) => void;
  className?: string;
}

export interface VideoPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getVideoElement: () => HTMLVideoElement | null;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ video, onTimeUpdate, onLoadedMetadata, className = '' }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPoster, setShowPoster] = useState(true);

    useImperativeHandle(ref, () => ({
      play: async () => {
        if (videoRef.current) {
          try {
            await videoRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error playing video:', error);
          }
        }
      },
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      seek: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time / 1000; // Convert ms to seconds
        }
      },
      getCurrentTime: () => {
        return videoRef.current ? videoRef.current.currentTime * 1000 : 0; // Convert to ms
      },
      getVideoElement: () => videoRef.current,
    }));

    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const handleTimeUpdate = () => {
        if (onTimeUpdate) {
          onTimeUpdate(videoElement.currentTime * 1000); // Convert to ms
        }
      };

      const handleLoadedMetadata = () => {
        if (onLoadedMetadata) {
          onLoadedMetadata(videoElement.videoWidth, videoElement.videoHeight);
        }
      };

      const handleEnded = () => {
        // Loop the video
        videoElement.currentTime = 0;
        videoElement.play().catch(console.error);
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }, [onTimeUpdate, onLoadedMetadata]);

    // For demo purposes, we'll use a placeholder video element
    // In production, you would use actual video files
    return (
      <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
        {showPoster ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{video.title}</h3>
              <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto px-4">{video.description}</p>
              <button
                onClick={() => {
                  setShowPoster(false);
                  setTimeout(() => {
                    // Simulate video metadata for demo
                    if (onLoadedMetadata) {
                      onLoadedMetadata(640, 480);
                    }
                    setIsPlaying(true);
                    // Start simulated playback
                    let startTime = Date.now();
                    const updateTime = () => {
                      if (!isPlaying) return;
                      const elapsed = Date.now() - startTime;
                      if (elapsed >= video.duration) {
                        startTime = Date.now(); // Loop
                      }
                      if (onTimeUpdate) {
                        onTimeUpdate(elapsed % video.duration);
                      }
                      requestAnimationFrame(updateTime);
                    };
                    updateTime();
                  }, 100);
                }}
                className="px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors font-medium"
              >
                Start Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Simulated video background with animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-herb-green/20 via-golden/20 to-tomato/20 animate-pulse" />
              </div>
            </div>
            
            {/* Video controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-herb-green transition-all duration-100" style={{ width: '0%' }} />
                  </div>
                </div>
                <span className="text-white text-sm font-mono">
                  {video.title}
                </span>
              </div>
            </div>
            
            {/* Hidden video element for future use */}
            <video
              ref={videoRef}
              className="hidden"
              playsInline
              muted
              loop
            />
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;