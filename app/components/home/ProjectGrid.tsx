import { projects } from "../../data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  return (
    <section id="work" className="px-6 md:px-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
