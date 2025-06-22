# SAM2 Server for Llama Cook

This directory contains the server components for running SAM2 (Segment Anything Model 2) with the Llama Cook application.

## Quick Start (Mock Server)

For testing without the actual SAM2 model:

```bash
# Option 1: Using venv (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Option 2: Without venv (quick testing)
pip install flask flask-cors numpy

# Run the mock server
python sam2_mock_server.py

# In another terminal, expose with ngrok
ngrok http 5000

# The terminal will show your ngrok URL:
# Forwarding  https://abc123xyz.ngrok-free.app -> http://localhost:5000
```

## Production Setup

For the actual SAM2 server, follow the instructions in `/docs/SAM2_SERVER_SETUP.md`.

## Environment Configuration

1. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
2. Add to your `.env.local`:
   ```
   NEXT_PUBLIC_SAM2_SERVER_URL=https://abc123.ngrok.io
   ```

## Testing the Connection

1. Start the Next.js app: `npm run dev`
2. Navigate to `/poc/sam2`
3. Click "Live" mode
4. Scan the QR code with your iPhone

## API Endpoints

- `GET /health` - Server health check
- `POST /segment` - Segment a single image
- `POST /track` - Track objects in video
- `POST /stream/start` - Start streaming session
- `POST /stream/stop` - Stop streaming session

## Troubleshooting

- **CORS errors**: Make sure `flask-cors` is installed
- **Connection refused**: Check if the server is running on port 5000
- **ngrok not working**: Ensure you're authenticated with `ngrok config add-authtoken`