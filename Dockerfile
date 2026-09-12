FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git libc6-compat python3 make g++ \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD ["sh", "-lc", "yarn install && yarn dev"]
