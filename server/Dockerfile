FROM node:22-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

RUN addgroup -g 1001 -S nodejs

USER useradd -S nodejs -u 1001

EXPOSE 3000

CMD ["node","server.js"]
