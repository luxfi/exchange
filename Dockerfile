# Lux Exchange - Vite SPA Dockerfile
# Multi-stage build: bun install + vite build -> nginx static serve

# Stage 1: Build
FROM --platform=linux/amd64 oven/bun:latest AS builder

RUN apt-get update && apt-get install -y python3 make g++ git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy entire monorepo (workspaces need each other)
COPY . .

# Install deps; skip preinstall (version check) and postinstall (lefthook, reanimated patch)
RUN bun install --ignore-scripts --no-frozen-lockfile

# Run the ajv prepare step needed before build
RUN cd apps/web && bun run scripts/compile-ajv-validators.js || true

# Build the web app as a static SPA (not Cloudflare workers)
ENV NODE_ENV=production
ENV DEPLOY_TARGET=static
ENV ROLLDOWN_OPTIONS_VALIDATION=loose
RUN cd apps/web && bun run --bun vite build

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
