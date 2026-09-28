# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The real DATABASE_URL is injected by Railway at runtime. This placeholder
# lets modules that read env during `next build` load without crashing.
ENV DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY package.json package-lock.json next.config.ts tsconfig.json ./
COPY drizzle.config.ts ./
COPY src/db ./src/db
COPY start.sh ./start.sh
RUN chmod +x ./start.sh
EXPOSE 3000
CMD ["./start.sh"]
