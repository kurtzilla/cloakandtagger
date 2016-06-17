var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// TODO move this to env vars
var strategy = new Auth0Strategy({
    domain:       'samcate.auth0.com',
    clientID:     'GQYyzhNN70BQvNQrgaBSherDLANesAYV',
    clientSecret: 'QYw3_Yv2Fe9_xKPmohJ6en-VWHL55GThKLiq8cdSkh9BZhr0ddALJmgIyLwZHFsa',
    callbackURL:  '/callback',
    // scope: 'openid email'
    // domain: 'rkurtz.auth0.com',
    // clientID: 'FGGg0Dqkvj2Z5TGY5ep3RlGkeA840G8i',
    // clientSecret: 'iO1AONYZttMSAbXvOAq0nKQDj6I7j5roMQXzSD1w2RpWNpuEu9Ne8jgEGZg_igt1',
    // callbackURL: 'http://localhost:3000/callback'

  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    // console.log('access token', accessToken);
    // console.log('profile', profile);
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  //console.log('serialize',user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // console.log(user);
  done(null, user);
});

module.exports = strategy;
