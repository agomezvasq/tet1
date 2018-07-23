var express = require('express');
var config = require('../../config/config');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/', function(req, res, next) {
    if (req.session) {
      User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            return res.sendFile(config.root + '/app/views/index.html');
          } else {
            return res.redirect('/map')
          }
        }
      });
    } else {
      return res.sendFile(config.root + '/app/views/index.html');
    }
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    if (req.body.username && req.body.password) {
      User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/map');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

router.post('/register', function (req, res, next) {
    console.log(req.body);
    if (req.body.regusername && req.body.regpassword) {
        var newUser = new User({ 
            username: req.body.regusername, 
            password: req.body.regpassword 
        });
        newUser.save(function(err, newUser) {
            if (err) {
                return next(err);
            } else {
              req.session.userId = newUser._id;
              return res.redirect('/map');
            }
        });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
            return next(err);
        } else {
            return res.redirect('/');
        }
      });
  }
});