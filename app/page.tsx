'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamic import to avoid SSR issues with chat
const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20 animate-fade-in">
      <div className="text-center">
        <div className="w-24 h-24 relative mx-auto mb-4">
          <Image
            src="/images/falcons/falcons-logo.png"
            alt="Atlanta Falcons"
            width={96}
            height={96}
            className="object-contain animate-pulse-slow"
          />
        </div>
        <p className="text-lg text-secondary">Loading your assistant...</p>
        <p className="text-sm text-muted mt-2">Rise Up!</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-180px)]">
      {/* Hero Banner */}
      <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
        <Image
          src="/images/falcons/julio-catch.webp"
          alt="Julio Jones making a catch"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--bg-primary)]" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
            Hey Jennifer!
          </h1>
          <p className="text-white/90 text-sm drop-shadow">
            Your personal assistant is ready to help
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}
