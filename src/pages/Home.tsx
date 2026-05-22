import LandingNav from '@/components/LandingNav';
import HeroSection from '@/sections/HeroSection';
import ServicesSection from '@/sections/ServicesSection';
import WhyChooseUsSection from '@/components/ui/why-choose-us-section';
import FooterSection from '@/sections/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <LandingNav />
      <HeroSection />
      <div id="services">
        <ServicesSection />
      </div>
      <div id="about">
        <WhyChooseUsSection />
      </div>
      <div id="contact">
        <FooterSection />
      </div>
    </div>
  );
}
