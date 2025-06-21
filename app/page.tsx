import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import SAM2Feature from '@/components/SAM2Feature';
import VJEPAFeature from '@/components/VJEPAFeature';
import LlamaFeature from '@/components/LlamaFeature';
import VoiceFeature from '@/components/VoiceFeature';
import DemoSection from '@/components/DemoSection';
import SetupInstructions from '@/components/SetupInstructions';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-mozzarella">
      <Navigation />
      <div id="hero">
        <HeroSection />
      </div>
      
      {/* Performance Banner */}
      <div className="bg-gradient-to-r from-herb-red to-tomato py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-white text-sm font-medium overflow-x-auto">
            <div className="flex items-center whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>&lt;100ms Llama</span>
            </div>
            <div className="flex items-center whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>SAM2 Tracking</span>
            </div>
            <div className="hidden sm:flex items-center whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>V-JEPA Prediction</span>
            </div>
            <div className="hidden md:flex items-center whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Zero-Shot AI</span>
            </div>
          </div>
        </div>
      </div>
      
      <div id="sam2">
        <SAM2Feature />
      </div>
      <div id="vjepa">
        <VJEPAFeature />
      </div>
      <div id="llama">
        <LlamaFeature />
      </div>
      <div id="voice">
        <VoiceFeature />
      </div>
      <div id="demo">
        <DemoSection />
      </div>
      <div id="setup">
        <SetupInstructions />
      </div>
    </div>
  );
}