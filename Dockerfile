# Build stage
FROM node:16-alpine AS builder

# Install dependencies for building
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy package files and required scripts
COPY package.json yarn.lock ./
COPY prei18n-extract.js ./

# Install dependencies using yarn (as specified in package.json)
# Skip postinstall scripts that cause issues in Docker
RUN yarn install --frozen-lockfile --network-timeout 100000 --ignore-scripts

# Copy application code
COPY . .

# Run necessary compilation steps manually
RUN yarn contracts:compile:abi && \
    yarn contracts:compile:v3 || true

# Build the application
RUN yarn build

# Production stage
FROM node:16-alpine

RUN apk add --no-cache --upgrade bash

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "build", "-l", "3000"]