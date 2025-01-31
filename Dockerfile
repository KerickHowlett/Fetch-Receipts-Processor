FROM docker.io/node:lts AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

FROM docker.io/node:lts AS test

USER node

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN chmod +x ./scripts/run-tests.sh

CMD ["sh", "-c", "./scripts/run-tests.sh"]

FROM docker.io/node:lts AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM docker.io/node:lts-alpine AS production

ENV PORT=4000
EXPOSE 4000

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist/fetch .

CMD ["node", "main.js"]
