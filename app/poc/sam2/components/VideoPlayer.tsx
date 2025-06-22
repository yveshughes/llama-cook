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
    const [hasEnded, setHasEnded] = useState(false);

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

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setHasEnded(true);
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);

      // Auto-play the video when component mounts
      videoElement.play().catch(console.error);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }, [onTimeUpdate, onLoadedMetadata]);

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    const resetVideo = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setHasEnded(false);
        videoRef.current.play();
      }
    };

    return (
      <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video.src}
          playsInline
          muted
          autoPlay
        />
        
        {/* End screen with reset button */}
        {hasEnded && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Demo Complete</h3>
              <p className="text-sm text-white/70 mb-4">All ingredients detected and tracked</p>
              <button
                onClick={resetVideo}
                className="inline-flex items-center gap-2 px-6 py-3 bg-herb-green text-white rounded-lg hover:bg-herb-green/90 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Watch Again
              </button>
            </div>
          </div>
        )}
        
        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
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
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;