# Exchange Dockerfile - React/Uniswap interface
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV REACT_APP_CHAIN_ID=96369
ENV GENERATE_SOURCEMAP=false
RUN yarn build

# Production stage - serve with nginx
FROM nginx:alpine AS runner

# Copy custom nginx config if exists
COPY nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || :

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Add a simple default nginx config if none exists
RUN if [ ! -f /etc/nginx/conf.d/default.conf ]; then \
  echo 'server { \
    listen 3000; \
    location / { \
      root /usr/share/nginx/html; \
      index index.html index.htm; \
      try_files $uri $uri/ /index.html; \
    } \
    location /api { \
      proxy_pass http://lux-node:8545; \
    } \
  }' > /etc/nginx/conf.d/default.conf; \
  fi

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]