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

# Patch @noble/hashes v1.3.3 for v2 compat needed by @scure/bip32@1.7.0
# Adds: ./legacy export, ./sha2.js mapping, abytes/anumber to utils
COPY <<'PATCH' /tmp/patch-noble.js
const fs = require('fs');
const polyfill = `
function abytes(b,...l){if(!(b instanceof Uint8Array))throw new Error("Uint8Array expected");if(l.length>0&&!l.includes(b.length))throw new Error("wrong length")}
function anumber(n){if(!Number.isSafeInteger(n)||n<0)throw new Error("positive integer expected")}
`;
const dirs = [
  'node_modules/.pnpm/@noble+hashes@1.3.3/node_modules/@noble/hashes',
  'node_modules/@noble/hashes'
];
dirs.filter(d => fs.existsSync(d + '/package.json')).forEach(d => {
  const pkg = JSON.parse(fs.readFileSync(d + '/package.json', 'utf8'));
  if (pkg.version !== '1.3.3') return;
  // Add missing exports
  pkg.exports['./legacy'] = { types: './utils.d.ts', import: './esm/legacy.js', default: './legacy.js' };
  if (!pkg.exports['./sha2.js']) pkg.exports['./sha2.js'] = pkg.exports['./sha2'];
  fs.writeFileSync(d + '/package.json', JSON.stringify(pkg, null, 2));
  // Append abytes/anumber to CJS utils
  let cjs = fs.readFileSync(d + '/utils.js', 'utf8');
  if (!cjs.includes('abytes')) {
    cjs += '\n' + polyfill + 'exports.abytes=abytes;exports.anumber=anumber;\n';
    fs.writeFileSync(d + '/utils.js', cjs);
  }
  // Append abytes/anumber to ESM utils
  let esm = fs.readFileSync(d + '/esm/utils.js', 'utf8');
  if (!esm.includes('abytes')) {
    esm += '\nexport ' + polyfill.trim().split('\n').join('\nexport ') + '\n';
    fs.writeFileSync(d + '/esm/utils.js', esm);
  }
  // Create legacy module
  fs.writeFileSync(d + '/legacy.js',
    'const u=require("./utils");const r=require("./ripemd160");const s=require("./sha256");const s5=require("./sha512");module.exports={...u,...r,...s,...s5};');
  fs.writeFileSync(d + '/esm/legacy.js',
    'export * from "./utils.js";export{ripemd160}from"./ripemd160.js";export{sha256}from"./sha256.js";export{sha384,sha512,sha512_256}from"./sha512.js";');
});
PATCH
RUN node /tmp/patch-noble.js

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
ENV NODE_OPTIONS=--max-old-space-size=8192
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
