FROM node:22-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs \
	&& adduser -S nodejs -u 1001 -G nodejs

USER nodejs

EXPOSE 5000

CMD ["npm", "start"]
