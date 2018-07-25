FROM node:9.6.1

LABEL version="1.0"
LABEL description="App para registrar localización y enviarla a una base de datos"
LABEL maintainer="Andrés Gómez - agomezv3@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT

WORKDIR /nodeApp
COPY . ./

RUN mkdir -p /etc/nginx/
RUN mv ssl /etc/nginx/

RUN npm install --test

EXPOSE 3000
CMD npm start
