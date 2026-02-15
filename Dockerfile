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

# Patch @noble/hashes v1.3.3: add ./legacy and ./sha2.js exports needed by @scure/bip32@1.7.0
# which expects v2.x API (abytes, anumber, ripemd160 from ./legacy)
RUN node -e " \
  const fs = require('fs'); \
  const glob = require('path'); \
  const dirs = ['node_modules/.pnpm/@noble+hashes@1.3.3/node_modules/@noble/hashes', 'node_modules/@noble/hashes']; \
  dirs.filter(d => fs.existsSync(d)).forEach(d => { \
    const f = d + '/package.json'; \
    const p = JSON.parse(fs.readFileSync(f, 'utf8')); \
    if (p.version !== '1.3.3') return; \
    p.exports['./legacy'] = { types: './utils.d.ts', import: './esm/legacy.js', default: './legacy.js' }; \
    if (!p.exports['./sha2.js']) p.exports['./sha2.js'] = p.exports['./sha2']; \
    fs.writeFileSync(f, JSON.stringify(p, null, 2)); \
    const cjs = 'const u=require(\"./utils\");const r=require(\"./ripemd160\");const s2=require(\"./sha256\");const s5=require(\"./sha512\");function abytes(b,...l){if(!(b instanceof Uint8Array))throw new Error(\"Uint8Array expected\");if(l.length>0&&!l.includes(b.length))throw new Error(\"Uint8Array expected of length \"+l)}function anumber(n){if(!Number.isSafeInteger(n)||n<0)throw new Error(\"positive integer expected\")}module.exports={...u,...r,...s2,...s5,abytes,anumber};'; \
    const esm = 'export * from \"./utils.js\";export{ripemd160}from\"./ripemd160.js\";export{sha256}from\"./sha256.js\";export{sha384,sha512,sha512_256}from\"./sha512.js\";export function abytes(b,...l){if(!(b instanceof Uint8Array))throw new Error(\"Uint8Array expected\");if(l.length>0&&!l.includes(b.length))throw new Error(\"Uint8Array expected of length \"+l)}export function anumber(n){if(!Number.isSafeInteger(n)||n<0)throw new Error(\"positive integer expected\")}'; \
    fs.writeFileSync(d + '/legacy.js', cjs); \
    fs.mkdirSync(d + '/esm', { recursive: true }); \
    fs.writeFileSync(d + '/esm/legacy.js', esm); \
  });"

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
