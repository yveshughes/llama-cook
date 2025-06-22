import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use Redis or similar
const activeStreams = new Map<string, { frame: string; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    const { roomId, frame, timestamp } = await request.json();
    
    if (!roomId || !frame) {
      return NextResponse.json(
        { error: 'Missing roomId or frame data' },
        { status: 400 }
      );
    }
    
    // Store the latest frame
    activeStreams.set(roomId, { frame, timestamp });
    
    // Clean up old streams (older than 30 seconds)
    const now = Date.now();
    for (const [id, stream] of activeStreams.entries()) {
      if (now - stream.timestamp > 30000) {
        activeStreams.delete(id);
      }
    }
    
    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Camera stream error:', error);
    return NextResponse.json(
      { error: 'Failed to process stream' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  
  if (!roomId) {
    return NextResponse.json(
      { error: 'Missing roomId' },
      { status: 400 }
    );
  }
  
  const stream = activeStreams.get(roomId);
  
  if (!stream) {
    return NextResponse.json(
      { error: 'Stream not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(stream);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}