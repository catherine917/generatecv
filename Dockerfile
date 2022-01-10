FROM node:12 AS build

WORKDIR /
COPY . .
RUN yarn install