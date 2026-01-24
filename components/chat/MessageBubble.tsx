'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

type ContentSegment = { type: 'text'; value: string } | { type: 'phone'; value: string; href: string };

function parseContent(text: string): ContentSegment[] {
  // Match phone patterns like (xxx) xxx-xxxx, xxx-xxx-xxxx, +1-xxx-xxx-xxxx, or 211
  const phoneRegex = /(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b211\b)/g;
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = phoneRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const digits = match[1].replace(/\D/g, '');
    const href = digits === '211' ? 'tel:211' : `tel:+1${digits}`;
    segments.push({ type: 'phone', value: match[1], href });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAssistant = role === 'assistant';

  const segments = parseContent(content);

  return (
    <div
      className={cn(
        'max-w-[90%]',
        isAssistant ? 'self-start' : 'self-end'
      )}
    >
      <div className={isAssistant ? 'message-ai' : 'message-user'}>
        <div className="text-base leading-relaxed whitespace-pre-wrap">
          {segments.map((seg, i) =>
            seg.type === 'phone' ? (
              <a
                key={i}
                href={seg.href}
                className="text-falcons-red underline font-semibold"
              >
                {seg.value}
              </a>
            ) : (
              <React.Fragment key={i}>{seg.value}</React.Fragment>
            )
          )}
        </div>
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
