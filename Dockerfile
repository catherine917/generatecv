FROM node:12-alpine AS build

WORKDIR /
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node","main.js"]