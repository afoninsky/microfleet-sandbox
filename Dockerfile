FROM node:11.9-alpine
LABEL Author FullDive backend team
ENV NODE_DIR /home/nodejs/app
WORKDIR $NODE_DIR
COPY package.json $NODE_DIR
RUN yarn install --production
COPY . $NODE_DIR

EXPOSE 8080
CMD ["yarn", "start"]
