FROM node:20.18-alpine3.20 AS base

# 1. Setup builder
FROM base AS setup
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune @enigma/website --docker

# 2. Install the deps
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=setup /app/out/json .
RUN npm ci
RUN npm i -g prisma
RUN npm i -g turbo


COPY --from=setup /app/out/full .
RUN npx prisma generate --schema=apps/website/prisma/schema.prisma
RUN turbo run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/.next/static ./apps/webiste/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/public ./apps/webiste/public

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node apps/website/server.js