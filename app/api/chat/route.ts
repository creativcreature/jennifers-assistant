import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { searchResources, getResourcesByType, formatResource, Resource } from '@/lib/resources-db';

export const maxDuration = 30;

// Check which API keys are available
const AVAILABLE_PROVIDERS = {
  claude: !!process.env.ANTHROPIC_API_KEY,
  gemini: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  groq: !!process.env.GROQ_API_KEY,
  ollama: process.env.NODE_ENV === 'development', // Only available locally
};

// Ollama provider (local development only)
const ollamaProvider = createOpenAI({
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/v1',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(choice: string): any {
  // If requested model is available, use it
  if (choice === 'claude' && AVAILABLE_PROVIDERS.claude) {
    return anthropic('claude-sonnet-4-20250514');
  }
  if (choice === 'gemini' && AVAILABLE_PROVIDERS.gemini) {
    return google('gemini-2.0-flash-001');
  }
  if (choice === 'groq' && AVAILABLE_PROVIDERS.groq) {
    return groq('llama-3.3-70b-versatile');
  }
  if (choice === 'ollama' && AVAILABLE_PROVIDERS.ollama) {
    return ollamaProvider('llama3.2');
  }

  // Fallback: use the first available provider
  if (AVAILABLE_PROVIDERS.claude) return anthropic('claude-sonnet-4-20250514');
  if (AVAILABLE_PROVIDERS.groq) return groq('llama-3.3-70b-versatile');
  if (AVAILABLE_PROVIDERS.gemini) return google('gemini-2.0-flash-001');
  if (AVAILABLE_PROVIDERS.ollama) return ollamaProvider('llama3.2');

  throw new Error('No AI provider configured. Please add an API key.');
}

export async function POST(req: Request) {
  try {
    const { messages, model: modelChoice, userContext, location } = await req.json();

    const model = getModel(modelChoice || 'claude');

    // Build system prompt with context
    let systemPrompt = SYSTEM_PROMPT;

    // Add user context if available
    if (userContext) {
      systemPrompt += userContext;
    }

    // Add GPS location if available
    if (location?.lat && location?.lng) {
      systemPrompt += `\n\nJennifer's current GPS coordinates: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)} (Atlanta, GA area). Use these when suggesting nearby resources, giving directions, or finding locations.`;
    }

    systemPrompt += `\n\nYou have tools to search for specific Atlanta resources. USE THEM when you need specific info like addresses, phone numbers, or hours. Don't give generic answers - search for real data.`;

    const result = streamText({
      model,
      system: systemPrompt,
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
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Endpoint to check available providers
export async function GET() {
  return Response.json({
    providers: AVAILABLE_PROVIDERS,
    default: AVAILABLE_PROVIDERS.claude ? 'claude' : AVAILABLE_PROVIDERS.groq ? 'groq' : 'gemini',
  });
}
