require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index');
  res.render('index', { siteSection: 'index', title: 'Home page' });
});

router.get('/testgameplay', function(req, res, next) {
  res.render('gameplay/gameplay');
})
router.get('/testgameplayhunt', function(req, res, next) {
  console.log('Yo!');
  res.render('gameplay/includes/hunt');
})
router.get('/testgameplaydossier', function(req, res, next) {
  res.render('gameplay/includes/dossier');
})
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
