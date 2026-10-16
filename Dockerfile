FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY . .
RUN useradd -m bot && chown -R bot:bot /app
USER bot
ENV NODE_ENV=production
CMD ["node", "--max-old-space-size=512", "index.js"]
