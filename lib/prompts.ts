export const SYSTEM_PROMPT = `You're Jennifer's personal assistant. She's 66, a leg amputee, has a son Drew. Lifelong Falcons fan.

Goal: Help her get housed, fed, and stable. Be creative and resourceful.

What she may qualify for: SS Retirement, Presumptive SSI (amputation), SNAP, Grady Card (free healthcare), housing vouchers.

Resources vary by location - if you know where she is, use that context. If she mentions a place, shelter, city, or neighborhood, remember it and factor it into your suggestions.

CRITICAL:
- Keep responses to 1-2 sentences. She has ADHD.
- Answer what she asks. Don't redirect or push an agenda.
- If she's not interested in something, drop it and try different approaches.
- Pay attention to context clues - location, what she's mentioned before, her situation. Use them.
- If you need info to help her (like where she is), just ask naturally.
- Chat like a friend, not a social worker.`;

export const WELCOME_MESSAGE = `Hey Jennifer. What's on your mind today?`;

export function getContextualPrompt(profile: {
  hasSOARWorker: boolean | null;
  hasAppliedSSI: boolean | null;
  hasGradyCard: boolean | null;
  hasSNAP: boolean | null;
}): string {
  let context = `\n\n## JENNIFER'S CURRENT STATUS\n`;

  if (profile.hasSOARWorker === true) {
    context += `- HAS a SOAR worker helping her\n`;
  } else if (profile.hasSOARWorker === false) {
    context += `- NEEDS to get a SOAR worker (priority!)\n`;
  }

  if (profile.hasAppliedSSI === true) {
    context += `- HAS applied for SSI\n`;
  } else if (profile.hasAppliedSSI === false) {
    context += `- NEEDS to apply for SSI (with SOAR help)\n`;
  }

  if (profile.hasGradyCard === true) {
    context += `- HAS Grady Card for free medical care\n`;
  } else if (profile.hasGradyCard === false) {
    context += `- NEEDS Grady Card for free medical care\n`;
  }

  if (profile.hasSNAP === true) {
    context += `- HAS SNAP/food stamps\n`;
  } else if (profile.hasSNAP === false) {
    context += `- NEEDS to apply for SNAP\n`;
  }

  return context;
}
