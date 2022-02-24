FROM node:14-alpine

COPY ./.  /dist/
RUN npm install --only=production

WORKDIR /

EXPOSE 3000

CMD ["npm", "run", "start"]
