const CREDENTIALS = ["(Industrial Design M.Sc.)", "(Based in Gothenburg, Sweden)", "(Always up for an adventure)"];

export default function AboutCard() {
  return (
    <div className="rounded-3xl border border-line bg-white/60 p-8">
      <span className="inline-block rounded-full border border-line px-3 py-1 text-[11px] text-muted">
        About
      </span>
      <h2 className="mt-4 text-lg font-medium text-ink">
        Hi, I am Sylvia Xie
        <br />A Industrial Designer
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        I design digital and physical products around how people actually think, move, and
        work. Through research, prototyping, and testing, I make complex technology easier to
        understand and more natural to use. I believe good design should be thoughtful, useful,
        and made for real life.
      </p>
      <div className="mt-6 space-y-1">
        {CREDENTIALS.map((c) => (
          <p key={c} className="font-mono text-xs text-tertiary">
            {c}
          </p>
        ))}
      </div>
    </div>
  );
}
