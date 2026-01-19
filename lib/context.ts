// Simple context persistence - remembers things Jennifer mentions across sessions

const CONTEXT_KEY = 'jennifer-context';

export interface UserContext {
  location?: string;           // Where she's staying
  city?: string;               // City/area
  contactedResources?: string[]; // Resources she's already tried
  preferences?: string[];      // Things she prefers or doesn't want
  notes?: string[];            // Other relevant info
  lastUpdated?: number;
}

export function getContext(): UserContext {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(CONTEXT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveContext(context: UserContext): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getContext();
    const merged = {
      ...existing,
      ...context,
      contactedResources: [
        ...new Set([...(existing.contactedResources || []), ...(context.contactedResources || [])])
      ],
      preferences: [
        ...new Set([...(existing.preferences || []), ...(context.preferences || [])])
      ],
      notes: [
        ...new Set([...(existing.notes || []), ...(context.notes || [])])
      ],
      lastUpdated: Date.now(),
    };
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage errors
  }
}

export function updateLocation(location: string, city?: string): void {
  saveContext({ location, city });
}

export function addContactedResource(resource: string): void {
  const ctx = getContext();
  saveContext({
    contactedResources: [...(ctx.contactedResources || []), resource]
  });
}

export function addPreference(pref: string): void {
  const ctx = getContext();
  saveContext({
    preferences: [...(ctx.preferences || []), pref]
  });
}

export function addNote(note: string): void {
  const ctx = getContext();
  saveContext({
    notes: [...(ctx.notes || []), note]
  });
}

export function clearContext(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONTEXT_KEY);
}

// Convert context to a string for the AI prompt
export function contextToPrompt(ctx: UserContext): string {
  const parts: string[] = [];

  if (ctx.location) {
    parts.push(`Location: ${ctx.location}${ctx.city ? ` in ${ctx.city}` : ''}`);
  }

  if (ctx.contactedResources?.length) {
    parts.push(`Already contacted: ${ctx.contactedResources.join(', ')}`);
  }

  if (ctx.preferences?.length) {
    parts.push(`Preferences: ${ctx.preferences.join(', ')}`);
  }

  if (ctx.notes?.length) {
    parts.push(`Notes: ${ctx.notes.join('; ')}`);
  }

  return parts.length > 0
    ? `\n\nWhat you remember about Jennifer:\n${parts.join('\n')}`
    : '';
}
