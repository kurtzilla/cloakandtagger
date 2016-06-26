var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var knex = require('./db/knex')
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var strategy = require('./routes/setup-passport.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Auth0Strategy = require('passport-auth0');


// include route files
var routes = require('./routes/index');
var users = require('./routes/users');
var maps = require('./routes/maps');
var photos = require('./routes/photos');
var admin = require('./routes/admin');
var games = require('./routes/games');
var locale = require('./routes/locale');
var qtest = require('./routes/qtest');

var enums = require('./lib/enums');


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

app.use(cookieParser());

// TODO this looks like auth0/passport stuff
// Sam can you update what the secret value should be here?
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({ secret: 'YOUR_SECRET_HERE',
  resave: true,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);
app.use('/maps', maps);
app.use('/photos', photos);
app.use('/admin', admin);
app.use('/games', games);
app.use('/locale', locale);
app.use('/qtest', qtest);


// Auth0 callback handler
// TODO when logging in with Auth0 email (not social) no token provided find a substitute
app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res, next) {

    console.log('Return from auth0', req.user);

    var _provider = req.user.provider;
    var _displayName = req.user.displayName;
    var _token = req.user.identities[0].access_token;
    var _email = req.user.emails[0].value;


    console.log('values', _provider, _email);

    knex('users')
    .where({email:_email})
    .first()
    .then(function(existing){
      if(existing){
        knex('users')
        .where({email:_email})
        .update({
          loginprovider: _provider,
          logintoken: _token
        })
        .then(function(id){

          //console.log('Updated data', id);

          existing.loginprovider = _provider;
          existing.logintoken = _token;
          req.session.user = existing;
          res.redirect('/join');
        })
        .catch(function(err){
          next(err);
        });
      } else {
        knex('users')
        .insert({
          roles: JSON.stringify([enums.userRole[0]]),
          email: _email,
          password:'',
          alias: _email,
          loginprovider: _provider,
          logintoken: _token
        })
        .returning('id')
        .then(function(id){
          knex('users')
          .where({id:parseInt(Array.isArray(id) ? id[0] : id)})
          .first()
          .then(function(user){

            console.log('New user added', user.email);
            req.session.user = user;
            res.redirect('/join');
          })
          .catch(function(err){
            next(err);
          });
        })
        .catch(function(err){
          next(err);
        });
      }
    })
    .catch(function(err){
      next(err);
    });



});



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
