# Use the official Node.js image as the base image
FROM node:22-alpine3.20 AS base

# 1. Setup builder
FROM base AS setup
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune @enigma/backend --docker

# 2. Install the deps
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=setup /app/out/json .
RUN npm ci
RUN npm i -g prisma
RUN npm i -g turbo

COPY --from=setup /app/out/full .
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma
RUN turbo run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/node_modules/.prisma ./node_modules/.prisma

USER nestjs

# Expose the application port
EXPOSE 3002

# Command to run the application
CMD ["node", "src/main"]