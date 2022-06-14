FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package*.json yarn.lock ./
COPY prisma ./prisma/
COPY .env.local ./

RUN export NODE_ENV=production
RUN yarn
RUN yarn add @prisma/client@3.14.0

COPY . .
RUN yarn prisma generate --schema ./prisma/schema.prisma

RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]