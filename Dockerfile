FROM node:6
MAINTAINER Denis Rechkunov <denis.rechkunov@gmail.com>

ENV APP_NAME catberry-example
ENV APP_DEST ~/apps/${APP_NAME}
ENV NODE_ENV production

RUN mkdir -p ${APP_DEST}
COPY . ${APP_DEST}/
WORKDIR ${APP_DEST}
RUN npm i --production
RUN npm run build-release
CMD npm run release
