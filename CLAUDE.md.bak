# Jennifer's Assistant - Development Rules

## DEPLOYMENT PROCESS (MUST FOLLOW)

**DO NOT deploy changes piecemeal. Follow this process:**

1. **Collect all requests** - Let the user list everything they want changed
2. **Batch the work** - Make ALL changes locally before any commits
3. **Test the build** - Run `npm run build` to verify everything works
4. **Review with user** - Show what's ready and ask "Ready to deploy?"
5. **Deploy once** - Single commit, single deploy when user confirms

## If user starts rapid-fire requests:

Say: **"Let me batch these - tell me when you're done listing changes and we'll deploy together."**

## Commands

- Local dev: `npm run dev` (runs on port 5001)
- Test build: `npm run build`
- Deploy: `vercel --prod --yes`
- Push to GitHub: `git push origin main`

## Project Context

- **App**: PWA life assistant for Jennifer (66yo, homeless in Atlanta)
- **User**: Her son building this for her
- **Stack**: Next.js 15, Tailwind, Vercel AI SDK, Dexie.js
- **Deployment**: Vercel (https://jennifers-assistant.vercel.app)

## Key Files

- `/app/api/chat/route.ts` - AI chat endpoint
- `/lib/resources-db.ts` - Atlanta resources database
- `/lib/prompts.ts` - System prompt for AI
- `/components/chat/ChatInterface.tsx` - Main chat UI
- `/app/nfl/page.tsx` - NFL news feed
