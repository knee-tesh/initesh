'use client';

import { Component, type ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: unknown }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prev: { resetKey?: unknown }) {
    if (this.props.resetKey !== prev.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="stitch-card p-6 text-center my-4">
          <p className="text-sm text-ink font-[family-name:var(--font-script)]">Something went wrong while loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-sm text-teal hover:underline"
            aria-label="Reload section"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
