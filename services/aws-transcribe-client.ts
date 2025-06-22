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
      if (!this.client) {
        await this.initialize();
      }
      
      console.log('Starting transcription...');
      
      this.audioProcessor = new AudioProcessor();
      const audioChunks: Uint8Array[] = [];
      
      // Start audio capture
      await this.audioProcessor.start((chunk) => {
        audioChunks.push(chunk);
      });
      
      // Create audio stream generator
      async function* audioStreamGenerator() {
        console.log('Audio stream generator started');
        while (true) {
          if (audioChunks.length > 0) {
            const chunk = audioChunks.shift()!;
            yield { AudioEvent: { AudioChunk: chunk } };
          } else {
            // Wait a bit for more audio
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
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
    } catch (error) {
      console.error('Transcription error:', error);
      this.isConnected = false;
      if (onError) {
        onError(error as Error);
      }
      throw error;
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
    this.isConnected = false;
    this.wakeWordActive = false;
    this.commandStartTime = null;
    
    if (this.audioProcessor) {
      this.audioProcessor.stop();
      this.audioProcessor = null;
    }
  }
  
  isActive(): boolean {
    return this.isConnected;
  }
}