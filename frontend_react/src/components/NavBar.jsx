import { useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, storeTheme } from '../utils/theme';

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Top navigation with app title and theme toggle. Persists 'mood-tracker:theme'. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initial = getStoredTheme() || 'light';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    storeTheme(next);
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner" role="navigation" aria-label="Main">
        <div className="brand" aria-label="Mood Tracker">
          <span className="dot" aria-hidden="true"></span>
          Mood Tracker
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-pressed={theme === 'dark'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
  );
}
