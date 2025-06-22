# SAM2 Server Setup Guide

## Overview
This guide explains how to set up a SAM2 (Segment Anything Model 2) server for the Llama Cook hackathon project, including ngrok integration for exposing the server to the internet.

## Prerequisites
- Python 3.10+
- CUDA-capable GPU (recommended) or CPU
- ngrok account and authtoken
- Git

## Setup Instructions

### 1. Clone and Install SAM2

```bash
# Clone the SAM2 repository
git clone https://github.com/facebookresearch/sam2.git
cd sam2

# Create a virtual environment
python -m venv sam2_env
source sam2_env/bin/activate  # On Windows: sam2_env\Scripts\activate

# Install PyTorch (adjust for your CUDA version)
pip install torch torchvision

# Install SAM2
pip install -e .

# Download model checkpoints
cd checkpoints
./download_ckpts.sh  # Or manually download from the repo
cd ..
```

### 2. Create SAM2 Server Script

Create a file `sam2_server.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch
import cv2
import base64
from io import BytesIO
from PIL import Image
import os

# Import SAM2
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

app = Flask(__name__)
CORS(app)  # Enable CORS for web access

# Initialize SAM2
checkpoint = "./checkpoints/sam2_hiera_large.pt"
model_cfg = "sam2_hiera_l.yaml"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

sam2_model = build_sam2(model_cfg, checkpoint, device=device)
predictor = SAM2ImagePredictor(sam2_model)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "device": str(device)})

@app.route('/segment', methods=['POST'])
def segment_image():
    try:
        data = request.json
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        image = Image.open(BytesIO(image_data))
        image_np = np.array(image)
        
        # Set image
        predictor.set_image(image_np)
        
        # Get point prompts if provided
        point_coords = data.get('point_coords', None)
        point_labels = data.get('point_labels', None)
        
        if point_coords:
            point_coords = np.array(point_coords)
            point_labels = np.array(point_labels)
        
        # Generate masks
        masks, scores, logits = predictor.predict(
            point_coords=point_coords,
            point_labels=point_labels,
            multimask_output=True,
        )
        
        # Convert masks to base64
        masks_encoded = []
        for mask in masks:
            mask_uint8 = (mask * 255).astype(np.uint8)
            _, buffer = cv2.imencode('.png', mask_uint8)
            mask_base64 = base64.b64encode(buffer).decode('utf-8')
            masks_encoded.append(mask_base64)
        
        return jsonify({
            "masks": masks_encoded,
            "scores": scores.tolist()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
def track_video():
    # Implement video tracking endpoint
    # This would use SAM2VideoPredictor
    return jsonify({"message": "Video tracking not implemented yet"}), 501

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### 3. Install Server Dependencies

```bash
pip install flask flask-cors opencv-python pillow
```

### 4. Set Up ngrok

```bash
# Install ngrok
# macOS: brew install ngrok
# Or download from https://ngrok.com/download

# Authenticate ngrok (one-time setup)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start ngrok tunnel (in a separate terminal)
ngrok http 5000 --domain your-custom-domain.ngrok-free.app

# Or use a random URL (free tier)
ngrok http 5000
```

The ngrok URL will be displayed in the terminal, something like:
```
Forwarding  https://abc123xyz.ngrok-free.app -> http://localhost:5000
```

### 5. Run the SAM2 Server

```bash
# Activate virtual environment
source sam2_env/bin/activate

# Run the server
python sam2_server.py
```

## Environment Variables

Add to your `.env.local` file:

```
NEXT_PUBLIC_SAM2_SERVER_URL=https://your-ngrok-url.ngrok.io
```

## Integration with Llama Cook

The SAM2 server will:
1. Accept image frames from the iPhone camera
2. Perform real-time segmentation
3. Return segmentation masks and ingredient detection
4. The ngrok URL will be encoded in the QR code for iPhone connection

## API Endpoints

### POST /segment
Segments a single image.

Request:
```json
{
  "image": "base64_encoded_image",
  "point_coords": [[x, y]],  // Optional
  "point_labels": [1]         // Optional (1 for foreground, 0 for background)
}
```

Response:
```json
{
  "masks": ["base64_mask1", "base64_mask2", "base64_mask3"],
  "scores": [0.98, 0.95, 0.92]
}
```

### GET /health
Health check endpoint.

Response:
```json
{
  "status": "healthy",
  "device": "cuda"
}
```

## Production Considerations

1. **GPU Memory**: Monitor GPU memory usage, especially with large images
2. **Batch Processing**: Implement batching for multiple frames
3. **Caching**: Cache model predictions for similar frames
4. **Security**: Add authentication for production use
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Troubleshooting

1. **CUDA Out of Memory**: Reduce image size or use CPU
2. **Slow Performance**: Ensure GPU is being used, check CUDA installation
3. **CORS Issues**: Ensure flask-cors is installed and configured
4. **ngrok Connection**: Check firewall settings and ngrok authentication