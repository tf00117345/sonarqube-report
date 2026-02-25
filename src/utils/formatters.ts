import {
  SIZE_THRESHOLDS,
  SIZE_DEFAULT,
  COLOR_COVERAGE_RED,
  COLOR_COVERAGE_ORANGE,
  COLOR_COVERAGE_GREEN,
} from './constants';

export function fmtNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function safePct(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function sizeRating(ncloc: number): string {
  for (const [threshold, label] of SIZE_THRESHOLDS) {
    if (ncloc < threshold) return label;
  }
  return SIZE_DEFAULT;
}

export function debtToStr(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours < 8) {
    return remaining ? `${hours}h ${remaining}min` : `${hours}h`;
  }
  const days = Math.floor(hours / 8);
  const remainingHours = hours % 8;
  if (remainingHours) return `${days}d ${remainingHours}h`;
  return `${days}d`;
}

export function coverageColor(pct: number): string {
  if (pct < 50) return COLOR_COVERAGE_RED;
  if (pct < 80) return COLOR_COVERAGE_ORANGE;
  return COLOR_COVERAGE_GREEN;
}

export function formatDate(isoStr: string | null): string {
  if (!isoStr) return 'N/A';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoStr;
  }
}
