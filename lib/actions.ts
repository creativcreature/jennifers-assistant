import { Action } from './db';

export const PRIORITY_ACTIONS: Action[] = [
  {
    id: 'soar-worker',
    priority: 1,
    title: 'Call 211 for a SOAR Worker',
    description: 'A SOAR worker is a trained specialist who helps people with disabilities get SSI approved faster. This is the most important first step.',
    phone: '211',
    script: `"Hi, my name is Jennifer. I'm 66 years old and I have a leg amputation. I'm currently staying at Frontline Response shelter.

I need help getting SSI benefits and I heard about SOAR workers who can help with this. Can you connect me with a SOAR program in Atlanta?"

If they ask questions:
- Yes, I have my ID, SSN card, and birth certificate
- I've been disabled for about 2 years
- I'm currently homeless but in a shelter`,
    bringList: ['ID', 'SSN Card', 'Birth Certificate'],
    status: 'pending',
  },
  {
    id: 'grady-card',
    priority: 2,
    title: 'Get a Grady Card',
    description: 'A Grady Card gives you free or low-cost medical care at Grady Hospital. Essential for your health needs.',
    phone: '4046161000',
    script: `"Hi, I'd like to apply for a Grady Card for free medical services.

I'm 66 years old, I'm homeless, and I have a leg amputation. I'm staying at Frontline Response shelter.

What do I need to bring to apply?"

Usually you'll need:
- Photo ID
- Proof of income (or statement that you have no income)
- Proof of address (shelter letter)`,
    bringList: ['Photo ID', 'Proof of address (shelter letter)', 'Proof of income or statement of no income'],
    status: 'pending',
  },
  {
    id: 'presumptive-ssi',
    priority: 3,
    title: 'Ask About Presumptive SSI',
    description: 'Because you have a leg amputation, you may qualify for immediate SSI payments while your full application is processed.',
    phone: '18007721213',
    script: `"Hi, my name is Jennifer. I'm calling to ask about Presumptive SSI.

I'm 66 years old and I had a leg amputation about 2 years ago. I'm currently homeless.

I heard that people with amputations can get emergency SSI payments right away while their application is being reviewed. Is that right? How do I apply for that?"`,
    bringList: ['SSN', 'ID', 'Medical records if available'],
    status: 'pending',
  },
  {
    id: 'snap-application',
    priority: 4,
    title: 'Apply for SNAP (Food Stamps)',
    description: 'SNAP provides money for food. You may qualify for expedited (fast) processing because you\'re homeless.',
    phone: undefined,
    script: `Go to: gateway.ga.gov or call 877-423-4746

When applying, mention:
- You're homeless (expedited processing)
- You have no income
- You're 66 years old
- You have a disability

They should process it within 7 days for expedited cases.`,
    bringList: ['ID', 'SSN Card', 'Shelter address for mail'],
    status: 'pending',
  },
  {
    id: 'mercy-care',
    priority: 5,
    title: 'Contact Mercy Care',
    description: 'Mercy Care provides free healthcare and has people who can help navigate benefits. Good backup for SOAR help.',
    phone: '6788438600',
    script: `"Hi, I'd like to become a patient at Mercy Care.

I'm 66 years old, homeless, and I have a leg amputation. I don't have insurance.

I also need help applying for SSI and Medicaid. Do you have case managers or navigators who can help with that?"`,
    bringList: ['ID', 'Any medical records you have'],
    status: 'pending',
  },
  {
    id: 'coordinated-entry',
    priority: 6,
    title: 'Enter Coordinated Entry',
    description: 'Coordinated Entry is the system for getting housing vouchers. You need to be in this system to get permanent housing.',
    phone: '211',
    script: `"Hi, I need to enter Coordinated Entry for housing.

I'm 66 years old, I have a leg amputation, and I'm currently homeless staying at Frontline Response shelter.

How do I get assessed for housing assistance?"

They will schedule a VI-SPDAT assessment - this determines your priority for housing.`,
    bringList: ['ID', 'Information about how long you\'ve been homeless'],
    status: 'pending',
  },
  {
    id: 'ss-retirement',
    priority: 7,
    title: 'Check on SS Retirement',
    description: 'At 66, you may already qualify for Social Security retirement benefits, separate from disability.',
    phone: '18007721213',
    script: `"Hi, I'm calling to check if I qualify for Social Security retirement benefits.

I'm 66 years old. I want to know:
- Do I have enough work credits for retirement benefits?
- If yes, how much would I get?
- Can I apply for retirement while also applying for disability?"`,
    bringList: ['SSN', 'ID'],
    status: 'pending',
  },
  {
    id: 'section-8',
    priority: 8,
    title: 'Look into Section 8 Housing',
    description: 'Section 8 vouchers help pay rent. Waitlists are long but worth getting on.',
    phone: undefined,
    script: `Call Atlanta Housing: 404-817-7477

Ask: "Is the Section 8 waitlist open? How do I apply?"

Note: Waitlists are often closed but check periodically. Also ask about:
- Project-based vouchers (no waitlist)
- Special homeless programs
- Senior housing options`,
    bringList: ['ID', 'SSN', 'Proof of income'],
    status: 'pending',
  },
  {
    id: 'follow-up',
    priority: 9,
    title: 'Follow Up on Applications',
    description: 'Check on the status of any applications you\'ve submitted.',
    phone: undefined,
    script: `When calling to follow up, say:

"Hi, I'm calling to check on the status of my application.

My name is Jennifer [Last Name].
My case number is [if you have one].
I applied on [date if you remember]."

Write down:
- Who you spoke with
- What they said
- Any next steps
- When to call back`,
    bringList: ['Any case numbers or reference numbers'],
    status: 'pending',
  },
];

export function getActionById(id: string): Action | undefined {
  return PRIORITY_ACTIONS.find(a => a.id === id);
}

export function getNextAction(actions: Action[]): Action | undefined {
  return actions
    .filter(a => a.status === 'pending')
    .sort((a, b) => a.priority - b.priority)[0];
}
