'use client';

interface ControlPanelProps {
  isOverlayEnabled: boolean;
  onOverlayToggle: (enabled: boolean) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export default function ControlPanel({
  isOverlayEnabled,
  onOverlayToggle,
  playbackSpeed,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Demo Controls</h3>

      {/* AR Overlay Toggle */}
      <div className="mb-4">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">AR Overlay</span>
          <button
            onClick={() => onOverlayToggle(!isOverlayEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOverlayEnabled ? 'bg-herb-green' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOverlayEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Toggle ingredient detection overlay
        </p>
      </div>

      {/* Playback Speed */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Playback Speed: {playbackSpeed}x
        </label>
        <div className="flex gap-2">
          {[0.5, 1, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
                playbackSpeed === speed
                  ? 'bg-herb-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-600">
            This demo simulates SAM2's real-time object detection and tracking capabilities for cooking ingredients.
          </p>
        </div>
      </div>
    </div>
  );
}