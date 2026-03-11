# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy source code
COPY . .

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

RUN npm prune --production  

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache libc6-compat

RUN mkdir -p /app/data

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 8000

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/main.js"]

