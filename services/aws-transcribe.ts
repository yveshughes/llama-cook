import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  StartStreamTranscriptionCommandInput,
  LanguageCode,
  MediaEncoding,
  TranscriptEvent,
  TranscriptResultStream,
} from '@aws-sdk/client-transcribe-streaming';

// MicrophoneStream for browser audio capture
class MicrophoneStream {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isRecording = false;
  private onDataCallback: ((data: Buffer) => void) | null = null;

  async start(onData: (data: Buffer) => void): Promise<void> {
    this.onDataCallback = onData;
    
    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        } 
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create processor for converting audio to PCM
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = this.convertFloat32ToInt16(inputData);
        this.onDataCallback?.(Buffer.from(pcmData.buffer));
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      this.isRecording = true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop(): void {
    this.isRecording = false;
    
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
    const buf = new Int16Array(l);
    
    for (let i = 0; i < l; i++) {
      buf[i] = Math.min(1, buffer[i]) * 0x7FFF;
    }
    
    return buf;
  }
}

export class AWSTranscribeService {
  private client: TranscribeStreamingClient;
  private microphoneStream: MicrophoneStream | null = null;
  private transcriptionStream: AsyncIterable<TranscriptResultStream> | null = null;
  private isListening = false;
  private wakeWordDetected = false;
  private commandBuffer = '';
  private wakeWord = 'sous chef';
  private onWakeWordCallback: (() => void) | null = null;
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;

  constructor() {
    // Initialize AWS Transcribe client
    this.client = new TranscribeStreamingClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async startListening(
    onWakeWord: () => void,
    onTranscript: (text: string, isFinal: boolean) => void
  ): Promise<void> {
    if (this.isListening) {
      console.log('Already listening');
      return;
    }

    this.onWakeWordCallback = onWakeWord;
    this.onTranscriptCallback = onTranscript;
    this.isListening = true;
    this.wakeWordDetected = false;
    this.commandBuffer = '';

    try {
      // Start microphone stream
      this.microphoneStream = new MicrophoneStream();
      
      // Create audio stream generator
      const audioStream = this.createAudioStreamGenerator();
      
      // Start transcription
      const command = new StartStreamTranscriptionCommand({
        LanguageCode: LanguageCode.EN_US,
        MediaEncoding: MediaEncoding.PCM,
        MediaSampleRateHertz: 16000,
        AudioStream: audioStream,
      } as StartStreamTranscriptionCommandInput);

      const response = await this.client.send(command);
      
      if (response.TranscriptResultStream) {
        this.transcriptionStream = response.TranscriptResultStream;
        this.processTranscriptionStream();
      }

      // Start microphone after setting up transcription
      await this.microphoneStream.start((data) => {
        // Audio data is handled by the generator
      });

    } catch (error) {
      console.error('Error starting transcription:', error);
      this.stopListening();
      throw error;
    }
  }

  stopListening(): void {
    this.isListening = false;
    this.wakeWordDetected = false;
    this.commandBuffer = '';
    
    if (this.microphoneStream) {
      this.microphoneStream.stop();
      this.microphoneStream = null;
    }
  }

  private async *createAudioStreamGenerator() {
    const chunks: Buffer[] = [];
    let audioDataPromiseResolve: ((value: Buffer) => void) | null = null;

    // Set up audio data handler
    if (this.microphoneStream) {
      await this.microphoneStream.start((data) => {
        chunks.push(data);
        if (audioDataPromiseResolve) {
          audioDataPromiseResolve(chunks.shift()!);
          audioDataPromiseResolve = null;
        }
      });
    }

    // Generate audio stream
    while (this.isListening) {
      if (chunks.length > 0) {
        yield { AudioEvent: { AudioChunk: chunks.shift()! } };
      } else {
        // Wait for new audio data
        yield {
          AudioEvent: {
            AudioChunk: await new Promise<Buffer>((resolve) => {
              audioDataPromiseResolve = resolve;
            }),
          },
        };
      }
    }
  }

  private async processTranscriptionStream(): Promise<void> {
    if (!this.transcriptionStream) return;

    try {
      for await (const event of this.transcriptionStream) {
        if (event.TranscriptEvent) {
          this.handleTranscriptEvent(event.TranscriptEvent);
        }
      }
    } catch (error) {
      console.error('Error processing transcription stream:', error);
    }
  }

  private handleTranscriptEvent(event: TranscriptEvent): void {
    const results = event.Transcript?.Results || [];
    
    for (const result of results) {
      if (!result.Alternatives || result.Alternatives.length === 0) continue;
      
      const alternative = result.Alternatives[0];
      const transcript = alternative.Transcript || '';
      const isFinal = !result.IsPartial;
      
      console.log(`[${isFinal ? 'FINAL' : 'PARTIAL'}] ${transcript}`);
      
      // Check for wake word if not yet detected
      if (!this.wakeWordDetected) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes(this.wakeWord)) {
          console.log('🎯 Wake word detected!');
          this.wakeWordDetected = true;
          this.onWakeWordCallback?.();
          
          // Extract command after wake word
          const wakeWordIndex = lowerTranscript.indexOf(this.wakeWord);
          const afterWakeWord = transcript.substring(wakeWordIndex + this.wakeWord.length).trim();
          if (afterWakeWord) {
            this.commandBuffer = afterWakeWord;
            this.onTranscriptCallback?.(afterWakeWord, isFinal);
          }
        }
      } else {
        // We're in command mode, capture everything
        if (isFinal) {
          this.commandBuffer += ' ' + transcript;
          this.onTranscriptCallback?.(this.commandBuffer.trim(), true);
          
          // Reset after final transcript
          this.wakeWordDetected = false;
          this.commandBuffer = '';
        } else {
          this.onTranscriptCallback?.(this.commandBuffer + ' ' + transcript, false);
        }
      }
    }
  }
}

// Singleton instance
let transcribeService: AWSTranscribeService | null = null;

export function getTranscribeService(): AWSTranscribeService {
  if (!transcribeService) {
    transcribeService = new AWSTranscribeService();
  }
  return transcribeService;
}