# Voice Integration Plan for Llama Cook

## Overview
Voice integration for hands-free cooking assistance using AWS services and Meta's Llama-4-Scout.

## Architecture

### Voice Flow
```
[iPhone Mic] → [WebSocket] → [AWS Transcribe] → [Wake Word Detection]
                                                         ↓
                                              ["Sous Chef" detected]
                                                         ↓
                                              [Capture command]
                                                         ↓
                                              [Llama-4-Scout API]
                                                         ↓
                                              [AWS Polly TTS]
                                                         ↓
                                              [Audio Response]
```

## Technology Stack

### 1. Voice Recognition & Synthesis: AWS
- **Amazon Transcribe Streaming**: Real-time speech-to-text with wake word detection
- **Amazon Polly**: Natural text-to-speech responses with neural voices
- **Benefits**: Low latency (<100ms), reliable wake word detection

### 2. LLM: Meta Llama-4-Scout
- Direct API integration for recipe generation and conversational AI
- Optimized for speed (sub-100ms response time)

### 3. Real-time Communication
- WebSocket for bidirectional audio streaming
- Socket.io for reliable connection management

## Implementation Components

### API Routes
```
/app/api/voice/stream     // WebSocket for audio streaming
/app/api/voice/transcribe // AWS Transcribe integration
/app/api/llama/chat       // Llama-4-Scout integration
/app/api/voice/synthesize // AWS Polly integration
```

### Client Components
```
/components/VoiceActivation.tsx  // Wake word listener
/components/VoiceRecorder.tsx    // Audio capture
/components/ConversationUI.tsx   // Chat display
/components/VoiceIndicator.tsx   // Visual feedback
```

### State Management
- Voice session state
- Conversation history
- Active recipe context
- Ingredient tracking from SAM2

## Required Dependencies
```json
{
  "@aws-sdk/client-transcribe-streaming": "^3.x",
  "@aws-sdk/client-polly": "^3.x",
  "@aws-sdk/client-polly-node": "^3.x",
  "socket.io": "^4.x",
  "socket.io-client": "^4.x",
  "recordrtc": "^5.x",
  "wavesurfer.js": "^7.x"
}
```

## Environment Variables
```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
LLAMA_API_KEY=
LLAMA_API_ENDPOINT=
```

## Implementation Steps

### Phase 1: Basic Voice Capture
1. Set up WebSocket server in Next.js API route
2. Implement client-side audio recording with RecordRTC
3. Stream audio chunks to server
4. Test basic audio capture and playback

### Phase 2: AWS Integration
1. Set up AWS credentials and SDK
2. Implement Transcribe streaming endpoint
3. Add wake word detection for "Sous Chef"
4. Implement Polly for TTS responses

### Phase 3: Llama Integration
1. Set up Llama-4-Scout API connection
2. Create conversation context management
3. Implement streaming responses
4. Add error handling and fallbacks

### Phase 4: UI Integration
1. Create voice activation indicator
2. Add conversation history display
3. Implement visual feedback for listening/processing/speaking states
4. Add permission handling for microphone access

### Phase 5: SAM2 Integration
1. Connect voice commands with visual context
2. Allow referencing detected ingredients in conversation
3. Implement multi-modal responses

## Demo Script Example

**User**: "Sous Chef, I have these ingredients, what can we make?"

**System**:
1. Detects "Sous Chef" wake word
2. Captures the command
3. Combines with SAM2 visual data (detected ingredients)
4. Sends to Llama-4-Scout with context
5. Receives recipe suggestion
6. Converts to speech with Polly
7. Responds: "Based on the tomatoes, mozzarella, and basil I see, we could make a delicious Caprese Salad. Would you like me to guide you through it?"

## Performance Targets
- Wake word detection: <200ms
- Transcription latency: <100ms
- Llama response: <100ms
- TTS generation: <150ms
- Total end-to-end: <550ms

## Error Handling
- Fallback to text input if voice fails
- Retry logic for API calls
- Graceful degradation for offline mode
- Clear user feedback for all states

## Security Considerations
- Secure WebSocket connections (WSS)
- API key management
- Audio data privacy
- Rate limiting for API calls