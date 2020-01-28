FROM node

RUN mkdir /app
ADD package.json /app
RUN cd /app ; npm install

ADD src /app/src
ADD .babelrc /app
ADD .env /app

EXPOSE 8080

WORKDIR "/app"

CMD ["npm","run-script","start"]