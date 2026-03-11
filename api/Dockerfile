FROM node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY . .

RUN npm ci

ARG POSTGRES_URL
ENV POSTGRES_URL=$POSTGRES_URL

RUN npx prisma generate && npm run build

FROM node:22-alpine AS run

WORKDIR /app

COPY --from=build /app .

CMD ["npm", "run", "start:prod"]