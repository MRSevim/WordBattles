# Production stage
FROM node:20-slim as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY prisma ./prisma

RUN npx prisma generate

COPY dist ./dist
COPY src/locales ./dist/locales

CMD ["npm", "run", "serve"]