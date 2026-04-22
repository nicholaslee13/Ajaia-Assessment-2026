# Collaborative Doc Editor Design

## Goal

Build a small full-stack application for individual users that supports document creation and editing, file upload/import, sharing, and persistence. The first version should optimize for a smooth editing experience and reliable sharing and permissions.

## Product Scope

The application is a document editor for individual users, not team workspaces. Users should land directly in the editor flow, where they can create a blank document or import a supported file into an editable document.

Core v1 capabilities:

- Rich-text document creation and editing
- Real-time content syncing without presence indicators or cursors
- File upload and import for `.txt`, `.md`, `.pdf`, and `.docx`
- Sharing through direct invites and shareable links
- Persistence using Supabase
- Autosave with timed restoreable snapshots
- Soft delete with restore

Out of scope for v1:

- Team workspaces
- Comments
- Presence indicators or multiplayer cursors
- Advanced editor features such as tables, embeds, slash commands, or complex layout tools

## User Experience

The main entry point should open directly into a blank/new document flow rather than a document dashboard. The editor should support basic rich-text formatting:

- Headings
- Bold
- Italic
- Lists
- Links

Users should be able to:

- Create a new document
- Rename a document
- Edit document content
- Import supported files into editable documents
- Share documents
- Restore from timed snapshots
- Soft delete and restore documents

Whenever a user browses or switches documents, the UI must visibly distinguish:

- Documents the current user owns
- Documents shared with the current user

This distinction is a product requirement, not a cosmetic extra. Ownership and shared access should be modeled explicitly and surfaced consistently in the interface.

## Architecture

The application should use Next.js as the full-stack framework.

Primary platform services:

- Supabase Auth for magic-link email login
- Supabase Postgres for application data
- Supabase Storage for retaining original uploaded files

Document content should be persisted primarily as Markdown in v1. The editor may use a rich-text representation in the browser, but the system of record should remain Markdown for storage and restore operations.

At a high level:

- The client loads a document and edits it through a basic rich-text editor
- Autosave persists markdown content on a timed interval
- The system creates timed snapshots for restore
- Real-time content syncing keeps collaborators updated without presence features
- Sharing permissions are enforced server-side
- Uploaded originals are kept in storage even after a successful import

## Authentication

Users should sign in with magic-link email login through Supabase Auth. Password-based auth is not required in v1.

Sharing and permissions must be tied to authenticated users for write access:

- Invite-based collaborators must sign in
- Edit links require sign-in before edits are allowed
- View links may be used without sign-in

## Data Model

The data model should include at least the following entities.

### Users

Represents authenticated users from Supabase Auth and any associated application profile data needed by the product.

### Documents

Each document should include:

- A unique ID
- Owner user ID
- Title
- Current markdown content
- Created and updated timestamps
- Soft delete state

The owner relationship is authoritative and is used to determine whether a document is "owned by me."

### Document Shares

Represents direct sharing from a document owner to a specific authenticated user.

Fields should include:

- Document ID
- Shared-to user ID
- Permission level: `view` or `edit`
- Created timestamp

These records determine whether a document appears as "shared with me."

### Document Share Links

Represents generated share links for a document.

Fields should include:

- Document ID
- Share token or identifier
- Permission level: `view` or `edit`
- Created timestamp
- Optional status or revocation state

Permission rules:

- View links can be anonymous
- Edit links require sign-in

### Document Snapshots

Represents timed restore points for document content.

Fields should include:

- Document ID
- Snapshot markdown content
- Snapshot timestamp

Snapshots are system-generated on a timed interval while editing.

### Uploaded Files

Represents the original uploaded assets that were used for import.

Fields should include:

- Document ID
- Original filename
- File type
- Storage path/key
- Upload timestamp
- Import status metadata if needed

The original file should be retained even after a successful import into Markdown.

## Sharing Model

The app supports two forms of sharing in v1:

- Direct invites
- Shareable links

Direct invites:

- Target a specific authenticated user
- Support `view` or `edit`
- Are intended for identity-based collaboration

Shareable links:

