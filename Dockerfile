# Lux Exchange - Vite SPA Dockerfile
# Pre-built locally, packaged into nginx

FROM nginx:alpine

# Copy pre-built static files (build/client/ is the Vite SPA output)
COPY apps/web/build/client /usr/share/nginx/html

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
