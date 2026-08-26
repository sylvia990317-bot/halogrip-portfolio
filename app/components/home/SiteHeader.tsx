// TODO(sylvia): confirm real contact email and social profile links.
const CONTACT_EMAIL = "sylviaxie99@hotmail.com";
const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export default function SiteHeader() {
  return (
    <header
      className="flex items-center justify-between px-6 py-6 opacity-0 [animation:header-reveal_0.7s_cubic-bezier(0.22,1,0.36,1)_1.25s_forwards] md:px-12"
    >
      <div className="flex items-center gap-3">
        <img
          src="/home/avatar.jpg"
          alt="Sylvia Xie"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-sm font-medium text-ink">Sylvia Xie</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-xs text-muted hover:text-ink">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <nav className="flex items-center gap-4">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-tertiary hover:text-ink"
          >
            {s.label}
          </a>
        ))}
      </nav>
      <style>{`
        @keyframes header-reveal {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
