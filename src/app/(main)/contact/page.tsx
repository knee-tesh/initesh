import QuickActions from "@/components/contact/quick-actions";
import ContactForm from "@/components/contact/contact-form";
import contact from "@/data/contact.json";

export default function ContactPage() {
  return (
    <div className="max-w-[640px]">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2 font-[family-name:var(--font-display)]">
          Let&apos;s work together
        </h1>
        <p className="text-sm text-stone">Response within 24 hours on business days.</p>
      </div>

      <QuickActions />

      <div className="stitch-card p-5 mb-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Email</span>
            <a href={`mailto:${contact.email}`} className="text-sm text-text hover:text-teal transition-colors">
              {contact.email}
            </a>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Location</span>
            <span className="text-sm text-text">{contact.location}</span>
          </div>
          <div className="border-t border-hem pt-4 flex gap-3">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-10 h-10 border border-hem text-stone hover:text-ink hover:border-terracotta transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center w-10 h-10 border border-hem text-stone hover:text-ink hover:border-terracotta transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.02 2.9-.02 3.3 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
