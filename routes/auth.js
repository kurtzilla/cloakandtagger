var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var express = require('express');
var router = express.Router();

var strategy = new Auth0Strategy({
    icon:         '',
    domain:       'samcate.auth0.com',
    clientID:     'GQYyzhNN70BQvNQrgaBSherDLANesAYV',
    clientSecret: 'QYw3_Yv2Fe9_xKPmohJ6en-VWHL55GThKLiq8cdSkh9BZhr0ddALJmgIyLwZHFsa',
    callbackURL:  process.env.HOST + '/zero/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    console.log('hello');
    return done(null, profile);

  });



router.get('/zero/callback',
  passport.authenticate('auth0', { failureRedirect: '/signup' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    app.get('/user', function (req, res) {
      res.render('user', {
        user: req.user
      });
    });
    res.redirect("/");
  });


passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;
