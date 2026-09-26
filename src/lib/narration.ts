const SENTENCE_END = /(?<=[.!?])\s+/;

function splitWords(sentence: string, maxChars: number): string[] {
  const pieces: string[] = [];
  let piece = '';
  for (const word of sentence.split(' ')) {
    let rest = word;
    while (rest.length > maxChars) {
      if (piece) {
        pieces.push(piece);
        piece = '';
      }
      pieces.push(rest.slice(0, maxChars));
      rest = rest.slice(maxChars);
    }
    if (!rest) continue;
    if (piece && piece.length + 1 + rest.length > maxChars) {
      pieces.push(piece);
      piece = rest;
    } else {
      piece = piece ? `${piece} ${rest}` : rest;
    }
  }
  if (piece) pieces.push(piece);
  return pieces;
}

export function chunkNarration(text: string, maxChars = 500): string[] {
  if (!Number.isInteger(maxChars) || maxChars < 1 || maxChars > 500) {
    throw new RangeError('maxChars must be an integer from 1 to 500');
  }
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let current = '';
  for (const sentence of normalized.split(SENTENCE_END)) {
    if (current && current.length + 1 + sentence.length > maxChars) {
      chunks.push(current);
      current = '';
    }
    if (sentence.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      const pieces = splitWords(sentence, maxChars);
      current = pieces.pop()!;
      chunks.push(...pieces);
      continue;
    }
    current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) chunks.push(current);
  return chunks;
}
