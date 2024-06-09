FROM  node:alpine

COPY package*.json ./

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install

CMD [ "npm", "start" ]