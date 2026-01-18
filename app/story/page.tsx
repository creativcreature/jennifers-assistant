'use client';

import { useState, useEffect, useRef } from 'react';
import { db, saveIntakeResponse, getIntakeResponses, IntakeResponse } from '@/lib/db';
import { INTAKE_QUESTIONS, CATEGORY_INTROS, getCategoryOrder } from '@/lib/intake-questions';
import Button from '@/components/ui/Button';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  questionId?: string;
}

export default function StoryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [responses, setResponses] = useState<IntakeResponse[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load existing responses on mount
  useEffect(() => {
    async function loadResponses() {
      const existing = await getIntakeResponses();
      setResponses(existing);

      // Find where we left off
      const answeredIds = new Set(existing.map(r => r.id));
      const nextUnanswered = INTAKE_QUESTIONS.findIndex(q => !answeredIds.has(q.id));

      if (nextUnanswered === -1) {
        // All questions answered
        setIsComplete(true);
        setMessages([{
          id: 'complete',
          role: 'assistant',
          content: "You've already shared your story with me. Would you like to send it to your family member, or start over?"
        }]);
      } else {
        setCurrentQuestionIndex(nextUnanswered);
        // Start with welcome or resume message
        const startMessage = nextUnanswered === 0
          ? "Hi Jennifer! 🏈 I'd love to hear your story. This will help us find the best resources for you, and write a letter to the Falcons organization. Take your time - there's no rush.\n\nLet's start with some basics about you."
          : "Welcome back! Let's continue where we left off.";

        setMessages([
          { id: 'welcome', role: 'assistant', content: startMessage },
          { id: `q-${INTAKE_QUESTIONS[nextUnanswered].id}`, role: 'assistant', content: INTAKE_QUESTIONS[nextUnanswered].question, questionId: INTAKE_QUESTIONS[nextUnanswered].id }
        ]);
      }
    }
    loadResponses();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isComplete) return;

    const currentQuestion = INTAKE_QUESTIONS[currentQuestionIndex];
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Save response to database
    await saveIntakeResponse(
      currentQuestion.id,
      currentQuestion.question,
      input.trim(),
      currentQuestion.category
    );

    // Update local responses
    setResponses(prev => [...prev, {
      id: currentQuestion.id,
      question: currentQuestion.question,
      answer: input.trim(),
      category: currentQuestion.category,
      answeredAt: new Date(),
    }]);

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= INTAKE_QUESTIONS.length) {
      // All done!
      setIsComplete(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'done',
          role: 'assistant',
          content: "Thank you so much for sharing your story with me, Jennifer. 🏈❤️\n\nYour story is powerful and I know it will touch hearts. Would you like me to send this to your family member now?"
        }]);
      }, 500);
    } else {
      const nextQuestion = INTAKE_QUESTIONS[nextIndex];
      const currentCategory = currentQuestion.category;
      const nextCategory = nextQuestion.category;

      setTimeout(() => {
        const newMessages: ChatMessage[] = [];

        // Add category intro if changing categories
        if (currentCategory !== nextCategory) {
          newMessages.push({
            id: `intro-${nextCategory}`,
            role: 'assistant',
            content: CATEGORY_INTROS[nextCategory],
          });
        }

        // Add the next question
        newMessages.push({
          id: `q-${nextQuestion.id}`,
          role: 'assistant',
          content: nextQuestion.question,
          questionId: nextQuestion.id,
        });

        setMessages(prev => [...prev, ...newMessages]);
        setCurrentQuestionIndex(nextIndex);
      }, 500);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      });

      if (response.ok) {
        setEmailSent(true);
        setMessages(prev => [...prev, {
          id: 'sent',
          role: 'assistant',
          content: "Done! I've sent your story to your family member. They'll be in touch soon. 🏈\n\nIn the meantime, check out the Actions tab to see what steps you can take today."
        }]);
      } else {
        throw new Error('Failed to send');
      }
    } catch {
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: "I had trouble sending that. Let's try again in a moment, or you can show this to your family member directly."
      }]);
    }
    setIsSending(false);
  };

  const handleStartOver = async () => {
    await db.intakeResponses.clear();
    setResponses([]);
    setCurrentQuestionIndex(0);
    setIsComplete(false);
    setEmailSent(false);
    setMessages([
      { id: 'welcome', role: 'assistant', content: "Let's start fresh! I'd love to hear your story. 🏈\n\n" + CATEGORY_INTROS['basics'] },
      { id: `q-${INTAKE_QUESTIONS[0].id}`, role: 'assistant', content: INTAKE_QUESTIONS[0].question, questionId: INTAKE_QUESTIONS[0].id }
    ]);
  };

  const progress = Math.round((responses.length / INTAKE_QUESTIONS.length) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Progress bar */}
      <div className="px-4 py-3 border-b border-falcons-silver/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-falcons-silver">Your Story</span>
          <span className="text-sm font-semibold text-white">{responses.length} of {INTAKE_QUESTIONS.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[90%] ${message.role === 'assistant' ? 'self-start' : 'self-end ml-auto'}`}
          >
            <div className={message.role === 'assistant' ? 'message-ai' : 'message-user'}>
              <div className="text-base leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {/* Action buttons when complete */}
        {isComplete && !emailSent && (
          <div className="space-y-3 pt-4">
            <Button onClick={handleSendEmail} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send My Story'}
            </Button>
            <Button variant="secondary" onClick={handleStartOver}>
              Start Over
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isComplete && (
        <div className="border-t border-falcons-silver/10 p-4 bg-bg-dark/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              rows={2}
              className="input-field flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-14 h-14 bg-falcons-red rounded-card flex items-center justify-center disabled:opacity-50 transition-opacity self-end"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
