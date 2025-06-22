import { NextRequest, NextResponse } from 'next/server';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// Initialize Polly client
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    // Configure Polly parameters
    const params = {
      Engine: 'neural' as const,
      LanguageCode: 'en-US' as const,
      OutputFormat: 'mp3' as const,
      Text: text,
      VoiceId: 'Joanna' as const, // Neural voice option
      TextType: 'text' as const,
    };
    
    // Synthesize speech
    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);
    
    if (!response.AudioStream) {
      throw new Error('No audio stream received from Polly');
    }
    
    // Convert the audio stream to a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.AudioStream as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);
    
    // Return the audio as base64
    const base64Audio = audioBuffer.toString('base64');
    
    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64Audio}`,
      contentType: 'audio/mp3',
    });
    
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    );
  }
}