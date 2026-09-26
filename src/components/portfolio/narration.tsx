'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { chunkNarration } from '@/lib/narration';
import {
  getNarrationState,
  loadNarration,
  pauseNarration,
  playNarration,
  resetTtsAvailability,
  resumeNarration,
  seekNarration,
  stopSpeaking,
  subscribeNarration,
  supportTts,
  type NarrationSnapshot,
} from '@/lib/tts';

export type NarrationSection = {
  id: string;
  title: string;
  text: string;
};

export type NarrationStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'unavailable';

export const PORTFOLIO_NARRATION_SOURCE = 'page';

type QueueItem = {
  sectionIndex: number;
  chunkIndex: number;
  text: string;
};

type ActiveRun = {
  generation: number;
  index: number;
  completed: boolean;
};

type NarrationContextValue = {
  status: NarrationStatus;
  hasStarted: boolean;
  sectionIndex: number;
  section: NarrationSection | null;
  statusMessage: string;
  play: (sectionId?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  position: number;
  duration: number;
  next: () => void;
  previous: () => void;
};

const NarrationContext = createContext<NarrationContextValue | null>(null);

export function usePortfolioNarration(): NarrationContextValue {
  const value = useContext(NarrationContext);
  if (!value) throw new Error('usePortfolioNarration must be used within a narration provider');
  return value;
}

export function PortfolioNarrationProvider({
  sections,
  children,
}: {
  sections: NarrationSection[];
  children: React.ReactNode;
}) {
  const queue = useMemo<QueueItem[]>(
    () =>
      sections.flatMap((section, sectionIndex) =>
        chunkNarration(section.text).map((text, chunkIndex) => ({ sectionIndex, chunkIndex, text })),
      ),
    [sections],
  );
  const [status, setStatus] = useState<NarrationStatus>('idle');
  const [hasStarted, setHasStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const generation = useRef(0);
  const activeRun = useRef<ActiveRun | null>(null);
  const navigationPendingRef = useRef(false);
  const navigationGenerationRef = useRef(0);
  const playAtRef = useRef<(index: number, transitionId?: number) => Promise<void>>(async () => undefined);
  const section = sections[sectionIndex] ?? null;

  useEffect(
    () => () => {
      generation.current++;
      activeRun.current = null;
      stopSpeaking();
    },
    [],
  );

  useEffect(
    () =>
      subscribeNarration((snapshot: NarrationSnapshot) => {
        if (snapshot.source !== PORTFOLIO_NARRATION_SOURCE) {
          if (snapshot.state === 'loading' || snapshot.state === 'playing') {
            generation.current++;
            navigationGenerationRef.current++;
            navigationPendingRef.current = false;
            activeRun.current = null;
            setCompleted(false);
            setPosition(0);
            setDuration(0);
            setStatus('idle');
          }
          return;
        }
        setPosition(snapshot.position);
        setDuration(snapshot.duration);
        if (snapshot.state === 'loading') setStatus('loading');
        else if (snapshot.state === 'playing') setStatus('playing');
        else if (snapshot.state === 'paused') setStatus('paused');
        else if (snapshot.state === 'error') {
          setCompleted(false);
          setStatus('error');
        } else if (snapshot.state === 'unavailable') {
          setCompleted(false);
          setStatus('unavailable');
        } else if (activeRun.current) {
          setCompleted(false);
          setStatus('idle');
        }
      }),
    [],
  );

  const syncPlayerState = useCallback(() => {
    const playerState = getNarrationState();
    setPosition(playerState.position);
    setDuration(playerState.duration);
  }, []);

  const playAt = useCallback(
    async (index: number, transitionId?: number) => {
      const settleTransition = () => {
        if (transitionId !== undefined && navigationGenerationRef.current === transitionId) {
          navigationPendingRef.current = false;
        }
      };
      const item = queue[index];
      if (!item) {
        settleTransition();
        return;
      }
      const currentGeneration = ++generation.current;
      setHasStarted(true);
      setCompleted(false);
      setPosition(0);
      setDuration(0);
      if (!supportTts()) {
        activeRun.current = null;
        stopSpeaking();
        setStatus('unavailable');
        settleTransition();
        return;
      }
      const run: ActiveRun = { generation: currentGeneration, index, completed: false };
      activeRun.current = run;
      setSectionIndex(item.sectionIndex);
      setStatus('loading');
      try {
        await loadNarration(item.text, PORTFOLIO_NARRATION_SOURCE);
        if (generation.current !== currentGeneration || activeRun.current !== run) return;
        playNarration({
          source: PORTFOLIO_NARRATION_SOURCE,
          onEnd: () => {
            if (generation.current !== currentGeneration || activeRun.current !== run || run.completed) return;
            run.completed = true;
            const nextIndex = index + 1;
            if (nextIndex < queue.length) {
              queueMicrotask(() => {
                if (generation.current === currentGeneration && activeRun.current === run) {
                  void playAtRef.current(nextIndex);
                }
              });
            } else {
              activeRun.current = null;
              setPosition(0);
              setDuration(0);
              setCompleted(true);
              setStatus('idle');
            }
          },
        });
        syncPlayerState();
        setStatus('playing');
      } catch (error) {
        if (generation.current !== currentGeneration || activeRun.current !== run) return;
        activeRun.current = null;
        if (!supportTts() || (error instanceof Error && /unavailable/i.test(error.message))) {
          stopSpeaking();
          setStatus('unavailable');
        } else {
          setStatus('error');
        }
      } finally {
        settleTransition();
      }
    },
    [queue, syncPlayerState],
  );

  useEffect(() => {
    playAtRef.current = playAt;
  }, [playAt]);

  const play = useCallback(
    (sectionId?: string) => {
      const sectionIndex = sectionId ? sections.findIndex((item) => item.id === sectionId) : 0;
      if (sectionIndex < 0) return;
      const queueIndex = sectionId
        ? queue.findIndex((item) => item.sectionIndex === sectionIndex)
        : 0;
      if (queueIndex >= 0) {
        navigationPendingRef.current = false;
        navigationGenerationRef.current++;
        void playAt(queueIndex);
      }
    },
    [playAt, queue, sections],
  );

  const playSectionOffset = useCallback(
    (offset: number) => {
      if (navigationPendingRef.current) return;
      const targetSection = Math.min(Math.max(sectionIndex + offset, 0), sections.length - 1);
      const targetQueueIndex = queue.findIndex((item) => item.sectionIndex === targetSection);
      if (targetQueueIndex >= 0) {
        navigationPendingRef.current = true;
        const transitionId = ++navigationGenerationRef.current;
        void playAt(targetQueueIndex, transitionId);
      }
    },
    [playAt, queue, sectionIndex, sections.length],
  );

  const next = useCallback(() => playSectionOffset(1), [playSectionOffset]);
  const previous = useCallback(() => playSectionOffset(-1), [playSectionOffset]);

  const pause = useCallback(() => {
    const nextState = pauseNarration();
    syncPlayerState();
    setStatus(nextState);
  }, [syncPlayerState]);

  const resume = useCallback(() => {
    const nextState = resumeNarration();
    syncPlayerState();
    setStatus(nextState);
  }, [syncPlayerState]);

  const seek = useCallback(
    (seconds: number) => {
      seekNarration(seconds);
      syncPlayerState();
    },
    [syncPlayerState],
  );

  const stop = useCallback(() => {
    generation.current++;
    navigationGenerationRef.current++;
    navigationPendingRef.current = false;
    activeRun.current = null;
    stopSpeaking();
    setPosition(0);
    setDuration(0);
    setCompleted(false);
    setStatus('idle');
  }, []);

  const statusMessage =
    status === 'playing' && section
      ? `Playing ${section.title}`
      : status === 'loading' && section
        ? `Loading ${section.title}`
        : status === 'paused'
          ? 'Paused'
          : status === 'unavailable'
            ? 'Narration unavailable. Try again.'
            : status === 'error'
              ? 'Narration failed. Try again.'
              : status === 'idle' && completed
                ? 'Narration complete.'
                : status === 'idle' && hasStarted
                  ? 'Stopped'
                  : '';

  return (
    <NarrationContext.Provider
      value={{
        status,
        hasStarted,
        sectionIndex,
        section,
        statusMessage,
        play,
        pause,
        resume,
        stop,
        seek,
        position,
        duration,
        next,
        previous,
      }}
    >
      {children}
    </NarrationContext.Provider>
  );
}

const TRIGGER_LABELS: Record<NarrationStatus, string> = {
  idle: 'Listen to this page',
  loading: 'Stop narration',
  playing: 'Pause narration',
  paused: 'Resume narration',
  error: 'Listen to this page',
  unavailable: 'Listen to this page',
};

export function NarrationTrigger() {
  const { play, pause, resume, stop, status } = usePortfolioNarration();
  const activate = () => {
    if (status === 'loading') {
      stop();
      return;
    }
    if (status === 'playing') {
      pause();
      return;
    }
    if (status === 'paused') {
      resume();
      return;
    }
    play();
  };
  return (
    <button
      type="button"
      onClick={activate}
      className="portfolio-button portfolio-button-quiet min-h-[44px] min-w-[44px]"
    >
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M4 9v6h3.5L12 19V5L7.5 9H4zM16 8.5a4.5 4.5 0 0 1 0 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {TRIGGER_LABELS[status]}
    </button>
  );
}

function transportWord(status: NarrationStatus): string {
  if (status === 'loading') return 'Stop';
  if (status === 'playing') return 'Pause';
  if (status === 'paused') return 'Resume';
  return 'Play';
}

export function NarrationDock() {
  const { section, statusMessage, pause, resume, stop, seek, status, hasStarted, position, duration, next, previous, play } =
    usePortfolioNarration();
  const idle = status === 'idle' && !hasStarted;
  if (idle) {
    return (
      <section
        aria-label="Portfolio narration controls"
        data-dock-state="idle"
        className="portfolio-glass portfolio-dock"
      >
        <button
          type="button"
          data-control="transport"
          onClick={() => play()}
          className="portfolio-dock-play"
        >
          Play narration
        </button>
      </section>
    );
  }
  return (
    <section
      aria-label="Portfolio narration controls"
      data-dock-state="active"
      className="portfolio-glass portfolio-dock"
    >
      <p role="status" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </p>
      <button
        type="button"
        data-control="transport"
        onClick={() => {
          if (status === 'loading') stop();
          else if (status === 'playing') pause();
          else if (status === 'paused') resume();
          else play();
        }}
        className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {transportWord(status)}
      </button>
      {status === 'loading' ? null : (
        <button
          type="button"
          onClick={stop}
          className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Stop
        </button>
      )}
      <button
        type="button"
        onClick={previous}
        className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={next}
        className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Next
      </button>
      {status === 'unavailable' || status === 'error' ? (
        <button
          type="button"
          onClick={() => {
            if (status === 'unavailable') resetTtsAvailability();
            if (section) play(section.id);
            else play();
          }}
          className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Retry
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => seek(-10)}
        className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        −10 seconds
      </button>
      <button
        type="button"
        onClick={() => seek(10)}
        className="min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        +10 seconds
      </button>
      <progress
        aria-label="Narration progress"
        value={position}
        max={duration || 1}
        className="w-full motion-reduce:transition-none"
      />
    </section>
  );
}
