import HeroSection from '@/components/HeroSection';
import SAM2Feature from '@/components/SAM2Feature';
import LlamaFeature from '@/components/LlamaFeature';
import VoiceFeature from '@/components/VoiceFeature';
import DemoSection from '@/components/DemoSection';
import SetupInstructions from '@/components/SetupInstructions';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-mozzarella">
      <HeroSection />
      <SAM2Feature />
      <LlamaFeature />
      <VoiceFeature />
      <DemoSection />
      <SetupInstructions />
    </div>
  );
}