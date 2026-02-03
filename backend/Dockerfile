# Production stage
FROM node:20-slim as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Install OpenSSL for Prisma
RUN apt-get update
RUN apt-get install -y openssl

COPY prisma ./prisma

RUN npx prisma generate
RUN npx prisma migrate deploy

COPY dist ./dist
COPY src/locales ./dist/locales

CMD ["npm", "run", "serve"]