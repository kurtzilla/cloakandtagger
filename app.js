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
var locale = require('./routes/locale');

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
app.use(session({ secret: 'YOUR_SECRET_HERE', resave: true,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/maps', maps);
app.use('/photos', photos);
app.use('/admin', admin);
app.use('/games', games);
app.use('/locale', locale);



// Auth0 callback handler
app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    //TODO:All Signup/login logic
    //TODO:If New - Insert into DB, return user ID, set req.session.id
    //TODO:Else - get user ID - set req.session.id
    // app.use(session({ secret: 'YOUR_SECRET_HERE', resave: true,  saveUninitialized: false }));
    console.log('1 = ' + req.session.secret);
    // req.session.destroy;
    // console.log('2 = '+req.session.user);
    // function createUser(req,res){


    if (!req.session.secret) {
      console.log('Didnt find existing session token');
      var accessToken =
      JSON.stringify(req.user.identities[0].user_id) || JSON.stringify(req.session.identities[0].user_id),

      email,
      name;

      gEmail = email;
      gName = name;

      req.session.secret = accessToken;
      console.log('session token = ' + req.session.secret);


        if(req.user.emails) {
          console.log('Email is available')
          email = JSON.stringify(req.user.emails[0].value);
        } else {
          console.log('Email is not available - creating email')
          email = (JSON.stringify(req.user.name.familyName + req.user.name.givenName) + '@tag.com');
        }

        console.log('Email = ' + email);
        // console.log(
        //   'Name = ' + JSON.stringify(req.user.displayName),
        //   'User id = ' + JSON.stringify(req.user.identities[0].user_id),
        //   'Access Token = ' + JSON.stringify(req.user.identities[0].user_id)
        // )
        knex('users')
        .where('email', email)
        .first()
        .then(function(data){
          console.log(data);
          if (!data) {
            //TODO:Create User
            console.log('Email didnt match - creating user')
            req.session.secret = accessToken;
            knex('user')
            .insert({
              email: email,
              firstname: req.user.name.givenName,
              lastname: req.user.name.familyName,
              logintoken: accessToken,
              password: '', // encrypt the pass for db storage
              roles: JSON.stringify([enums.userRole[0]]),
              loginprovider: req.user.provider
            })
            .catch(function(err){
              console.log(err);
            })
          } else {
            //TODO:Login user
            console.log('Email existed, account verified - Signing In')
            req.session.secret = accessToken;
            req.session.user = data
          }
          // console.log(req.session.user);
        })
        .catch(function(e){
          console.log(e);
        })
    } else {
      if(req.session.secret === req.user.identities[0].user_id) {
        console.log('Session found - same token');
        knex('users')
        .where('email', email)
        .first()
        .then(function(data){
          console.log(data);
        })
        return;
      } else {
        console.log('Session found - different token');
        var accessToken =
        JSON.stringify(req.user.identities[0].user_id) || JSON.stringify(req.session.identities[0].user_id),

        email,
        name;

        gEmail = email;
        gName = name;

        req.session.secret = accessToken;
        console.log('session token = ' + req.session.secret);


          if(req.user.emails) {
            console.log('Email is available')
            email = JSON.stringify(req.user.emails[0].value);
          } else {
            console.log('Email is not available')
            email = (JSON.stringify(req.user.name.familyName + req.user.name.givenName) + '@tag.com');
          }

          console.log('Email = ' + email);

        knex('users')
        .where('email', email)
        .first()
        .then(function(data){
          console.log(data);
          if (!data) {
            console.log('Email didnt match - creating user')
            //TODO:Create User
            req.session.secret = accessToken;
            knex('user')
            .insert({
              email: email,
              firstname: req.user.name.givenName,
              lastname: req.user.name.familyName,
              logintoken: accessToken,
              password: '', // encrypt the pass for db storage
              roles: JSON.stringify([enums.userRole[0]]),
              loginprovider: req.user.provider
            })
            .catch(function(err){
              console.log(err);
            })
          } else {
            //TODO:Login user
            console.log('Email existed - Signed In')
            req.session.secret = accessToken;
            req.session.user = data;
          }
        })
      }
      // createUser(req,res);
    }
    // }
    // console.log(req.session.user);
    // createUser(req,res);
  // res.redirect("/user");
  res.send();
});

    // if (!req.session.user) {
    //   // console.log('User' + req.user);
    //   // req.session.user = req.user;
    //   // console.log(req.session.user);
    //
    //
    //   var accessToken =
    //   JSON.stringify(req.user.identities[0].user_id) || JSON.stringify(req.session.identities[0].user_id),
    //
    //     id = JSON.stringify(req.user.identities[0].user_id),
    //
    //     email,
    //     name;
    //
    //
    //   req.session.secret = accessToken;
    //
    //   console.log('session = ' + req.session.secret)
    //
    //   if(req.user.emails) {
    //     email = JSON.stringify(req.user.emails[0].value);
    //   } else {
    //     email = 'Not available';
    //   }
    //
    //
    //   console.log('Email = ' + email);
    //   console.log(
    //     'Name = ' + JSON.stringify(req.user.displayName),
    //     'User id = ' + JSON.stringify(req.user.identities[0].user_id),
    //     'Access Token = ' + JSON.stringify(req.user.identities[0].access_token)
    //   )


      // knex('users')
      // .insert({
      //   email: email,
      //   // id: id.toString(),
      //   firstname: req.user.name.givenName,
      //   lastname: req.user.name.familyName,
      //   logintoken: accessToken, //input issue, causes error
      //   // tokenexpiry: '3600',
      //   password: '', // encrypt the pass for db storage
      //   roles: JSON.stringify([enums.userRole[0]]),
      //   loginprovider: req.user.provider
      // })
      // .catch(function(err){
      //   console.log(err);
      // })

      // req.session.id = req.user.identities[0].user_id;
      // console.log('Session token ' + req.session.id)

      // console.log(req.session.user);
      // console.log(req.user.Profile);
      // req.session.user = req.user.Profile.id;
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
