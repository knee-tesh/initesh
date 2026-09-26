/** @jest-environment jsdom */
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { PortfolioNarrationProvider, NarrationDock, NarrationTrigger, usePortfolioNarration } from '@/components/portfolio/narration';
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

jest.mock('@/lib/tts', () => ({
  getNarrationState: jest.fn(() => ({ state: 'idle', position: 0, duration: 12 })),
  loadNarration: jest.fn(async () => undefined),
  pauseNarration: jest.fn(),
  playNarration: jest.fn(),
  resetTtsAvailability: jest.fn(),
  resumeNarration: jest.fn(),
  seekNarration: jest.fn(),
  stopSpeaking: jest.fn(),
  subscribeNarration: jest.fn(() => () => undefined),
  supportTts: jest.fn(() => true),
}));

const mockedGetNarrationState = getNarrationState as jest.MockedFunction<typeof getNarrationState>;
const mockedLoadNarration = loadNarration as jest.MockedFunction<typeof loadNarration>;
const mockedPauseNarration = pauseNarration as jest.MockedFunction<typeof pauseNarration>;
const mockedPlayNarration = playNarration as jest.MockedFunction<typeof playNarration>;
const mockedResetTtsAvailability = resetTtsAvailability as jest.MockedFunction<typeof resetTtsAvailability>;
const mockedResumeNarration = resumeNarration as jest.MockedFunction<typeof resumeNarration>;
const mockedSeekNarration = seekNarration as jest.MockedFunction<typeof seekNarration>;
const mockedStopSpeaking = stopSpeaking as jest.MockedFunction<typeof stopSpeaking>;
const mockedSubscribeNarration = subscribeNarration as jest.MockedFunction<typeof subscribeNarration>;
const mockedSupportTts = supportTts as jest.MockedFunction<typeof supportTts>;

const sections = [
  { id: 'intro', title: 'Introduction', text: 'Welcome to the portfolio.' },
  { id: 'work', title: 'Selected work', text: 'The work is described here.' },
];

function renderNarration() {
  return render(
    <PortfolioNarrationProvider sections={sections}>
      <NarrationTrigger />
      <NarrationDock />
    </PortfolioNarrationProvider>,
  );
}

function dock() {
  return within(screen.getByRole('region', { name: /portfolio narration controls/i }));
}

function transport() {
  const element = screen
    .getByRole('region', { name: /portfolio narration controls/i })
    .querySelector<HTMLButtonElement>('[data-control="transport"]');
  if (!element) throw new Error('the dock transport control is missing');
  return element;
}

function renderTrigger() {
  return render(
    <PortfolioNarrationProvider sections={sections}>
      <NarrationTrigger />
    </PortfolioNarrationProvider>,
  );
}

function SectionTrigger({ id }: { id: string }) {
  const { play } = usePortfolioNarration();
  return <button onClick={() => play(id)}>Play {id}</button>;
}

