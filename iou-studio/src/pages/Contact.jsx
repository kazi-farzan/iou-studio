import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const whatsappLink =
  "https://api.whatsapp.com/send?text=Hello%20IOU%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20project.";

const contactNotes = [
  "Share your main goal, timeline, and the type of support you need.",
  "Use WhatsApp for quick conversations and the form for a more structured brief.",
  "Form submission is currently frontend-only and ready for backend wiring later.",
];

export default function Contact() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        className="pt-4 sm:pt-8"
        description="Reach out with a quick message or a more structured brief. Both paths are designed to make the next step feel easy."
        eyebrow="Contact"
        title="Start the conversation in the format that suits you."
        width="full"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px] xl:items-start">
          <Card className="p-7 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                  Inquiry Form
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  Send a structured project brief
                </h2>
              </div>

              <form
                className="grid gap-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white">Name</span>
                    <input
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-violet-300/35 focus:bg-white/[0.05]"
                      name="name"
                      placeholder="Your name"
                      type="text"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white">Email</span>
                    <input
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-violet-300/35 focus:bg-white/[0.05]"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white">Service</span>
                  <select
                    className="rounded-2xl border border-white/10 bg-[var(--background-soft)] px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-violet-300/35"
                    name="service"
                  >
                    <option>Web & app development</option>
                    <option>Branding & identity</option>
                    <option>Graphic design & content</option>
                    <option>Marketing support</option>
                    <option>Combination of services</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white">Project Brief</span>
                  <textarea
                    className="min-h-40 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-violet-300/35 focus:bg-white/[0.05]"
                    name="message"
                    placeholder="Tell IOU Studio about your goal, timeline, and what you need help with."
                    rows={6}
                  />
                </label>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                  <Button className="w-full sm:w-auto" size="lg" type="submit">
                    Send Inquiry
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    href={whatsappLink}
                    rel="noreferrer"
                    size="lg"
                    target="_blank"
                    variant="secondary"
                  >
                    Message On WhatsApp
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-7">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                WhatsApp
              </p>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                Prefer a faster message thread?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Use the WhatsApp link for a quicker first touch, then move into a
                more detailed brief when the scope becomes clearer.
              </p>
              <a
                className="mt-6 inline-flex text-sm font-medium text-[var(--accent-secondary)] transition-colors duration-300 hover:text-white"
                href={whatsappLink}
                rel="noreferrer"
                target="_blank"
              >
                Open WhatsApp
              </a>
            </Card>

            <Card className="p-7">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                Notes
              </p>
              <div className="mt-5 space-y-3">
                {contactNotes.map((note) => (
                  <div
                    key={note}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.85)]" />
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
