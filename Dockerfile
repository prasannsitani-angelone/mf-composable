##
#Build#
##
ARG NODE_VERSION
FROM node:18.13.0 as build

ARG BUILD_ENV

WORKDIR /app
COPY . .

RUN chown -R node:node /app
USER node

RUN echo BUILD_ENV is $BUILD_ENV
RUN npm install
RUN npm run build:$BUILD_ENV

#ARCHIVE#
FROM node:18.13.0-alpine as nodejsapp

ENV PORT=8080
USER node
COPY --chown=node:node --from=build /app /app
EXPOSE 8080
WORKDIR /app

ENTRYPOINT [ "node" ]
CMD ["build/index.js"]

