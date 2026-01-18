'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import QuickActions, { getDefaultSuggestions } from './QuickActions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getGreeting } from '@/lib/utils';

export default function ChatInterface() {
  const isOnline = useOnlineStatus();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `${getGreeting()}, Jennifer! 🏈

I'm here to help you with benefits, housing, food, and whatever you need today.

Your most important next step is calling 211 to get connected with a SOAR worker. They're experts who help people get SSI approved faster.

Would you like help preparing what to say when you call?`,
      },
    ],
    onFinish: () => {
      setShowSuggestions(true);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle quick action selection
  const handleQuickAction = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    // Submit after a brief delay
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setShowSuggestions(false);
    handleSubmit(e);
  };

  // Get suggestions based on last message
  const getSuggestions = (): string[] => {
    if (!showSuggestions || isLoading) return [];
    return getDefaultSuggestions();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MessageBubble
              role={message.role as 'user' | 'assistant'}
              content={message.content}
            />
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="self-start max-w-[90%] animate-fade-in">
            <div className="message-ai">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-falcons-red rounded-full animate-bounce" />
                <div
                  className="w-2.5 h-2.5 bg-falcons-red rounded-full animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <div
                  className="w-2.5 h-2.5 bg-falcons-red rounded-full animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isLoading && messages.length > 0 && (
          <QuickActions
            suggestions={getSuggestions()}
            onSelect={handleQuickAction}
            disabled={isLoading}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[var(--border-color)] p-4 glass">
        {!isOnline && (
          <div className="mb-3 p-4 rounded-card bg-warning/10 border border-warning/30 text-center">
            <span className="text-warning font-medium">You&apos;re offline</span>
            <span className="text-secondary block text-sm mt-1">Chat will work when you reconnect</span>
          </div>
        )}

        <form id="chat-form" onSubmit={onSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={!isOnline || isLoading}
            rows={1}
            className="input-field flex-1 resize-none"
            style={{ minHeight: '56px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = document.getElementById('chat-form') as HTMLFormElement;
                if (form) form.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !isOnline}
            className="w-14 h-14 rounded-card flex items-center justify-center disabled:opacity-50 transition-all duration-200 hover:shadow-glow-sm active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)',
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
