require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');
var multer  = require('multer');
var upload = multer({ dest: 'upfiles/' });
var del = require('del');
var cloudinary = require('cloudinary');
var moment = require('moment');


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
  // TODO make this query more customized - ie get user name, etc
  knex('games')
  .select('id','dtcreated','hostuserid','title','dtstart','dtend','dtactualend')
  .orderBy('id','desc')
  .then(function(data){
    res.render('games/listing', { siteSection: 'game', title: 'Games', rows: data, moment: moment });
  })
  .catch(function(err){
    next(err);
  })
});


router.get('/new', function(req, res, next) {
  res.render('games/new', { siteSection: 'game', title: 'Games' });
});

router.post('/new', upload.any(), function(req, res, next) {

  // verify input
  var _title = req.body.title.trim();
  var _tempDestination = (req.files && req.files[0] && req.files[0].path) ? req.files[0].path : '';
  var _startdate = req.body.startdate;
  var _startdatewithtime = _startdate + ' 08:00:00';
  var _gameStart= new Date(_startdatewithtime);
  var _now = new Date();

  var _errors = [];

  // TODO complete validation
  if(_title.length === 0){
    _errors.push('Title is required');
  }
  if(_tempDestination.length === 0){
    _errors.push('Image is required');
  }
  if(_startdate.length === 0){
    _errors.push('StartDate is required');
  }
  if(_gameStart < _now){
    _errors.push('StartDate must be in future');
  }

  // return on error
  if(_errors.length > 0){
    console.log('signup errors: ', _errors);
    res.render('games/new', { siteSection: 'games', title: 'Games', error: _errors });
  } else {

    var _gameEnd = new Date(_gameStart);
    _gameEnd.setDate(_gameEnd.getDate() + 3);

    cloudinary.uploader.upload(
      _tempDestination,
      function(result) {

        // console.log('cloudinary result', result);

        knex('games')
        .insert({
          hostuserid: parseInt(req.session.user.id),
          title: _title,
          imageurl: result.url,
          dtstart: _gameStart,
          dtend: _gameEnd
        })
        .returning('id')
        .then(function(id) {

          // log event
          knex('gameevents')
          .insert({
            status: enums.eventStatus[1],
            gameid: parseInt(id),
            eventverb: 'gameCreated',
            newvalue: _title,
            description: 'startDate: ' + _gameStart + '// endDate: ' + _gameEnd,
            ipaddress: req.connection.remoteAddress
          })
          .then(function(){
            console.log('pre file delete');
            del([_tempDestination]);

            res.redirect('/games');
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


router.get('/:id', function(req, res, next){
  // res.send(req.params.id);
  knex('games')
  .where({ id: parseInt(req.params.id) })
  .first()
  .then(function(game){

    knex('players')
    .where({ gameid: game.id })
    .then(function(players){

      knex('activeplayers')
      .where({ gameid: game.id })
      .then(function(actives){

        knex('gameevents')
        .where({ gameid: game.id })
        .orderBy('id', 'desc')
        .then(function(events){
          //console.log('editing', game, players, actives, events);
          res.render('games/edit', { siteSection: 'games', title: 'Games',
            game: game, players: players, actives: actives, events: events, moment: moment });
        })
        .catch(function(err){
          next(err);
        });
      })
      .catch(function(err){
        next(err);
      })
    })
    .catch(function(err){
      next(err);
    });
  })
  .catch(function(err){
    next(err);
  });
});


// session user joins the game
router.get('/:gameid/join', function(req,res,next){

  var _playerid = req.session.user.id;
  var _gameid = parseInt(req.params.gameid);

  if(!_playerid || !_gameid){
    // this condition should not happen (in theory)
    next(err);
  } else {

    // console.log('join a game - play/game', _playerid, _gameid);
    // if the game does not have a player with this id then add to players
    knex('players')
    .where({ gameid: _gameid, userid: _playerid })
    .first()
    .then(function(data){

      if(data){
        // TODO redirect based on existence of image, bio and alias
        // so if alias or bio or image are missing - go to player edit

        // for now just go to game details
        console.log('user already exists as a player in tihs game');
        res.redirect('/games/' + _gameid);
      } else {
        //res.send('join a game');
        // NOTE location needs to be communicated by the client (maps api)
        //     //      so we don't record here. Be sure to handle (allow) players
        //     //      without location information
        knex('players')
        .insert({
          userid: _playerid,
          gameid: _gameid
        })
        .returning('id')
        .then(function(id) {
          id = Array.isArray(id) ? id[0] : id;
          knex('players')
          .where({ id: id })
          .first()
          .then(function(data){
            console.log('added player', data);
            // redirect to add alias and bio and user image
            // alias and bio will set session value for players
            req.session.player = data;
            res.redirect('/players/' + data.id);
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
  }
});



module.exports = router;
