# CLAUDE.md — teaky-frontend

Agent guidelines for this repository. Concise, evergreen; the backend's `CLAUDE.md` is the parent, and the standing rules there (test discipline, the merge and deploy rules, the walk rule) apply here unchanged.

## What this is

The React + TypeScript (Vite) app for Teaky: the shop side (`/dashboard`, `/orders`, …), the production shell (`/production/*`), the buyer portals (`/p/{slug}`) and the public pages. It is **baked into the backend image** at build time (`printer-agent2`'s Build image job checks out `main` here), so a frontend merge reaches production only with the next backend tag; the image records the frontend commit (`/FRONTEND_COMMIT`).

## Design principles

- **The API is the contract.** Every read and write goes through `src/api/*` with `apiRequest`; no fetch elsewhere. Types for API shapes live in `src/types/` and are being replaced by generation from the backend's OpenAPI document (`design/frontend-types-generation-2026-11-19.md`); once that lands, hand-written API types are not added.
- **Role gates are the API's, mirrored, never invented.** A screen hides what the API refuses (the `readOnly` shell flag, `isShadowReader`), and never shows a control the API would not honour. A 403 renders the empty state and one line, not the API's error string.
- **No HTML from strings.** No `innerHTML`, no `dangerouslySetInnerHTML`; markdown content renders through `src/lib/markdown.ts` (elements, never raw HTML). A content file can never carry markup.
- **No secrets, no tokens in storage once the cookie model lands.** Today the access and refresh tokens are in `localStorage` (`src/api/client.ts`); the ruled direction (`design/account-sessions-2026-11-18.md` §6) is the refresh token in an `HttpOnly` cookie and the access token in memory. Until then: nothing else is written to storage but per-browser conveniences (a remembered portal, a view toggle, a signed-in email).
- **One component per concept, in `src/components/`; pages compose.** A page file exports its component only (the react-refresh rule); shared constants and helpers live in `src/lib/`.
- **Walked by a person before Andrew.** Anything Andrew will touch — an invitation, a screen, a landing — is walked by a person as the probe user first (backend runbook §5a); a render or route check does not substitute.

## Standards

- **Expand/contract on the wire.** A frontend change must work against the API one deploy behind and one ahead: new fields read as optional until the backend has shipped; a removed field is read as optional for one rev after.
- **Tests gate the merge.** CI's required check (`lint-and-build`) runs `tsc --noEmit`, `lint:banned`, `vitest run --retry 2` and the build. A red test blocks. The `--retry 2` exists for one known flake (`AgentTaskDetailPage.test.tsx › calls approveDraft with no body when textarea content matches draft_response`) and comes out when it is fixed. Locally: `NODE_OPTIONS=--no-experimental-webstorage npx vitest run` on Node 25.
- **Test discipline is the backend's.** No existing assertion changes without the operator's word; a new test that fails is fixed in the code or declared; mocks of API modules by `vi.mock('../api/x')`.
- **Lint.** `eslint .` is advisory (the two pre-existing `react-refresh/only-export-components` warnings are known); `lint:banned` (no `alert()`, no `confirm()`) is required.
- **Types.** `strict` TypeScript; no `any` in new code; `unknown` and narrowing at the boundary.
- **Naming.** Descriptive, unambiguous; no shorthand (`svc`, `btn` in identifiers); test ids are specific to their component (`proposals-read-only-note`, not `read-only-note` twice).

## Layout

`src/api/` calls · `src/types/` API shapes · `src/lib/` pure helpers · `src/hooks/` data hooks · `src/components/` by domain (`production/`, `layout/`, `auth/`, `orders/`, …) · `src/pages/` routes (production pages under `src/pages/production/`) · `src/content/` markdown the operator edits · tests beside their subject in `__tests__/`.

## Where the state of things lives

The backend repo's handoffs (`~/printer-agent2-handoffs/`): the current trajectory, the rev notes, the design notes. This file carries principles only.