- Support `view` or `edit`
- Must enforce sign-in before edit access is granted
- Can allow anonymous access for view-only links

Owners should retain full control over their documents and sharing settings. Users with edit access may:

- Edit content
- Rename the document

Users with edit access should not gain sharing-management privileges in v1.

## Import Behavior

Supported input file types:

- `.txt`
- `.md`
- `.pdf`
- `.docx`

Uploads in v1 are intended to become editable documents. The system should attempt conversion into Markdown and reject files that cannot be imported cleanly enough for editing.

Import behavior:

- Best target output is an editable Markdown document
- Original uploaded file is retained in storage
- Failed imports should produce explicit user-facing errors
- The system should not silently create low-quality or corrupted editable output when conversion quality is unacceptable

Chosen v1 behavior for imperfect imports:

- Reject files that cannot be imported cleanly enough

## Editing And Collaboration

The editor should prioritize a smooth writing experience with basic formatting rather than advanced collaborative UI.

Required v1 formatting support:

- Headings
- Bold
- Italic
- Lists
- Links

Collaboration behavior in v1:

- Real-time content syncing
- No presence indicators
- No collaborator cursors
- No comments

This is intentionally simpler than a full CRDT-style collaborative workspace. The product goal is useful shared editing with less complexity in the interface.

## Persistence And Lifecycle

Persistence is handled through Supabase. The user has not connected Supabase yet, so implementation must include a guided setup step later in the project rather than assuming configuration already exists.

Lifecycle behavior:

- Documents autosave on a timed interval while editing
- Timed snapshots are created while editing
- Documents are soft deleted rather than permanently removed immediately
- Users should be able to restore soft-deleted documents
- Users should be able to restore prior document snapshots

## Security And Permission Rules

The system must enforce permissions server-side.

Minimum rules:

- Owners can fully manage their own documents
- Invited users can access documents according to their invite permission
- View links allow read-only access
- Edit links require authentication before permitting edits
- Ownership/shared status shown in the UI must match actual permission data

The client UI may reflect permissions optimistically, but the backend remains the source of truth.

## Primary Flows

### Create New Document

1. Signed-in user opens the app
2. User starts a blank document
3. Editor opens immediately
4. Autosave persists content on a timed interval
5. Snapshots are created on a timed interval

### Import Document

1. Signed-in user uploads a supported file
2. System attempts to convert the file into Markdown
3. If conversion is acceptable, a new editable document is created
4. Original uploaded file is retained in storage
5. If conversion quality is unacceptable, the import is rejected with a clear error

### Share Document

1. Owner opens sharing controls
2. Owner invites a specific user or generates a share link
3. Owner selects `view` or `edit`
4. Server persists the share rule
5. Access is enforced according to invite/link type and permission level

### Browse Owned vs Shared Documents

1. User views accessible documents
2. UI clearly distinguishes "owned by me" from "shared with me"
3. That distinction remains visible in navigation or list surfaces wherever documents are browsed

### Restore Snapshot

1. User opens document history/snapshot controls
2. User selects a timed snapshot
3. System restores the selected Markdown content
4. Current document content is updated and saved as the latest state

## Testing Requirements

Implementation should include automated coverage for:

- Authentication and session flows
- Server-side permission enforcement for owners, invited users, and share links
- Document create, rename, edit, autosave, and soft delete behavior
- Snapshot creation and restore
- Import success/failure behavior for `.txt`, `.md`, `.pdf`, and `.docx`
- UI distinction between owned and shared documents
- Edit-link sign-in enforcement
- Real-time content sync behavior at the content level

## Constraints And Priorities

Top priorities:

- Smooth document editing experience
- Reliable sharing and permission enforcement

Supporting constraints:

- Keep v1 focused on individuals, not teams
- Avoid advanced editor features that add large implementation cost
- Keep write access identity-backed even when links are used
- Preserve originals for imported files

## Open Implementation Note

The implementation plan must include a guided Supabase connection/setup task. The user specifically wants to be walked through that setup during implementation rather than front-loading it in the design phase.
