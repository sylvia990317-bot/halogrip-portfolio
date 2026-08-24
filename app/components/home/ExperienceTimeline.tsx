import { experience } from "../../data/experience";

// TODO(sylvia): replace with a real CV link/file.
const CV_HREF = "#";

export default function ExperienceTimeline() {
  return (
    <div className="rounded-3xl border border-line bg-white/60 p-8">
      <span className="inline-block rounded-full border border-line px-3 py-1 text-[11px] text-muted">
        Experience
      </span>
      <div className="mt-6 space-y-6">
        {experience.map((entry) => (
          <div key={`${entry.org}-${entry.start}`} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <p className="font-mono text-[11px] text-tertiary">
              {entry.start} · {entry.end}
            </p>
            <p className="mt-1 text-sm font-medium text-ink">{entry.title}</p>
            <p className="text-xs text-muted">{entry.org}</p>
          </div>
        ))}
      </div>
      <a
        href={CV_HREF}
        className="mt-6 inline-flex items-center gap-2 text-xs text-ink underline underline-offset-4"
      >
        Download CV ↗
      </a>
    </div>
  );
}
