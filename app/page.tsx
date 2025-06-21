import Navigation from '@/components/Navigation';
import TechStackBanner from '@/components/TechStackBanner';
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
      
      {/* Tech Stack Banner */}
      <TechStackBanner />
      
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