describe('portfolio narration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetNarrationState.mockReturnValue({ state: 'idle', position: 0, duration: 12 });
    mockedSupportTts.mockReturnValue(true);
    mockedLoadNarration.mockResolvedValue(undefined);
    mockedPauseNarration.mockReturnValue('paused');
    mockedResumeNarration.mockReturnValue('playing');
    mockedSubscribeNarration.mockImplementation(() => () => undefined);
  });

  it('starts the first section from the trigger and shows one live status', async () => {
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));

    expect(mockedLoadNarration).toHaveBeenCalledWith('Welcome to the portfolio.', 'page');
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    expect(mockedPlayNarration).toHaveBeenCalledTimes(1);
  });

  it('starts playback from the dock when it is idle', async () => {
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /play narration/i }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    expect(mockedLoadNarration).toHaveBeenCalledWith('Welcome to the portfolio.', 'page');
  });

  it('pauses and resumes the active narration', async () => {
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(dock().getByRole('button', { name: 'Pause' }));
    expect(mockedPauseNarration).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Paused'));

    fireEvent.click(dock().getByRole('button', { name: 'Resume' }));
    expect(mockedResumeNarration).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
  });

  it('uses the player result when pause is a no-op', async () => {
    mockedPauseNarration.mockReturnValue('idle');
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(dock().getByRole('button', { name: 'Pause' }));

    await waitFor(() => expect(screen.getByRole('status').textContent).not.toBe('Paused'));
  });

  it('uses the player result when resume cannot resume', async () => {
    mockedResumeNarration.mockReturnValue('idle');
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    fireEvent.click(dock().getByRole('button', { name: 'Pause' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Paused'));

    fireEvent.click(dock().getByRole('button', { name: 'Resume' }));

    await waitFor(() => expect(screen.getByRole('status').textContent).not.toBe('Playing Introduction'));
  });

  it('stops playback and reports the stopped state', async () => {
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));

    expect(mockedStopSpeaking).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Stopped'));
  });

  it('seeks ten seconds in either direction and exposes progress', async () => {
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(screen.getByRole('button', { name: '−10 seconds' }));
    fireEvent.click(screen.getByRole('button', { name: '+10 seconds' }));

    expect(mockedSeekNarration).toHaveBeenNthCalledWith(1, -10);
    expect(mockedSeekNarration).toHaveBeenNthCalledWith(2, 10);
    expect(screen.getByRole('progressbar', { name: /narration progress/i })).toBeTruthy();
  });

  it('moves to the previous and next section boundaries', async () => {
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Selected work'));
    expect(mockedLoadNarration).toHaveBeenLastCalledWith('The work is described here.', 'page');

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    expect(mockedLoadNarration).toHaveBeenLastCalledWith('Welcome to the portfolio.', 'page');
  });

  it('advances naturally once when the player completes a chunk', async () => {
    let complete: (() => void) | undefined;
    mockedPlayNarration.mockImplementation((options) => {
      complete = options?.onEnd;
    });
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    await act(async () => {
      complete?.();
      complete?.();
    });

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Selected work'));
    expect(mockedLoadNarration.mock.calls.filter(([text]) => text === 'The work is described here.')).toHaveLength(1);
  });

  it('does not restart after stop wins a pending section load', async () => {
    let resolveLoad!: () => void;
    mockedLoadNarration.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveLoad = resolve;
      }),
    );
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));
    fireEvent.click(dock().getByRole('button', { name: 'Stop' }));

    await act(async () => {
      resolveLoad();
    });

    expect(mockedPlayNarration).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe('Stopped');
  });

  it('shows a retryable unavailable state when narration is not supported', async () => {
    mockedSupportTts.mockReturnValue(false);
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration unavailable. Try again.'));
    expect(mockedLoadNarration).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('clears the latched availability on retry so the section can load again', async () => {
    mockedSupportTts.mockReturnValueOnce(false);
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration unavailable. Try again.'));
    expect(mockedResetTtsAvailability).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(mockedResetTtsAvailability).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    expect(mockedLoadNarration).toHaveBeenCalledWith('Welcome to the portfolio.', 'page');
  });

  it('leaves the availability latch alone when a transient failure is retried', async () => {
    mockedLoadNarration.mockRejectedValue(new Error('network failure'));
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration failed. Try again.'));

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(mockedResetTtsAvailability).not.toHaveBeenCalled();
  });

  it('announces the current section while narration is loading', async () => {
    let resolveLoad!: () => void;
    mockedLoadNarration.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveLoad = resolve;
      }),
    );
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Loading Introduction'));
    await act(async () => {
      resolveLoad();
    });
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
  });

  it('shows a retryable error state when loading fails', async () => {
    mockedLoadNarration.mockRejectedValue(new Error('network failure'));
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration failed. Try again.'));
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('classifies a missing Murf key as unavailable', async () => {
    mockedLoadNarration.mockRejectedValue(new Error('TTS unavailable'));
    renderNarration();

    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration unavailable. Try again.'));
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('maps a selected section to the first chunk of its flattened queue', async () => {
    const longText = `${'alpha '.repeat(100).trim()}.`;
    render(
      <PortfolioNarrationProvider
        sections={[
          { id: 'long', title: 'Long section', text: longText },
          { id: 'work', title: 'Selected work', text: 'The work is described here.' },
        ]}
      >
        <SectionTrigger id="work" />
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Play work' }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Selected work'));
    expect(mockedLoadNarration).toHaveBeenCalledWith('The work is described here.', 'page');
  });

  it('stops active narration when the provider unmounts', async () => {
    const view = renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    view.unmount();

    expect(mockedStopSpeaking).toHaveBeenCalledTimes(1);
  });

  it('retries the section that failed', async () => {
    mockedLoadNarration.mockRejectedValueOnce(new Error('network failure'));
    render(
      <PortfolioNarrationProvider sections={sections}>
        <SectionTrigger id="work" />
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Play work' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration failed. Try again.'));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Selected work'));
    expect(mockedLoadNarration).toHaveBeenLastCalledWith('The work is described here.', 'page');
  });

  it('keeps the current section while advancing through its chunks', async () => {
    const longText = `${'alpha '.repeat(100).trim()}.`;
    const callbacks: Array<(() => void) | undefined> = [];
    mockedPlayNarration.mockImplementation((options) => {
      callbacks.push(options?.onEnd);
    });
    render(
      <PortfolioNarrationProvider
        sections={[
          { id: 'long', title: 'Long section', text: longText },
          { id: 'work', title: 'Selected work', text: 'The work is described here.' },
        ]}
      >
        <NarrationTrigger />
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(mockedPlayNarration).toHaveBeenCalledTimes(1));
    await act(async () => {
      callbacks[0]?.();
    });

    await waitFor(() => expect(mockedLoadNarration).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('status').textContent).toBe('Playing Long section');
  });

  it('lets stop win over a completion callback fired in the same turn', async () => {
    let complete: (() => void) | undefined;
    mockedPlayNarration.mockImplementation((options) => {
      complete = options?.onEnd;
    });
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    await act(async () => {
      complete?.();
      fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
      complete?.();
    });

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Stopped'));
    expect(mockedLoadNarration).toHaveBeenCalledTimes(1);
  });

  it('clears progress when stopped', async () => {
    mockedGetNarrationState.mockReturnValue({ state: 'playing', position: 5, duration: 10 });
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));

    expect(screen.getByRole('progressbar', { name: /narration progress/i }).getAttribute('value')).toBe('0');
  });

  it('reports completion after the final section ends', async () => {
    let complete: (() => void) | undefined;
    mockedPlayNarration.mockImplementation((options) => {
      complete = options?.onEnd;
    });
    render(
      <PortfolioNarrationProvider sections={[sections[0]]}>
        <NarrationTrigger />
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    await act(async () => {
      complete?.();
    });

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Narration complete.'));
  });

  it('coalesces rapid next-section clicks until the new segment load settles', async () => {
    render(
      <PortfolioNarrationProvider
        sections={[
          sections[0],
          sections[1],
          { id: 'capabilities', title: 'Capabilities', text: 'The capabilities are described here.' },
        ]}
      >
        <NarrationTrigger />
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    let resolveNavigation!: () => void;
    mockedLoadNarration.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveNavigation = resolve;
      }),
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    });

    expect(mockedLoadNarration).toHaveBeenCalledTimes(2);
    await act(async () => {
      resolveNavigation();
    });
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Selected work'));
    expect(mockedLoadNarration).not.toHaveBeenCalledWith('The capabilities are described here.', 'page');
  });

  it('coalesces rapid previous-section clicks until the new segment load settles', async () => {
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationTrigger />
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Selected work'));

    let resolveNavigation!: () => void;
    mockedLoadNarration.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveNavigation = resolve;
      }),
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    });

    expect(mockedLoadNarration).toHaveBeenCalledTimes(3);
    await act(async () => {
      resolveNavigation();
    });
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
  });

  it('renders live player progress from the page source subscription', async () => {
    let listener: ((snapshot: NarrationSnapshot) => void) | undefined;
    mockedSubscribeNarration.mockImplementation((next) => {
      listener = next;
      return () => undefined;
    });
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    act(() => listener?.({ state: 'playing', position: 5, duration: 12, source: 'page' }));

    expect(screen.getByRole('progressbar', { name: /narration progress/i }).getAttribute('value')).toBe('5');
  });

  it('clears page state when another speech source takes over', async () => {
    let listener: ((snapshot: NarrationSnapshot) => void) | undefined;
    mockedSubscribeNarration.mockImplementation((next) => {
      listener = next;
      return () => undefined;
    });
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    act(() => listener?.({ state: 'playing', position: 9, duration: 20, source: 'chat:1' }));

    expect(screen.getByRole('status').textContent).toBe('Stopped');
    expect(screen.getByRole('progressbar', { name: /narration progress/i }).getAttribute('value')).toBe('0');
  });

  it('invalidates a page run when another source takes over', async () => {
    let listener: ((snapshot: NarrationSnapshot) => void) | undefined;
    let complete: (() => void) | undefined;
    mockedSubscribeNarration.mockImplementation((next) => {
      listener = next;
      return () => undefined;
    });
    mockedPlayNarration.mockImplementation((options) => {
      complete = options?.onEnd;
    });
    renderNarration();
    fireEvent.click(screen.getByRole('button', { name: /start portfolio narration|listen/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    act(() => {
      listener?.({ state: 'loading', position: 0, duration: 0, source: 'chat:1' });
      complete?.();
    });

    expect(mockedLoadNarration).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').textContent).toBe('Stopped');
  });
  it('names the trigger with its visible label and drops the pressed state', () => {
    renderTrigger();
    const trigger = screen.getByRole('button', { name: 'Listen to this page' });

    expect(trigger.getAttribute('aria-label')).toBeNull();
    expect(trigger.getAttribute('aria-pressed')).toBeNull();
    expect(trigger.textContent).toContain('Listen to this page');
  });

  it('toggles the visible label to pause while playing', async () => {
    renderTrigger();

    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Pause narration' })).toBeTruthy());
    expect(mockedLoadNarration).toHaveBeenCalledTimes(1);
    expect(mockedPauseNarration).not.toHaveBeenCalled();
  });

  it('pauses and resumes with the player state instead of restarting the section', async () => {
    renderTrigger();
    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));
    await waitFor(() => screen.getByRole('button', { name: 'Pause narration' }));

    fireEvent.click(screen.getByRole('button', { name: 'Pause narration' }));
    expect(mockedPauseNarration).toHaveBeenCalledTimes(1);
    await waitFor(() => screen.getByRole('button', { name: 'Resume narration' }));

    fireEvent.click(screen.getByRole('button', { name: 'Resume narration' }));
    expect(mockedResumeNarration).toHaveBeenCalledTimes(1);
    expect(mockedLoadNarration).toHaveBeenCalledTimes(1);
    expect(mockedPlayNarration).toHaveBeenCalledTimes(1);
  });

  it('stops an in-flight load from the trigger so late audio never installs', async () => {
    let release: () => void = () => undefined;
    mockedLoadNarration.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    renderTrigger();

    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));
    await waitFor(() => screen.getByRole('button', { name: 'Stop narration' }));
    expect(mockedPauseNarration).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Stop narration' }));
    expect(mockedStopSpeaking).toHaveBeenCalled();
    expect(mockedPlayNarration).not.toHaveBeenCalled();

    await act(async () => release());

    expect(mockedLoadNarration).toHaveBeenCalledTimes(1);
    expect(mockedPlayNarration).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Listen to this page' })).toBeTruthy();
  });

  it('stays a compact pill while idle and expands only once narration starts', async () => {
    renderNarration();

    const idle = screen.getByRole('region', { name: /portfolio narration controls/i });
    expect(idle.getAttribute('data-dock-state')).toBe('idle');
    expect(idle.className).not.toContain('portfolio-dock-idle');
    expect(screen.queryByRole('progressbar', { name: /narration progress/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /pause narration/i })).toBeNull();
    expect(screen.getByRole('button', { name: 'Play narration' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Listen to this page' }));

    await waitFor(() =>
      expect(screen.getByRole('region', { name: /portfolio narration controls/i }).getAttribute('data-dock-state')).toBe(
        'active',
      ),
    );
    const active = screen.getByRole('region', { name: /portfolio narration controls/i });
    expect(active.className).not.toContain('portfolio-dock-expanded');
    expect(dock().getByRole('progressbar', { name: /narration progress/i })).toBeTruthy();
    expect(dock().getByRole('button', { name: 'Pause' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Playing Introduction');
  });
  it('drives the dock transport through play, pause, and resume', async () => {
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    expect(transport().textContent).toBe('Play narration');
    expect(transport().getAttribute('data-control')).toBe('transport');

    fireEvent.click(transport());
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    expect(transport().textContent).toBe('Pause');
    expect(transport().getAttribute('aria-label')).toBeNull();
    expect(screen.getByRole('button', { name: 'Pause' })).toBe(transport());

    fireEvent.click(transport());
    expect(mockedPauseNarration).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Paused'));
    expect(transport().textContent).toBe('Resume');
    expect(screen.getByRole('button', { name: 'Resume' })).toBe(transport());

    fireEvent.click(transport());
    expect(mockedResumeNarration).toHaveBeenCalledTimes(1);
    expect(mockedLoadNarration).toHaveBeenCalledTimes(1);
  });

  it('keeps the dock transport on pause when the player refuses to pause', async () => {
    mockedPauseNarration.mockReturnValue('playing');
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    fireEvent.click(transport());
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    fireEvent.click(transport());

    expect(mockedPauseNarration).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));
    expect(transport().textContent).toBe('Pause');
    expect(screen.getByRole('button', { name: 'Pause' })).toBe(transport());
  });

  it('stops an in-flight load from the dock transport', async () => {
    let release: () => void = () => undefined;
    mockedLoadNarration.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );

    fireEvent.click(transport());
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Loading Introduction'));
    expect(transport().textContent).toBe('Stop');
    expect(transport().getAttribute('aria-label')).toBeNull();
    expect(screen.getByRole('button', { name: 'Stop' })).toBe(transport());

    fireEvent.click(transport());
    expect(mockedStopSpeaking).toHaveBeenCalled();

    await act(async () => release());

    expect(mockedPlayNarration).not.toHaveBeenCalled();
  });
  it('gives every dock control an accessible name equal to its visible text', async () => {
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );
    fireEvent.click(transport());
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    const controls = [
      ...screen
        .getByRole('region', { name: /portfolio narration controls/i })
        .querySelectorAll<HTMLButtonElement>('button'),
    ];

    expect(controls.length).toBeGreaterThan(4);
    for (const control of controls) {
      const visible = (control.textContent || '').trim();
      expect(visible.length).toBeGreaterThan(0);
      expect(control.getAttribute('aria-label')).toBeNull();
      expect(screen.getByRole('button', { name: visible })).toBe(control);
      expect(control.className).toContain('min-h-[44px]');
      expect(control.className).toContain('min-w-[44px]');
    }
  });

  it('describes the seek controls in their visible labels', async () => {
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );
    fireEvent.click(transport());
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    for (const label of ['−10 seconds', '+10 seconds']) {
      const seek = screen.getByRole('button', { name: label });
      expect(seek.textContent?.trim()).toBe(label);
      expect(seek.getAttribute('aria-label')).toBeNull();
    }
  });

  it('announces the dock status politely without moving focus', async () => {
    render(
      <PortfolioNarrationProvider sections={sections}>
        <NarrationDock />
      </PortfolioNarrationProvider>,
    );
    fireEvent.click(transport());
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Playing Introduction'));

    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-atomic')).toBe('true');
    expect(document.activeElement).toBe(document.body);
  });
});
