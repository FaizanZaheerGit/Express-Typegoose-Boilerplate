# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only lock and manifest first (for better caching)
COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --frozen-lockfile

# Copy rest of the codebase
COPY . .

# Build the app
RUN pnpm run build

# Stage 2: Slim runtime image
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm store prune && rm -rf ~/.cache

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/app.js"]
