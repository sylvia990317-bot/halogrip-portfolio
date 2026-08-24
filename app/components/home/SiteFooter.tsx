const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export default function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-line px-6 py-8 text-xs text-muted md:flex-row md:justify-between md:px-12">
      <span>© {new Date().getFullYear()} Sylvia Xie</span>
      <div className="flex gap-4">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-ink">
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
