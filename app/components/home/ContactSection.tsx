// TODO(sylvia): confirm real contact email for this CTA.
const CONTACT_EMAIL = "sylviaxie99@hotmail.com";

export default function ContactSection() {
  return (
    <section className="px-6 py-28 text-center md:px-12 md:py-40">
      <h2 className="mx-auto max-w-2xl text-2xl font-medium leading-snug text-ink md:text-4xl">
        I&apos;m not just here to design products; I&apos;m here to connect with people.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted">
        Feel free to contact me for any questions, feedback, or further assistance.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-bg hover:opacity-90"
      >
        Let&apos;s talk
      </a>
    </section>
  );
}
