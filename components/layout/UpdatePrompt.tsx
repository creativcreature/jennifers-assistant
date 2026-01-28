'use client';

import { useState, useEffect } from 'react';

export default function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Force check for updates immediately
    navigator.serviceWorker.ready.then((registration) => {
      // Force update check
      registration.update().catch(() => {});
      
      // Check if there's already a waiting worker
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdate(true);
      }

      // Listen for new service workers
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        }
      });
    });

    // Listen for controller change (happens when new SW takes over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Clear the actions version so they refresh
      localStorage.removeItem('jennifer_actions_version');
      window.location.reload();
    });
    
    // Also check every 30 seconds for updates
    const interval = setInterval(() => {
      navigator.serviceWorker.ready.then((reg) => reg.update().catch(() => {}));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  function handleUpdate() {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  function handleDismiss() {
    setShowUpdate(false);
  }

  if (!showUpdate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Header with icon */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{
            background: 'linear-gradient(135deg, var(--falcons-red) 0%, #1a1a2e 100%)'
          }}
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            Update Available!
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
            A new version of the app is ready. Update now to get the latest features and improvements!
          </p>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleUpdate}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-transform active:scale-[0.98]"
              style={{ backgroundColor: 'var(--falcons-red)' }}
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
