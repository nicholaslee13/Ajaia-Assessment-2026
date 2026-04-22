# Ajaia Assessment 2026

A small full-stack collaborative document editor built with Next.js and Supabase.

## Current Status

This repository currently contains:

- A product design spec in `docs/superpowers/specs/`
- An implementation plan in `docs/superpowers/plans/`

Application code will be added starting with Task 1 from the implementation plan.

## Planned Stack

- Next.js
- TypeScript
- React
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- TipTap
- Vitest
- Playwright

## Local Setup

### Prerequisites

Install these before running the app locally:

- Node.js 20+
- npm 10+
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/nicholaslee13/Ajaia-Assessment-2026.git
cd Ajaia-Assessment-2026
```

### 2. Install dependencies

This step will work after Task 1 scaffolds the application:

```bash
npm install
```

### 3. Create your local environment file

After Task 1 creates `.env.example`, copy it into `.env.local`:

```bash
cp .env.example .env.local
```

Add your Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 4. Start the development server

This step will work after the Next.js app is scaffolded:

```bash
npm run dev
```

Expected local app URL:

```text
http://localhost:3000
```

## Running Tests

These commands will become available as the app is scaffolded:

```bash
npm test
npm run test:e2e
```

## Supabase Setup Notes

We will wire Supabase in during implementation. The expected setup flow is:

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Copy the service role key into `.env.local` for server-side actions.
4. Configure the magic-link callback URL to `http://localhost:3000/auth/callback`.

## Project Docs

- Design spec: `docs/superpowers/specs/2026-04-22-collaborative-doc-editor-design.md`
- Implementation plan: `docs/superpowers/plans/2026-04-22-collaborative-doc-editor.md`
