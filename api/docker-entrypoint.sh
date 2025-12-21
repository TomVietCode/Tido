#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Waiting for PostgreSQL and running migrations..."
# Retry migrations until database is ready (max 30 attempts = 60 seconds)
RETRIES=30
until npx prisma migrate deploy; do
  RETRIES=$((RETRIES-1))
  if [ $RETRIES -eq 0 ]; then
    echo "Failed to run migrations after 30 attempts. Database might not be ready."
    exit 1
  fi
  echo "Waiting for database... ($RETRIES attempts left)"
  sleep 2
done

echo "Migrations completed successfully"
echo "Starting application..."
exec npm run dev

