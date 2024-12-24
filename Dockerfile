FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh
EXPOSE 3000
CMD ["sh", "/wait-for.sh", "npm", "run", "start:dev"]
