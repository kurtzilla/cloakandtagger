require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var enums = require('../lib/enums');
var multer  = require('multer');
var upload = multer({ dest: 'upfiles/' });
var del = require('del');
var cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



router.use(function(req,res,next){
  // console.log('users router');
  next();
});

// return a list of users
router.get('/', function(req, res, next){
  knex('users')
  .orderBy('email')
  .then(function(data){
    res.render('users/userlisting', { siteSection: 'users', title: 'User List', rows: data });
  })
  .catch(function(err){
    next(err);
  });
});

//show user's details
router.get('/:id', function(req,res,next){
  knex('users')
  .where({ id: parseInt(req.params.id)})
  .first()
  .then(function(data){
    res.render('users/user', { siteSection: 'users', title: 'User Details', user: data });
  })
  .catch(function(err){
    next(err);
  });
});

router.post('/:id', upload.any(), function(req,res,next){
  //res.send('posted to user');

  knex('users')
  .where({id:parseInt(req.params.id)})
  .first()
  .then(function(user){

    //verify inputs
    var _firstname = req.body.firstname.trim();
    var _lastname = req.body.lastname.trim();
    var _tempDestination = (req.files && req.files[0] && req.files[0].path) ? req.files[0].path : '';
    var _existingImage = user.imageurl;
    var _errors = [];

    if(_firstname.length === 0){
      _errors.push('First name is required');
    }
    if(_lastname.length === 0){
      _errors.push('Last name is required');
    }
    // only validate if no user image
    if(_existingImage.length === 0 && _tempDestination.length === 0){
      _errors.push('Image is required');
    }

    // return on error
    if(_errors.length > 0){
      console.log('user errors: ', _errors);
      res.render('users/' + req.params.id, { siteSection: 'users', title: 'User Details',
        user: user, error: _errors });
    } else {

      // if a new image was specified....we have already determined that one or the other exists
      if(_tempDestination.length > 0){
        //update image first
        cloudinary.uploader.upload(
          _tempDestination,
          function(result) {
            knex('users')
            .where({id: parseInt(req.session.user.id)})
            .update({
              firstname: _firstname,
              lastname: _lastname,
              imageurl: result.url
            })
            .then(function(data){

              del([_tempDestination]);

              res.redirect('/users/' + req.params.id);
            })
            .catch(function(err){
              next(err);
            });
          }
        );
      } else {
        knex('users')
        .where({id: parseInt(req.session.user.id)})
        .update({
          firstname: _firstname,
          lastname: _lastname
        })
        .then(function(data){
          res.redirect('/users/' + req.params.id);
        })
        .catch(function(err){
          next(err);
        });
      }
    }
  })
  .catch(function(err){
    next(err);
  });
});

// facilitate signup
router.get('/signup', function(req, res, next) {
  res.render('users/signup', { siteSection: 'users', title: 'Signup' } );
});

router.post('/signup', function(req, res, next) {

  var _email = req.body.email.trim(); // note username = email
  var _pwd = req.body.password;
  var _errors = [];

  // TODO complete validation
  if(_email.length === 0){
    _errors.push('Email is required');
  }
  if(_pwd.length === 0){
    _errors.push('Password is required');
  }
  if(_email.indexOf('@') == -1 || _email.length <= 5) {
    //TODO flesh out email validation a bit more - don't be too stringent
    _errors.push('Please enter a valid email address');
  }
  // TODO _pwd cannot end in a whitespace
  // TODO _pwd should be at least so many chars and so complex (arbitrary)
  if(_pwd.length <5){
    // TODO define pwd reqs
    _errors.push('Password must be at least XXX chars');
  }

  // return on error
  if(_errors.length > 0){
    console.log('signup errors: ', _errors);
    res.render('users/signup', { siteSection: 'users', title: 'Signup', error: _errors });
  } else {

    // ensure username is unique
    knex('users').where({ email: _email.toLowerCase() })
    .then(function(data) {

      // if there is return data - there was a matching row
      if (data.length) {
        // TODO clear out input
        res.render('users/signup', { siteSection: 'users', title: 'Signup', error: ['Username is taken'] });
      } else {

        knex('users')
        .insert({
          email: _email.toLowerCase(),
          password: bcrypt.hashSync(_pwd, 8), // encrypt the pass for db storage
          roles: JSON.stringify([enums.userRole[0]]),
          loginprovider: enums.loginProvider[0],
          lastlogin: new Date()
        })
        .returning('id')
        .then(function(id) {

          // log an event - don't bother with return, promise, etc
          knex('userevents').insert({
            status: enums.eventStatus[1],
            userid: parseInt(id),
            eventverb: 'signup',
            newvalue: _email.toLowerCase(),
            description: 'new user signup',
            ipaddress: req.connection.remoteAddress
          })
          .then(function(eventrow){

            knex('users').where({ id: parseInt(id) })
            .first()
            .then(function(data) {
              // get rid of pwd in session object
              data.password = null;
              req.session.user = data;
              res.redirect('/');
            })
            .catch(function(err) {
              next(err);
            });
          })
          .catch(function(err){
            next(err);
          })
        })
        .catch(function(err) {
          next(err);
        });
      }

    })
    .catch(function(err) {
      // error on uniqe username db call
      next(err);
    });
  }

});


// facilitate signins
router.get('/signin', function(req, res, next) {
  res.render('users/signin', { siteSection: 'users', title: 'Signin' });
});

router.post('/signin', function(req,res,next) {

  var _email = req.body.email.trim();
  var _pwd = req.body.password;
  var _errors = [];

  // validation - simplified for signIN reqs. ie If email.pwd is incorrect, then fail
  if(_email.length === 0){
    _errors.push('Email is required');
  }
  if(_pwd.length === 0){
    _errors.push('Password is required');
  }

  // return on error
  if(_errors.length > 0){
    console.log('signin errors: ', _errors);
    res.render('users/signin', { siteSection: 'users', title: 'Signin', error: _errors });
  } else {

    // find user in db and if found - compare pwd
    knex('users')
    .where({email: _email.toLowerCase()})
    .first()
    .then(function(data){

      if(data && bcrypt.compareSync(_pwd, data.password)){

        // log an event
        knex.insert({
          status: enums.eventStatus[1],
          userid: data.id,
          eventverb: 'signin',
          newvalue: _email.toLowerCase(),
          description: 'user signin',
          ipaddress: req.connection.remoteAddress
        }).into('userevents')
        .then(function(eventrow){
          // get rid of pwd in session object
          data.password = null;
          req.session.user = data;

          // update last login
          knex('users')
          .update({lastlogin: new Date()})
          .where({id: data.id})
          .then(function(data){
            res.redirect('/');
          })
          .catch(function(err){
            next(err);
          });

        })
        .catch(function(err){
          next(err);
        });

      } else {
        res.render('users/signin', { siteSection: 'users', title: 'Signin', error: ['Invalid username/password'] });
      }

    })
    .catch(function(err){
      res.render('users/signin', { siteSection: 'users', title: 'Signin', error: ['Invalid username/password'] });
    });
  }

});

// facilitate signout
router.get('/signout', function(req, res, next) {
  // TODO remove any session keys - finer grained
  req.session.user = null;
  res.redirect('/');
});


module.exports = router;
