/**
 * JS mirror of theme.css color tokens.
 * Use for Chart.js configs, inline styles, and toast styling.
 */

export const primary = {
  50: '#ecfdf9',
  100: '#d0fbf0',
  200: '#a3f5e1',
  300: '#65edd0',
  400: '#43ddc8',
  500: '#33c9b4',
  DEFAULT: '#43ddc8',
  600: '#28a894',
  700: '#1e8575',
};

export const neutral = {
  50: '#FDFDFD',
  100: '#F5F5F5',
  200: '#E9E9E9',
  300: '#DCDCDC',
  400: '#CACACA',
  500: '#636363',
  600: '#4D4D4D',
  700: '#3A3A3A',
  800: '#191919',
  900: '#000000',
};

export const success = {
  50: '#ecfdf5',
  100: '#d1fae5',
  DEFAULT: '#10b981',
  700: '#047857',
};

export const error = {
  50: '#fef2f2',
  DEFAULT: '#ef4444',
  700: '#b91c1c',
};

export const warning = {
  50: '#fff7ed',
  DEFAULT: '#F57037',
  600: '#F93535',
  accent: '#D32020',
};

export const info = {
  50: '#eff6ff',
  100: '#dbeafe',
  DEFAULT: '#1E5FCB',
};

export const chart = {
  orange: '#F57037',
  amber: '#F5A623',
  teal: '#36B37E',
  sky: '#00B8D9',
  sage: '#8DB38B',
  muted: '#C4B5A0',
  grid: '#e5e7eb',
  tick: '#6b7280',
};

/** Ready-made palette array for Chart.js datasets */
export const chartPalette = [
  chart.orange,
  chart.amber,
  chart.teal,
  chart.sky,
  chart.sage,
  chart.muted,
];
