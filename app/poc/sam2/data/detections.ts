export interface Detection {
  id: string;
  label: string;
  confidence: number;
  bbox: [x: number, y: number, width: number, height: number];
  timestamp: number;
  color: string;
  state: 'whole' | 'chopped' | 'mixed' | 'cooking';
}

export interface DetectionSequence {
  videoId: string;
  duration: number;
  detections: Detection[];
}

// Color palette matching the brand
const colors = {
  flour: '#F5F5DC',
  eggs: '#FFD700',
  water: '#4FC3F7',
  tomato: '#FF6B6B',
  mozzarella: '#FFF8E1',
  basil: '#66BB6A',
  dough: '#D4A574',
  pasta: '#FFA726',
  salt: '#E0E0E0',
  oil: '#FFB300',
  pepper: '#424242',
  garlic: '#FFF9C4',
  balsamic: '#4A2C2A',
};

// Classic Caprese Salad sequence - matched to actual video
export const capreseSequence: DetectionSequence = {
  videoId: 'caprese-salad',
  duration: 12000, // 12 seconds
  detections: [
    // Initial scene - all ingredients visible on cutting board
    {
      id: 'salt-grinder',
      label: 'Sea Salt Grinder',
      confidence: 0.89,
      bbox: [20, 100, 60, 120],
      timestamp: 0,
      color: colors.salt,
      state: 'whole',
    },
    {
      id: 'pepper-mill',
      label: 'Black Pepper Mill',
      confidence: 0.87,
      bbox: [90, 100, 60, 120],
      timestamp: 50,
      color: colors.pepper,
      state: 'whole',
    },
    {
      id: 'tomatoes-vine',
      label: 'Tomatoes on Vine',
      confidence: 0.98,
      bbox: [180, 140, 160, 120],
      timestamp: 100,
      color: colors.tomato,
      state: 'whole',
    },
    {
      id: 'basil-fresh',
      label: 'Fresh Basil',
      confidence: 0.95,
      bbox: [240, 240, 120, 80],
      timestamp: 150,
      color: colors.basil,
      state: 'whole',
    },
    {
      id: 'mozzarella-fresh',
      label: 'Fresh Mozzarella',
      confidence: 0.96,
      bbox: [350, 180, 100, 80],
      timestamp: 200,
      color: colors.mozzarella,
      state: 'whole',
    },
    {
      id: 'olive-oil-bottle',
      label: 'Extra Virgin Olive Oil',
      confidence: 0.93,
      bbox: [420, 80, 80, 160],
      timestamp: 250,
      color: colors.oil,
      state: 'whole',
    },
    {
      id: 'balsamic-vinegar',
      label: 'Balsamic Vinegar',
      confidence: 0.91,
      bbox: [500, 100, 70, 140],
      timestamp: 300,
      color: colors.balsamic,
      state: 'whole',
    },
    
  ],
};

export const sequences = {
  'caprese-salad': capreseSequence,
};

// Helper function to get detections at a specific timestamp
export function getDetectionsAtTime(sequence: DetectionSequence, currentTime: number): Detection[] {
  // Get all detections that should be visible at current time
  const visibleDetections = sequence.detections.filter(detection => {
    return currentTime >= detection.timestamp;
  });
  
  // Create a map to handle detection lifecycle (some detections replace others)
  const detectionMap = new Map<string, Detection>();
  
  // No transformations needed since we're only showing whole ingredients
  const transformRules = new Map([]);
  
  // Add all visible detections to the map
  for (const detection of visibleDetections) {
    detectionMap.set(detection.id, detection);
  }
  
  // Apply transformation rules - remove replaced detections
  for (const [newId, oldIds] of transformRules) {
    if (detectionMap.has(newId)) {
      for (const oldId of oldIds) {
        detectionMap.delete(oldId);
      }
    }
  }
  
  return Array.from(detectionMap.values());
}

// Helper to interpolate position between detections
export function interpolateDetection(
  prev: Detection | undefined,
  next: Detection,
  currentTime: number
): Detection {
  if (!prev || prev.id !== next.id) return next;
  
  const progress = (currentTime - prev.timestamp) / (next.timestamp - prev.timestamp);
  const smoothProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  
  return {
    ...next,
    bbox: [
      prev.bbox[0] + (next.bbox[0] - prev.bbox[0]) * smoothProgress,
      prev.bbox[1] + (next.bbox[1] - prev.bbox[1]) * smoothProgress,
      prev.bbox[2] + (next.bbox[2] - prev.bbox[2]) * smoothProgress,
      prev.bbox[3] + (next.bbox[3] - prev.bbox[3]) * smoothProgress,
    ],
    confidence: prev.confidence + (next.confidence - prev.confidence) * smoothProgress,
  };
}