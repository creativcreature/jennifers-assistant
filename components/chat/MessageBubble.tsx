'use client';

import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAssistant = role === 'assistant';

  // Parse phone numbers and make them clickable
  const renderContent = (text: string) => {
    // Match phone patterns like (xxx) xxx-xxxx, xxx-xxx-xxxx, or just xxx-xxxx
    const phoneRegex = /(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b211\b)/g;

    // Match markdown-style links [text](tel:xxx)
    const linkRegex = /\[([^\]]+)\]\((tel:[^)]+)\)/g;

    // First replace markdown links
    let processed = text.replace(linkRegex, (_, linkText, href) => {
      return `<a href="${href}" class="text-falcons-red underline font-semibold">${linkText}</a>`;
    });

    // Then replace plain phone numbers (that aren't already in links)
    processed = processed.replace(phoneRegex, (match) => {
      if (processed.includes(`>${match}<`)) return match; // Already in a link
      const digits = match.replace(/\D/g, '');
      const href = digits === '211' ? 'tel:211' : `tel:+1${digits}`;
      return `<a href="${href}" class="text-falcons-red underline font-semibold">${match}</a>`;
    });

    return processed;
  };

  return (
    <div
      className={cn(
        'max-w-[90%]',
        isAssistant ? 'self-start' : 'self-end'
      )}
    >
      <div className={isAssistant ? 'message-ai' : 'message-user'}>
        <div
          className="text-base leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        />
      </div>
      <div
        className={cn(
          'text-xs mt-1',
          isAssistant ? 'text-left' : 'text-right'
        )}
        style={{ color: 'var(--text-muted)' }}
      >
        {isAssistant ? 'Jennifer\'s Assistant' : 'You'}
      </div>
    </div>
  );
}
