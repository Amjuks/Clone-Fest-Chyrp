FROM node:18

WORKDIR /app

COPY chyrp_frontend/package*.json ./
RUN npm install

COPY chyrp_frontend/ .

CMD ["npm", "start"]