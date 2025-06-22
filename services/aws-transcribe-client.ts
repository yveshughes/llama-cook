import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  LanguageCode,
  MediaEncoding,
  TranscriptEvent,
  TranscriptResultStream,
} from '@aws-sdk/client-transcribe-streaming';

// Simple audio processor for browser
class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private audioChunks: Uint8Array[] = [];

  async start(onAudioData: (chunk: Uint8Array) => void): Promise<void> {
    try {
      console.log('Requesting microphone access...');
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      console.log('Microphone access granted');

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ 
        sampleRate: 16000 
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = this.convertFloat32ToInt16(inputData);
        onAudioData(new Uint8Array(pcm16.buffer));
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      console.log('Audio pipeline connected');
    } catch (error) {
      console.error('Error in audio processor:', error);
      throw error;
    }
  }

  stop(): void {
    console.log('Stopping audio processor...');
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  private convertFloat32ToInt16(buffer: Float32Array): Int16Array {
    const l = buffer.length;
    const output = new Int16Array(l);
    
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    return output;
  }
}

export interface TranscriptSegment {
  text: string;
  isCommand: boolean;
  isFinal: boolean;
  timestamp: Date;
  resultId?: string;
}

export class TranscribeClient {
  private client: TranscribeStreamingClient | null = null;
  private audioProcessor: AudioProcessor | null = null;
  private isConnected = false;
  private wakeWord = 'sous chef';
  private wakeWordActive = false;
  private commandStartTime: Date | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private sessionStartTime: Date | null = null;
  private shouldStopStream = false;
  private streamAbortController: AbortController | null = null;
  
  async initialize(): Promise<void> {
    console.log('Initializing TranscribeClient...');
    
    try {
      // Get credentials from environment variables
      const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
      const region = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
      
      if (!accessKeyId || !secretAccessKey) {
        throw new Error('AWS credentials not found in environment variables');
      }
      
      console.log('Creating TranscribeStreamingClient with region:', region);
      
      this.client = new TranscribeStreamingClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      
      console.log('TranscribeClient initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TranscribeClient:', error);
      throw error;
    }
  }
  
