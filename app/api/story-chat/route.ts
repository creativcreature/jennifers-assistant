import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { STORY_SYSTEM_PROMPT } from '@/lib/story-prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: STORY_SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
