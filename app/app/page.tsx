import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import VisionSection from "./components/VisionSection";
import Footer from "./components/Footer";
import ComplianceSection from "./components/ComplianceSection";
import CTAsection from "./components/CTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />

      <ComplianceSection />
      <HowItWorksSection />
      <VisionSection />
    </div>
  );
}
