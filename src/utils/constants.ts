/** Color palette and constants matching bitegarden report style. */

export const COLOR_HEADER_TITLE = '#1B2A4A';
export const COLOR_GOLD_LINE = '#C8A951';
export const COLOR_LIGHT_GRAY = '#F5F5F5';
export const COLOR_MEDIUM_GRAY = '#E0E0E0';
export const COLOR_BORDER = '#E0E0E0';
export const COLOR_TEXT_PRIMARY = '#212121';
export const COLOR_TEXT_SECONDARY = '#757575';
export const COLOR_PASS = '#4CAF50';
export const COLOR_FAIL = '#F44336';
export const COLOR_HEADER_BG = '#1565C0';
export const COLOR_TOTAL_NONZERO_BG = '#FCE4EC';

export const RATING_COLORS: Record<number, string> = {
  1: '#4CAF50', // A - green
  2: '#8BC34A', // B - light green
  3: '#FF9800', // C - orange
  4: '#FF5722', // D - red-orange
  5: '#D32F2F', // E - dark red
};

export const RATING_LABELS: Record<number, string> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
};

export const SEVERITY_COLORS: Record<string, string> = {
  BLOCKER: '#D32F2F',
  CRITICAL: '#F44336',
  MAJOR: '#FF9800',
  MINOR: '#4CAF50',
  INFO: '#2196F3',
};

export const SEVERITY_ORDER = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'] as const;

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  BUG: 'Bugs',
  VULNERABILITY: 'Vulnerabilities',
  CODE_SMELL: 'Code Smells',
};

export const SIZE_THRESHOLDS: [number, string][] = [
  [1_000, 'XS'],
  [10_000, 'S'],
  [100_000, 'M'],
  [500_000, 'L'],
];
export const SIZE_DEFAULT = 'XL';

export const SIZE_COLORS: Record<string, string> = {
  XS: '#4CAF50',
  S: '#8BC34A',
  M: '#FF9800',
  L: '#FF5722',
  XL: '#D32F2F',
};

export const COLOR_COVERAGE_RED = '#F44336';
export const COLOR_COVERAGE_ORANGE = '#FF9800';
export const COLOR_COVERAGE_GREEN = '#4CAF50';
export const COLOR_DUPLICATION = '#FF9800';
