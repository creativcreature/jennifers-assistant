'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamic import to avoid SSR issues with chat
const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center">
        <div className="w-20 h-20 relative mx-auto mb-4">
          <Image
            src="/images/falcons/falcons-logo.png"
            alt="Atlanta Falcons"
            width={80}
            height={80}
            className="object-contain animate-pulse-slow"
          />
        </div>
        <p className="text-lg text-secondary">Loading your assistant...</p>
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
