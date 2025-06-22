import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.LLAMA_API_KEY;
    const apiEndpoint = process.env.LLAMA_API_ENDPOINT || 'https://api.llama.com/v1';
    
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured' });
    }
    
    // Test with a simple text-only request first
    const testResponse = await fetch(`${apiEndpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Llama-4-Scout-17B-16E-Instruct-FP8',
        messages: [
          {
            role: 'user',
            content: 'Hello, can you help me cook?'
          }
        ],
        max_tokens: 50,
      }),
    });
    
    const responseText = await testResponse.text();
    
    return NextResponse.json({
      status: testResponse.status,
      statusText: testResponse.statusText,
      headers: Object.fromEntries(testResponse.headers.entries()),
      response: responseText.substring(0, 500), // First 500 chars
      apiEndpoint,
      hasApiKey: !!apiKey
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'catch block'
    });
  }
}