FROM ubuntu:latest

RUN apt-get update
RUN apt-get install make gcc g++ python curl -y
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

COPY . ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install -g grunt-cli node-gyp node-pre-gyp pm2
RUN npm install --production
RUN apt-get remove make gcc g++ python curl -y
RUN grunt

EXPOSE 3000

CMD [ "pm2-runtime", "start", "process.json" ]