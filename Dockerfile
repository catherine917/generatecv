FROM node:12 AS build

WORKDIR /
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["node","main.js"]