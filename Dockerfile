FROM node:9.6.1

LABEL version="1.0"
LABEL description="App para registrar localización y enviarla a una base de datos"
LABEL maintainer="Andrés Gómez - agomezv3@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT

WORKDIR /nodeApp
COPY . ./

RUN mv ssl /etc/nginx/ssl

RUN npm install --test

EXPOSE 3000
CMD npm start
