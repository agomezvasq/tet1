var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'test';

var config = {
  development: {
    baseUrl: '/',
    root: rootPath,
    app: {
      name: 'tet1'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/tet1db',
    secret: 'secret'
  },

  test: {
    baseUrl: '/',
    root: rootPath,
    app: {
      name: 'tet1'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongo-server/tet1db',
    secret: 'secret'
  },

  production: {
    baseUrl: '/',
    root: rootPath,
    app: {
      name: 'tet1'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://andres:123456a@mongo-server/tet1db',
    secret: 'secret'
  }
};

module.exports = config[env];
