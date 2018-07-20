var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://andres:123456a@ds147011.mlab.com:47011/tet1db');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

require('./app/models/User')

//use sessions for tracking logins
/*app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));*/

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./app/controllers/loginController');
//app.use('/', routes);

/*var models = glob.sync(config.root + './app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();*/

app.get('/', function(req, res, next) {
    return res.sendFile(path.join(__dirname, '/app/views/index.html'));
});

app.get('/map', function(req, res, next) {
    return res.sendFile(path.join(__dirname, '/app/views/map.html'));
});


//create user
User = mongoose.model('User');
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


