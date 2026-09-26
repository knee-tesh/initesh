import { decodeWav } from '@/lib/wav';
import { wavBytes, type WavOptions } from '../helpers/wav-fixture';

describe('decodeWav', () => {
  it('reports the sample rate and returns the payload after the 44-byte header', () => {
    const { sampleRate, pcm } = decodeWav(wavBytes({ sampleRate: 44100, pcm: [1, 2, 3, 4, 5, 6] }));

    expect(sampleRate).toBe(44100);
    expect(Array.from(pcm)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('reads the sample rate the provider actually sent', () => {
    expect(decodeWav(wavBytes({ sampleRate: 22050, pcm: [0, 0] })).sampleRate).toBe(22050);
  });

  it('rejects a response too short to carry a header', () => {
    expect(() => decodeWav(new Uint8Array(20))).toThrow(/truncated/i);
  });

  it.each([
    ['riff', 'riffId', 'RIFX'],
    ['wave', 'waveId', 'WAVX'],
    ['fmt ', 'fmtId', 'fmtX'],
    ['data', 'dataId', 'datX'],
  ])('rejects audio whose %s chunk id is wrong', (_label, key, replacement) => {
    expect(() => decodeWav(wavBytes({ [key]: replacement } as WavOptions))).toThrow();
  });

  it('rejects a header that declares no sample rate', () => {
    expect(() => decodeWav(wavBytes({ sampleRate: 0, pcm: [1, 2, 3, 4] }))).toThrow();
  });

  it('rejects a payload with an unpaired sample byte', () => {
    expect(() => decodeWav(wavBytes({ pcm: [1, 2, 3] }))).toThrow();
  });

  it.each([
    ['carries more than one channel', { channels: 2, blockAlign: 2, pcm: 16 }],
    ['declares a non-PCM format code', { formatCode: 3, bitsPerSample: 32, blockAlign: 4, pcm: 16 }],
    ['declares samples that are not 16-bit', { bitsPerSample: 8, blockAlign: 1, pcm: 8 }],
    ['declares a block alignment other than two bytes', { blockAlign: 1, pcm: 8 }],
    ['uses a fmt chunk that is not the canonical 16 bytes', { fmtChunkSize: 18, pcm: 8 }],
    ['declares a riff size that does not match the payload', { riffSize: 999, pcm: 8 }],
    ['declares a data size larger than the payload', { dataSize: 999, pcm: 8 }],
    ['declares a data size smaller than the payload', { dataSize: 2, pcm: 8 }],
    ['carries no audio at all', { pcm: 0 }],
  ])('rejects audio that %s', (_label, options) => {
    expect(() => decodeWav(wavBytes(options as WavOptions))).toThrow();
  });
});
