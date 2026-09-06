'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Medallion from '@/components/shared/medallion';
import { createSseState, parseSseChunk } from '@/lib/sse';
import { parseTourTag } from '@/lib/tour-tag';
import { quickQuestions } from '@/data/qaData';

const PAGE_MAP: Record<string, { label: string; href: string }> = {
  home: { label: 'Home', href: '/' },
  services: { label: 'Services', href: '/services' },
  about: { label: 'About', href: '/about' },
  projects: { label: 'Projects', href: '/projects' },
  contact: { label: 'Contact', href: '/contact' },
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  tour: { slug: string; label: string } | null;
};

export default function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! Ask me anything about Nitesh's work, skills, or services.", tour: null },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  function appendAssistant(delta: string) {
    setMessages(prev => {
      const copy = prev.slice();
      const last = copy[copy.length - 1];
      if (last && last.role === 'assistant') {
        copy[copy.length - 1] = { ...last, content: last.content + delta, tour: null };
      }
      return copy;
    });
  }

  async function handleSend(question?: string) {
    const text = (question ?? input).trim();
    if (!text || isLoading) return;

    setInput('');
    const userMessage: Message = { role: 'user', content: text, tour: null };
    const nextMessages = [...messages, userMessage];
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error('Failed to get response');

      setMessages(prev => [...prev, { role: 'assistant', content: '', tour: null }]);
      setIsStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const sse = createSseState();
      let full = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const delta of parseSseChunk(sse, chunk)) {
          full += delta;
          appendAssistant(delta);
        }
      }
      const tail = decoder.decode();
      for (const delta of parseSseChunk(sse, tail)) {
        full += delta;
        appendAssistant(delta);
      }

      if (full) {
        const { slug, clean } = parseTourTag(full);
        const tour = slug && PAGE_MAP[slug] ? { slug, label: PAGE_MAP[slug].label } : null;
        setMessages(prev => {
          const copy = prev.slice();
          const last = copy[copy.length - 1];
          if (last && last.role === 'assistant') copy[copy.length - 1] = { ...last, content: clean, tour };
          return copy;
        });
      } else {
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Sorry, I could not generate a response.', tour: null }]);
      }
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', tour: null }]);
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-[320px] h-[480px] bg-linen border border-hem rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hem">
            <h3 className="text-sm font-semibold text-ink font-[family-name:var(--font-script)]">Ask Nitesh</h3>
            <button onClick={() => setIsOpen(false)} className="text-stone hover:text-teal transition-colors text-sm" aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <Fragment key={i}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-terracotta text-linen rounded-br-sm'
                        : 'bg-paper text-ink border border-hem rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                    {(isStreaming || isLoading) && msg.role === 'assistant' && msg.content === '' && (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-stone animate-pulse [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-stone animate-pulse [animation-delay:0.3s]" />
                      </span>
                    )}
                  </div>
                </div>
                {msg.role === 'assistant' && msg.tour && (
                  <button
                    onClick={() => router.push(PAGE_MAP[msg.tour!.slug].href)}
                    className="mt-2 block text-xs font-[family-name:var(--font-script)] text-teal hover:underline"
                  >
                    Go to {PAGE_MAP[msg.tour!.slug].label} →
                  </button>
                )}
              </Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isStreaming && !isLoading && (
            <div className="px-4 pt-2 flex flex-wrap gap-1.5">
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs text-stone bg-paper border border-hem rounded-full px-2.5 py-1 hover:text-teal hover:border-teal transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-hem px-4 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 bg-paper border border-hem rounded-lg px-3 py-2 text-sm text-ink placeholder-stone outline-none focus:border-terracotta transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-terracotta text-linen px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-terracotta text-linen rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '✕' : (
          <Medallion className="w-8 h-8 text-linen">
            <span className="w-1.5 h-1.5 rounded-full bg-linen" />
          </Medallion>
        )}
      </button>
    </div>
  );
}
