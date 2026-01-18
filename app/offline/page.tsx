export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-warning"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      </div>

      <h1 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        You&apos;re Offline
      </h1>

      <p className="text-lg mb-8 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        Some features need internet connection. But you can still:
      </p>

      <div className="space-y-4 w-full max-w-sm text-left">
        <div className="card p-4 flex items-center gap-4">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>View your saved info</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Medications, appointments, contacts
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Make phone calls</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Tap any phone number to call
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>See your actions</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Check your to-do list and scripts
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <a href="tel:211" className="btn-call">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call 211 for Help
        </a>
      </div>
    </div>
  );
}
