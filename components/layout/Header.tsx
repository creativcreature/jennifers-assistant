'use client';

import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-sm border-b border-falcons-silver/10 safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Falcons Logo */}
          <div className="w-10 h-10 bg-falcons-red rounded-full flex items-center justify-center">
            <span className="text-2xl">🏈</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">
              Jennifer&apos;s Assistant
            </h1>
          </div>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-12 h-12 flex items-center justify-center text-falcons-silver hover:text-white transition-colors"
          aria-label="Menu"
        >
          <svg
            className="w-7 h-7"
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

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-bg-dark border-b border-falcons-silver/10 py-2">
          <a
            href="tel:911"
            className="flex items-center gap-3 px-4 py-3 text-lg text-white hover:bg-falcons-red/10"
          >
            <span className="text-2xl">🚨</span>
            Emergency: Call 911
          </a>
          <a
            href="tel:211"
            className="flex items-center gap-3 px-4 py-3 text-lg text-white hover:bg-falcons-red/10"
          >
            <span className="text-2xl">📞</span>
            Call 211 for Help
          </a>
          <button
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  registrations.forEach(r => r.update());
                });
              }
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 text-lg text-falcons-silver hover:text-white w-full text-left"
          >
            <span className="text-2xl">🔄</span>
            Refresh App
          </button>
        </div>
      )}
    </header>
  );
}
