require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


router.get('/', function(req, res, next) {
  res.render('map', { siteSection: 'maps', title: 'Maps' });
});

module.exports = router;
