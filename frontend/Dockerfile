FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=500 npm start"]

