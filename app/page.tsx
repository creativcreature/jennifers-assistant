'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with chat
const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-falcons-red rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl">🏈</span>
        </div>
        <p className="text-lg text-falcons-silver">Loading your assistant...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-[calc(100vh-140px)]">
      <ChatInterface />
    </div>
  );
}
