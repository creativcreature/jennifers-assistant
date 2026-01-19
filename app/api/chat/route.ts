import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { searchResources, getResourcesByType, formatResource, Resource } from '@/lib/resources-db';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model: modelChoice, userContext } = await req.json();

  const model = modelChoice === 'claude'
    ? anthropic('claude-sonnet-4-20250514')
    : google('gemini-2.0-flash-001');

  // Add user context to system prompt if available
  const systemPrompt = userContext
    ? `${SYSTEM_PROMPT}${userContext}`
    : SYSTEM_PROMPT;

  const result = streamText({
    model,
    system: systemPrompt + `

You have tools to search for specific Atlanta resources. USE THEM when you need specific info like addresses, phone numbers, or hours. Don't give generic answers - search for real data.`,
    messages,
    tools: {
      searchResources: tool({
        description: 'Search for Atlanta resources by keyword. Use this to find specific places, services, phone numbers, addresses, and hours.',
        parameters: z.object({
          query: z.string().describe('Search term like "food", "shelter", "healthcare", "Grady", "211", etc.'),
          type: z.enum(['food', 'shelter', 'healthcare', 'benefits', 'transportation', 'other']).optional().describe('Filter by resource type'),
        }),
        execute: async ({ query, type }) => {
          const results = searchResources(query, type as Resource['type']);
          if (results.length === 0) {
            return 'No resources found for that search.';
          }
          return results.slice(0, 5).map(formatResource).join('\n\n---\n\n');
        },
      }),
      getResourcesByCategory: tool({
        description: 'Get all resources of a specific type (food, shelter, healthcare, benefits, transportation)',
        parameters: z.object({
          category: z.enum(['food', 'shelter', 'healthcare', 'benefits', 'transportation', 'other']).describe('The category of resources to get'),
        }),
        execute: async ({ category }) => {
          const results = getResourcesByType(category as Resource['type']);
          return results.slice(0, 5).map(formatResource).join('\n\n---\n\n');
        },
      }),
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
