const HEADER_BYTES = 44;
const PCM_SAMPLE_BYTES = 2;

export interface WavAudio {
  sampleRate: number;
  pcm: Uint8Array;
}

export function decodeWav(bytes: Uint8Array): WavAudio {
  if (bytes.byteLength < HEADER_BYTES) throw new Error('Truncated audio response');
  const view = new DataView(bytes.buffer, bytes.byteOffset, HEADER_BYTES);
  const chunkId = (offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
  const pcm = bytes.subarray(HEADER_BYTES);

  if (
    chunkId(0) !== 'RIFF' ||
    chunkId(8) !== 'WAVE' ||
    chunkId(12) !== 'fmt ' ||
    chunkId(36) !== 'data' ||
    view.getUint32(16, true) !== 16 ||
    view.getUint16(20, true) !== 1 ||
    view.getUint16(22, true) !== 1 ||
    view.getUint16(32, true) !== PCM_SAMPLE_BYTES ||
    view.getUint16(34, true) !== 16
  ) {
    throw new Error('Unexpected audio format');
  }

  if (
    pcm.byteLength === 0 ||
    pcm.byteLength % PCM_SAMPLE_BYTES !== 0 ||
    view.getUint32(40, true) !== pcm.byteLength ||
    view.getUint32(4, true) !== 36 + pcm.byteLength
  ) {
    throw new Error('Unexpected audio size');
  }

  const sampleRate = view.getUint32(24, true);
  if (sampleRate <= 0) throw new Error('Unexpected sample rate');
  return { sampleRate, pcm };
}
