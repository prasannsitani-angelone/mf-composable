##
#Build#
##
ARG NODE_VERSION
FROM node:18.13.0 as build

ARG BUILD_ENV

WORKDIR /app
COPY . .

RUN chown -R node:node /app

RUN npm install -g pnpm 
USER node

RUN echo BUILD_ENV is $BUILD_ENV
RUN pnpm install
RUN pnpm format:check
RUN pnpm lint --max-warnings=70
RUN pnpm run build:$BUILD_ENV

#ARCHIVE#
FROM node:18.13.0-alpine as nodejsapp

ENV PORT=8080
USER node
COPY --chown=node:node --from=build /app /app
EXPOSE 8080
WORKDIR /app

ENTRYPOINT [ "node" ]
CMD ["build/index.js"]

