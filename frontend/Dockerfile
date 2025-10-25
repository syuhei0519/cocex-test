# syntax=docker/dockerfile:1.7

FROM node:20-bullseye AS base

WORKDIR /usr/src/app

ENV NODE_ENV=development

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libatspi2.0-0 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libgtk-3-0 \
        libnss3 \
        libnspr4 \
        libx11-xcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxfixes3 \
        libxi6 \
        libxkbcommon0 \
        libxrandr2 \
        libxrender1 \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . .

RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package.json ]; then npm install; \
    else echo "No package manifest found. Skipping install."; fi

USER node

EXPOSE 3000

CMD ["sh", "-c", "if [ -f package.json ]; then npm run dev; else echo 'No package.json found. Container idle.' && tail -f /dev/null; fi"]
