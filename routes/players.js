require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
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


// require registered user to access
router.use(function(req,res,next){
  next();
});


router.get('/', function(req, res, next) {
  res.send('players route');
});


// show player information
router.get('/:playerid', function(req, res, next) {

  knex('players')
  .where({ id: parseInt(req.params.playerid)})
  .first()
  .then(function(player){

    knex('users')
    .where({ id: player.userid })
    .first()
    .then(function(user){
      req.session.player = player;
      req.session.user = user;
      res.render('players/players', { siteSection: 'players', title: 'Players',
        player: player, user: user});
    })
    .catch(function(err){
      next(err);
    });
  })
  .catch(function(err){
    next(err);
  });
});


router.post('/:playerid', upload.any(), function(req,res,next) {

  //verify inputs
  var _alias = req.body.alias.trim();
  var _bio = req.body.bio.trim();
  var _locale = req.body.locale.trim();
  var _tempDestination = (req.files && req.files[0] && req.files[0].path) ? req.files[0].path : '';
  var _errors = [];


  if(_alias.length === 0){
    _errors.push('Alias is required');
  }
  if(_bio.length === 0){
    _errors.push('Bio is required');
  }
  if(_tempDestination.length === 0){
    _errors.push('Image is required');
  }

  if(_errors.length > 0){
    console.log('player details errors: ', _errors);
    res.render('players/players', { siteSection: 'players', title: 'Players',
      player: req.session.player, user: req.session.user});
  } else {

    //update image first
    cloudinary.uploader.upload(
      _tempDestination,
      function(result) {

        knex('users')
        .where({id: req.session.user.id})
        .update({
          imageurl: result.url
        })
        .then(function(data){
          knex('players')
          .where({ id: parseInt(req.params.playerid)})
          .update({
            alias: _alias,
            bio: _bio,
            lastlocation: _locale
          })
          .then(function(data){
            // if all good then redirect - let next route handle object population
            res.redirect('/players/' + req.params.playerid);
          })
          .catch(function(err){
            next(err);
          });
        })
        .catch(function(err){
          next(err);
        });
      },
      {
        crop: 'fit',
        width: 200,
        height: 200
      }
    );
  }
});


module.exports = router;
