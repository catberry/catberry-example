FROM node:alpine
MAINTAINER Denis Rechkunov <denis@rdner.de>

ENV APP_NAME catberry-example
ENV APP_DEST ~/apps/${APP_NAME}
ENV NODE_ENV production

RUN mkdir -p ${APP_DEST}
COPY . ${APP_DEST}/
WORKDIR ${APP_DEST}
CMD npm start
