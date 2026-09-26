const ascii = (text: string): Uint8Array<ArrayBuffer> => Uint8Array.from(text, (char) => char.charCodeAt(0));

export interface WavOptions {
  riffId?: string;
  waveId?: string;
  fmtId?: string;
  dataId?: string;
  riffSize?: number;
  fmtChunkSize?: number;
  dataSize?: number;
  formatCode?: number;
  channels?: number;
  sampleRate?: number;
  blockAlign?: number;
  bitsPerSample?: number;
  pcm?: number[] | number;
}

export function wavBytes(options: WavOptions = {}): Uint8Array<ArrayBuffer> {
  const {
    riffId = 'RIFF',
    waveId = 'WAVE',
    fmtId = 'fmt ',
    dataId = 'data',
    riffSize,
    fmtChunkSize = 16,
    dataSize,
    formatCode = 1,
    channels = 1,
    sampleRate = 44100,
    blockAlign = (channels * 16) / 8,
    bitsPerSample = 16,
    pcm = 8,
  } = options;
  const pcmLength = typeof pcm === 'number' ? pcm : pcm.length;

  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  header.set(ascii(riffId), 0);
  view.setUint32(4, riffSize ?? 36 + pcmLength, true);
  header.set(ascii(waveId), 8);
  header.set(ascii(fmtId), 12);
  view.setUint32(16, fmtChunkSize, true);
  view.setUint16(20, formatCode, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  header.set(ascii(dataId), 36);
  view.setUint32(40, dataSize ?? pcmLength, true);

  const bytes = new Uint8Array(44 + pcmLength);
  bytes.set(header, 0);
  if (typeof pcm === 'number') bytes.fill(0, 44);
  else bytes.set(pcm, 44);
  return bytes;
}
