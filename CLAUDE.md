# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 8080

# Build
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint

# Tests
npm test             # Run Vitest (single run)
npm run test:watch   # Run Vitest in watch mode

# Single test file
npx vitest run src/path/to/file.test.ts
```

## Architecture

This is a **Vite + React SPA** (no SSR, no Next.js) backed by **Supabase** (PostgreSQL + Auth). It's a Korean-language compliance checklist app for OK Finance.

### Data Flow

1. **Auth:** Lovable OAuth (Google) → `src/integrations/lovable/index.ts` → Supabase session → `AuthContext`
2. **Data:** Direct Supabase client calls (no API layer) → local React state
3. **No TanStack Query usage yet** — data fetching in `Index.tsx` uses plain `useEffect` + `useState`

### Key Abstractions

- **`src/contexts/AuthContext.tsx`** — provides `{ user, session, loading, signOut }` via `useAuth()` hook; wraps entire app
- **`src/integrations/supabase/client.ts`** — singleton Supabase client (session persisted in localStorage)
- **`src/integrations/supabase/types.ts`** — auto-generated DB types; regenerate via Supabase CLI when schema changes
- **`src/pages/Index.tsx`** — all core business logic: fetch, toggle, memo updates (debounced 500ms), delete, add items

### Database

Single table: `checklist_items` with columns `id, title, category, checked, memo, user_id, created_at, updated_at`.

Row Level Security (RLS) enforced — all queries are automatically filtered by `user_id`. New users receive 6 default Korean compliance items via a DB trigger.

Migrations live in `supabase/migrations/`. The Supabase project ID is in `.env` as `VITE_SUPABASE_PROJECT_ID`.

### Styling

Tailwind CSS with custom HSL CSS variables defined in `src/index.css`:
- Primary: pink/magenta (`330 80% 60%`)
- Accent: yellow (`45 80% 50%`)
- Category label color: cyan (`210 90% 60%`)
- Dark theme is the default

UI components are shadcn/ui (`src/components/ui/`) — edit these files directly, do not re-add via CLI unless adding a new component.

### Path Alias

`@/*` resolves to `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).

### Testing

Vitest with jsdom environment. `@testing-library/react` and `@testing-library/jest-dom` are available. Setup in `src/test/setup.ts` polyfills `window.matchMedia`.

Playwright is configured (`playwright.config.ts`) but E2E tests are not actively maintained.
