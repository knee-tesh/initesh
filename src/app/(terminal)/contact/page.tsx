import ProcessCard from "@/components/process-card";
import GuestbookForm from "@/components/guestbook-form";
import contact from "@/data/contact.json";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>
          contact.sock (PID 4)
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Reach out. Response expected within {contact.responseTime.toLowerCase()}.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="process-card p-4 rounded-sm">
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            EMAIL
          </div>
          <a
            href={`mailto:${contact.email}`}
            className="keyboard-nav text-sm underline hover:no-underline"
            style={{ color: "var(--accent)" }}
          >
            {contact.email}
          </a>
        </div>

        <div className="process-card p-4 rounded-sm">
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            PHONE
          </div>
          <span className="text-sm" style={{ color: "var(--fg)" }}>
            {contact.phone}
          </span>
        </div>

        <div className="process-card p-4 rounded-sm">
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            LOCATION
          </div>
          <span className="text-sm" style={{ color: "var(--fg)" }}>
            {contact.location}
          </span>
        </div>

        <div className="process-card p-4 rounded-sm">
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            LINKS
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="keyboard-nav underline hover:no-underline"
              style={{ color: "var(--accent)" }}
            >
              LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="keyboard-nav underline hover:no-underline"
              style={{ color: "var(--accent)" }}
            >
              GitHub
            </a>
            <a
              href={contact.calendar}
              target="_blank"
              rel="noopener noreferrer"
              className="keyboard-nav underline hover:no-underline"
              style={{ color: "var(--accent)" }}
            >
              Website
            </a>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
          Send a Message
        </h2>
        <div className="process-card p-4 rounded-sm">
          <form
            action={`mailto:${contact.email}`}
            method="GET"
            encType="text/plain"
            className="space-y-3"
          >
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted)" }} htmlFor="subject">
                SUBJECT
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="keyboard-nav w-full border px-3 py-2 text-sm rounded-sm bg-transparent"
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                placeholder="Let's work together"
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--muted)" }} htmlFor="body">
                BODY
              </label>
              <textarea
                id="body"
                name="body"
                rows={4}
                className="keyboard-nav w-full border px-3 py-2 text-sm rounded-sm bg-transparent resize-y"
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                placeholder="Describe your project or question..."
              />
            </div>
            <button
              type="submit"
              className="keyboard-nav btn-accent px-4 py-2 text-sm rounded-sm"
            >
              Send via mailto
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
          Leave a Query
        </h2>
        <div className="process-card p-4 rounded-sm">
          <GuestbookForm />
        </div>
      </section>
    </div>
  );
}
