'use client';

import { useChat, Message } from 'ai/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getContext, contextToPrompt, saveContext, UserContext } from '@/lib/context';
import { addMessage, getRecentMessages } from '@/lib/db';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hey Jennifer. What's on your mind today?`,
};

export default function ChatInterface() {
  const isOnline = useOnlineStatus();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [model, setModel] = useState<'gemini' | 'claude'>('gemini');
  const [userContext, setUserContext] = useState('');
  const [initialMessages, setInitialMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isReady, setIsReady] = useState(false);
  const lastSavedRef = useRef<number>(0);

  // Load saved model preference and messages on mount
  useEffect(() => {
    const savedModel = localStorage.getItem('chat-model');
    if (savedModel === 'gemini' || savedModel === 'claude') {
      setModel(savedModel);
    }

    const ctx = getContext();
    setUserContext(contextToPrompt(ctx));

    // Load persisted messages from Dexie
    getRecentMessages(50).then((saved) => {
      if (saved.length > 0) {
        const restored: Message[] = saved.map((m, i) => ({
          id: `db-${m.id || i}`,
          role: m.role,
          content: m.content,
        }));
        setInitialMessages([WELCOME_MESSAGE, ...restored]);
        lastSavedRef.current = saved.length;
      }
      setIsReady(true);
    }).catch(() => {
      setIsReady(true);
    });
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { model, userContext },
    initialMessages,
  });

  // Persist new messages to Dexie
  useEffect(() => {
    if (!isReady) return;
    // Only persist messages beyond what we already saved
    const newMessages = messages.filter(m => m.id !== 'welcome' && !m.id.startsWith('db-'));
    if (newMessages.length > lastSavedRef.current) {
      const unsaved = newMessages.slice(lastSavedRef.current);
      unsaved.forEach(m => {
        if (m.role === 'user' || (m.role === 'assistant' && !isLoading)) {
          addMessage(m.role, m.content);
        }
      });
      if (!isLoading) {
        lastSavedRef.current = newMessages.length;
      }
    }
  }, [messages, isLoading, isReady]);

  // Save model preference
  const handleModelChange = useCallback((newModel: 'gemini' | 'claude') => {
    setModel(newModel);
    localStorage.setItem('chat-model', newModel);
  }, []);

  // Clear chat
  const handleClearChat = useCallback(async () => {
    setMessages([WELCOME_MESSAGE]);
    lastSavedRef.current = 0;
    // Clear from Dexie
    const { db } = await import('@/lib/db');
    await db.messages.clear();
  }, [setMessages]);

  // Extract and save context from user messages
  useEffect(() => {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMsg) return;

    const text = lastUserMsg.content.toLowerCase();
    const updates: UserContext = {};

    const locationPatterns = [
      /(?:i'm at|im at|staying at|i am at|live at|i'm in|im in|i am in)\s+([^,.!?]+)/i,
      /(?:at the|at a)\s+([^,.!?]+(?:shelter|center|mission|church))/i,
    ];
    for (const pattern of locationPatterns) {
      const match = lastUserMsg.content.match(pattern);
      if (match) {
        updates.location = match[1].trim();
        break;
      }
    }

    const cityPatterns = [
      /(?:in|near|around)\s+(atlanta|decatur|marietta|sandy springs|east point|college park)/i,
    ];
    for (const pattern of cityPatterns) {
      const match = lastUserMsg.content.match(pattern);
      if (match) {
        updates.city = match[1].trim();
        break;
      }
    }

    if (text.includes('already called') || text.includes('already tried') || text.includes('already contacted')) {
      const resourceMatch = lastUserMsg.content.match(/(?:called|tried|contacted)\s+([^,.!?]+)/i);
      if (resourceMatch) {
        updates.contactedResources = [resourceMatch[1].trim()];
      }
    }

    if (text.includes("don't want to") || text.includes("dont want to") || text.includes("prefer not")) {
      const prefMatch = lastUserMsg.content.match(/(?:don't want to|dont want to|prefer not to)\s+([^,.!?]+)/i);
      if (prefMatch) {
        updates.preferences = [`doesn't want to ${prefMatch[1].trim()}`];
      }
    }

    if (Object.keys(updates).length > 0) {
      saveContext(updates);
      const ctx = getContext();
      setUserContext(contextToPrompt(ctx));
    }
  }, [messages]);

  // Auto-scroll to bottom only after user has interacted
  useEffect(() => {
    if (hasInteracted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasInteracted]);

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setHasInteracted(true);
    handleSubmit(e);
  };

  if (!isReady) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <div className="w-6 h-6 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Messages Area */}
      <div className="flex-1 px-4 py-4 space-y-4">
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

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="sticky bottom-20 border-t border-[var(--border-color)] p-4 glass">
        {!isOnline && (
          <div className="mb-3 p-4 rounded-card bg-warning/10 border border-warning/30 text-center">
            <span className="text-warning font-medium">You&apos;re offline</span>
            <span className="text-secondary block text-sm mt-1">Chat will work when you reconnect</span>
          </div>
        )}

        {/* Model Toggle + Clear Chat */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handleClearChat}
            className="text-xs px-3 py-1 rounded-full transition-all"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
          >
            Clear Chat
          </button>
          <div className="flex rounded-full p-0.5" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <button
              type="button"
              onClick={() => handleModelChange('gemini')}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                model === 'gemini' ? 'bg-falcons-red text-white' : 'text-secondary'
              }`}
            >
              Gemini
            </button>
            <button
              type="button"
              onClick={() => handleModelChange('claude')}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                model === 'claude' ? 'bg-falcons-red text-white' : 'text-secondary'
              }`}
            >
              Claude
            </button>
          </div>
        </div>

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
