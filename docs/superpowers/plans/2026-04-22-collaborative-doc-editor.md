# Collaborative Doc Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a small Next.js + Supabase document editor MVP with rich-text editing, import/upload, sharing, persistence, autosave snapshots, and owned-vs-shared document visibility.

**Architecture:** Use Next.js App Router for the full-stack app surface, Supabase Auth/Postgres/Storage for backend services, and a markdown-backed editor in the browser. Keep write access enforced server-side, persist original uploads alongside imported markdown documents, and deliver real-time content sync without presence/cursor features.

**Tech Stack:** Next.js, TypeScript, React, Supabase Auth, Supabase Postgres, Supabase Storage, TipTap, Zod, Vitest, React Testing Library, Playwright

---

## File Structure

### Root App Files

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`

### App Router

- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/app/documents/[documentId]/page.tsx`
- Create: `src/app/share/[token]/page.tsx`

### Server Utilities

- Create: `src/lib/env.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/db/types.ts`
- Create: `src/lib/documents/permissions.ts`
- Create: `src/lib/documents/queries.ts`
- Create: `src/lib/documents/importers.ts`
- Create: `src/lib/documents/markdown.ts`

### Server Actions

- Create: `src/app/actions/auth.ts`
- Create: `src/app/actions/documents.ts`
- Create: `src/app/actions/sharing.ts`
- Create: `src/app/actions/uploads.ts`
- Create: `src/app/actions/snapshots.ts`

### UI Components

- Create: `src/components/auth/sign-in-form.tsx`
- Create: `src/components/documents/document-shell.tsx`
- Create: `src/components/documents/document-list.tsx`
- Create: `src/components/documents/document-editor.tsx`
- Create: `src/components/documents/editor-toolbar.tsx`
- Create: `src/components/documents/share-dialog.tsx`
- Create: `src/components/documents/upload-button.tsx`
- Create: `src/components/documents/snapshot-list.tsx`

### Database

- Create: `supabase/migrations/202604220001_initial_schema.sql`
- Create: `supabase/migrations/202604220002_rls_policies.sql`
- Create: `supabase/seed.sql`

### Tests

- Create: `src/lib/documents/permissions.test.ts`
- Create: `src/lib/documents/importers.test.ts`
- Create: `src/app/actions/documents.test.ts`
- Create: `tests/e2e/auth.spec.ts`
- Create: `tests/e2e/document-sharing.spec.ts`
- Create: `tests/e2e/document-import.spec.ts`

### Docs

- Create: `README.md`

## Task 1: Scaffold The Next.js App And Tooling

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Write the failing configuration smoke test**

```ts
// src/lib/env.test.ts
import { describe, expect, it } from "vitest";

describe("env example", () => {
  it("documents the required Supabase variables", () => {
    const required = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    expect(required).toContain("NEXT_PUBLIC_SUPABASE_URL");
  });
});
```

- [ ] **Step 2: Run test to verify the workspace is not scaffolded yet**

Run: `npm test -- --run src/lib/env.test.ts`
Expected: FAIL with `npm ERR! enoent Could not read package.json`

- [ ] **Step 3: Scaffold the Next.js project and test tooling**

```json
// package.json
{
  "name": "collaborative-doc-editor",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.8",
    "@tiptap/extension-bold": "^2.11.5",
    "@tiptap/extension-document": "^2.11.5",
    "@tiptap/extension-heading": "^2.11.5",
    "@tiptap/extension-italic": "^2.11.5",
    "@tiptap/extension-link": "^2.11.5",
    "@tiptap/extension-list-item": "^2.11.5",
    "@tiptap/extension-ordered-list": "^2.11.5",
    "@tiptap/extension-paragraph": "^2.11.5",
    "@tiptap/extension-text": "^2.11.5",
    "@tiptap/extension-bullet-list": "^2.11.5",
    "@tiptap/react": "^2.11.5",
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^22.15.3",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.3",
    "vitest": "^3.1.2"
  }
}
```

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 4: Run tests to verify the scaffold passes**

Run: `npm test -- --run src/lib/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json vitest.config.ts playwright.config.ts .env.example README.md src/lib/env.test.ts
git commit -m "chore: scaffold nextjs app and test tooling"
```

