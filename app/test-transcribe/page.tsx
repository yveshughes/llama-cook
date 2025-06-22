'use client';

import { useState } from 'react';
import { TranscribeClient, TranscriptSegment } from '@/services/aws-transcribe-client';

export default function TestTranscribe() {
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);

  const [transcribeClient] = useState(() => new TranscribeClient());

  const startListening = async () => {
    try {
      setError(null);
      setIsListening(true);
      setTranscripts([]);
      setWakeWordDetected(false);
      
      setTranscripts(prev => [...prev, '🎤 Starting microphone...']);
      
      await transcribeClient.startTranscription(
        (segment: TranscriptSegment) => {
          const prefix = segment.isFinal ? '[FINAL]' : '[PARTIAL]';
          const typeLabel = segment.isCommand ? '[COMMAND]' : '[SPEECH]';
          
          // Check if this segment contains the wake word
          if (segment.text.toLowerCase().includes('sous chef')) {
            setWakeWordDetected(true);
            setTranscripts(prev => [...prev, '🎯 WAKE WORD DETECTED: "Sous Chef"']);
          }
          
          setTranscripts(prev => [...prev, `${prefix} ${typeLabel} ${segment.text}`]);
        },
        (error) => {
          setTranscripts(prev => [...prev, `❌ ERROR: ${error.message}`]);
          setError(error.message);
          setIsListening(false);
        }
      );
      
      setTranscripts(prev => [...prev, '✅ Connected to AWS Transcribe']);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await transcribeClient.stopTranscription();
      setIsListening(false);
      setTranscripts(prev => [...prev, '🛑 Stopped transcription']);
    } catch (err) {
      console.error('Error stopping:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AWS Transcribe Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          
          <div className="mt-4 flex items-center gap-4">
            <div className={`flex items-center ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-3 h-3 rounded-full mr-2 ${
                isListening ? 'bg-green-600 animate-pulse' : 'bg-gray-400'
              }`}></span>
              Microphone {isListening ? 'Active' : 'Inactive'}
            </div>
            
            {wakeWordDetected && (
              <div className="flex items-center text-orange-600">
                <span className="w-3 h-3 bg-orange-600 rounded-full mr-2 animate-pulse"></span>
                Wake Word Active
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">Error:</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Transcripts</h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transcripts.length === 0 ? (
              <p className="text-gray-500">No transcripts yet. Click &quot;Start Listening&quot; and say &quot;Sous Chef&quot; followed by a command.</p>
            ) : (
              transcripts.map((transcript, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    transcript.includes('WAKE WORD') 
                      ? 'bg-orange-100 text-orange-800 font-semibold' 
                      : transcript.includes('[FINAL]')
                      ? 'bg-green-50 text-green-800'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {transcript}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click &quot;Start Listening&quot; to begin</li>
            <li>Say &quot;Sous Chef&quot; to activate the wake word</li>
            <li>After wake word detection, say your command</li>
            <li>Example: &quot;Sous Chef, what can I make with tomatoes?&quot;</li>
          </ul>
        </div>
      </div>
    </div>
  );
}