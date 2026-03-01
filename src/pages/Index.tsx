import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ValuesSection from "@/components/ValuesSection";
import FoundersSection from "@/components/FoundersSection";
import EventSection from "@/components/EventSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <ValuesSection />
      <FoundersSection />
      <EventSection />
      <SocialSection />
      <Footer />
    </main>
  );
};

export default Index;
