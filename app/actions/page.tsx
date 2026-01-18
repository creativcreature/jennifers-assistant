'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const ActionList = dynamic(() => import('@/components/actions/ActionList'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12 animate-fade-in">
      <div className="text-secondary">Loading your actions...</div>
    </div>
  ),
});

export default function ActionsPage() {
  return (
    <div className="pb-4">
      {/* Hero Section */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/images/falcons/bijan-robinson.jpeg"
          alt="Bijan Robinson running"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
            Your Game Plan
          </h1>
          <p className="text-white/90 text-sm drop-shadow">
            Step-by-step guide to getting your benefits
          </p>
        </div>
      </div>

      <ActionList />
    </div>
  );
}
