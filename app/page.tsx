import Navigation from '@/components/Navigation';
import TechStackBanner from '@/components/TechStackBanner';
import HeroSection from '@/components/HeroSection';
import VoiceFeature from '@/components/VoiceFeature';
import LlamaFeature from '@/components/LlamaFeature';
import SAM2Feature from '@/components/SAM2Feature';
import VJEPAFeature from '@/components/VJEPAFeature';
import DemoSection from '@/components/DemoSection';
import SetupInstructions from '@/components/SetupInstructions';
import { LiveModeProvider } from '@/contexts/LiveModeContext';

export default function Home() {
  return (
    <LiveModeProvider>
      <div className="min-h-screen bg-gradient-to-b from-cream to-mozzarella">
        <Navigation />
        <div id="hero">
          <HeroSection />
        </div>
      
      {/* Tech Stack Banner */}
      <TechStackBanner />
      
      {/* 1. Voice Command - Entry point */}
      <div id="voice">
        <VoiceFeature />
      </div>
      
      {/* 2. Llama 4 - Understanding ingredients */}
      <div id="llama">
        <LlamaFeature />
      </div>
      
      {/* 3. SAM2 - Watching ingredients and state */}
      <div id="sam2">
        <SAM2Feature />
      </div>
      
      {/* 4. V-JEPA 2 - Anticipating next moves */}
      <div id="vjepa">
        <VJEPAFeature />
      </div>
      
      {/* 5. Live Demo - See it all in action */}
      <div id="demo">
        <DemoSection />
      </div>
      
      <div id="setup">
        <SetupInstructions />
      </div>
    </div>
    </LiveModeProvider>
  );
}