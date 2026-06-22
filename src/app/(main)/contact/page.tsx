import QuickActions from "@/components/contact/quick-actions";
import ContactForm from "@/components/contact/contact-form";
import contact from "@/data/contact.json";

export default function ContactPage() {
  return (
    <div className="max-w-[640px]">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-2 font-[family-name:var(--font-display)]">
          Let&apos;s work together
        </h1>
        <p className="text-sm text-muted">Response within 24 hours on business days.</p>
      </div>

      <QuickActions />

      <div className="bg-surface border border-border rounded-lg p-5 mb-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Email</span>
            <a href={`mailto:${contact.email}`} className="text-sm text-text hover:text-accent transition-colors">
              {contact.email}
            </a>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Phone</span>
            <span className="text-sm text-text">{contact.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Location</span>
            <span className="text-sm text-text">{contact.location}</span>
          </div>
          <div className="border-t border-border pt-4 flex gap-4">
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">LinkedIn</a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">GitHub</a>
            <a href={contact.calendar} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Website</a>
          </div>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
