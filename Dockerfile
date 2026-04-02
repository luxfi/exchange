# Lux Exchange - White-Label DEX
# One image, any brand. Config via /config.json mounted by K8s ConfigMap.

# Stage 1: Builder
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++ git
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copy entire monorepo
COPY . .

# Install dependencies — run lifecycle scripts but tolerate failures
RUN NODE_ENV=development pnpm install --no-frozen-lockfile || true
RUN pnpm rebuild || true

# Build-time env — brand-neutral, no hardcoded domains
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=true

# Generate gitignored types before build
RUN cd pkgs/api && pnpm exec openapi \
      --input ./src/clients/trading/api.json \
      --output ./src/clients/trading/__generated__ \
      --useOptions --exportServices true --exportModels true \
    || (mkdir -p src/clients/trading/__generated__/models src/clients/trading/__generated__/core src/clients/trading/__generated__/services && \
        echo 'export {}' > src/clients/trading/__generated__/index.ts)
RUN mkdir -p pkgs/lx/src/abis/types/v3 && \
    echo 'export {}' > pkgs/lx/src/abis/types/v3/index.ts
# compile-ajv-validators needs ajv from pnpm store
RUN cd apps/web && pnpm exec node scripts/compile-ajv-validators.js || true

# Build the web app (Vite SPA) — brand-neutral
RUN cd apps/web && DISABLE_EXTRACTION=1 NODE_OPTIONS="--max-old-space-size=16384" pnpm exec vite build

# Stage 2: Runner
FROM node:22-alpine AS runner
RUN npm install -g serve@14
WORKDIR /app

# Copy built static assets (includes default config.json for Lux)
COPY --from=builder /app/apps/web/build /app/public

# Mount point: K8s ConfigMap mounts brand-specific config here
# kubectl create configmap exchange-brand --from-file=config.json=zoo-config.json
# volumeMounts: [{name: brand, mountPath: /app/public/config.json, subPath: config.json}]
VOLUME ["/app/public/config.json"]

EXPOSE 3000

# serve -s enables SPA mode (all routes -> index.html)
CMD ["serve", "-s", "public", "-l", "3000"]
