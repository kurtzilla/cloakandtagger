require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');

// facilitate signup
router.get('/signup', function(req, res, next) {
  res.render('users/signup', { siteSection: 'users', title: 'Signup' } );
});

router.post('/signup', function(req, res, next) {

  var _email = req.body.email.trim(); // note this is currently email
  var _pwd = req.body.password;
  // TODO validation
  // _email and _pwd are required
  // _email should have a min length
  // _pwd cannot end in a whitespace
  // _pwd should be at least so many chars and so complex (arbitrary)

  // ensure username is unique
  knex('users').where({ username: _email.toLowerCase() })
  .then(function(data) {

    // if there is return data - there was a matching row
    if (true || data.length) {
      res.render('users/signup', { siteSection: 'users', title: 'Signup', error: ['Username is taken'] });
    }

    // encrypt the pass for db storage
    var _crypt = bcrypt.hashSync(_pwd, 8);

    knex('users').insert({
      email: _email.toLowerCase(),
      password: _pwd
    })
    .returning('id')
    .then(function(id) {
      req.session.userId = (Array.isArray(id)) ? id[0] : id;
      res.redirect('/');
      // res.redirect('/users/signupsuccess');
    })
    .catch(function(err) {
      next(err);
    });



  }).catch(function(err) {
      next(err);
  });












  res.render('users/signup', { siteSection: 'users', title: 'Signup' });
});







router.get('/signin', function(req, res, next) {
  res.render('users/signin', { siteSection: 'users', title: 'Signin' });
});



router.get('/signout', function(req, res, next) {
  // TODO remove any session keys
  res.redirect('/');
});

module.exports = router;
