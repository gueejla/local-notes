# AGENTS.md — local-notes

Guidance for AI coding agents working in this repo. Keep edits **small, targeted, and test-backed**.

## What this is
A fully local, browser-cached notes app with a customizable UI. No backend, no network calls for user data.
Live demo: https://gueejla.github.io/local-notes/

## Stack
- React 19 + TypeScript (~6.0), bundled with Vite 8
- Styling: plain CSS with CSS custom properties (no Tailwind/CSS-in-JS)
- Markdown: `marked` + `isomorphic-dompurify` (sanitize before render)
- Storage: OPFS (Origin Private File System) — see `src/lib/opfs.ts`
- Tests: Vitest + Testing Library (jsdom)
- Lint: ESLint flat config

## Commands
| Task | Command |
| ---- | ------- |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |
| Test (once) | `npm test` |
| Test (watch) | `npm run test:watch` |

Always run `npm run lint` and `npm test` after changes. Prefer running a single test file while iterating.

## Layout
- `src/App.tsx` — root component
- `src/main.tsx` — entry point
- `src/components/` — UI, split by domain: `input/`, `note/`, `organize/`, `sidebar/`
- `src/components/sidebar/colorThemes.css` — **all theme color variables live here**
- `src/models/` — domain models/types: `note.ts`, `theme.ts`, `sort.ts`, `align.ts`
- `src/lib/` — pure logic: `markdown.ts`, `import.ts`, `export.ts`, `opfs.ts`
- `src/test/` — test setup/helpers

## Conventions
- **Types over `any`.** Shared domain types belong in `src/models/`.
- Keep `src/lib/*` pure and unit-testable; side effects (OPFS, DOM) stay in components or thin wrappers.
- One component per folder; colocate its CSS with it.
- CSS variables are the styling contract — never hardcode colors in component CSS. Use `var(--bg)`, `var(--text)`, `var(--border)`, `var(--accent)`, `var(--input-bg)`.
- Sanitize any user/markdown HTML with DOMPurify before injecting it.
- Match existing file naming: `kebab`/`camel` files, PascalCase components.

## Adding or editing a theme
1. Add a `[data-theme="<id>"]` block in `src/components/sidebar/colorThemes.css` defining all five variables:
   `--bg`, `--text`, `--border`, `--accent`, `--input-bg`.
2. Register the `<id>` in the theme list/type in `src/models/theme.ts`.
3. Verify contrast (text vs bg, accent vs bg) and that the selector `[data-theme]` is applied on the root element.
4. No component code should change to support a new theme.

## Guardrails
- Don't add runtime dependencies without asking.
- Don't change storage format (`opfs.ts`) or import/export schemas without a migration note.
- Keep the app offline-first: no telemetry, no external fetches for user content.
