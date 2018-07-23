var express = require('express');
var config = require('../../config/config');
var router = express.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var verifyToken = require('./verifyToken')

module.exports = function(app) {
    app.use('/map', router);
};

router.get('/', function(req, res, next) {
    return res.sendFile(config.root + '/app/views/map.html');
});

router.post('/', verifyToken, function (req, res, next) {
    User.findById(req.userId).exec(function (error, user) {
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
                        res.json({ message: 'Event saved successfully' });
                    } 
                });
            }
        }
    });
});

router.get('/getEvents', verifyToken, function(req, res, next) {
    User.findById(req.userId).exec(function (error, user) {
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
});