'use client';

interface QuickActionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export default function QuickActions({ suggestions, onSelect, disabled }: QuickActionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-col gap-3 mt-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="quick-action text-left disabled:opacity-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

// Default suggestions based on context
export function getDefaultSuggestions(): string[] {
  return [
    "Yes, help me prepare what to say",
    "What should I do first today?",
    "Where can I get food nearby?",
    "I need help with something else",
  ];
}

export function getCallPrepSuggestions(): string[] {
  return [
    "I'm ready to call now",
    "What should I say when they answer?",
    "What if they put me on hold?",
    "I'm nervous, can you help?",
  ];
}

export function getFollowUpSuggestions(): string[] {
  return [
    "That worked, what's next?",
    "They asked me to call back later",
    "I couldn't get through",
    "I have a question about what they said",
  ];
}
