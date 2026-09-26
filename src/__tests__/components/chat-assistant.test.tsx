/** @jest-environment jsdom */
import { TextDecoder as NodeTextDecoder } from 'node:util';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChatAssistant } from '@/components/portfolio/chat-assistant';
import { portfolioData } from '@/data/portfolio';
import { speak, stopSpeaking, subscribeNarration, supportTts, type NarrationSnapshot } from '@/lib/tts';

jest.mock('@/lib/tts', () => ({
  speak: jest.fn(async () => undefined),
  stopSpeaking: jest.fn(),
  subscribeNarration: jest.fn(() => () => undefined),
  supportTts: jest.fn(() => true),
}));

const mockedSpeak = speak as jest.MockedFunction<typeof speak>;
const mockedStopSpeaking = stopSpeaking as jest.MockedFunction<typeof stopSpeaking>;
const mockedSubscribeNarration = subscribeNarration as jest.MockedFunction<typeof subscribeNarration>;
const mockedSupportTts = supportTts as jest.MockedFunction<typeof supportTts>;
const originalFetch = global.fetch;
let fetchMock: jest.MockedFunction<typeof fetch>;
const showModal = jest.fn();
const closeDialog = jest.fn();

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function showModalPolyfill(this: HTMLDialogElement) {
      showModal();
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function closePolyfill(this: HTMLDialogElement) {
      closeDialog();
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    },
  });
});

Object.assign(globalThis, { TextDecoder: NodeTextDecoder });

function streamResponse(payload: string): Response {
  const bytes = new Uint8Array(Buffer.from(payload));
  let sent = false;
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: async () => {
          if (sent) return { done: true, value: undefined };
          sent = true;
          return { done: false, value: bytes };
        },
      }),
    },
  } as unknown as Response;
}

