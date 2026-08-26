// TODO(sylvia): confirm real contact email for this CTA.
const CONTACT_EMAIL = "sylviaxie99@hotmail.com";

export default function ContactSection() {
  return (
    <section className="px-6 py-28 text-center md:px-12 md:py-40">
      <span className="inline-block rounded-full border border-line px-3 py-1 text-[11px] text-muted">
        Contact
      </span>
      <h2 className="mx-auto mt-6 max-w-2xl text-2xl font-medium leading-snug text-ink md:text-4xl">
        I&apos;m not just here to design products; I&apos;m here to connect with people.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted">
        Feel free to contact me for any questions, feedback, or further assistance.
      </p>
      <div className="relative mt-8 inline-block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 left-1/2 h-16 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,77,46,0.55),transparent)] blur-xl"
        />
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="relative inline-flex items-center gap-2 rounded-full border border-line bg-bg px-10 py-5 text-sm text-ink hover:opacity-90"
        >
          Let&apos;s talk
        </a>
      </div>
    </section>
  );
}
