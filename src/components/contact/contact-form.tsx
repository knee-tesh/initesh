"use client";

import { useState } from "react";

type Status = { state: "idle" } | { state: "sending" } | { state: "success" } | { state: "error" };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !body.trim()) return;
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: body }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus({ state: "success" });
      setName(""); setEmail(""); setBody("");
    } catch {
      setStatus({ state: "error" });
    }
  }

  return (
    <div id="message-form" className="stitch-card p-6">
      <h2 className="text-base font-semibold text-ink mb-4 font-[family-name:var(--font-display)]">
        Or send a message
      </h2>
      {status.state === "success" && (
        <p className="mb-4 text-sm text-teal bg-linen border border-hem rounded px-3 py-2.5 font-[family-name:var(--font-script)]">
          Message sent — thank you, I&apos;ll get back to you soon.
        </p>
      )}
      {status.state === "error" && (
        <p className="mb-4 text-sm text-terracotta bg-linen border border-hem rounded px-3 py-2.5">
          Email didn&apos;t send — you can use{" "}
          <a href="mailto:tiwari.nitesh294@gmail.com" className="underline">tiwari.nitesh294@gmail.com</a> directly.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone mb-1.5 font-[family-name:var(--font-script)]" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-paper border border-hem rounded px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone mb-1.5 font-[family-name:var(--font-script)]" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-paper border border-hem rounded px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-terracotta transition-colors"
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-stone mb-1.5 font-[family-name:var(--font-script)]" htmlFor="body">
            Message
          </label>
          <textarea
            id="body"
            name="body"
            rows={4}
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full bg-paper border border-hem rounded px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-terracotta transition-colors resize-y"
            placeholder="Tell me about your project..."
          />
        </div>
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="w-full bg-terracotta text-on-accent py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {status.state === "sending" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
