# Lux Exchange - Vite SPA Dockerfile
# Multi-stage build: pnpm install + vite build -> nginx static serve

# Stage 1: Build (pin exact node version to match engines requirement)
FROM node:22.13.1-alpine AS builder

RUN apk add --no-cache python3 make g++ git bash
RUN npm install -g pnpm

WORKDIR /app

# Copy entire monorepo (workspaces need each other)
COPY . .

# Install deps (ignore preinstall/postinstall scripts that need bash/lefthook)
RUN pnpm install --frozen-lockfile --ignore-scripts || pnpm install --no-frozen-lockfile --ignore-scripts

# Patch @noble/hashes v1.3.3: add missing ./legacy export for vite commonjs resolver
# (v2-only export required by some transitive dependency)
RUN node -e " \
  const fs = require('fs'); \
  const dir = 'node_modules/.pnpm/@noble+hashes@1.3.3/node_modules/@noble/hashes'; \
  const alt = 'node_modules/@noble/hashes'; \
  const d = fs.existsSync(dir) ? dir : alt; \
  const f = d + '/package.json'; \
  const p = JSON.parse(fs.readFileSync(f, 'utf8')); \
  if (!p.exports['./legacy']) { \
    p.exports['./legacy'] = { types: './utils.d.ts', import: './esm/utils.js', default: './utils.js' }; \
    fs.writeFileSync(f, JSON.stringify(p, null, 2)); \
    fs.writeFileSync(d + '/legacy.js', 'module.exports = require(\"./utils\");'); \
    fs.mkdirSync(d + '/esm', { recursive: true }); \
    fs.writeFileSync(d + '/esm/legacy.js', 'export * from \"./utils.js\";'); \
  }"

# Run the ajv prepare step needed before build
RUN cd apps/web && node scripts/compile-ajv-validators.js || true

# Build the web app as a static SPA
# Use ENABLE_REACT_COMPILER=true to use @vitejs/plugin-react (Babel) instead of
# @vitejs/plugin-react-oxc which requires rolldown-vite (strict module resolution
# causes @noble/hashes v1/v2 compat issues in Docker)
ENV NODE_ENV=production
ENV DEPLOY_TARGET=static
ENV ENABLE_REACT_COMPILER=true
ENV CLOUDFLARE_ENV=production
RUN pnpm --filter @luxfi/web exec vite build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

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
