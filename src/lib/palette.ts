import type { Palette } from './types';

const PALETTE_HOURS: [number, number, Palette][] = [
  [6, 11, 'dawn'],
  [12, 17, 'day'],
  [18, 21, 'dusk'],
  [22, 5, 'midnight'],
];

export function getPalette(hour: number): Palette {
  for (const [start, end, palette] of PALETTE_HOURS) {
    if (start <= end) {
      if (hour >= start && hour <= end) return palette;
    } else {
      if (hour >= start || hour <= end) return palette;
    }
  }
  return 'day';
}
