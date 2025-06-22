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
};

// Classic Caprese Salad sequence - the star of our demo
export const capreseSequence: DetectionSequence = {
  videoId: 'caprese-salad',
  duration: 12000, // 12 seconds
  detections: [
    // Initial ingredients on cutting board
    {
      id: 'tomato-1',
      label: 'Fresh Tomato',
      confidence: 0.98,
      bbox: [80, 180, 120, 120],
      timestamp: 0,
      color: colors.tomato,
      state: 'whole',
    },
    {
      id: 'tomato-2',
      label: 'Fresh Tomato',
      confidence: 0.97,
      bbox: [220, 170, 120, 120],
      timestamp: 200,
      color: colors.tomato,
      state: 'whole',
    },
    {
      id: 'mozzarella-ball',
      label: 'Fresh Mozzarella',
      confidence: 0.96,
      bbox: [380, 175, 130, 130],
      timestamp: 400,
      color: colors.mozzarella,
      state: 'whole',
    },
    {
      id: 'basil-bunch',
      label: 'Fresh Basil',
      confidence: 0.95,
      bbox: [520, 190, 100, 80],
      timestamp: 600,
      color: colors.basil,
      state: 'whole',
    },
    
    // Slicing phase - tomatoes
    {
      id: 'tomato-slice-1',
      label: 'Tomato Slice',
      confidence: 0.94,
      bbox: [100, 300, 80, 20],
      timestamp: 2000,
      color: colors.tomato,
      state: 'chopped',
    },
    {
      id: 'tomato-slice-2',
      label: 'Tomato Slice',
      confidence: 0.94,
      bbox: [190, 300, 80, 20],
      timestamp: 2200,
      color: colors.tomato,
      state: 'chopped',
    },
    {
      id: 'tomato-slice-3',
      label: 'Tomato Slice',
      confidence: 0.93,
      bbox: [280, 300, 80, 20],
      timestamp: 2400,
      color: colors.tomato,
      state: 'chopped',
    },
    
    // Slicing phase - mozzarella
    {
      id: 'mozzarella-slice-1',
      label: 'Mozzarella Slice',
      confidence: 0.95,
      bbox: [370, 300, 90, 25],
      timestamp: 3000,
      color: colors.mozzarella,
      state: 'chopped',
    },
    {
      id: 'mozzarella-slice-2',
      label: 'Mozzarella Slice',
      confidence: 0.95,
      bbox: [470, 300, 90, 25],
      timestamp: 3200,
      color: colors.mozzarella,
      state: 'chopped',
    },
    
    // Plating phase - alternating arrangement
    {
      id: 'plated-tomato-1',
      label: 'Tomato',
      confidence: 0.96,
      bbox: [200, 200, 80, 80],
      timestamp: 5000,
      color: colors.tomato,
      state: 'chopped',
    },
    {
      id: 'plated-mozzarella-1',
      label: 'Mozzarella',
      confidence: 0.96,
      bbox: [290, 200, 80, 80],
      timestamp: 5200,
      color: colors.mozzarella,
      state: 'chopped',
    },
    {
      id: 'plated-tomato-2',
      label: 'Tomato',
      confidence: 0.95,
      bbox: [380, 200, 80, 80],
      timestamp: 5400,
      color: colors.tomato,
      state: 'chopped',
    },
    {
      id: 'plated-basil-1',
      label: 'Basil Leaf',
      confidence: 0.94,
      bbox: [245, 190, 40, 30],
      timestamp: 5600,
      color: colors.basil,
      state: 'whole',
    },
    {
      id: 'plated-basil-2',
      label: 'Basil Leaf',
      confidence: 0.94,
      bbox: [335, 190, 40, 30],
      timestamp: 5800,
      color: colors.basil,
      state: 'whole',
    },
    
    // Finishing touches
    {
      id: 'oil-drizzle',
      label: 'Extra Virgin Olive Oil',
      confidence: 0.92,
      bbox: [200, 180, 260, 120],
      timestamp: 7000,
      color: colors.oil,
      state: 'mixed',
    },
    {
      id: 'salt-sprinkle',
      label: 'Sea Salt',
      confidence: 0.90,
      bbox: [240, 200, 180, 80],
      timestamp: 8000,
      color: colors.salt,
      state: 'whole',
    },
    {
      id: 'pepper-grind',
      label: 'Black Pepper',
      confidence: 0.89,
      bbox: [280, 210, 140, 70],
      timestamp: 8500,
      color: colors.pepper,
      state: 'whole',
    },
    {
      id: 'balsamic-drizzle',
      label: 'Balsamic Glaze',
      confidence: 0.91,
      bbox: [220, 190, 220, 100],
      timestamp: 9000,
      color: '#4A2C2A',
      state: 'mixed',
    },
    
    // Final dish recognition
    {
      id: 'complete-caprese',
      label: 'Caprese Salad',
      confidence: 0.98,
      bbox: [180, 160, 320, 160],
      timestamp: 10000,
      color: colors.basil,
      state: 'mixed',
    },
  ],
};

export const sequences = {
  'caprese-salad': capreseSequence,
};

// Helper function to get detections at a specific timestamp
export function getDetectionsAtTime(sequence: DetectionSequence, currentTime: number): Detection[] {
  return sequence.detections.filter(detection => {
    // Show detections within a 2-second window
    const windowStart = detection.timestamp;
    const windowEnd = detection.timestamp + 2000;
    return currentTime >= windowStart && currentTime <= windowEnd;
  });
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