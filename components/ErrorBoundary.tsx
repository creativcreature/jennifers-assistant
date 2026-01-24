'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 text-center">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Something went wrong
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Try refreshing the page
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--falcons-red)' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
