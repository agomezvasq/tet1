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
        res.json({ auth: false, error: 'Wrong email or password.' });
      } else {
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        return res.json({ auth: true, token: token });
      }
    });
  } else {
    res.json({ auth: false, error: 'All fields required.' });
  }
});


router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    
    res.status(200).send(decoded);
  });
});

router.post('/register', function (req, res, next) {
  if (req.body.username && req.body.password) {
      var newUser = new User({ 
          username: req.body.username, 
          password: req.body.password 
      });
      newUser.save(function(err, newUser) {
          if (err) {
              return next(err);
          } else {
            // create a token
            var token = jwt.sign({ id: newUser._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });

            return res.json({ auth: true, token: token });
          }
      });
  } else {
    return res.json({ auth: false, error: 'All fields required.' });
  }
});

router.get('/logout', function (req, res, next) {
  
});