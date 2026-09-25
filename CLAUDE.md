# Virtus Website — CLAUDE.md

## Stack
- Next.js 15, React 19, TypeScript, Tailwind CSS 3
- Database: Neon (PostgreSQL serverless) via `@neondatabase/serverless`
- No auth library — middleware sets security headers only
- No external UI library — all components hand-built

## Structure
```
src/
  app/           # Next.js App Router pages + API routes
  components/
    dashboard/   # Internal agency OS views
    public/      # Public-facing marketing components
    portal/      # Client portal modal
  db/index.ts    # In-memory AgencyDatabase class (mock store, no real DB yet)
  lib/           # neon.ts, quotationEngine.ts
  data/          # Static site content (siteData.ts)
  middleware.ts  # Security headers only
```

## Key Facts
- `src/db/index.ts` is the entire data layer — in-memory mock, no real DB writes persist
- Public site: `src/app/page.tsx` + `src/components/public/`
- Admin dashboard: `src/app/admin/page.tsx` + `src/components/dashboard/`
- Client portal: `src/app/portal/page.tsx` + `src/components/portal/`
- API routes live in `src/app/api/` — all use the in-memory store

## Commands
```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Do Not Touch
- `public/fonts/` — static font assets
- `.neon/` — Neon CLI state
- `tsconfig.tsbuildinfo` — TS cache
