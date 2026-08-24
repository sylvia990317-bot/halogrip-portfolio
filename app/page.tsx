import SiteHeader from "./components/home/SiteHeader";
import Hero from "./components/home/Hero";
import ProjectGrid from "./components/home/ProjectGrid";
import TwoColumnSection from "./components/home/TwoColumnSection";
import ContactSection from "./components/home/ContactSection";
import SiteFooter from "./components/home/SiteFooter";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <ProjectGrid />
      <TwoColumnSection />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
