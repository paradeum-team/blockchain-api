FROM node:14-alpine

COPY ./.  /dist/
WORKDIR /dist

RUN npm install --only=production


EXPOSE 3000

CMD ["npm", "run", "start"]
