import { Detection } from '../data/detections';

export interface DrawOptions {
  ctx: CanvasRenderingContext2D;
  detection: Detection;
  videoWidth: number;
  videoHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  isHighlighted?: boolean;
  animationProgress?: number;
}

// Convert video coordinates to canvas coordinates
export function scaleCoordinates(
  bbox: Detection['bbox'],
  videoWidth: number,
  videoHeight: number,
  canvasWidth: number,
  canvasHeight: number
): Detection['bbox'] {
  // Prevent division by zero
  if (videoWidth === 0 || videoHeight === 0 || canvasWidth === 0 || canvasHeight === 0) {
    return [0, 0, 0, 0];
  }
  
  const scaleX = canvasWidth / videoWidth;
  const scaleY = canvasHeight / videoHeight;
  
  // Ensure all values are finite
  return [
    isFinite(bbox[0] * scaleX) ? bbox[0] * scaleX : 0,
    isFinite(bbox[1] * scaleY) ? bbox[1] * scaleY : 0,
    isFinite(bbox[2] * scaleX) ? bbox[2] * scaleX : 0,
    isFinite(bbox[3] * scaleY) ? bbox[3] * scaleY : 0,
  ];
}

// Draw AR-style bounding box
export function drawBoundingBox(options: DrawOptions) {
  const { ctx, detection, isHighlighted = false, animationProgress = 1 } = options;
  
  const [x, y, width, height] = scaleCoordinates(
    detection.bbox,
    options.videoWidth,
    options.videoHeight,
    options.canvasWidth,
    options.canvasHeight
  );
  
  // Skip drawing if dimensions are invalid
  if (width === 0 || height === 0 || !isFinite(x) || !isFinite(y) || !isFinite(width) || !isFinite(height)) {
    return;
  }
  
  ctx.save();
  
  // Apply animation
  ctx.globalAlpha = animationProgress;
  
  // Glow effect
  if (isHighlighted) {
    ctx.shadowColor = detection.color;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  // Draw rounded rectangle border
  ctx.strokeStyle = detection.color;
  ctx.lineWidth = isHighlighted ? 3 : 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw corner brackets instead of full box for AR effect
  const cornerLength = Math.min(width, height) * 0.15;
  
  ctx.beginPath();
  // Top-left corner
  ctx.moveTo(x + cornerLength, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + cornerLength);
  
  // Top-right corner
  ctx.moveTo(x + width - cornerLength, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + cornerLength);
  
  // Bottom-right corner
  ctx.moveTo(x + width, y + height - cornerLength);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width - cornerLength, y + height);
  
  // Bottom-left corner
  ctx.moveTo(x + cornerLength, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + height - cornerLength);
  
  ctx.stroke();
  
  ctx.restore();
}

// Draw AR-style label
export function drawLabel(options: DrawOptions) {
  const { ctx, detection, animationProgress = 1 } = options;
  
  const [x, y, width] = scaleCoordinates(
    detection.bbox,
    options.videoWidth,
    options.videoHeight,
    options.canvasWidth,
    options.canvasHeight
  );
  
  ctx.save();
  
  // Apply animation
  ctx.globalAlpha = animationProgress * 0.9;
  
  // Label dimensions
  const padding = 8;
  const fontSize = 14;
  const confidenceSize = 11;
  
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  const labelWidth = ctx.measureText(detection.label).width;
  
  ctx.font = `${confidenceSize}px system-ui, -apple-system, sans-serif`;
  const confidenceText = `${Math.round(detection.confidence * 100)}%`;
  const confidenceWidth = ctx.measureText(confidenceText).width;
  
  const totalWidth = labelWidth + confidenceWidth + padding * 3 + 10;
  const labelHeight = fontSize + padding * 2;
  
  // Position label above the box
  const labelX = x + (width - totalWidth) / 2;
  const labelY = y - labelHeight - 5;
  
  // Ensure all values are finite before drawing
  if (!isFinite(labelX) || !isFinite(labelY) || !isFinite(totalWidth) || !isFinite(labelHeight)) {
    ctx.restore();
    return;
  }
  
  // Draw label background with gradient
  const gradient = ctx.createLinearGradient(labelX, labelY, labelX, labelY + labelHeight);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(labelX, labelY, totalWidth, labelHeight, 4);
  } else {
    // Fallback for browsers that don't support roundRect
    ctx.rect(labelX, labelY, totalWidth, labelHeight);
  }
  ctx.fill();
  
  // Draw colored accent line
  ctx.fillStyle = detection.color;
  ctx.fillRect(labelX, labelY + labelHeight - 3, totalWidth, 3);
  
  // Draw label text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(detection.label, labelX + padding, labelY + fontSize + padding - 2);
  
  // Draw confidence
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = `${confidenceSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(confidenceText, labelX + padding * 2 + labelWidth + 10, labelY + fontSize + padding - 2);
  
  // Draw state indicator if not 'whole'
  if (detection.state !== 'whole') {
    const stateIndicator = detection.state === 'chopped' ? '🔪' : 
                          detection.state === 'mixed' ? '🥄' : '🔥';
    ctx.font = '12px system-ui';
    ctx.fillText(stateIndicator, labelX - 20, labelY + labelHeight / 2 + 4);
  }
  
  ctx.restore();
}

// Draw connection line between related items
export function drawConnection(
  ctx: CanvasRenderingContext2D,
  from: Detection,
  to: Detection,
  options: {
    videoWidth: number;
    videoHeight: number;
    canvasWidth: number;
    canvasHeight: number;
    color?: string;
    opacity?: number;
  }
) {
  const fromBox = scaleCoordinates(
    from.bbox,
    options.videoWidth,
    options.videoHeight,
    options.canvasWidth,
    options.canvasHeight
  );
  
  const toBox = scaleCoordinates(
    to.bbox,
    options.videoWidth,
    options.videoHeight,
    options.canvasWidth,
    options.canvasHeight
  );
  
  const fromCenterX = fromBox[0] + fromBox[2] / 2;
  const fromCenterY = fromBox[1] + fromBox[3] / 2;
  const toCenterX = toBox[0] + toBox[2] / 2;
  const toCenterY = toBox[1] + toBox[3] / 2;
  
  ctx.save();
  ctx.globalAlpha = options.opacity || 0.3;
  ctx.strokeStyle = options.color || '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  ctx.beginPath();
  ctx.moveTo(fromCenterX, fromCenterY);
  ctx.lineTo(toCenterX, toCenterY);
  ctx.stroke();
  
  ctx.restore();
}

// Clear the canvas
export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Draw pulse effect for new detections
export function drawPulse(options: DrawOptions & { pulseProgress: number }) {
  const { ctx, detection, pulseProgress } = options;
  
  const [x, y, width, height] = scaleCoordinates(
    detection.bbox,
    options.videoWidth,
    options.videoHeight,
    options.canvasWidth,
    options.canvasHeight
  );
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const maxRadius = Math.max(width, height) * 0.8;
  
  ctx.save();
  ctx.globalAlpha = (1 - pulseProgress) * 0.5;
  ctx.strokeStyle = detection.color;
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * pulseProgress, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}