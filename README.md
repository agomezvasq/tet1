# App web para visualización GPS con funcionalidad de usuarios

Desarrollado en modelo MVC con API REST seguro. Autenticación con usuario y contraseña (password hashing).

Contiene Dockerfile para despliegue en contenedor CentOS 7. Tiene 3 ambientes de desarrollo: development, test y production. Para test y production se configura la variable NODE_ENV en docker-compose.yml, aunque hasta este momento no varía el funcionamiento o las opciones entre estos dos ambientes.

Por: Andrés Gómez, agomezv3@eafit.edu.co.

## Instalación (CentOS 7 y Docker)

Docker setup:

    source: https://docs.docker.com/install/linux/docker-ce/centos/
    
    $ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    $ sudo yum install docker-ce
    $ sudo systemctl start docker
    $ sudo systemctl enable docker
    
Docker-Compose setup:

    source: https://docs.docker.com/compose/install/

    $ sudo curl -L https://github.com/docker/compose/releases/download/1.20.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    $ sudo chmod +x /usr/local/bin/docker-compose

Para agregar docker-compose al PATH y poderlo ejecutar con sudo por si hay errores de permisos:
  
    $ echo 'export PATH=$PATH;/usr/local/bin/docker-compose' >> ~/.bashrc 
      
Descargar del git:

    $ git clone https://github.com/agomezvasq/tet1/
      
La geolocalización requiere activar SSL y entrar con el prefijo https:// . Para configurar esto se deben generar una clave y un certificado dentro de la carpeta del proyecto:

    $ sudo mkdir ssl
    $ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/nginx.key -out ssl/nginx.crt
    
Se deben llenar los siguientes campos (El más importante es Common Name, llenarlo con el dominio o IP donde se desplegará la app):

    source: https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04

    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New York
    Locality Name (eg, city) []:New York City
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:Bouncy Castles, Inc.
    Organizational Unit Name (eg, section) []:Ministry of Water Slides
    Common Name (e.g. server FQDN or YOUR name) []:your_domain.com
    Email Address []:admin@your_domain.com

Construir y ejecutar:

    $ docker-compose build
    $ docker-compose up
    
## Instalación (local, localhost)

Para pruebas se puede instalar en localhost pero requiere instalar mongodb por aparte. Esto varía segun el sistema operativo; para las instrucciones de instalación puede visitar https://docs.mongodb.com/manual/installation/.

Chequear que el servicio esté corriendo:

    $ net start mongod

Configurar la variable de ambiente development para usar la string de conexión correcta a la base de datos:

    $ set NODE_ENV=development       # para Windows
    $ export NODE_ENV=development    # para Linux

Instalación:

    $ npm install
    
Ejecutar:

    $ npm start
    
El servidor queda corriendo en http://localhost/ .

## Referencias

Esqueleto del proyecto; MVC, config.js y archivos para Docker: https://github.com/st0263eafit/appwebArticulosNodejs

Google Maps API: https://developers.google.com/maps/documentation/javascript/tutorial https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i

MongoDB: https://docs.mongodb.com/manual

Rest API: https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09 https://devcenter.heroku.com/articles/mean-apps-restful-api

Autenticación: https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359

Middleware: https://expressjs.com/en/guide/writing-middleware.html

SSH: https://www.howtogeek.com/336775/how-to-enable-and-use-windows-10s-built-in-ssh-commands/

JWT y llamadas REST seguras: https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens https://www.codementor.io/olatundegaruba/5-steps-to-authenticating-node-js-with-jwt-7ahb5dmyr https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52

Referencia: https://www.w3schools.com/ https://developer.mozilla.org/en-US/ https://stackoverflow.com/
