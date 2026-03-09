FROM node:18-slim

WORKDIR /app

# Use production environment
ENV NODE_ENV=production

# Install dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

# Copy app source
COPY . .

# Expose default port
EXPOSE 3000

CMD ["node", "server.js"]
