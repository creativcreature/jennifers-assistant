'use client';

import dynamic from 'next/dynamic';

const ActionList = dynamic(() => import('@/components/actions/ActionList'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-falcons-silver">Loading your actions...</div>
    </div>
  ),
});

export default function ActionsPage() {
  return (
    <div className="py-4">
      <div className="px-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Your Actions</h1>
        <p className="text-sm text-falcons-silver mt-1">
          Step-by-step guide to getting your benefits
        </p>
      </div>

      <ActionList />
    </div>
  );
}