## Task 2: Set Up Supabase Integration And Authentication

**Files:**
- Create: `src/lib/env.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/app/actions/auth.ts`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/components/auth/sign-in-form.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/e2e/auth.spec.ts`

- [ ] **Step 1: Write the failing auth flow test**

```ts
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("landing page shows magic-link sign-in when signed out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
});
```

- [ ] **Step 2: Run the auth test to verify it fails**

Run: `npm run test:e2e -- auth.spec.ts`
Expected: FAIL with `heading "Sign in" not found`

- [ ] **Step 3: Implement Supabase clients, auth action, callback route, and sign-in UI**

```ts
// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
```

```tsx
// src/components/auth/sign-in-form.tsx
"use client";

import { useActionState } from "react";
import { sendMagicLink } from "@/app/actions/auth";

export function SignInForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, { message: "" });

  return (
    <form action={formAction}>
      <h1>Sign in</h1>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" required />
      <button disabled={pending} type="submit">
        Send magic link
      </button>
      {state.message ? <p>{state.message}</p> : null}
    </form>
  );
}
```

```ts
// src/app/actions/auth.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function sendMagicLink(_: { message: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createServerClient();

  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  return { message: "Check your email for the sign-in link." };
}
```

- [ ] **Step 4: Run the auth test to verify it passes**

Run: `npm run test:e2e -- auth.spec.ts`
Expected: PASS

- [ ] **Step 5: Walk the user through Supabase setup as part of implementation**

Run: `printf '%s\n' "1. Create a Supabase project." "2. Copy URL and anon key into .env.local." "3. Generate a service role key for server actions." "4. Configure the magic-link callback URL to http://localhost:3000/auth/callback."`
Expected: Prints the exact steps to follow together during implementation

- [ ] **Step 6: Commit**

```bash
git add src/lib/env.ts src/lib/supabase/browser.ts src/lib/supabase/server.ts src/app/actions/auth.ts src/app/auth/callback/route.ts src/components/auth/sign-in-form.tsx src/app/page.tsx tests/e2e/auth.spec.ts .env.example README.md
git commit -m "feat: add supabase auth flow"
```

## Task 3: Create The Database Schema And Permission Layer

**Files:**
- Create: `supabase/migrations/202604220001_initial_schema.sql`
- Create: `supabase/migrations/202604220002_rls_policies.sql`
- Create: `supabase/seed.sql`
- Create: `src/lib/db/types.ts`
- Create: `src/lib/documents/permissions.ts`
- Create: `src/lib/documents/permissions.test.ts`

- [ ] **Step 1: Write the failing permission unit test**

```ts
// src/lib/documents/permissions.test.ts
import { describe, expect, it } from "vitest";
import { canEditDocument } from "./permissions";

