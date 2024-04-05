FROM node:21.7 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]
