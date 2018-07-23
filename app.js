var express = require('express');
var config = require('./config/config');
var bodyParser = require('body-parser');
var compress = require('compression');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var glob = require('glob');

//connect to MongoDB
mongoose.connect(config.db);
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//Require models
var models = glob.sync(__dirname + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());

//use sessions for tracking logins
/*app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));*/

//Require controllers
var controllers = glob.sync(__dirname + '/app/controllers/*.js');
controllers.forEach(function (controller) {
  require(controller)(app);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File not found.');
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
app.listen(config.port, function () {
  console.log('Express app listening on port ' + config.port);
});