import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Introduction } from "@/components/Introduction";
import { TeamSection } from "@/components/TeamSection";
import { ServicesSection } from "@/components/ServicesSection";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { Gallery } from "@/components/Gallery";
import { VideoSection } from "@/components/VideoSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <Introduction />
      <TeamSection />
      <ServicesSection />
      <BudgetCalculator />
      <Gallery />
      <VideoSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
