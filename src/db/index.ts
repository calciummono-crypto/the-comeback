import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// During `next build` (including Railway's Docker build) the real database URL
// may not be present yet. Runtime startup (`start.sh`) validates DATABASE_URL
// before migrations/server start, so a harmless placeholder is enough here.
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
