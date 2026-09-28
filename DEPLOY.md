# Railway deployment

This repository is configured for Railway with `Dockerfile`, `railway.json`, and `start.sh`.

## Required variable

- `DATABASE_URL` — required. Add PostgreSQL in the same Railway project, then in the web service go to **Variables → New Variable → Add Reference** and select the PostgreSQL service's `DATABASE_URL`.

## Optional variables

These are optional because the app has fallbacks in `src/lib/config.ts`, but setting them in Railway is recommended for production:

- `DISCORD_CLIENT_ID` — Discord OAuth app client ID.
- `DISCORD_CLIENT_SECRET` — Discord OAuth app client secret.
- `SESSION_SECRET` — long random string used to sign login cookies.
- `ADMIN_DISCORD_ID` — Discord user ID that should always be admin.
- `ADMIN_USERNAMES` — comma-separated Discord usernames that should be admin.
- `PUBLIC_BASE_URL` — app URL, for example `https://your-app.up.railway.app`. Usually not required because the app reads Railway proxy headers.

## Deploy steps

1. Deploy this GitHub repo/branch to Railway.
2. Add a PostgreSQL database to the Railway project.
3. Reference the database `DATABASE_URL` in the web service variables.
4. Let Railway build/deploy. Startup waits for Postgres, runs `drizzle-kit push --config=drizzle.config.ts --force`, then starts Next.js on `0.0.0.0:$PORT`.
5. Generate a Railway domain.
6. If using Discord login, add this redirect URL in Discord Developer Portal → OAuth2 → Redirects:

   ```text
   https://YOUR-DOMAIN.up.railway.app/api/auth/discord/callback
   ```

## What was fixed

The old startup used Drizzle's default `drizzle.config.json`, which pointed at `127.0.0.1`. On Railway, Postgres is not at localhost, so startup could stall or fail while pulling the schema. The new startup explicitly uses `drizzle.config.ts`, which reads `process.env.DATABASE_URL`, waits until the database is reachable, then runs migrations before starting the server.
