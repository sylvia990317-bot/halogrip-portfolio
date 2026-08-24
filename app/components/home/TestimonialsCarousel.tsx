"use client";

import { useState } from "react";
import { testimonials } from "../../data/testimonials";

// TODO(sylvia): replace with a real LinkedIn profile link.
const LINKEDIN_HREF = "https://linkedin.com";

export default function TestimonialsCarousel() {
  const [selected, setSelected] = useState(0);
  const active = testimonials[selected];

  return (
    <div className="rounded-3xl border border-line bg-white/60 p-8">
      <span className="inline-block rounded-full border border-line px-3 py-1 text-[11px] text-muted">
        Testimonials
      </span>

      <div className="mt-8 min-h-[140px]" aria-live="polite">
        <p className="text-base font-medium leading-snug text-ink">“{active.quote}”</p>
        <p className="mt-4 text-sm text-ink">{active.name}</p>
        <p className="text-xs text-muted">{active.title}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {testimonials.map((t, index) => (
            <button
              key={t.name + index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show testimonial ${index + 1}`}
              aria-pressed={index === selected}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                index === selected ? "bg-ink" : "bg-line"
              }`}
            />
          ))}
        </div>
        <a href={LINKEDIN_HREF} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-ink">
          Read on LinkedIn ↗
        </a>
      </div>
    </div>
  );
}