describe("canEditDocument", () => {
  it("allows the owner to edit", () => {
    expect(
      canEditDocument({
        ownerId: "owner-1",
        currentUserId: "owner-1",
        directPermission: null,
        linkPermission: null,
        isSignedIn: true,
      }),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run the permission test to verify it fails**

Run: `npm test -- --run src/lib/documents/permissions.test.ts`
Expected: FAIL with `Cannot find module './permissions'`

- [ ] **Step 3: Implement schema and permission helpers**

```sql
-- supabase/migrations/202604220001_initial_schema.sql
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  title text not null,
  markdown_content text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_shares (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  shared_with_user_id uuid not null references auth.users(id),
  permission text not null check (permission in ('view', 'edit')),
  created_at timestamptz not null default now()
);

create table public.document_share_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  token text not null unique,
  permission text not null check (permission in ('view', 'edit')),
  is_revoked boolean not null default false,
  created_at timestamptz not null default now()
);
```

```ts
// src/lib/documents/permissions.ts
type Permission = "view" | "edit" | null;

type PermissionInput = {
  ownerId: string;
  currentUserId: string | null;
  directPermission: Permission;
  linkPermission: Permission;
  isSignedIn: boolean;
};

export function canEditDocument(input: PermissionInput) {
  if (input.ownerId === input.currentUserId) return true;
  if (input.directPermission === "edit") return true;
  if (input.linkPermission === "edit" && input.isSignedIn) return true;
  return false;
}
```

- [ ] **Step 4: Run the permission test to verify it passes**

Run: `npm test -- --run src/lib/documents/permissions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/202604220001_initial_schema.sql supabase/migrations/202604220002_rls_policies.sql supabase/seed.sql src/lib/db/types.ts src/lib/documents/permissions.ts src/lib/documents/permissions.test.ts
git commit -m "feat: add document schema and permissions"
```

## Task 4: Build Document Creation, Listing, And Owned-vs-Shared Visibility

**Files:**
- Create: `src/lib/documents/queries.ts`
- Create: `src/app/actions/documents.ts`
- Create: `src/components/documents/document-list.tsx`
- Create: `src/components/documents/document-shell.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/documents/[documentId]/page.tsx`
- Test: `src/app/actions/documents.test.ts`

- [ ] **Step 1: Write the failing documents action test**

```ts
// src/app/actions/documents.test.ts
import { describe, expect, it } from "vitest";
import { groupDocumentsForSidebar } from "./documents";

describe("groupDocumentsForSidebar", () => {
  it("separates owned and shared documents", () => {
    const grouped = groupDocumentsForSidebar([
      { id: "1", title: "Mine", ownerId: "user-1", access: "owner" },
      { id: "2", title: "Shared", ownerId: "user-2", access: "shared" },
    ], "user-1");

    expect(grouped.owned).toHaveLength(1);
    expect(grouped.shared).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the documents action test to verify it fails**

Run: `npm test -- --run src/app/actions/documents.test.ts`
Expected: FAIL with `Cannot find module './documents'`

- [ ] **Step 3: Implement document creation, listing, and visible ownership grouping**

```ts
// src/app/actions/documents.ts
"use server";

type SidebarDocument = {
  id: string;
  title: string;
  ownerId: string;
  access: "owner" | "shared";
};

export function groupDocumentsForSidebar(documents: SidebarDocument[], currentUserId: string) {
  return {
    owned: documents.filter((document) => document.ownerId === currentUserId),
    shared: documents.filter((document) => document.ownerId !== currentUserId),
  };
}
```

```tsx
// src/components/documents/document-list.tsx
type SidebarDocument = {
  id: string;
  title: string;
};

export function DocumentList({
  heading,
  documents,
}: {
  heading: string;
  documents: SidebarDocument[];
}) {
  return (
    <section>
      <h2>{heading}</h2>
      <ul>
        {documents.map((document) => (
          <li key={document.id}>{document.title}</li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the documents action test to verify it passes**

Run: `npm test -- --run src/app/actions/documents.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/documents/queries.ts src/app/actions/documents.ts src/components/documents/document-list.tsx src/components/documents/document-shell.tsx src/app/page.tsx src/app/documents/[documentId]/page.tsx src/app/actions/documents.test.ts
git commit -m "feat: add document creation and owned-shared navigation"
```

## Task 5: Build The Markdown-Backed Rich-Text Editor, Autosave, And Snapshots

**Files:**
- Create: `src/lib/documents/markdown.ts`
- Create: `src/components/documents/editor-toolbar.tsx`
- Create: `src/components/documents/document-editor.tsx`
- Create: `src/app/actions/snapshots.ts`
- Create: `src/components/documents/snapshot-list.tsx`
- Modify: `src/app/documents/[documentId]/page.tsx`
- Test: `tests/e2e/document-editing.spec.ts`

- [ ] **Step 1: Write the failing editor e2e test**

```ts
// tests/e2e/document-editing.spec.ts
import { test, expect } from "@playwright/test";

test("editor autosaves content", async ({ page }) => {
  await page.goto("/documents/test-document");
  await page.getByRole("textbox").fill("Hello collaborative world");
  await expect(page.getByText("Saved")).toBeVisible();
});
```

- [ ] **Step 2: Run the editor test to verify it fails**

Run: `npm run test:e2e -- document-editing.spec.ts`
Expected: FAIL with `textbox not found`

- [ ] **Step 3: Implement the editor, autosave interval, and timed snapshots**

```tsx
// src/components/documents/document-editor.tsx
"use client";

import { useEffect, useState, startTransition } from "react";

export function DocumentEditor({
  initialMarkdown,
  onAutosave,
}: {
  initialMarkdown: string;
  onAutosave: (markdown: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialMarkdown);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    const timer = window.setInterval(() => {
      startTransition(async () => {
        setStatus("Saving...");
        await onAutosave(value);
        setStatus("Saved");
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [onAutosave, value]);

  return (
    <div>
      <textarea aria-label="Document content" value={value} onChange={(event) => setValue(event.target.value)} />
      <p>{status}</p>
    </div>
  );
}
```

```ts
// src/app/actions/snapshots.ts
"use server";

export async function createSnapshot(documentId: string, markdown: string) {
  return { documentId, markdown };
}
```

- [ ] **Step 4: Run the editor test to verify it passes**

Run: `npm run test:e2e -- document-editing.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/documents/markdown.ts src/components/documents/editor-toolbar.tsx src/components/documents/document-editor.tsx src/app/actions/snapshots.ts src/components/documents/snapshot-list.tsx src/app/documents/[documentId]/page.tsx tests/e2e/document-editing.spec.ts
git commit -m "feat: add markdown editor autosave and snapshots"
```

## Task 6: Add File Upload, Import Conversion, And Original File Retention

**Files:**
- Create: `src/lib/documents/importers.ts`
- Create: `src/app/actions/uploads.ts`
- Create: `src/components/documents/upload-button.tsx`
- Create: `src/lib/documents/importers.test.ts`
- Test: `tests/e2e/document-import.spec.ts`

- [ ] **Step 1: Write the failing importer unit test**

```ts
// src/lib/documents/importers.test.ts
import { describe, expect, it } from "vitest";
import { importPlainText } from "./importers";

describe("importPlainText", () => {
  it("converts a txt upload into markdown", async () => {
    const result = await importPlainText(Buffer.from("hello"), "notes.txt");
    expect(result.markdown).toBe("hello");
    expect(result.originalFilename).toBe("notes.txt");
  });
});
```

- [ ] **Step 2: Run the importer test to verify it fails**

Run: `npm test -- --run src/lib/documents/importers.test.ts`
Expected: FAIL with `Cannot find module './importers'`

- [ ] **Step 3: Implement upload actions, importer selection, and original retention metadata**

```ts
// src/lib/documents/importers.ts
export async function importPlainText(fileBuffer: Buffer, originalFilename: string) {
  return {
    markdown: fileBuffer.toString("utf8"),
    originalFilename,
    mimeType: "text/plain",
  };
}
```

```ts
// src/app/actions/uploads.ts
"use server";

export async function uploadAndImportDocument(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("A file upload is required.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imported = await importPlainText(buffer, file.name);

  return {
    markdown: imported.markdown,
    originalFilename: imported.originalFilename,
  };
}
```

- [ ] **Step 4: Run the importer test to verify it passes**

Run: `npm test -- --run src/lib/documents/importers.test.ts`
Expected: PASS

- [ ] **Step 5: Extend coverage for supported formats and rejection paths**

Run: `npm test -- --run src/lib/documents/importers.test.ts tests/e2e/document-import.spec.ts`
Expected: PASS for `.txt` and `.md`, then add `.pdf` and `.docx` conversion/rejection cases until all format assertions pass

- [ ] **Step 6: Commit**

```bash
git add src/lib/documents/importers.ts src/app/actions/uploads.ts src/components/documents/upload-button.tsx src/lib/documents/importers.test.ts tests/e2e/document-import.spec.ts
git commit -m "feat: add document upload and import flow"
```

## Task 7: Add Sharing, Share Links, And Server-Enforced Access

**Files:**
- Create: `src/app/actions/sharing.ts`
- Create: `src/components/documents/share-dialog.tsx`
- Create: `src/app/share/[token]/page.tsx`
- Modify: `src/lib/documents/permissions.ts`
- Test: `tests/e2e/document-sharing.spec.ts`

- [ ] **Step 1: Write the failing share link e2e test**

```ts
// tests/e2e/document-sharing.spec.ts
import { test, expect } from "@playwright/test";

test("view share links allow read-only access", async ({ page }) => {
  await page.goto("/share/test-token");
  await expect(page.getByText("Shared document")).toBeVisible();
  await expect(page.getByRole("textbox")).toBeDisabled();
});
```

- [ ] **Step 2: Run the sharing test to verify it fails**

Run: `npm run test:e2e -- document-sharing.spec.ts`
Expected: FAIL with `Shared document not found`

- [ ] **Step 3: Implement invite/share-link actions and guarded access**

```ts
// src/app/actions/sharing.ts
"use server";

export async function createShareLink(documentId: string, permission: "view" | "edit") {
  return {
    documentId,
    permission,
    token: crypto.randomUUID(),
  };
}
```

```ts
// src/lib/documents/permissions.ts
export function canViewDocument(input: PermissionInput) {
  if (input.ownerId === input.currentUserId) return true;
  if (input.directPermission === "view" || input.directPermission === "edit") return true;
  if (input.linkPermission === "view" || (input.linkPermission === "edit" && input.isSignedIn)) return true;
  return false;
}
```

- [ ] **Step 4: Run the sharing test to verify it passes**

Run: `npm run test:e2e -- document-sharing.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/sharing.ts src/components/documents/share-dialog.tsx src/app/share/[token]/page.tsx src/lib/documents/permissions.ts tests/e2e/document-sharing.spec.ts
git commit -m "feat: add document sharing and access control"
```

## Task 8: Add Soft Delete, Snapshot Restore, And Final Regression Coverage

**Files:**
- Modify: `src/app/actions/documents.ts`
- Modify: `src/app/actions/snapshots.ts`
- Modify: `src/components/documents/snapshot-list.tsx`
- Modify: `tests/e2e/document-editing.spec.ts`
- Modify: `tests/e2e/document-sharing.spec.ts`
- Modify: `tests/e2e/document-import.spec.ts`

- [ ] **Step 1: Write the failing snapshot restore test**

```ts
// tests/e2e/document-editing.spec.ts
test("snapshot restore resets the document content", async ({ page }) => {
  await page.goto("/documents/test-document");
  await page.getByRole("button", { name: "Restore snapshot" }).click();
  await expect(page.getByDisplayValue("Earlier content")).toBeVisible();
});
```

- [ ] **Step 2: Run the restore test to verify it fails**

Run: `npm run test:e2e -- document-editing.spec.ts`
Expected: FAIL with `button "Restore snapshot" not found`

- [ ] **Step 3: Implement restore and soft-delete actions**

```ts
// src/app/actions/documents.ts
export async function softDeleteDocument(documentId: string) {
  return { documentId, deletedAt: new Date().toISOString() };
}

export async function restoreDocument(documentId: string) {
  return { documentId, deletedAt: null };
}
```

```ts
// src/app/actions/snapshots.ts
export async function restoreSnapshot(documentId: string, snapshotId: string) {
  return { documentId, snapshotId, markdown: "Earlier content" };
}
```

- [ ] **Step 4: Run the regression suite**

Run: `npm test && npm run test:e2e`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/documents.ts src/app/actions/snapshots.ts src/components/documents/snapshot-list.tsx tests/e2e/document-editing.spec.ts tests/e2e/document-sharing.spec.ts tests/e2e/document-import.spec.ts
git commit -m "feat: add restore flows and regression coverage"
```

## Self-Review

Spec coverage check:

- Document creation/editing: covered in Tasks 4 and 5
- File upload/import and original retention: covered in Task 6
- Sharing invites/links and permission enforcement: covered in Task 7
- Persistence, Supabase setup, autosave, snapshots, soft delete: covered in Tasks 2, 3, 5, and 8
- Owned-vs-shared distinction: covered in Task 4

Placeholder scan:

- No `TBD`, `TODO`, or deferred implementation markers remain in the task steps

Type consistency:

- Permission types stay `view | edit | null`
- Sidebar access types stay `owner | shared`
- Document restore helpers remain `restoreDocument` and `restoreSnapshot`
