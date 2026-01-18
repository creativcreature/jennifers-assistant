'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '../ThemeProvider';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDevMode = process.env.NODE_ENV === 'development';

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border-color)] safe-top">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Falcons Logo */}
          <div className="w-12 h-12 relative flex items-center justify-center">
            <Image
              src="/images/falcons/falcons-logo.png"
              alt="Atlanta Falcons"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-primary">
              {isDevMode ? 'X (Test Site)' : "Jennifer's Assistant"}
            </h1>
            <p className="text-xs text-muted">Rise Up</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center rounded-card hover:bg-surface transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:211"
              className="flex items-center gap-2 px-4 py-2 rounded-card hover:bg-surface transition-colors text-secondary hover:text-primary"
            >
              <span className="text-lg">📞</span>
              <span className="text-sm font-medium">Call 211</span>
            </a>
            <a
              href="tel:911"
              className="flex items-center gap-2 px-4 py-2 rounded-card bg-falcons-red text-white hover:bg-falcons-red-dark transition-colors"
            >
              <span className="text-lg">🚨</span>
              <span className="text-sm font-medium">Emergency</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-card hover:bg-surface transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu (Mobile) */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-secondary border-b border-[var(--border-color)] py-2 animate-slide-up">
          <a
            href="tel:911"
            className="flex items-center gap-4 px-5 py-4 text-lg text-primary hover:bg-surface transition-colors"
          >
            <span className="text-2xl">🚨</span>
            <div>
              <div className="font-semibold">Emergency</div>
              <div className="text-sm text-muted">Call 911</div>
            </div>
          </a>
          <a
            href="tel:211"
            className="flex items-center gap-4 px-5 py-4 text-lg text-primary hover:bg-surface transition-colors"
          >
            <span className="text-2xl">📞</span>
            <div>
              <div className="font-semibold">Get Help</div>
              <div className="text-sm text-muted">Call 211 for Resources</div>
            </div>
          </a>
          <div className="divider mx-4 my-2" />
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="flex items-center gap-4 px-5 py-4 text-lg text-primary hover:bg-surface w-full text-left transition-colors"
          >
            <span className="text-2xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <div>
              <div className="font-semibold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
              <div className="text-sm text-muted">Switch appearance</div>
            </div>
          </button>
          <button
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  registrations.forEach(r => r.update());
                });
              }
              setMenuOpen(false);
            }}
            className="flex items-center gap-4 px-5 py-4 text-lg text-secondary hover:text-primary hover:bg-surface w-full text-left transition-colors"
          >
            <span className="text-2xl">🔄</span>
            <div>
              <div className="font-semibold">Refresh App</div>
              <div className="text-sm text-muted">Check for updates</div>
            </div>
          </button>
        </div>
      )}
    </header>
  );
}
