import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ComplianceSection from "./components/ComplianceSection";
import DevelopersSection from "./components/DevelopersSection";
import VisionSection from "./components/VisionSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ComplianceSection />
      <DevelopersSection />
      <VisionSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
