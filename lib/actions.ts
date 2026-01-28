import { Action } from './db';

export const PRIORITY_ACTIONS: Action[] = [
  {
    id: 'soar-worker',
    priority: 1,
    title: 'Call 211 — Get a SOAR Worker',
    description: 'This is the most important call. A SOAR worker will help you get SSI benefits faster because of your leg.',
    phone: '211',
    script: `"Hi, my name is Jennifer. I'm homeless and I'm an amputee — I lost my left leg. I need help getting connected to a SOAR worker to apply for SSI. I'm staying at Frontline Response."

If they ask questions:
- Yes, I have my ID, SSN card, and birth certificate
- I've been disabled for about 2 years
- I'm currently at Frontline Response shelter`,
    bringList: ['ID', 'SSN Card', 'Birth Certificate'],
    status: 'pending',
  },
  {
    id: 'ga-disability-advocacy',
    priority: 2,
    title: 'Call GA Disability Advocacy',
    description: 'FREE legal help to speed up your SSI claim. They can expedite your disability application.',
    phone: '18008229727',
    script: `"Hi, I need help with my SSI disability application.

I'm 66 years old and I'm an amputee — I had my left leg amputated. I'm homeless and staying at Frontline Response shelter.

I heard you can help speed up disability claims. What do I need to do?"`,
    bringList: ['ID', 'SSN Card', 'Any medical records'],
    status: 'pending',
  },
  {
    id: 'grady-card',
    priority: 3,
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
    priority: 4,
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
    id: 'serve-with-limbs',
    priority: 5,
    title: '🦿 Serve with Limbs (FREE Prosthetic)',
    description: 'FREE prosthetic leg help! They help people who can\'t afford prosthetics get the leg they need.',
    phone: undefined,
    script: `Visit: servewithllimbs.org

Or search "Serve with Limbs" online and fill out their contact form.

They provide FREE prosthetics to people who can't afford them. Tell them:
- You're an amputee (left leg)
- You're homeless
- You need help getting a prosthetic`,
    bringList: ['Medical records about amputation if available'],
    status: 'pending',
  },
  {
    id: 'emory-amputee',
    priority: 6,
    title: '🦿 Emory Amputee Program',
    description: 'Full rehabilitation program at Emory. They help with prosthetics and recovery.',
    phone: '4047124200',
    script: `"Hi, I'd like information about your amputee rehabilitation program.

I'm 66 years old and I had a left leg amputation. I'm currently homeless but I'm working on getting benefits.

What services do you offer? Do you help with prosthetics? Is there financial assistance available?"`,
    bringList: ['ID', 'Any medical records'],
    status: 'pending',
  },
  {
    id: 'rapid-rehousing',
    priority: 7,
    title: '🏠 Partners for HOME (Rapid Rehousing)',
    description: 'FASTER than Section 8! No preconditions — no income, sobriety, or job required. Ask Frontline to connect you.',
    phone: undefined,
    script: `Tell your Frontline case manager:

"I want to apply for Partners for HOME rapid rehousing — the LIFT Program. Can you help connect me?"

Or visit: partnersforhome.org

This is MUCH faster than waiting for Section 8!`,
    bringList: ['ID', 'SSN Card'],
    status: 'pending',
  },
  {
    id: 'crossroads-housing',
    priority: 8,
    title: '🏠 Crossroads Door-to-Door Program',
    description: 'Emergency rent, move-in costs, and utility assistance. Plus case management to help you stay housed.',
    phone: undefined,
    script: `Visit: crossroadsatlanta.org

Call and ask about the "Door-to-Door" program:

"Hi, I'm homeless and I'm an amputee. I heard about your Door-to-Door program that helps with move-in costs and rent. How do I apply?"`,
    bringList: ['ID', 'Proof of homelessness (shelter letter)'],
    status: 'pending',
  },
  {
    id: 'snap-application',
    priority: 9,
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
    priority: 10,
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
    priority: 11,
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
    priority: 12,
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
    id: 'atlanta-housing',
    priority: 13,
    title: '🏠 Atlanta Housing Authority',
    description: 'Long-term housing help. Waitlists are long but important to get on. Ask about accessible/disability housing.',
    phone: '4048177350',
    script: `"Hi, I need to apply for housing assistance.

I'm 66 years old, I'm homeless, and I'm an amputee — I lost my left leg. I need a wheelchair-accessible unit.

What housing programs do you have? Is the Section 8 waitlist open?"

Also ask about:
- Project-based vouchers (sometimes no waitlist)
- Special homeless programs
- Senior housing
- Accessible housing for disabilities`,
    bringList: ['ID', 'SSN', 'Proof of homelessness'],
    status: 'pending',
  },
  {
    id: 'amputee-coalition',
    priority: 14,
    title: '💪 Join Amputee Coalition',
    description: 'Connect with other amputees who can help. They share resources and support each other.',
    phone: undefined,
    script: `Visit: amputee-coalition.org

Join their peer support network. Other amputees often:
- Share tips about getting help
- Know local resources
- Support each other emotionally

Also search Facebook for "Amputee Support Group" — these communities often help each other directly.`,
    bringList: [],
    status: 'pending',
  },
  {
    id: 'church-help',
    priority: 15,
    title: '⛪ Ask Churches for Help',
    description: 'Many churches have benevolence funds to help with rent deposits and emergency needs.',
    phone: undefined,
    script: `Visit local churches and ask to speak to the pastor or benevolence coordinator:

"Hi, I'm homeless and I'm an amputee. I'm working on getting benefits but I need help now. Does your church have benevolence funds that could help with a housing deposit?"

Bring your ID and proof of your situation. Churches often help directly!`,
    bringList: ['ID', 'Shelter letter', 'Any documentation of your situation'],
    status: 'pending',
  },
  {
    id: 'follow-up',
    priority: 16,
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
