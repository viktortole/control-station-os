# Repository Guidelines

Contributor playbook for Control Station OS. Keep changes small, traceable, and oriented around reliable punishment-and-reward mechanics.

## Project Structure & Module Organization
- Frontend lives in `src/`: `app/App.jsx` bootstraps the shell, `components/` holds shared UI, `features/` groups domain flows (auth, missions, focus, dashboard), `shared/` contains stores (`useGameStore.js`, `useAuthStore.js`), config, and utilities, and `assets/` hosts media. Tests sit in `src/tests/` with setup in `src/tests/setup.js`.
- `public/` serves static assets for Vite; `dist/` is the Vite build output. Electron packaging outputs to `release/`.
- `electron/` contains the main process entry (`main.cjs`) and packaging config; keep renderer code in `src/`.
- `backend/` is a FastAPI service (`main.py` plus `api/`, `models/`, `services/`, `config/`); align API contracts with the React client endpoints.

## Build, Test, and Development Commands
- Install deps: `npm install` (frontend/electron) and `pip install -r backend/requirements.txt` (backend).
- Frontend dev server: `npm run dev`; preview a production build with `npm run preview`.
- Production builds: `npm run build` (default) or `npm run build:prod` (production env); analyze bundles with `npm run build:analyze`.
- Desktop app: `npm run electron` (packaged build) or `npm run electron-dev` (`ELECTRON_IS_DEV=true`); ship binaries locally with `npm run dist` or `npm run ship`.
- Quality gates: `npm run lint`, `npm run test`, `npm run test:run`, `npm run test:coverage`.
- Backend dev: `uvicorn backend.main:app --reload --app-dir backend` (ensure `.env` mirrors `backend/.env.example`).

## Coding Style & Naming Conventions
- JavaScript/JSX modules with ES imports; prefer functional components and hooks-only state. Follow 2-space indentation, single quotes, and keep component files in PascalCase (e.g., `MissionControl.jsx`); utility/state files use camelCase (`useGameStore.js`).
- ESLint config enforces `@eslint/js` recommended rules plus React Hooks checks; unused vars are blocked unless intentionally constant-like (`^[A-Z_]`). Run `npm run lint` before PRs.
- Tailwind CSS is available—re-use existing tokens (e.g., `bg-dark-bg`, `text-neon-blue`) and favor composable utility classes over inline styles.

## Testing Guidelines
- Vitest (jsdom, globals) drives tests; place specs in `src/tests/**` or beside the feature with `*.test.js` suffix. Use `setup.js` for shared mocks and DOM polyfills.
- Cover new logic pathways, especially game-state transitions, auth flows, and punishment/XP calculations. Aim for meaningful assertions over snapshot-only coverage.
- Run `npm run test` locally; add `npm run test:coverage` before shipping significant changes to guard regressions.

## Commit & Pull Request Guidelines
- Match the existing history: emoji + uppercase impact tag works well (`🚀 MAJOR: ...`, `🧰 CHORE: ...`). Keep subjects imperative and short.
- For PRs, include: purpose and scope, linked issue, how to run/validate (`npm run dev`, `npm run test`, backend command if touched), and screenshots/GIFs for UI changes (desktop + windowed Electron when relevant).
- Note any config changes (`.env`, Electron build targets, backend settings) and backward compatibility considerations (migrations, API surface shifts).

## Security & Configuration
- Never commit secrets. Base configs live in `.env.example` (root) and `backend/.env.example`; copy to local `.env` files and keep them git-ignored.
- CORS, auth, and persistence settings are centralized in `backend/config/settings.py` and `src/shared/config/`; update both sides when changing endpoints or storage keys.
- When packaging, verify assets referenced in `electron/main.cjs` and `public/icon.png` exist to avoid broken installers.
