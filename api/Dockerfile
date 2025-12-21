FROM node:22-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and config
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy entrypoint script and set permissions
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Copy application code
COPY . .

ENTRYPOINT ["./docker-entrypoint.sh"] 