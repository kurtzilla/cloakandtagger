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

// include route files
var routes = require('./routes/index');
var users = require('./routes/users');
var maps = require('./routes/maps');
var photos = require('./routes/photos');
var admin = require('./routes/admin');
var games = require('./routes/games');

var enums = require('./lib/enums');


// establish app
var app = express();

// tabris app setup
  // var page = new tabris.Page({
  //   topLevel: true,
  //   title: "app"
  // });
  // new tabris.TextView({
  //   layoutData: {centerX: 0, centerY: 0},
  //   text: "My First App"
  // }).appendTo(page);
  // page.open();

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
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({ secret: 'YOUR_SECRET_HERE', resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/maps', maps);
app.use('/photos', photos);
app.use('/admin', admin);
app.use('/games', games);
// app.use('/user', user);
// app.use('/setup-passport', passport);
// app.use('/auth', auth);




// Auth0 callback handler
app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    //TODO:All Signup/login logic
    //TODO:If New - Insert into DB, return user ID, set req.session.id
    //TODO:Else - get user ID - set req.session.id
    if (!req.session.user) {
      // console.log('User' + req.user);
      var accessToken = JSON.stringify(req.user.identities[0].access_token) || JSON.stringify(req.session.identities[0].access_token);
      console.log(
        'Name = ' + (JSON.stringify(req.user.displayName)),
        'User id = ' + (JSON.stringify(req.user.identities[0].user_id)),
        'Access Token = ' + (JSON.stringify(req.user.identities[0].access_token)),
        'Session '
      )
      // req.session.id = req.user.identities[0].user_id;
      // console.log('Session token ' + req.session.id)

      // console.log(req.session.user);
      // console.log(req.user.Profile);
      // req.session.user = req.user.Profile.id;
      // knex('users')
      // .insert({
      //   email: req.user.emails[0].value,
      //   id: JSON.stringify(req.user.user_id),
      //   password: '', // encrypt the pass for db storage
      //   roles: JSON.stringify([enums.userRole[0]]),
      //   loginprovider: enums.loginProvider[0]
      // })
      // .then(function(data) {

        // log an event - don't bother with return, promise, etc
        // console.log(users)
        // knex('userevents').insert({
        //   status: enums.eventStatus[1],
        //   userid: parseInt(id),
        //   eventverb: 'signup',
        //   // newvalue: _email.toLowerCase(),
        //   description: 'new user signup',
        //   ipaddress: req.connection.remoteAddress
        // })
      // })
      // .catch(function(err){
      //   console.log(err);
      // })
    }
    // res.redirect("/user");
    res.send();
  });

app.get('/user', function (req, res) {
  // console.log(req.user);
  res.render('users/user', {
    user: req.user
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
