FROM node:12

WORKDIR /
COPY . .
RUN yarn install
EXPOSE 8080
CMD ["node","main.js"]