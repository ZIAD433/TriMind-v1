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

## Railway deployment

The repository pins Node.js 22 through `.nvmrc`, `package.json`, and `railway.toml`. This is required because the current Vite/Rolldown toolchain does not build on Railway's older Node 18 image.

Deploy the backend as its own Railway service from this repository:

1. Create a Railway project and add a service from GitHub.
2. Set the service start command to `npm run start:api` (the included `railway.toml` does this automatically).
3. Generate a public Railway domain and verify `https://YOUR-API-DOMAIN/api/health` returns `{ "ok": true }`.
4. Set backend variables:
   - `NODE_ENV=production`
   - `FRONTEND_ORIGIN=https://YOUR-FRONTEND-DOMAIN`
   - `PORT` is supplied by Railway automatically.
5. In the frontend hosting service, set `VITE_API_URL=https://YOUR-API-DOMAIN/api` and redeploy the frontend. This is a build-time variable; changing it requires a new frontend deployment.

Do not set `VITE_API_URL` to `localhost` in production. In a deployed browser, `localhost` refers to the visitor's own computer. If the frontend reports `Unable to reach the backend`, first open the Railway health URL directly, then check the exact frontend origin in `FRONTEND_ORIGIN`.

The local JSON repository is not suitable for production persistence on Railway's ephemeral filesystem. Use a Railway PostgreSQL service and migrate the repository before relying on production student records.

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
# TriMind-v1
# TriMind-v1
