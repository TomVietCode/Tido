# Dùng Node bản nhẹ
FROM node:22-slim

# Thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json trước để tận dụng cache của Docker
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code (thực ra bước này sẽ bị volume ghi đè ở docker-compose, nhưng cứ để cho chuẩn)
COPY . .

# Chạy lệnh dev (có hot reload)
CMD ["npm", "run", "dev"] 