# Ajaia Assessment 2026

A small full-stack collaborative document editor built with Next.js and Supabase.

## Current Development Step

Task 1 scaffolds the Next.js app, TypeScript configuration, and test tooling so the rest of the implementation plan has a working baseline.

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

## Vercel Deployment

The current branch is safe to deploy to Vercel before full Supabase setup is complete. Without Supabase environment variables, the homepage renders in preview mode and disables the magic-link submit action instead of crashing the deployment.

### 1. Import the repository into Vercel

- Create a new Vercel project
- Select `nicholaslee13/Ajaia-Assessment-2026`
- Choose the `codex/task-1-scaffold` branch if you want to preview the in-progress branch

### 2. Use the default framework settings

- Framework preset: `Next.js`
- Build command: `next build`
- Output directory: leave blank

### 3. Add environment variables

Set these in the Vercel project when you are ready to enable real auth:

```env
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 4. Update Supabase auth URLs

In Supabase Auth, add your Vercel deployment URL as an allowed redirect URL:

```text
https://your-vercel-domain.vercel.app/auth/callback
```

### 5. Deploy

After the project is imported and environment variables are set, Vercel can build and deploy the app automatically from GitHub.

## Supabase Setup Notes

We will wire Supabase in during implementation. The expected setup flow is:

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Copy the service role key into `.env.local` for server-side actions.
4. Configure the magic-link callback URL to `http://localhost:3000/auth/callback`.

## Project Docs

- Design spec: `docs/superpowers/specs/2026-04-22-collaborative-doc-editor-design.md`
- Implementation plan: `docs/superpowers/plans/2026-04-22-collaborative-doc-editor.md`
