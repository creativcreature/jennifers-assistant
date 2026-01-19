import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { STORY_SYSTEM_PROMPT } from '@/lib/story-prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    system: STORY_SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
