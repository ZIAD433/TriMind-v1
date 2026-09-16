# TRIMIND

TRIMIND is a React/Vite learning platform for investing, business, and startup education. The existing visual shell remains in `src/App.jsx`; a local backend now provides cookie-based authentication and durable profile/progress storage.

## Local development

```bash
npm install
npm run dev:api   # terminal 1: http://localhost:3001
npm run dev       # terminal 2: http://localhost:5173
```

The backend stores local development data in `server/data/trimind.json` (ignored by Git). It uses HTTP-only, SameSite cookies for sessions and never stores the session token in localStorage. Set `NODE_ENV=production` behind HTTPS to enable Secure cookies.

Copy `.env.example` to `.env` when changing ports or origins. The browser only receives `VITE_API_URL`; passwords and private provider credentials stay on the server.

## Current API slice

- `POST /api/auth/register` and `POST /api/auth/login` — email/password auth, scrypt password hashing, rotating expiring sessions.
- `GET /api/auth/me` — current session.
- `POST /api/auth/logout` — session revocation.
- `PUT /api/me/preferences` — onboarding/profile preferences.
- `GET /api/progress` — persisted lesson, quiz, and activity summaries.
- `POST /api/progress/lesson` — idempotent lesson completion.
- `POST /api/progress/quiz` — persisted server endpoint for quiz attempts.
- `POST /api/ai/mentor` — explicit unavailable response until a server provider is configured.

## Database direction

`docker compose up -d postgres` starts the documented local PostgreSQL service for the production data-layer migration. This initial vertical slice deliberately uses a dependency-free JSON repository so it can run immediately in this constrained starter repository; the route and record boundaries are isolated in `server/index.mjs` for migration to Express/Prisma without changing the frontend contract.

## Validation

```bash
npm run lint
npm run build
npm run test:api
```

The frontend still contains the original embedded catalog and presentation mappings. Empty video URLs remain unavailable rather than fabricated. AI credentials are not included; the UI receives an honest backend error when AI is unavailable.
# TriMind-v1
