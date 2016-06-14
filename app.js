var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var knex = require('./db/knex');


// include route files
var routes = require('./routes/index');
var users = require('./routes/users');
var maps = require('./routes/maps');
var photos = require('./routes/photos');
var admin = require('./routes/admin');
var games = require('./routes/games');
var players = require('./routes/players');


// establish app
var app = express();



app.use(cookieSession(
  {
    name: 'session',
    keys: [
      process.env.SESSION_KEY1,
      process.env.SESSION_KEY2,
      process.env.SESSION_KEY3
    ]
  }
));


// middleware to handle session setup - persist session info
app.use(function(req,res,next){

  // TODO ignore certain urls???
  //      this fires for all requests


  // TODO when signing in - find a matching player - if user && noplayer
  // console.log('session user', req.session.user);
  // console.log('why does this log twice?');
  // TODO move this line to route files
  res.locals.user = req.session.user;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/maps', maps);
app.use('/photos', photos);
app.use('/admin', admin);
app.use('/games', games);
app.use('/players', players);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
