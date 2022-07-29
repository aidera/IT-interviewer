FROM node:18.2-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm rebuild sass

# for Ubuntu user permission fix
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]