  async startTranscription(
    onTranscript: (segment: TranscriptSegment) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      // Stop any existing session first
      if (this.isConnected) {
        console.log('Stopping existing session before starting new one...');
        await this.stopTranscription();
        // Wait a bit to ensure clean closure
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!this.client) {
        await this.initialize();
      }
      
      console.log('Starting transcription...');
      this.shouldStopStream = false;
      this.sessionStartTime = new Date();
      
      // Set up 1-minute timeout
      this.sessionTimeout = setTimeout(() => {
        console.log('Session timeout reached (1 minute), closing gracefully...');
        this.stopTranscription();
      }, 60000); // 60 seconds
      
      this.audioProcessor = new AudioProcessor();
      const audioChunks: Uint8Array[] = [];
      
      // Start audio capture
      await this.audioProcessor.start((chunk) => {
        audioChunks.push(chunk);
      });
      
      // Create audio stream generator with proper closure
      const self = this;
      async function* audioStreamGenerator() {
        console.log('Audio stream generator started');
        while (!self.shouldStopStream) {
          if (audioChunks.length > 0) {
            const chunk = audioChunks.shift()!;
            yield { AudioEvent: { AudioChunk: chunk } };
          } else {
            // Wait a bit for more audio
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        console.log('Audio stream generator stopped');
      }
      
      // Start transcription
      const command = new StartStreamTranscriptionCommand({
        LanguageCode: LanguageCode.EN_US,
        MediaEncoding: MediaEncoding.PCM,
        MediaSampleRateHertz: 16000,
        AudioStream: audioStreamGenerator(),
      });
      
      console.log('Sending StartStreamTranscriptionCommand...');
      const response = await this.client!.send(command);
      
      if (response.TranscriptResultStream) {
        console.log('Transcription stream started');
        this.isConnected = true;
        
        // Process transcription results
        for await (const event of response.TranscriptResultStream) {
          if (event.TranscriptEvent) {
            this.handleTranscriptEvent(event.TranscriptEvent, onTranscript);
          }
        }
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      this.isConnected = false;
      
      // Clear timeout if set
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = null;
      }
      
      // Only propagate error if it's not a graceful shutdown
      if (!this.shouldStopStream && onError) {
        // Handle specific AWS errors gracefully
        if (error.name === 'BadRequestException') {
          console.log('AWS session issue - this can happen when switching modes or reconnecting');
          // Don't propagate BadRequestException to user
          return;
        }
        onError(error as Error);
      }
      
      // Don't throw if it was a graceful shutdown
      if (!this.shouldStopStream) {
        throw error;
      }
    }
  }
  
  private handleTranscriptEvent(
    event: TranscriptEvent,
    onTranscript: (segment: TranscriptSegment) => void
  ): void {
    const results = event.Transcript?.Results || [];
    
    for (const result of results) {
      if (!result.Alternatives || result.Alternatives.length === 0) continue;
      
      const alternative = result.Alternatives[0];
      const text = alternative.Transcript || '';
      const isFinal = !result.IsPartial;
      const resultId = result.ResultId || `${Date.now()}-${Math.random()}`;
      
      if (!text.trim()) continue;
      
      console.log(`[${isFinal ? 'FINAL' : 'PARTIAL'}] ${text} (ID: ${resultId})`);
      
      // Check if wake word is in this transcript
      const lowerText = text.toLowerCase();
      const wakeWordIndex = lowerText.lastIndexOf(this.wakeWord);
      
      if (wakeWordIndex !== -1) {
        // Wake word found in this segment
        console.log('🎯 Wake word detected in segment');
        
        // Split the text into before and after wake word
        const beforeWakeWord = text.substring(0, wakeWordIndex).trim();
        const wakeWordPart = text.substring(wakeWordIndex, wakeWordIndex + this.wakeWord.length);
        const afterWakeWord = text.substring(wakeWordIndex + this.wakeWord.length).trim();
        
        // Send the part before wake word as regular text
        if (beforeWakeWord) {
          onTranscript({
            text: beforeWakeWord,
            isCommand: false,
            isFinal,
            timestamp: new Date(),
            resultId: `${resultId}-before`
          });
        }
        
        // Send the wake word as a command start
        onTranscript({
          text: wakeWordPart,
          isCommand: true,
          isFinal,
          timestamp: new Date(),
          resultId: `${resultId}-wake`
        });
        
        // If there's text after wake word, send it as command
        if (afterWakeWord) {
          onTranscript({
            text: afterWakeWord,
            isCommand: true,
            isFinal,
            timestamp: new Date(),
            resultId: `${resultId}-after`
          });
        }
        
        // Mark wake word as active
        this.wakeWordActive = true;
        this.commandStartTime = new Date();
        
      } else {
        // No wake word in this segment
        // Check if we're in command mode (wake word was recently said)
        const isCommand = this.wakeWordActive && 
          this.commandStartTime !== null && 
          (new Date().getTime() - this.commandStartTime.getTime() < 10000); // 10 second window
        
        onTranscript({
          text,
          isCommand: isCommand,
          isFinal,
          timestamp: new Date(),
          resultId
        });
        
        // If this is a final transcript and we're in command mode, reset after this
        if (isFinal && isCommand) {
          setTimeout(() => {
            this.wakeWordActive = false;
            this.commandStartTime = null;
          }, 1000);
        }
      }
    }
  }
  
  async stopTranscription(): Promise<void> {
    console.log('Stopping transcription...');
    this.shouldStopStream = true;
    this.isConnected = false;
    this.wakeWordActive = false;
    this.commandStartTime = null;
    
    // Clear session timeout
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
    
    // Stop audio processor
    if (this.audioProcessor) {
      this.audioProcessor.stop();
      this.audioProcessor = null;
    }
    
    // Log session duration
    if (this.sessionStartTime) {
      const duration = (new Date().getTime() - this.sessionStartTime.getTime()) / 1000;
      console.log(`Session duration: ${duration.toFixed(1)} seconds`);
      this.sessionStartTime = null;
    }
  }
  
  isActive(): boolean {
    return this.isConnected;
  }
}