# Sử dụng Node.js image nhẹ (Alpine)
FROM node:22-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Cài đặt các thư viện cần thiết cho native modules (nếu cần, ví dụ bcrypt đôi khi cần python/make)
# Với bcrypt js thuần thì không cần, nhưng an toàn thì cứ để
RUN apk add --no-cache python3 make g++

# Copy package.json và package-lock.json trước để tận dụng Docker cache
COPY package*.json ./

# Copy thư mục prisma để chạy prisma generate
COPY prisma ./prisma/

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Generate Prisma Client (Bắt buộc để NestJS hiểu schema)
RUN npx prisma generate

# Expose port mà NestJS chạy (mặc định 3000)
EXPOSE 8000

# Lệnh mặc định (sẽ bị ghi đè bởi docker-compose nếu có)
CMD [ "npm", "run", "dev" ]