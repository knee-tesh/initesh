import SectionHeading from "@/components/shared/section-heading";
import ContactForm from "@/components/contact/contact-form";

const offerings = [
  "Code & architecture audits — distilling years of review into a prioritized remediation roadmap.",
  "Technical advisory — architecture decisions, RFC feedback, and engineering leadership on retainer.",
  "Feature delivery — end-to-end ownership from design through deployment.",
];

export default function ContactPage() {
  return (
    <div className="max-w-[900px] mx-auto">
      <SectionHeading
        eyebrow="Consulting"
        title="Have a difficult systems problem?"
        kicker="Let's talk."
      />

      <div className="mt-10 space-y-4">
        {offerings.map((item) => (
          <p key={item} className="text-muted text-base leading-relaxed">
            {item}
          </p>
        ))}
      </div>

      <div className="mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
