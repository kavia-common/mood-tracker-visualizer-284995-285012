import { Colors } from './colors';

const THEME_KEY = 'mood-tracker:theme';

// PUBLIC_INTERFACE
export function getStoredTheme() {
  /** Retrieve stored theme from localStorage. Returns 'light' | 'dark' | null */
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function storeTheme(theme) {
  /** Persist theme to localStorage */
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function applyTheme(theme) {
  /**
   * Apply theme by setting data-theme and CSS variables to documentElement.
   * Themes: 'light' or 'dark'
   */
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  // Base palette variables
  setCSSVar('--color-primary', Colors.primary);
  setCSSVar('--color-secondary', Colors.secondary);
  setCSSVar('--color-success', Colors.success);
  setCSSVar('--color-error', Colors.error);
  setCSSVar('--color-text', Colors.text);

  if (theme === 'dark') {
    setCSSVar('--color-bg', Colors.gray900);
    setCSSVar('--color-surface', '#0b1220'); // deep blue-black
    setCSSVar('--color-text', '#e5e7eb');
    setCSSVar('--color-muted', Colors.gray500);
    setCSSVar('--shadow-soft', '0 4px 16px rgba(0,0,0,0.5)');
    setCSSVar('--gradient-bg', `linear-gradient(180deg, rgba(37,99,235,0.15), rgba(17,24,39,0.6))`);
    setCSSVar('--focus-ring', `0 0 0 3px rgba(37, 99, 235, 0.5)`);
  } else {
    setCSSVar('--color-bg', Colors.background);
    setCSSVar('--color-surface', Colors.surface);
    setCSSVar('--color-muted', Colors.gray600);
    setCSSVar('--shadow-soft', '0 6px 24px rgba(2,6,23,0.06)');
    setCSSVar('--gradient-bg', `linear-gradient(180deg, rgba(59,130,246,0.08), rgba(249,250,251,1))`); // from blue-500/10 to gray-50
    setCSSVar('--focus-ring', `0 0 0 3px rgba(37, 99, 235, 0.35)`);
  }
}

function setCSSVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

// PUBLIC_INTERFACE
export function initTheme() {
  /**
   * Initialize theme at app start, respecting stored preference or system preference.
   */
  const stored = getStoredTheme();
  const preferred =
    stored ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferred);
  storeTheme(preferred);
  return preferred;
}
