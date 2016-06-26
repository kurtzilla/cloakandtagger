require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var query = require('../lib/query_user');

/* GET home page. */
router.get('/', function(req, res, next) {
  knex('games').then(function(data){
    res.render('index', {rows: data});
  })
})

router.get('/testgameplay', function(req, res, next) {
  res.render('gameplay/gameplay');
})
router.get('/testgameplayhunt', function(req, res, next) {
  res.render('gameplay/includes/hunt');
})

router.get('/testgameplaydossier', function(req, res, next) {

  query
  .getUserPlayer_ByUserId(parseInt(req.session.user.id))
  .then(function(currentPlayer){
    var userplayer = currentPlayer.rows[0];
    return query.getUserPlayer_ByPlayerId(userplayer.targetplayer_id);
  })
  .then(function(target){
    if(target && target.rows.length > 0){
      var _target = target.rows[0];
      res.render('gameplay/includes/dossier', {target: _target});
    } else {
      console.log('player IS NOT member of game');
      res.send(targetlocale);
    }
  })
  .catch(function(err){
    next(err);
  });
});

router.get('/testgameplaygame', function(req, res, next) {
  res.render('gameplay/includes/game');
});

router.get('/join', function(req, res, next) {
  knex('games').then(function(data){
    res.render('join/gamelist', {rows: data});
  })
});

////////////////  IN PROGRESS  /////////////////////////////////////////
router.get('/join/:id', function(req, res, next) {
  knex('games')
  .where({ id: parseInt(req.params.id)})
  .first()
  .then(function(data){
    res.render('join/gamedetails', { game: data });
  })
  .catch(function(err){
    next(err);
  });
  console.log(req.params);
});
////////////////////////////////////////////////////////////////////////

module.exports = router;
