# ngrok Setup for iPhone Access

## Option 1: Local Network (Recommended for Hackathon)

1. Find your computer's IP address:
   ```bash
   # macOS
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # You'll see something like:
   # inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
   ```

2. Update `.env.local`:
   ```
   NEXT_PUBLIC_CAMERA_BASE_URL=http://192.168.1.100:3000
   ```

3. Ensure iPhone and MacBook are on the same WiFi network

4. Restart Next.js server

## Option 2: ngrok for Frontend (Public Access)

If you need public access or are on different networks:

1. In Terminal 1 - Frontend ngrok:
   ```bash
   ngrok http 3000
   # Copy the URL like: https://abc123.ngrok-free.app
   ```

2. In Terminal 2 - Backend ngrok:
   ```bash
   ngrok http 5000
   # Copy the URL like: https://xyz789.ngrok-free.app
   ```

3. Update `.env.local`:
   ```
   NEXT_PUBLIC_CAMERA_BASE_URL=https://abc123.ngrok-free.app
   NEXT_PUBLIC_SAM2_SERVER_URL=https://xyz789.ngrok-free.app
   ```

4. Restart Next.js server

## Troubleshooting

- **"Safari cannot open the page"**: Check IP address is correct
- **Camera doesn't open**: Ensure HTTPS or localhost (Safari requires secure context)
- **No connection**: Verify both devices on same network
- **Slow performance**: Use local network instead of ngrok when possible