"use client";

export default function ContactForm() {
  return (
    <div id="message-form" className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-base font-semibold text-text mb-4 font-[family-name:var(--font-display)]">
        Or send a message
      </h2>
      <form action="mailto:tiwari.nitesh294@gmail.com" method="GET" encType="text/plain" className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted mb-1.5 font-[family-name:var(--font-mono)]" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-void border border-border rounded px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted mb-1.5 font-[family-name:var(--font-mono)]" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-void border border-border rounded px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent transition-colors"
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-muted mb-1.5 font-[family-name:var(--font-mono)]" htmlFor="body">
            Message
          </label>
          <textarea
            id="body"
            name="body"
            rows={4}
            className="w-full bg-void border border-border rounded px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent transition-colors resize-y"
            placeholder="Tell me about your project..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-void py-2.5 rounded text-sm font-semibold font-[family-name:var(--font-mono)] hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
