# Build Environment
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .
RUN npm run build

# Runtime Environment
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN addgroup -g 5001 appgroup && \
    adduser -D -u 5001 -G appgroup appuser

RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html

USER appuser

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
