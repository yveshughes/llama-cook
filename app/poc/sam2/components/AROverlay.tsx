'use client';

import { useRef, useEffect, useState } from 'react';
import { Detection } from '../data/detections';
import { drawBoundingBox, drawLabel, clearCanvas, drawPulse } from '../utils/canvas';

interface AROverlayProps {
  detections: Detection[];
  videoWidth: number;
  videoHeight: number;
  isEnabled: boolean;
  highlightedId?: string | null;
  className?: string;
}

interface AnimatedDetection extends Detection {
  animationProgress: number;
  pulseProgress: number;
  isNew: boolean;
}

export default function AROverlay({
  detections,
  videoWidth,
  videoHeight,
  isEnabled,
  highlightedId,
  className = '',
}: AROverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animatedDetectionsRef = useRef<Map<string, AnimatedDetection>>(new Map());
  const animationFrameRef = useRef<number>();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Update animated detections
  useEffect(() => {
    if (!isEnabled) {
      animatedDetectionsRef.current.clear();
      return;
    }

    const currentIds = new Set(detections.map(d => d.id));
    const animatedMap = animatedDetectionsRef.current;

    // Remove old detections
    for (const [id, animated] of animatedMap.entries()) {
      if (!currentIds.has(id)) {
        // Fade out animation
        animated.animationProgress -= 0.1;
        if (animated.animationProgress <= 0) {
          animatedMap.delete(id);
        }
      }
    }

    // Add or update detections
    detections.forEach(detection => {
      if (!animatedMap.has(detection.id)) {
        // New detection
        animatedMap.set(detection.id, {
          ...detection,
          animationProgress: 0,
          pulseProgress: 0,
          isNew: true,
        });
      } else {
        // Update existing
        const existing = animatedMap.get(detection.id)!;
        animatedMap.set(detection.id, {
          ...detection,
          animationProgress: Math.min(1, existing.animationProgress + 0.1),
          pulseProgress: existing.isNew ? Math.min(1, existing.pulseProgress + 0.05) : 1,
          isNew: existing.isNew && existing.pulseProgress < 1,
        });
      }
    });
  }, [detections, isEnabled]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !isEnabled || canvasSize.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      clearCanvas(ctx);

      const animatedDetections = Array.from(animatedDetectionsRef.current.values());
      
      // Draw in layers for better visual hierarchy
      // Layer 1: Pulse effects for new detections
      animatedDetections.forEach(detection => {
        if (detection.isNew && detection.pulseProgress < 1) {
          drawPulse({
            ctx,
            detection,
            videoWidth,
            videoHeight,
            canvasWidth: canvasSize.width,
            canvasHeight: canvasSize.height,
            pulseProgress: detection.pulseProgress,
          });
        }
      });

      // Layer 2: Bounding boxes
      animatedDetections.forEach(detection => {
        drawBoundingBox({
          ctx,
          detection,
          videoWidth,
          videoHeight,
          canvasWidth: canvasSize.width,
          canvasHeight: canvasSize.height,
          isHighlighted: detection.id === highlightedId,
          animationProgress: detection.animationProgress,
        });
      });

      // Layer 3: Labels
      animatedDetections.forEach(detection => {
        drawLabel({
          ctx,
          detection,
          videoWidth,
          videoHeight,
          canvasWidth: canvasSize.width,
          canvasHeight: canvasSize.height,
          isHighlighted: detection.id === highlightedId,
          animationProgress: detection.animationProgress,
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled, highlightedId, videoWidth, videoHeight, canvasSize]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}