import { NextRequest } from 'next/server';

// Note: This is a simplified WebSocket implementation for Next.js
// For production, consider using a dedicated WebSocket server

export async function GET() {
  // WebSocket upgrade is not directly supported in Next.js App Router
  // Return information about how to set up WebRTC signaling
  
  return new Response(JSON.stringify({
    message: 'WebRTC signaling requires a WebSocket server.',
    alternatives: [
      'Use a service like Socket.io with a custom server',
      'Use a third-party signaling service',
      'Fall back to WebSocket streaming mode'
    ]
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// For now, we'll implement a simple polling-based signaling as a fallback
const signalingRooms = new Map<string, {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidates: RTCIceCandidateInit[];
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, roomId, ...data } = body;
    
    if (!roomId) {
      return new Response(JSON.stringify({ error: 'Missing roomId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Initialize room if it doesn't exist
    if (!signalingRooms.has(roomId)) {
      signalingRooms.set(roomId, { iceCandidates: [] });
    }
    
    const room = signalingRooms.get(roomId)!;
    
    switch (type) {
      case 'offer':
        room.offer = data.offer;
        break;
      case 'answer':
        room.answer = data.answer;
        break;
      case 'ice-candidate':
        room.iceCandidates.push(data.candidate);
        break;
      case 'get-signal':
        // Return current signaling state
        return new Response(JSON.stringify({
          offer: room.offer,
          answer: room.answer,
          iceCandidates: room.iceCandidates
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
    }
    
    // Clean up old rooms (older than 5 minutes)
    // In production, use proper session management
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Signaling error:', error);
    return new Response(JSON.stringify({ error: 'Signaling failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}