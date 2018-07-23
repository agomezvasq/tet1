var express = require('express');
var config = require('../../config/config');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');

module.exports = function(app) {
    app.use('/map', router);
};

router.get('/', function(req, res, next) {
    if (req.session) {
        User.findById(req.session.userId).exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                return next(err);
                } else {
                    return res.sendFile(config.root + '/app/views/map.html');
                }
            }
        });
    }
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                return next(err);
            } else {
                var newEvent = new Event({ 
                    username: user.username, 
                    location: req.body.location,
                    time: req.body.time
                });
                newEvent.save(function(err, newEvent) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    } else {              
                        res.send('Event saved successfully');
                    } 
                });
            }
        }
    });
});

router.get('/getEvents', function(req, res, next) {
    if (req.session) {
        User.findById(req.session.userId).exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized!');
                    err.status = 400;
                    return next(err);
                } else {
                    Event.find({ username: user.username }, function(err, events) {
                        if (err) {
                        return next(err);
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ username: user.username, events: events }));
                    });
                }
            }
        });
    } else {
        var err = new Error('Not authorized!');
        err.status = 400;
        return next(err);
    }
});