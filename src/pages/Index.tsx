import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ValuesSection from "@/components/ValuesSection";
import FoundersSection from "@/components/FoundersSection";
import EventSection from "@/components/EventSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <SEO 
        title="NavYug Alliance — Youth Leadership & Social Foundation"
        description="NavYug Alliance is a youth-driven movement committed to leadership, creativity, and social impact. Together We Rise."
        keywords="Navyug Alliance, Navyug Foundation, NavYug, Youth Alliance, Social Impact, Leadership Movement, Community Relief, Student Leadership, Youth Empowerment"
      />
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
