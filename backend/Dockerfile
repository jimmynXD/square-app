FROM --platform=linux/amd64 node:18-alpine AS base

# Install dependencies only when needed
FROM --platform=linux/amd64 node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Add build arguments
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG NFL_TEAMS_ENDPOINT
ARG NFL_SCHEDULE_ENDPOINT
ARG NFL_LIVE_SCOREBOARD_ENDPOINT
ARG NFL_GAME_SCORE_ENDPOINT

# Set as environment variables for build time
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NFL_TEAMS_ENDPOINT=$NFL_TEAMS_ENDPOINT
ENV NFL_SCHEDULE_ENDPOINT=$NFL_SCHEDULE_ENDPOINT
ENV NFL_LIVE_SCOREBOARD_ENDPOINT=$NFL_LIVE_SCOREBOARD_ENDPOINT
ENV NFL_GAME_SCORE_ENDPOINT=$NFL_GAME_SCORE_ENDPOINT
ENV PORT 8080

# Install dependencies
COPY package.json pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# Production stage
FROM --platform=linux/amd64 node:18-alpine AS runner

WORKDIR /app

# Add runtime environment variables
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NFL_TEAMS_ENDPOINT=$NFL_TEAMS_ENDPOINT
ENV NFL_SCHEDULE_ENDPOINT=$NFL_SCHEDULE_ENDPOINT
ENV NFL_LIVE_SCOREBOARD_ENDPOINT=$NFL_LIVE_SCOREBOARD_ENDPOINT
ENV NFL_GAME_SCORE_ENDPOINT=$NFL_GAME_SCORE_ENDPOINT
ENV PORT 8080
ENV NODE_ENV production

RUN corepack enable pnpm 
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Set directory permissions
RUN chown -R expressjs:nodejs .

# Copy built assets
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/package*.json /app/pnpm-lock.yaml ./

# Switch to non-root user
USER expressjs

EXPOSE 8080

# Install production dependencies
RUN pnpm i --frozen-lockfile --prod

ENTRYPOINT ["node", "dist/server.js"]
