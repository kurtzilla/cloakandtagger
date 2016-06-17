require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  knex('games').then(function(data){
    console.log(data);
    res.render('index', {rows: data});
  })
})

router.get('/testgameplay', function(req, res, next) {
  res.render('gameplay/gameplay');
})
router.get('/testgameplayhunt', function(req, res, next) {
  // console.log('Yo!');
  res.render('gameplay/includes/hunt');
})
// router.get('/testgameplaydossier', function(req, res, next) {
//   res.render('gameplay/includes/dossier');
// })
router.get('/testgameplaydossier', function(req, res, next) {
  console.log(req.session.user.id);
  knex('players')
  // .where({userid: req.session.user.id})
  .where({userid: 2})
  // .where({userid:_userid})
  .orderBy('id', 'desc')
  .first()
  .then(function(currentplayer) {
    if(currentplayer){

      knex('activeplayers')
      .where({gameid:currentplayer.gameid, playerid:currentplayer.id})
      .first()
      .then(function(activeplayer){

        knex('players')
        .where({id:activeplayer.targetid})
        .first()
        .then(function(targetedplayer){

          knex('users')
          .where({id:targetedplayer.userid})
          .first()
          .then(function(targeteduser){
            console.log(targeteduser);
            res.render('gameplay/includes/dossier', {target: targeteduser});
            // now access you vars via targeteduser (imageurl) and targetedplayer(lastlocation)


          })
          .catch(function(err){
            next(err);
          });
        })
        .catch(function(err){
          next(err);
        });
      })
      .catch(function(err){
        next(err);
      });
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
})
router.get('/tagphoto', function(req, res, next) {
  res.render('photos');
})

router.get('/join', function(req, res, next) {
  knex('games').then(function(data){
    console.log(data);
    res.render('join/gamelist', {rows: data});
  })
})

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
})
////////////////////////////////////////////////////////////////////////
module.exports = router;
