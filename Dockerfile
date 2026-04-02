# Lux Exchange - White-Label DEX
# Target: <2min builds with layer caching

# Stage 1: Dependencies (cached unless package.json/lockfile changes)
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ git
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copy ONLY dependency manifests first — maximizes cache hits
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/
COPY apps/extension/package.json apps/extension/
COPY pkgs/api/package.json pkgs/api/
COPY pkgs/lx/package.json pkgs/lx/
COPY pkgs/ui/package.json pkgs/ui/
COPY pkgs/wallet/package.json pkgs/wallet/
COPY pkgs/utilities/package.json pkgs/utilities/
COPY pkgs/config/package.json pkgs/config/
COPY pkgs/sessions/package.json pkgs/sessions/
COPY pkgs/gating/package.json pkgs/gating/
COPY pkgs/notifications/package.json pkgs/notifications/
COPY pkgs/prices/package.json pkgs/prices/
COPY pkgs/exchange/package.json pkgs/exchange/
COPY pkgs/dex/package.json pkgs/dex/
COPY pkgs/websocket/package.json pkgs/websocket/
COPY pkgs/logger/package.json pkgs/logger/
COPY pkgs/privacy/package.json pkgs/privacy/
COPY pkgs/analytics/package.json pkgs/analytics/
COPY pkgs/datadog-cloud/package.json pkgs/datadog-cloud/
COPY pkgs/biome-config/package.json pkgs/biome-config/
COPY pkgs/eslint-config/package.json pkgs/eslint-config/
COPY pkgs/react-query/package.json pkgs/react-query/
COPY pkgs/trpc/package.json pkgs/trpc/
COPY pkgs/mycelium/package.json pkgs/mycelium/
COPY pkgs/hashcash-native/package.json pkgs/hashcash-native/
COPY pkgs/options/package.json pkgs/options/
COPY config/vitest-presets/package.json config/vitest-presets/
COPY config/jest-presets/package.json config/jest-presets/
COPY config/tsconfig/package.json config/tsconfig/

# Install deps — this layer is cached unless manifests change
RUN NODE_ENV=development pnpm install --no-frozen-lockfile --ignore-scripts

# Stage 2: Build (cached unless source changes)
FROM deps AS builder
WORKDIR /app

# Copy source code (separate from deps for caching)
COPY . .

# Rebuild native modules and run postinstall scripts now that source is available
RUN pnpm rebuild || true
RUN cd pkgs/biome-config && node scripts/generate.js || true

# Generate gitignored types
RUN cd pkgs/api && pnpm exec openapi \
      --input ./src/clients/trading/api.json \
      --output ./src/clients/trading/__generated__ \
      --useOptions --exportServices true --exportModels true \
    || (mkdir -p src/clients/trading/__generated__/models src/clients/trading/__generated__/core src/clients/trading/__generated__/services && \
        echo 'export {}' > src/clients/trading/__generated__/index.ts)
RUN mkdir -p pkgs/lx/src/abis/types/v3 && echo 'export {}' > pkgs/lx/src/abis/types/v3/index.ts
RUN cd apps/web && pnpm exec node scripts/compile-ajv-validators.js || true

# Build — brand-neutral
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production DOCKER_BUILD=true
RUN cd apps/web && DISABLE_EXTRACTION=1 NODE_OPTIONS="--max-old-space-size=8192" pnpm exec vite build

# Stage 3: Runner (tiny — just serve + static files)
FROM node:22-alpine AS runner
RUN npm install -g serve@14
RUN addgroup -g 1001 -S app && adduser -S app -u 1001
WORKDIR /app
COPY --from=builder /app/apps/web/build /app/public
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chown -R app:app /app
USER app
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["serve", "-s", "public", "-l", "3000"]
