# CodeVision.ai — Frontend

AI-powered code review assistant — frontend built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

This is the **complete frontend** (UI/UX only, with realistic mock data). Every screen from the project report is included:
marketing landing page, auth (login/signup), dashboard, repository connection, review results (static + security + AI),
AI-assisted fix generation with diff view, sandbox validation, review history, and settings.

## Tech used

- React 18 + TypeScript
- Vite
- Tailwind CSS (custom blue/purple design tokens)
- Framer Motion (page and micro-interaction animations)
- React Router
- Lucide icons

## Run it in VS Code

1. **Unzip** this folder and open it in VS Code: `File → Open Folder…`
2. Open a terminal in VS Code: `` Terminal → New Terminal `` (or `` Ctrl+` ``)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open the URL it prints — usually **http://localhost:5173**

That's it — hot reload is on, so any file you edit updates instantly in the browser.

### Requirements
- Node.js 18+ (check with `node -v`). Get it from https://nodejs.org if you don't have it.

### Other useful commands
```bash
npm run build     # production build → outputs to /dist
npm run preview   # preview the production build locally
```

## Where things live

```
src/
  pages/        one file per screen (Landing, Login, Signup, Dashboard, Repositories,
                 ReviewResults, Fixes, History, SettingsPage, NotFound)
  components/    shared UI: Navbar, Footer, Sidebar, Topbar, AppShell, IssueCard,
                 DiffBlock, SeverityBadge, StatCard, ScanPanel, Logo, SectionHeading
  data/mock.ts   mock repositories, issues, workflow steps, tech stack — swap this
                 for real API calls to your FastAPI backend when it's ready
```

## Connecting a real backend later

Every page currently reads from `src/data/mock.ts` and simulates async actions with `setTimeout`
(repository connect, fix generation, validation). To wire up the real FastAPI backend described in
the project report, replace those mock reads/timeouts with `fetch`/`axios` calls to your API — the
component structure and loading/success states are already in place.

## Design

Dark, developer-tool aesthetic: near-black background, blue → violet gradient accents, glassy cards,
`Space Grotesk` for display type, `Inter` for body text, `JetBrains Mono` for code. The landing page
hero includes an animated "AI scanning code" panel as the signature visual.

## New in this update

Added on top of the original build, without changing any existing page's behavior:

- **`/docs` — How to use CodeVision.ai.** A full walkthrough page (with a scroll-synced table of
  contents) covering every screen: getting started, connecting a repo, reading review results,
  generating and validating fixes, insights/reports, the live analyzer, the command palette, and an FAQ.
  Linked from the landing navbar, the app sidebar, and the command palette.
- **`/app/analyzer` — Live Code Analyzer.** A genuinely working mini static-analysis engine
  (`src/lib/analyzeCode.ts`) that runs entirely in the browser — paste any Python/JS/TS snippet and
  it flags real patterns: hardcoded secrets, SQL built via string concatenation, `eval()`, unsafe
  `innerHTML` assignment, bare/broad `except`, leftover debug prints, `TODO`/`FIXME` markers, a simple
  N+1-loop heuristic, and overly long lines — each with a severity and a suggested fix.
- **`/app/insights` — Insights.** Real charts (an animated SVG donut plus animated bar/progress rows)
  computed live from the mock findings and repository scores: severity breakdown, category breakdown,
  per-repository score, and fix-pipeline status.
- **`/app/reports` — Reports.** Pick a repository and download an actual Markdown report
  (`Blob` + `<a download>` — a real file lands in your Downloads folder) with every finding and its
  suggested diff, with a live preview before you download.
- **Command palette (`Ctrl/Cmd + K`).** Jump to any page, repository, or finding from anywhere in the
  app — arrow keys to move, Enter to go, Esc to close.

These were added as new files (`pages/Docs.tsx`, `pages/Insights.tsx`, `pages/Analyzer.tsx`,
`pages/Reports.tsx`, `components/CommandPalette.tsx`, `lib/analyzeCode.ts`) plus a few purely additive
lines in `App.tsx` (new routes), `components/Sidebar.tsx` (new nav entries), and `components/Navbar.tsx`
(a "Docs" link) — every previously existing page and component is unchanged.
