# ===============================
# 🐾 Pet Sitter Platform - Dockerfile (Fixed)
# ===============================
FROM node:18-alpine

WORKDIR /app

# คัดลอก package.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกทุกไฟล์โปรเจกต์เข้ามา
COPY . .

# เปิด port 3000
EXPOSE 3000

# รันแอป
CMD ["node", "server.js"]
