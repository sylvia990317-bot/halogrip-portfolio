import Link from "next/link";
import PlaceholderImage from "../PlaceholderImage";
import ScrollZoomImage from "./ScrollZoomImage";
import type { Project } from "../../data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const tags = project.tags && project.tags.length > 0 ? [...project.tags, ...project.tags] : [];

  const media = (
    <ScrollZoomImage
      className="aspect-[4/3] w-full"
      overlay={
        tags.length > 0 ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden bg-[#f4f4f6] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex w-max items-center gap-8 whitespace-nowrap px-6 py-5 group-hover:animate-[tag-ticker_18s_linear_infinite]">
              {tags.map((tag, i) => (
                <span key={i} className="font-mono text-sm uppercase tracking-wide text-ink">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null
      }
    >
      {project.image ? (
        <img src={project.image} alt={project.cardLabel} className="h-full w-full object-cover" />
      ) : (
        <PlaceholderImage
          label={project.comingSoon ? "Coming soon" : project.cardLabel}
          className="h-full w-full"
        />
      )}
    </ScrollZoomImage>
  );

  const caption = (
    <div className="absolute inset-x-0 bottom-0 max-h-[76px] overflow-hidden rounded-b-card bg-[#f4f4f6] px-6 py-5 transition-[max-height] duration-300 ease-out group-hover:max-h-[132px]">
      <p className="text-xl font-medium text-ink">{project.cardLabel}</p>
      <p className="mt-2 text-sm text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {project.subtitle}
      </p>
    </div>
  );

  const tickerStyle = (
    <style>{`
      @keyframes tag-ticker {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  );

  if (project.comingSoon || !project.href) {
    return (
      <div className="group relative block cursor-default overflow-hidden rounded-card">
        {media}
        {caption}
        {tickerStyle}
      </div>
    );
  }

  return (
    <Link href={project.href} className="group relative block overflow-hidden rounded-card">
      {media}
      {caption}
      {tickerStyle}
    </Link>
  );
}
