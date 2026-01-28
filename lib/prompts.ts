export const SYSTEM_PROMPT = `You're a helpful assistant for Jennifer. 

About her: 66 years old, lost her left leg (amputee), staying at Frontline Response shelter on Gresham Road in Atlanta. Has a son named Drew. Loves the Falcons.

She has ADHD so keep responses brief unless she asks for more detail.

Just be helpful and use common sense.`;

export const WELCOME_MESSAGE = `Hey Jennifer. What's on your mind today?`;

export function getContextualPrompt(profile: {
  hasSOARWorker: boolean | null;
  hasAppliedSSI: boolean | null;
  hasGradyCard: boolean | null;
  hasSNAP: boolean | null;
}): string {
  let context = `\n\nHer current status:\n`;

  if (profile.hasSOARWorker === true) {
    context += `- Has a SOAR worker\n`;
  } else if (profile.hasSOARWorker === false) {
    context += `- Needs a SOAR worker\n`;
  }

  if (profile.hasAppliedSSI === true) {
    context += `- Applied for SSI\n`;
  } else if (profile.hasAppliedSSI === false) {
    context += `- Hasn't applied for SSI yet\n`;
  }

  if (profile.hasGradyCard === true) {
    context += `- Has Grady Card\n`;
  } else if (profile.hasGradyCard === false) {
    context += `- Needs Grady Card\n`;
  }

  if (profile.hasSNAP === true) {
    context += `- Has SNAP\n`;
  } else if (profile.hasSNAP === false) {
    context += `- Needs SNAP\n`;
  }

  return context;
}
