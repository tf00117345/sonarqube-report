import { RATING_COLORS, RATING_LABELS } from './constants';

export function ratingInt(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value)));
}

export function ratingLabel(value: number): string {
  return RATING_LABELS[ratingInt(value)] ?? '?';
}

export function ratingColor(value: number): string {
  return RATING_COLORS[ratingInt(value)] ?? '#9E9E9E';
}
