'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { chunkNarration } from '@/lib/narration';
import { createSseState, parseSseChunk } from '@/lib/sse';
import { speak, stopSpeaking, subscribeNarration, supportTts, type NarrationSnapshot } from '@/lib/tts';

function CloseIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  intro?: boolean;
  failed?: boolean;
};

const INTRO = 'Hi, I’m Nitesh’s portfolio assistant. Ask about my work, experience, or how to get in touch.';
const CHAT_ERROR = 'Sorry, something went wrong. Please try again.';

function isAbortError(error: unknown): boolean {
  return (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError')
    || error instanceof Error && error.name === 'AbortError';
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'assistant', content: INTRO, intro: true }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const mountedRef = useRef(true);
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastQuestionRef = useRef('');
  const lastUserIdRef = useRef<number | null>(null);
  const lastAssistantIdRef = useRef<number | null>(null);
  const speechGenerationRef = useRef(0);
  const speechRef = useRef<{ source: string; messageId: number } | null>(null);
  const moreChunksRef = useRef(false);
  const nextIdRef = useRef(1);

  const stopSpeech = useCallback(() => {
    speechGenerationRef.current++;
    speechRef.current = null;
    moreChunksRef.current = false;
    stopSpeaking();
    setSpeakingId(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      stopSpeaking();
    };
  }, []);

  useEffect(
    () =>
      subscribeNarration((snapshot: NarrationSnapshot) => {
        const active = speechRef.current;
        if (!active) return;
        if (snapshot.source === active.source) {
          if (snapshot.state === 'idle' || snapshot.state === 'error' || snapshot.state === 'unavailable') {
            if (snapshot.state !== 'idle' || !moreChunksRef.current) {
              speechRef.current = null;
              moreChunksRef.current = false;
              setSpeakingId(null);
            }
          } else {
            setSpeakingId(active.messageId);
          }
        } else if (snapshot.state === 'loading' || snapshot.state === 'playing') {
          speechGenerationRef.current++;
          speechRef.current = null;
          moreChunksRef.current = false;
          setSpeakingId(null);
        }
      }),
    [],
  );

  const finishClose = useCallback(() => {
    requestRef.current++;
    abortRef.current?.abort();
    stopSpeech();
    setLoading(false);
    setError('');
    setInput('');
    setMessages([{ id: 0, role: 'assistant', content: INTRO, intro: true }]);
    lastQuestionRef.current = '';
    lastUserIdRef.current = null;
    lastAssistantIdRef.current = null;
    nextIdRef.current = 1;
    setOpen(false);
    openerRef.current?.focus();
  }, [stopSpeech]);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open && typeof dialog.close === 'function') dialog.close();
    else finishClose();
  }, [finishClose]);

  async function playReply(message: Message) {
    if (!supportTts() || !message.content) return;
    if (speakingId === message.id) {
      stopSpeech();
      return;
    }
    stopSpeech();
    const generation = speechGenerationRef.current;
    const chunks = chunkNarration(message.content);
    if (!chunks.length) return;
    const source = `chat:${message.id}`;
    speechRef.current = { source, messageId: message.id };
    setSpeakingId(message.id);

    const playChunk = async (index: number): Promise<void> => {
      if (!mountedRef.current || generation !== speechGenerationRef.current) return;
      const chunk = chunks[index];
      if (!chunk) {
        speechRef.current = null;
        setSpeakingId(null);
        return;
      }
      let advanced = false;
      moreChunksRef.current = index + 1 < chunks.length;
      try {
        await speak(chunk, {
          source,
          onEnd: () => {
            if (!mountedRef.current || generation !== speechGenerationRef.current || advanced) return;
            advanced = true;
            if (index + 1 < chunks.length) void playChunk(index + 1);
            else {
              speechRef.current = null;
              moreChunksRef.current = false;
              setSpeakingId(null);
            }
          },
        });
      } catch {
        if (mountedRef.current && generation === speechGenerationRef.current) {
          speechRef.current = null;
          moreChunksRef.current = false;
          setSpeakingId(null);
        }
      }
    };

    await playChunk(0);
  }

  async function handleSend(question?: string, retry = false) {
    const text = (question ?? input).trim();
    if (!text || loading) return;

    const reuseAssistantId = retry ? lastAssistantIdRef.current : null;
    const isRetry = reuseAssistantId !== null;
    const userMessage: Message | null = isRetry
      ? null
      : { id: nextIdRef.current++, role: 'user', content: text };
    const userId = isRetry ? lastUserIdRef.current : userMessage!.id;
    const assistantId = reuseAssistantId ?? nextIdRef.current++;
    const history = messages
      .filter((message) => !message.intro && message.content)
      .filter((message) => !isRetry || (message.id !== userId && message.id !== assistantId))
      .map(({ role, content }) => ({ role, content }));
    const requestId = ++requestRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    lastQuestionRef.current = text;
    lastUserIdRef.current = userId;
    lastAssistantIdRef.current = assistantId;
    setInput('');
    setError('');
    setLoading(true);
    setMessages((current) =>
      isRetry
        ? current.map((message) => (message.id === assistantId ? { ...message, content: '', failed: false } : message))
        : [...current, userMessage!, { id: assistantId, role: 'assistant', content: '' }],
    );

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }] }),
        signal: controller.signal,
      });
      if (!mountedRef.current || requestId !== requestRef.current) return;
      if (!response.ok || !response.body) throw new Error('Chat request failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const sse = createSseState();
      let full = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (!mountedRef.current || requestId !== requestRef.current) return;
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const delta of parseSseChunk(sse, chunk)) {
          if (!mountedRef.current || requestId !== requestRef.current) return;
          full += delta;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, content: message.content + delta } : message,
            ),
          );
        }
      }
      if (!mountedRef.current || requestId !== requestRef.current) return;
      for (const delta of parseSseChunk(sse, decoder.decode())) {
        full += delta;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: message.content + delta } : message,
          ),
        );
      }
      if (!full) throw new Error('Empty chat response');
    } catch (requestError) {
      if (!mountedRef.current || requestId !== requestRef.current || isAbortError(requestError)) return;
      setError(CHAT_ERROR);
      setMessages((current) =>
        current.map((message) => (message.id === assistantId ? { ...message, content: CHAT_ERROR, failed: true } : message)),
      );
    } finally {
      if (mountedRef.current && requestId === requestRef.current) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  }

  return (
    <div className="portfolio-chat">
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open portfolio chat"
        className="portfolio-chat-launcher min-h-[44px] min-w-[44px] bg-accent text-on-accent"
      >
        Chat
      </button>
      {open ? (
        <dialog
          ref={dialogRef}
          aria-labelledby="portfolio-chat-title"
          onClose={finishClose}
          className="portfolio-chat-sheet [&:not([open])]:hidden fixed inset-x-3 z-50 m-0 flex w-auto flex-col border border-border p-0 sm:left-auto sm:right-6 sm:w-[24rem]"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <h2 id="portfolio-chat-title">Portfolio assistant</h2>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close portfolio chat"
              className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <CloseIcon />
            </button>
          </div>
          <div
            role="log"
            aria-live="polite"
            aria-busy={loading}
            aria-relevant="additions text"
            aria-label="Conversation"
            className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
          >
            {messages.map((message) => (
              <div key={message.id}>
                <p role={message.content === CHAT_ERROR ? 'alert' : undefined}>{message.content}</p>
                {message.role === 'assistant' && !message.intro && !message.failed && message.content && supportTts() ? (
                  <button
                    type="button"
                    onClick={() => void playReply(message)}
                    aria-label={speakingId === message.id ? 'Stop reading reply' : 'Read reply aloud'}
                    className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {speakingId === message.id ? 'Stop reading' : 'Read reply aloud'}
                  </button>
                ) : null}
              </div>
            ))}
            {loading ? <span role="status" className="motion-reduce:animate-none">Thinking…</span> : null}
          </div>
          {error ? (
            <div className="px-4 pb-2">
              <button
                type="button"
                onClick={() => void handleSend(lastQuestionRef.current, true)}
                aria-label="Retry failed question"
                className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : null}
          {messages.length === 1 && !loading && !error ? (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {portfolioData.suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void handleSend(question)}
                  className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {question}
                </button>
              ))}
            </div>
          ) : null}
          <div className="border-t border-border px-4 py-3">
            <label htmlFor="portfolio-chat-message" className="block">
              Message
            </label>
            <textarea
              id="portfolio-chat-message"
              ref={inputRef}
              aria-label="Message portfolio assistant, ask a question"
              className="min-h-[44px] w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              value={input}
              disabled={loading}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!input.trim() || loading}
              className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Send
            </button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
