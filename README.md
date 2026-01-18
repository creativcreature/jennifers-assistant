# Jennifer's AI Life Assistant

A mobile-first Progressive Web App (PWA) designed to help Jennifer navigate benefits, healthcare, food resources, and daily life in Atlanta.

## Features

- **AI Chat Assistant**: Powered by Claude, provides personalized guidance for benefits, housing, and daily tasks
- **Action Tracker**: 9 priority actions with scripts, phone numbers, and step-by-step guidance
- **Resources Directory**: Food banks, healthcare, and services in Atlanta with click-to-call
- **Personal Info Storage**: Track medications, appointments, contacts, and case numbers
- **Offline Support**: Works without internet - saved data always accessible
- **Accessibility First**: Large text (22px), high contrast (7:1), 56px touch targets

## Tech Stack

- **Framework**: Next.js 15.1
- **Styling**: Tailwind CSS with Falcons theme
- **Database**: Dexie.js (IndexedDB)
- **PWA**: Serwist service worker
- **AI**: Vercel AI SDK + Anthropic Claude

## Quick Start

1. **Install dependencies**:
   ```bash
   cd jennifers-assistant
   npm install
   ```

2. **Configure environment**:
   Create `.env.local` with:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

## Project Structure

```
jennifers-assistant/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Chat interface (home)
│   ├── actions/           # Action tracker
│   ├── resources/         # Food & services
│   ├── info/              # Personal info
│   ├── offline/           # Offline fallback
│   └── api/chat/          # Claude API endpoint
├── components/
│   ├── chat/              # Chat interface components
│   ├── actions/           # Action tracking components
│   ├── resources/         # Resource cards
│   ├── info/              # Personal info trackers
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Header, navigation
│   └── onboarding/        # First-time setup
├── lib/
│   ├── db.ts              # Dexie database schema
│   ├── prompts.ts         # Claude system prompts
│   ├── actions.ts         # Priority actions data
│   └── resources.ts       # Atlanta resources
└── public/
    └── manifest.json      # PWA manifest
```

## Accessibility Features

| Feature | Standard | This App |
|---------|----------|----------|
| Body text | 16px | 22px |
| Touch targets | 44px | 56px |
| Contrast ratio | 4.5:1 | 7:1 (AAA) |
| Line height | 1.4 | 1.6 |

## Priority Actions

1. Call 211 for SOAR worker
2. Get Grady Card
3. Request Presumptive SSI
4. Apply for expedited SNAP
5. Contact Mercy Care
6. Enter Coordinated Entry
7. Check SS Retirement
8. Apply for Section 8
9. Follow up on applications

## Contributing

This is a personal project built to help Jennifer. If you'd like to help or have suggestions, please reach out.

---

Built with love for Jennifer 🏈
