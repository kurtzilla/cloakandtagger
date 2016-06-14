require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index');
  res.render('index', { siteSection: 'index', title: 'Home page' });
});

module.exports = router;

router.get('/testgamelist', function(req, res, next) {
  res.render('join/gamelist');
})
router.get('/testgamedetail', function(req, res, next) {
  res.render('join/gamedetail');
})
router.get('/testgameplay', function(req, res, next) {
  res.render('gameplay/gameplay');
})
