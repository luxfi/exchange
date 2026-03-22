# Lux Exchange — Vite SPA
# Pre-built locally, served by `serve` (no nginx — ingress handles routing/TLS)

FROM node:24-alpine

RUN npm install -g serve@14

COPY apps/web/build/client /app

EXPOSE 3000

CMD ["serve", "-s", "/app", "-l", "3000", "--no-clipboard"]
