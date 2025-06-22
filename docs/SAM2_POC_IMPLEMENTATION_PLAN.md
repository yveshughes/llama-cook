# SAM2 POC Implementation Plan

## Overview
Building a proof-of-concept demonstration for SAM2 real-time ingredient detection and AR-style labeling, inspired by the colorful dough/pasta preparation visualization.

## Vision
Create an immersive demo showing video loops of cooking preparations with AR-style overlay labels that track and identify ingredients in real-time, similar to the inspiration image showing hands kneading colorful dough with overlay effects.

## Implementation Steps

### Phase 1: Video Infrastructure Setup
1. **Video Assets Preparation**
   - Source or create cooking preparation video loops (pasta making, dough kneading, ingredient mixing)
   - Focus on visually distinct, colorful ingredients for clear demonstration
   - Ensure videos showcase dynamic movement and ingredient transformation

2. **Video Player Component**
   - Build a custom video player with loop functionality
   - Support for multiple video sources/playlists
   - Smooth transitions between video loops
   - Fullscreen and responsive design

### Phase 2: AR Overlay System
1. **Canvas Overlay Architecture**
   - HTML5 Canvas layer positioned over video player
   - Synchronized with video playback timing
   - Support for dynamic drawing and animations

2. **Label Components**
   - Floating AR-style labels with ingredient names
   - Color-coded boxes/outlines matching ingredient types
   - Smooth tracking animations following ingredient movement
   - Confidence scores and visual indicators

3. **Visual Effects**
   - Glowing edges and soft shadows for depth
   - Animated entry/exit transitions for labels
   - Pulsing effects for newly detected items
   - Connection lines between related ingredients

### Phase 3: Simulated Detection Data
1. **Mock Data Structure**
   ```typescript
   interface Detection {
     id: string;
     label: string;
     confidence: number;
     bbox: [x: number, y: number, width: number, height: number];
     timestamp: number;
     color: string;
     state: 'whole' | 'chopped' | 'mixed' | 'cooking';
   }
   ```

2. **Timeline-based Detection Sequences**
   - Pre-programmed detection data synchronized with video timecodes
   - Realistic movement patterns and occlusion handling
   - Multiple ingredient tracking scenarios

### Phase 4: Interactive Features
1. **User Controls**
   - Play/Pause with detection overlay persistence
   - Speed controls (0.5x, 1x, 2x) with adjusted detection timing
   - Toggle detection overlay on/off
   - Select specific ingredients to highlight

2. **Information Panel**
   - Real-time detection feed showing current ingredients
   - Ingredient properties and states
   - Recipe suggestions based on detected items
   - Nutritional information display

### Phase 5: Visual Polish
1. **AR Styling**
   - Modern, clean label design with semi-transparent backgrounds
   - Culinary-themed color palette (matching brand colors)
   - Smooth animations and transitions
   - Responsive to different screen sizes

2. **Performance Optimization**
   - RequestAnimationFrame for smooth canvas updates
   - Efficient rendering with dirty rectangle optimization
   - WebGL acceleration for complex effects (optional)

## Technical Architecture

### Components Structure
```
/app/poc/sam2/
├── page.tsx                    # Main POC page
├── components/
│   ├── VideoPlayer.tsx         # Video playback component
│   ├── AROverlay.tsx          # Canvas overlay for AR labels
│   ├── DetectionLabel.tsx     # Individual label component
│   ├── ControlPanel.tsx       # User controls
│   └── InfoPanel.tsx          # Detection information display
├── data/
│   ├── detections.ts          # Mock detection sequences
│   └── videos.ts              # Video playlist configuration
└── utils/
    ├── canvas.ts              # Canvas drawing utilities
    └── animations.ts          # Animation helpers
```

### Key Technologies
- **Video**: HTML5 Video API with custom controls
- **Graphics**: Canvas 2D API for overlay rendering
- **Animations**: Framer Motion for UI, custom RAF for canvas
- **State**: React hooks for detection state management
- **Styling**: Tailwind CSS with custom AR-themed utilities

## Implementation Priority

### Core Features (Must Have)
- Video player with loop functionality
- Canvas overlay system
- Basic AR label rendering
- Mock detection data with timeline sync

### Enhanced Features (Nice to Have)
- Visual effects and transitions
- Interactive controls
- Information panel
- Performance optimizations

## Demo Scenarios

### Scenario 1: Pasta Making
- Video: Hands kneading colorful pasta dough
- Detections: Flour, eggs, water, food coloring
- Highlights: Ingredient transformation tracking

### Scenario 2: Salad Preparation
- Video: Chopping and mixing vegetables
- Detections: Tomatoes, lettuce, cucumbers, dressing
- Highlights: State changes (whole → chopped)

### Scenario 3: Pizza Assembly
- Video: Adding toppings to pizza base
- Detections: Dough, sauce, cheese, toppings
- Highlights: Multi-object tracking and layering

## Success Metrics
- Smooth 60fps overlay rendering
- Realistic tracking behavior
- Intuitive user controls
- Visually impressive AR effects
- Clear ingredient identification
- Responsive across devices

## Future Enhancements
- Real SAM2 model integration
- Live camera feed support
- Voice command integration
- Recipe generation from detections
- Nutritional analysis overlay
- Social sharing features