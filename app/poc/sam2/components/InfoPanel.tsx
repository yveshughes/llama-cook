'use client';

import { Detection } from '../data/detections';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoPanelProps {
  detections: Detection[];
  onHighlight: (id: string | null) => void;
  currentTime: number;
}

export default function InfoPanel({ detections, onHighlight, currentTime }: InfoPanelProps) {
  // Group detections by label to show aggregate view
  const groupedDetections = detections.reduce((acc, detection) => {
    const key = detection.label;
    if (!acc[key]) {
      acc[key] = {
        label: key,
        count: 0,
        confidence: 0,
        state: detection.state,
        color: detection.color,
        ids: [],
      };
    }
    acc[key].count += 1;
    acc[key].confidence = Math.max(acc[key].confidence, detection.confidence);
    acc[key].ids.push(detection.id);
    return acc;
  }, {} as Record<string, { label: string; count: number; confidence: number; state: string; color: string; ids: string[] }>);

  const detectionGroups = Object.values(groupedDetections);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Live Detections</h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
              <span className="text-xs text-gray-600">Active</span>
            </span>
            <span className="text-xs text-gray-500">
              {Math.round(currentTime / 1000)}s
            </span>
          </div>
        </div>
      </div>

      {/* Detection List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {detectionGroups.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No ingredients detected
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {detectionGroups.map((group) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onMouseEnter={() => onHighlight(group.ids[0])}
                  onMouseLeave={() => onHighlight(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Color indicator */}
                      <div
                        className="w-3 h-3 rounded-full ring-2 ring-offset-1 ring-gray-200"
                        style={{ backgroundColor: group.color }}
                      />
                      
                      {/* Label and state */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {group.label}
                          {group.count > 1 && (
                            <span className="ml-1 text-xs text-gray-500">
                              ({group.count})
                            </span>
                          )}
                        </p>
                        {group.state !== 'whole' && (
                          <p className="text-xs text-gray-500 capitalize">
                            {group.state}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        {Math.round(group.confidence * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">confidence</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{detections.length}</p>
            <p className="text-xs text-gray-600">Objects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{detectionGroups.length}</p>
            <p className="text-xs text-gray-600">Ingredients</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {detections.length > 0 
                ? Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100)
                : 0}%
            </p>
            <p className="text-xs text-gray-600">Avg Conf</p>
          </div>
        </div>
      </div>
    </div>
  );
}