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

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);

      // Auto-play the video when component mounts
      videoElement.play().catch(console.error);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
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

    return (
      <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video.src}
          playsInline
          muted
          loop
          autoPlay
        />
        
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