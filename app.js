var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://andres:123456a@ds147011.mlab.com:47011/tet1db');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

root = __dirname;

require(root + '/app/models/User');
require(root + '/app/models/Event');

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require(root + '/app/controllers/loginController');
//app.use('/', routes);

/*var models = glob.sync(config.root + './app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();*/

app.get('/', function(req, res, next) {
  if (req.session) {
    User.findById(req.session.userId).exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.sendFile(path.join(__dirname, '/app/views/index.html'));
        } else {
          return res.redirect('/map')
        }
      }
    });
  } else {
    return res.sendFile(path.join(__dirname, '/app/views/index.html'));
  }
});

app.get('/getUsername', function(req, res, next) {
  if (req.session) {
    User.findById(req.session.userId).exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not logged in');
          err.status = 400;
          return next(err);
        } else {
          res.send(user.username);
        }
      }
    });
  } else {
    var err = new Error('Not logged in');
    err.status = 400;
    return next(err);
  }
});

app.get('/getEvents', function(req, res, next) {
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

app.get('/map', function(req, res, next) {
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
          return res.sendFile(path.join(__dirname, '/app/views/map.html'));
        }
      }
    });
  }
});


//create user
User = mongoose.model('User');
Event = mongoose.model('Event');
/*var newUser = new User({ username: 'andres', password: '123' })
newUser.save(function(err, newArticulo) {
    if (err) {
        return next(err);
    }
  });*/


app.post('/', function (req, res, next) {
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

app.post('/map', function (req, res, next) {
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

app.get('/logout', function (req, res, next) {
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

app.post('/register', function (req, res, next) {
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});


