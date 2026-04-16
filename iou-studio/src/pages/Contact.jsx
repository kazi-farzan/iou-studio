import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const whatsappLink =
  "https://api.whatsapp.com/send?text=Hello%20IOU%20Studio%2C%20I%27d%20like%20help%20with%20a%20build%20or%20support%20request.";

const contactNotes = [
  "Use Start Build first when the project can be configured directly inside the system.",
  "Use this page for support questions, edge cases, or requests that need a direct conversation.",
  "Form submission is currently frontend-only and ready for backend wiring later.",
];

export default function Contact() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        spacing="hero"
        description="The primary path is the build flow. Use contact as a secondary route when you need help, have an edge case, or want direct support."
        eyebrow="Support"
        title="Use contact when the build flow needs human help."
        titleAs="h1"
        width="full"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px] xl:items-start">
          <Card className="p-7 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="type-kicker">
                  Support Brief
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl">
                  Send a structured support request
                </h2>
              </div>

              <form
                className="grid gap-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Name</span>
                    <input
                      className="theme-input rounded-[20px] px-4 py-3 text-sm transition-all duration-300"
                      name="name"
                      placeholder="Your name"
                      type="text"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Email</span>
                    <input
                      className="theme-input rounded-[20px] px-4 py-3 text-sm transition-all duration-300"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Context</span>
                  <select
                    className="theme-input rounded-[20px] px-4 py-3 text-sm transition-all duration-300"
                    name="service"
                  >
                    <option>Help with configurator setup</option>
                    <option>Custom build requirement</option>
                    <option>Branding or design support</option>
                    <option>Marketing support</option>
                    <option>General question</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Support Brief</span>
                  <textarea
                    className="theme-input min-h-40 rounded-[20px] px-4 py-3 text-sm transition-all duration-300"
                    name="message"
                    placeholder="Tell IOU Studio what you are trying to build, where the flow breaks down, and what support you need."
                    rows={6}
                  />
                </label>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                  <Button className="w-full sm:w-auto" size="lg" type="submit">
                    Send Support Brief
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    href={whatsappLink}
                    rel="noreferrer"
                    size="lg"
                    target="_blank"
                    variant="secondary"
                  >
                    Open WhatsApp
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-7">
              <p className="type-kicker">
                WhatsApp
              </p>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Need a faster support thread?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Use WhatsApp for quick support questions, then move into a more
                structured brief when the requirements become clearer.
              </p>
              <a
                className="mt-6 inline-flex text-sm font-medium text-[var(--accent-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
                href={whatsappLink}
                rel="noreferrer"
                target="_blank"
              >
                Open WhatsApp Support
              </a>
            </Card>

            <Card className="p-7">
              <p className="type-kicker">
                Notes
              </p>
              <div className="mt-5 space-y-3">
                {contactNotes.map((note) => (
                  <div
                    key={note}
                    className="theme-panel flex items-start gap-3 rounded-2xl px-4 py-4"
                  >
                    <span className="theme-dot mt-2 h-2 w-2 rounded-full" />
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
