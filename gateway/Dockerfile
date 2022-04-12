from node:16-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .

RUN npm install && npm install typescript -g

COPY index.ts .

RUN tsc

CMD [ "node", "./dist/index.js" ]
