import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. In Railway, add PostgreSQL and reference its DATABASE_URL in the web service variables.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
});