describe('ChatAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;
    mockedSupportTts.mockReturnValue(true);
    mockedSpeak.mockResolvedValue(undefined);
    mockedSubscribeNarration.mockImplementation(() => () => undefined);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('opens with focus in the dialog and restores focus on close', () => {
    render(<ChatAssistant />);
    const opener = screen.getByRole('button', { name: /open portfolio chat/i });
    opener.focus();

    fireEvent.click(opener);

    const dialog = screen.getByRole('dialog', { name: /portfolio assistant/i });
    const input = screen.getByRole('textbox', { name: /message/i });
    expect(dialog).toBeTruthy();
    expect(document.activeElement).toBe(input);

    fireEvent.click(screen.getByRole('button', { name: /close portfolio chat/i }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
    expect(mockedStopSpeaking).toHaveBeenCalled();
  });

  it('submits a suggested question and renders the streamed reply', async () => {
    fetchMock.mockResolvedValue(
      streamResponse('data: {"choices":[{"delta":{"content":"I focus on distributed systems."}}]}\n\n'),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));

    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: portfolioData.suggestedQuestions[0] }] }),
      }),
    );
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('I focus on distributed systems.'));
  });

  it('shows a loading indicator while the assistant request is pending', async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), { target: { value: 'Pending question' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Thinking…'));
    resolveFetch(streamResponse('data: {"choices":[{"delta":{"content":"Done."}}]}\n\n'));
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
  });

  it('submits on Enter but preserves Shift+Enter for a new line', async () => {
    fetchMock.mockResolvedValue(
      streamResponse('data: {"choices":[{"delta":{"content":"A concise answer."}}]}\n\n'),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    const input = screen.getByRole('textbox', { name: /message/i });
    fireEvent.change(input, { target: { value: 'Tell me about the work' } });

    const shiftEnter = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true });
    await act(async () => {
      input.dispatchEvent(shiftEnter);
    });
    expect(shiftEnter.defaultPrevented).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    await act(async () => {
      input.dispatchEvent(enter);
    });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(enter.defaultPrevented).toBe(true);
  });

  it('shows an explicit error and retries the failed question', async () => {
    fetchMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(streamResponse('data: {"choices":[{"delta":{"content":"Recovered answer."}}]}\n\n'));
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    const input = screen.getByRole('textbox', { name: /message/i });
    fireEvent.change(input, { target: { value: 'Tell me about the work' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/went wrong|try again/i));
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Recovered answer.'));
    expect(screen.getAllByText('Tell me about the work')).toHaveLength(1);
  });

  it('offers the speech control only for successful assistant replies', async () => {
    fetchMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(streamResponse('data: {"choices":[{"delta":{"content":"Recovered answer."}}]}\n\n'));
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), { target: { value: 'Tell me about the work' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/went wrong|try again/i));
    expect(screen.queryByRole('button', { name: 'Read reply aloud' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Recovered answer.'));
    expect(screen.getByRole('button', { name: 'Read reply aloud' })).toBeTruthy();
  });

  it('closes through the native dialog close event and returns focus', () => {
    render(<ChatAssistant />);
    const opener = screen.getByRole('button', { name: /open portfolio chat/i });
    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole('dialog', { name: /portfolio assistant/i }) as HTMLDialogElement;
    act(() => dialog.close());

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('uses native dialog modality and close events', () => {
    render(<ChatAssistant />);
    const opener = screen.getByRole('button', { name: /open portfolio chat/i });
    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole('dialog', { name: /portfolio assistant/i });
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.className).toContain('[&:not([open])]:hidden');
    expect(showModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /close portfolio chat/i }));

    expect(closeDialog).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('leaves the sheet vertical anchoring to the stylesheet', () => {
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));

    const dialog = screen.getByRole('dialog', { name: /portfolio assistant/i });

    expect(dialog.className).toContain('portfolio-chat-sheet');
    expect(dialog.className).not.toMatch(/(^|\s)(top|bottom|inset-y)-/);
  });

  it('does not throw when showModal is unavailable', () => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: undefined,
    });

    try {
      expect(() => {
        render(<ChatAssistant />);
        fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
      }).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', descriptor);
    }
  });

  it('aborts a pending request on close and can reopen without a stuck loader', async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), { target: { value: 'Pending question' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: /close portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));

    expect(screen.queryByRole('status')).toBeNull();
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
    resolveFetch(streamResponse('data: {"choices":[{"delta":{"content":"Late"}}]}\n\n'));
  });

  it('does not retain a transcript after closing', async () => {
    fetchMock.mockResolvedValue(streamResponse('data: {"choices":[{"delta":{"content":"Private reply."}}]}\n\n'));
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Private reply.'));

    fireEvent.click(screen.getByRole('button', { name: /close portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));

    expect(screen.getByRole('log').textContent).not.toContain('Private reply.');
  });

  it('aborts an in-flight request on unmount', async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );
    const view = render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), { target: { value: 'Unmount question' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    view.unmount();

    expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
    resolveFetch(streamResponse('data: {"choices":[{"delta":{"content":"Late"}}]}\n\n'));
  });

  it('splits a long reply into speech chunks and advances on completion', async () => {
    const longText = Array.from({ length: 140 }, (_, index) => `word${index}`).join(' ');
    const callbacks: Array<(() => void) | undefined> = [];
    mockedSpeak.mockImplementation(async (_text, options) => {
      callbacks.push(options?.onEnd);
    });
    fetchMock.mockResolvedValue(
      streamResponse(`data: ${JSON.stringify({ choices: [{ delta: { content: longText } }] })}\n\n`),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain(longText));

    fireEvent.click(screen.getByRole('button', { name: 'Read reply aloud' }));
    await waitFor(() => expect(mockedSpeak).toHaveBeenCalledTimes(1));
    expect(mockedSpeak.mock.calls[0][0].length).toBeLessThanOrEqual(500);

    await act(async () => {
      callbacks[0]?.();
    });

    await waitFor(() => expect(mockedSpeak).toHaveBeenCalledTimes(2));
  });

  it('does not advance speech after the drawer closes', async () => {
    const longText = Array.from({ length: 140 }, (_, index) => `word${index}`).join(' ');
    const callbacks: Array<(() => void) | undefined> = [];
    mockedSpeak.mockImplementation(async (_text, options) => {
      callbacks.push(options?.onEnd);
    });
    fetchMock.mockResolvedValue(
      streamResponse(`data: ${JSON.stringify({ choices: [{ delta: { content: longText } }] })}\n\n`),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain(longText));
    fireEvent.click(screen.getByRole('button', { name: 'Read reply aloud' }));
    await waitFor(() => expect(mockedSpeak).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: /close portfolio chat/i }));
    await act(async () => {
      callbacks[0]?.();
    });

    expect(mockedSpeak).toHaveBeenCalledTimes(1);
  });

  it('keeps chat speech active between chunks when the player publishes idle', async () => {
    let listener: ((snapshot: NarrationSnapshot) => void) | undefined;
    const callbacks: Array<(() => void) | undefined> = [];
    mockedSubscribeNarration.mockImplementation((next) => {
      listener = next;
      return () => undefined;
    });
    mockedSpeak.mockImplementation(async (_text, options) => {
      callbacks.push(options?.onEnd);
    });
    const longText = Array.from({ length: 140 }, (_, index) => `word${index}`).join(' ');
    fetchMock.mockResolvedValue(
      streamResponse(`data: ${JSON.stringify({ choices: [{ delta: { content: longText } }] })}\n\n`),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain(longText));
    fireEvent.click(screen.getByRole('button', { name: 'Read reply aloud' }));
    await waitFor(() => expect(mockedSpeak).toHaveBeenCalledTimes(1));
    const source = (mockedSpeak.mock.calls[0][1] as { source: string }).source;

    act(() => {
      listener?.({ state: 'idle', position: 0, duration: 0, source });
      callbacks[0]?.();
    });

    await waitFor(() => expect(mockedSpeak).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('button', { name: 'Stop reading reply' })).toBeTruthy();
  });

  it('clears chat speech when another singleton source supersedes it', async () => {
    let listener: ((snapshot: NarrationSnapshot) => void) | undefined;
    const callbacks: Array<(() => void) | undefined> = [];
    mockedSubscribeNarration.mockImplementation((next) => {
      listener = next;
      return () => undefined;
    });
    mockedSpeak.mockImplementation(async (_text, options) => {
      callbacks.push(options?.onEnd);
    });
    const longText = Array.from({ length: 140 }, (_, index) => `word${index}`).join(' ');
    fetchMock.mockResolvedValue(
      streamResponse(`data: ${JSON.stringify({ choices: [{ delta: { content: longText } }] })}\n\n`),
    );
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain(longText));
    fireEvent.click(screen.getByRole('button', { name: 'Read reply aloud' }));
    await waitFor(() => expect(mockedSpeak).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ source: expect.stringMatching(/^chat:/) }),
    ));
    expect(screen.getByRole('button', { name: 'Stop reading reply' })).toBeTruthy();

    act(() => {
      listener?.({ state: 'playing', position: 0, duration: 2, source: 'page' });
      callbacks[0]?.();
    });

    expect(screen.getByRole('button', { name: 'Read reply aloud' })).toBeTruthy();
    expect(mockedSpeak).toHaveBeenCalledTimes(1);
  });

  it('clears speaking state when speech fails', async () => {
    mockedSpeak.mockRejectedValue(new Error('TTS failed'));
    fetchMock.mockResolvedValue(streamResponse('data: {"choices":[{"delta":{"content":"Short reply."}}]}\n\n'));
    render(<ChatAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio chat/i }));
    fireEvent.click(screen.getByRole('button', { name: portfolioData.suggestedQuestions[0] }));
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Short reply.'));

    fireEvent.click(screen.getByRole('button', { name: 'Read reply aloud' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Read reply aloud' })).toBeTruthy());
  });
});
