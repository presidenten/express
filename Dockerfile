FROM node:16.13.2-alpine3.14 as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app

RUN yarn lint && \
    yarn test && \
    yarn build && \
    yarn --production

# ---

FROM node:16.13.2-alpine3.14

WORKDIR /app

COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules

CMD node /app/index.js
