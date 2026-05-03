# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CareerPath (职业规划平台) — a Chinese-language career planning platform built with Next.js 14 App Router. Features AI-powered resume analysis, job matching, visual skill learning paths (Flipbook with ASCII art), a learning center, community, and achievement system. Uses DeepSeek API for AI features.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint (next lint)
```

No test framework is configured. There is no database migration system.

## Architecture

**Storage**: JSON file-based storage in `lib/data/*.json` (users, jobs, resumes, posts, paths, courses, achievements, userAchievements). Read/write via `lib/data/index.ts` with file-locking. Not a real database — data is ephemeral and not production-grade.

**AI Integration**: All AI calls go through `lib/deepseek.ts`, which wraps the DeepSeek API using the OpenAI SDK. Every AI endpoint has a static fallback response that activates when the API key is missing or the call fails.

**Auth**: NextAuth v4 with credentials provider (`lib/auth.ts`). JWT-based sessions. Password hashing via bcryptjs. Session provider wraps the app in `components/providers/session-provider.tsx`.

**Validation**: `lib/validators.ts` provides input validation functions (email, password, resume text). Used in API routes.

**API Response Pattern**: All API routes use `apiSuccess()` / `apiError()` / `apiPaginated()` helpers from `lib/utils.ts` returning `{ success, data?, error? }`.

**Routing Structure**:
- `app/(auth)/` — login, register (no main nav)
- `app/(main)/` — all authenticated pages with sticky nav (dashboard, resume, jobs, learning, path, community, achievements)
- `app/api/` — REST endpoints, most with fallback data

**Key Patterns**:
- Route groups `(auth)` and `(main)` separate layouts — auth pages have no nav, main pages share a sticky top nav
- Flipbook component (`components/flipbook/`) renders skill cards with framer-motion animations, ASCII art headers via figlet, and skill dependency trees/constellations via `lib/ascii-structure.ts`
- Job data is static mock data in `lib/data/jobs.json` — only 3 sample jobs
- Resume upload only supports plain text files; PDF/Word shows a message to paste text instead

## Environment Variables

Required in `.env`:
- `DEEPSEEK_API_KEY` — DeepSeek API key (AI features degrade to fallback without it)
- `DEEPSEEK_API_BASE` — defaults to `https://api.deepseek.com/v1`
- `NEXTAUTH_SECRET` — JWT signing secret
- `DATABASE_URL` — set to `file:./dev.db` (unused; storage is JSON files)

## Chinese Locale

The entire UI is in Chinese (zh-CN). All user-facing strings, date formatting (`formatDate` in `lib/utils.ts`), and AI prompts are in Chinese. Maintain this convention.
