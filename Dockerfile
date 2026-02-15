# Lux Exchange - Vite SPA Dockerfile
# Multi-stage build: pnpm install + vite build -> nginx static serve

# Stage 1: Build
FROM --platform=linux/amd64 node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ git
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy entire monorepo (workspaces need each other)
COPY . .

# Install deps using pnpm (matches pnpm-lock.yaml)
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# Run the ajv prepare step needed before build
RUN cd apps/web && node scripts/compile-ajv-validators.js || true

# Build the web app as a static SPA
ENV NODE_ENV=production
ENV DEPLOY_TARGET=static
ENV ROLLDOWN_OPTIONS_VALIDATION=loose
RUN cd apps/web && pnpm exec vite build

# Stage 2: Serve with nginx
FROM --platform=linux/amd64 nginx:alpine AS runner

# Copy built static files (vite outDir is 'build')
COPY --from=builder /app/apps/web/build /usr/share/nginx/html

# Nginx config for SPA routing
RUN printf 'server {\n\
    listen 3000;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
