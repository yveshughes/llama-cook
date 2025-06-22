import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serverUrl = searchParams.get('server');

  if (!serverUrl) {
    return NextResponse.json(
      { error: 'Server URL is required' },
      { status: 400 }
    );
  }

  // This endpoint would typically:
  // 1. Validate the server URL
  // 2. Generate a session token
  // 3. Return connection instructions for the iPhone app

  // For now, we'll return a simple response that redirects to a custom URL scheme
  // that the iPhone app can handle
  const connectionData = {
    serverUrl: serverUrl,
    sessionId: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
  };

  // If this is accessed from a mobile device, attempt to open in app
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

  if (isMobile) {
    // Redirect to custom URL scheme that the iPhone app would handle
    // Example: llamacook://connect?server=...&session=...
    const appUrl = `llamacook://connect?${new URLSearchParams(connectionData).toString()}`;
    
    return NextResponse.redirect(appUrl);
  }

  // For desktop, return JSON with connection info
  return NextResponse.json({
    message: 'Scan this QR code with your iPhone camera',
    connectionData,
    instructions: [
      '1. Open the iPhone camera app',
      '2. Point at the QR code',
      '3. Tap the notification to connect',
      '4. The app will stream video to the SAM2 server'
    ]
  });
}

export async function POST(request: NextRequest) {
  // Handle connection status updates from the iPhone app
  try {
    const body = await request.json();
    const { sessionId, status } = body;

    // In a real implementation, you would:
    // 1. Update session status in database
    // 2. Notify the web app via WebSocket
    // 3. Handle authentication

    return NextResponse.json({
      success: true,
      sessionId,
      status,
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}