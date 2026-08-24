import Link from "next/link";
import PlaceholderImage from "../PlaceholderImage";
import type { Project } from "../../data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const media = (
    <PlaceholderImage
      label={project.comingSoon ? "Coming soon" : project.cardLabel}
      muted={project.comingSoon}
      className="aspect-[4/3] w-full rounded-card"
    />
  );

  const caption = (
    <div className="mt-3 flex items-baseline justify-between gap-3">
      <span className="text-sm text-ink">{project.cardLabel}</span>
      <span className="truncate text-xs text-muted">{project.subtitle}</span>
    </div>
  );

  if (project.comingSoon || !project.href) {
    return (
      <div className="cursor-default">
        {media}
        {caption}
      </div>
    );
  }

  return (
    <Link href={project.href} className="group block">
      {media}
      {caption}
    </Link>
  );
}
