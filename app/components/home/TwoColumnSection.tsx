import PlaceholderImage from "../PlaceholderImage";
import LogoMarquee from "./LogoMarquee";
import AboutCard from "./AboutCard";
import ExperienceTimeline from "./ExperienceTimeline";
import TestimonialsCarousel from "./TestimonialsCarousel";

export default function TwoColumnSection() {
  return (
    <section className="mt-24 grid grid-cols-1 gap-8 px-6 md:mt-32 md:grid-cols-2 md:px-12">
      <div className="md:sticky md:top-8 md:h-fit">
        <PlaceholderImage label="Portrait placeholder" className="aspect-[4/5] w-full rounded-card" />
        <LogoMarquee />
      </div>
      <div className="space-y-6">
        <AboutCard />
        <ExperienceTimeline />
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
