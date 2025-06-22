#!/usr/bin/env python3
"""
Mock SAM2 Server for Testing
This is a simplified version that doesn't require the actual SAM2 model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for web access

# Store active sessions
sessions = {}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "device": "cpu (mock)",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0-mock"
    })

@app.route('/segment', methods=['POST'])
def segment_image():
    """Mock segmentation endpoint"""
    try:
        data = request.json
        
        # In a real implementation, this would:
        # 1. Decode the base64 image
        # 2. Run SAM2 segmentation
        # 3. Return real masks
        
        # For now, return mock data
        mock_masks = [
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        ]
        
        mock_scores = [0.98, 0.95, 0.92]
        
        # Simulate ingredient detection
        mock_detections = [
            {
                "id": f"obj_{np.random.randint(1000)}",
                "label": np.random.choice(["Tomato", "Mozzarella", "Basil", "Olive Oil"]),
                "confidence": np.random.uniform(0.85, 0.99),
                "bbox": [
                    np.random.randint(50, 200),
                    np.random.randint(50, 200),
                    np.random.randint(100, 200),
                    np.random.randint(100, 200)
                ],
                "state": np.random.choice(["whole", "chopped", "mixed"])
            }
            for _ in range(np.random.randint(2, 5))
        ]
        
        return jsonify({
            "masks": mock_masks,
            "scores": mock_scores,
            "detections": mock_detections,
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
def track_video():
    """Mock video tracking endpoint"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        # Store session
        sessions[session_id] = {
            "status": "tracking",
            "frame_count": sessions.get(session_id, {}).get('frame_count', 0) + 1,
            "last_update": datetime.utcnow().isoformat()
        }
        
        # Return mock tracking data
        return jsonify({
            "session_id": session_id,
            "frame_number": sessions[session_id]["frame_count"],
            "detections": [
                {
                    "id": f"track_{i}",
                    "label": label,
                    "confidence": np.random.uniform(0.85, 0.99),
                    "bbox": [
                        np.random.randint(50, 400),
                        np.random.randint(50, 300),
                        np.random.randint(80, 150),
                        np.random.randint(80, 150)
                    ],
                    "tracking_id": f"{label.lower()}_{i}"
                }
                for i, label in enumerate(["Tomato", "Mozzarella", "Basil"])
            ],
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/sessions', methods=['GET'])
def get_sessions():
    """Get active sessions"""
    return jsonify({
        "sessions": sessions,
        "active_count": len(sessions)
    })

@app.route('/stream/start', methods=['POST'])
def start_stream():
    """Start a streaming session"""
    try:
        data = request.json
        session_id = data.get('session_id', f'session_{np.random.randint(10000)}')
        
        sessions[session_id] = {
            "status": "active",
            "started_at": datetime.utcnow().isoformat(),
            "frame_count": 0,
            "client_info": data.get('client_info', {})
        }
        
        return jsonify({
            "session_id": session_id,
            "status": "started",
            "websocket_url": f"ws://localhost:5001/stream/{session_id}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stream/stop', methods=['POST'])
def stop_stream():
    """Stop a streaming session"""
    try:
        data = request.json
        session_id = data.get('session_id')
        
        if session_id in sessions:
            sessions[session_id]["status"] = "stopped"
            sessions[session_id]["stopped_at"] = datetime.utcnow().isoformat()
            
        return jsonify({
            "session_id": session_id,
            "status": "stopped"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Mock SAM2 Server")
    print("📡 Server running at http://localhost:5000")
    print("🔧 This is a mock server for testing - no actual SAM2 model loaded")
    print("\nEndpoints:")
    print("  GET  /health        - Health check")
    print("  POST /segment       - Segment single image")
    print("  POST /track         - Track objects in video frame")
    print("  POST /stream/start  - Start streaming session")
    print("  POST /stream/stop   - Stop streaming session")
    print("  GET  /sessions      - List active sessions")
    print("\n✨ Ready for connections!")
    
    app.run(host='0.0.0.0', port=5000, debug=True)