var express = require('express');
var config = require('../../config/config');
var router = express.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var verifyToken = require('./verifyToken');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/', function(req, res, next) {
    return res.sendFile(config.root + '/app/views/index.html');
});

router.get('/error', function(req, res, next) {
    return res.sendFile(config.root + '/app/views/error.html');
});

router.post('/login', function (req, res, next) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        res.json({ auth: false, error: 'Usuario o contraseña incorrectos.' });
      } else {
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        return res.json({ auth: true, token: token });
      }
    });
  } else {
    res.json({ auth: false, error: 'Todos los campos requeridos.' });
  }
});

router.post('/register', function (req, res, next) {
  if (req.body.username && req.body.password) {
      var newUser = new User({ 
          username: req.body.username, 
          password: req.body.password 
      });
      newUser.save(function(err, newUser) {
          if (err) {
            if (err.code == 11000) {
              return res.json({ register: false, error: 'Este usuario ya existe.' });
            } else {
              return res.json({ register: false, error: err.err });
            }
          } else {
            // create a token
            var token = jwt.sign({ id: newUser._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });

            return res.json({ register: true, token: token });
          }
      });
  } else {
    return res.json({ register: false, error: 'Todos los campos requeridos.' });
  }
});

router.get('/logout', function (req, res, next) {
  
});