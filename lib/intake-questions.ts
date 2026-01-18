export interface IntakeQuestion {
  id: string;
  category: 'basics' | 'situation' | 'health' | 'history' | 'falcons' | 'goals';
  question: string;
  followUp?: string;
  placeholder?: string;
}

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  // Basics
  {
    id: 'full_name',
    category: 'basics',
    question: "Let's start simple - what's your full name?",
    placeholder: "Your full name",
  },
  {
    id: 'birthday',
    category: 'basics',
    question: "When's your birthday? (Just the month and day is fine)",
    placeholder: "Like March 15",
  },
  {
    id: 'where_from',
    category: 'basics',
    question: "Where are you originally from?",
    followUp: "Did you grow up there?",
    placeholder: "City, State",
  },

  // Current Situation
  {
    id: 'current_living',
    category: 'situation',
    question: "Where are you staying right now?",
    followUp: "How long have you been there?",
    placeholder: "Shelter name or location",
  },
  {
    id: 'who_with',
    category: 'situation',
    question: "Is anyone staying with you? Tell me about them.",
    placeholder: "Family, friends...",
  },
  {
    id: 'how_long_homeless',
    category: 'situation',
    question: "How long have you been without stable housing?",
    placeholder: "Weeks, months, years...",
  },
  {
    id: 'what_happened',
    category: 'situation',
    question: "What happened that led to you being in this situation? Take your time - I'm listening.",
    placeholder: "Share as much as you're comfortable with",
  },

  // Health
  {
    id: 'health_conditions',
    category: 'health',
    question: "Tell me about your health. What conditions do you deal with?",
    placeholder: "Any health issues or disabilities",
  },
  {
    id: 'amputation_story',
    category: 'health',
    question: "I know you have a leg amputation. What happened, and how has it changed your life?",
    placeholder: "Your story",
  },
  {
    id: 'current_medical',
    category: 'health',
    question: "Are you getting the medical care you need right now?",
    followUp: "What medical care do you still need?",
    placeholder: "Doctors, medications, etc.",
  },
  {
    id: 'medications',
    category: 'health',
    question: "What medications are you taking? Are you able to get them regularly?",
    placeholder: "List medications",
  },

  // History
  {
    id: 'work_history',
    category: 'history',
    question: "What kind of work did you do before? What were you good at?",
    placeholder: "Jobs, skills, experience",
  },
  {
    id: 'family',
    category: 'history',
    question: "Tell me about your family. Who's important to you?",
    placeholder: "Family members, relationships",
  },
  {
    id: 'proud_of',
    category: 'history',
    question: "What are you most proud of in your life?",
    placeholder: "Accomplishments, memories",
  },

  // Falcons
  {
    id: 'falcons_how_long',
    category: 'falcons',
    question: "How long have you been a Falcons fan? 🏈",
    placeholder: "Years, decades...",
  },
  {
    id: 'falcons_why',
    category: 'falcons',
    question: "What made you fall in love with the Falcons?",
    placeholder: "Your story",
  },
  {
    id: 'falcons_favorite_memory',
    category: 'falcons',
    question: "What's your favorite Falcons memory ever?",
    followUp: "Were you at the game or watching from somewhere special?",
    placeholder: "A game, a moment, a player...",
  },
  {
    id: 'falcons_favorite_player',
    category: 'falcons',
    question: "Who's your all-time favorite Falcons player and why?",
    placeholder: "Player name",
  },
  {
    id: 'falcons_means',
    category: 'falcons',
    question: "What do the Falcons mean to you? How do they help you get through tough times?",
    placeholder: "What they mean to you",
  },
  {
    id: 'falcons_dream',
    category: 'falcons',
    question: "If the Falcons organization could do one thing for you, what would mean the most?",
    placeholder: "Your wish",
  },

  // Goals
  {
    id: 'immediate_needs',
    category: 'goals',
    question: "What do you need most right now, today?",
    placeholder: "Most urgent needs",
  },
  {
    id: 'three_months',
    category: 'goals',
    question: "Where do you hope to be in 3 months?",
    placeholder: "Your goals",
  },
  {
    id: 'stable_looks_like',
    category: 'goals',
    question: "What does a stable, good life look like for you?",
    placeholder: "Your vision",
  },
  {
    id: 'message_to_helpers',
    category: 'goals',
    question: "If someone wanted to help you, what would you want them to know about you?",
    placeholder: "Your message",
  },
];

export const CATEGORY_INTROS: Record<string, string> = {
  basics: "Let's start with some basics about you.",
  situation: "Now I'd like to understand your current situation better.",
  health: "Let's talk about your health so we can make sure you get the right care.",
  history: "Tell me a bit about your life story.",
  falcons: "Now for the fun part - let's talk about the Falcons! 🏈",
  goals: "Finally, let's talk about where you want to go from here.",
};

export function getQuestionsByCategory(category: string): IntakeQuestion[] {
  return INTAKE_QUESTIONS.filter(q => q.category === category);
}

export function getCategoryOrder(): string[] {
  return ['basics', 'situation', 'health', 'history', 'falcons', 'goals'];
}
