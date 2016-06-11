require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index');
  res.render('index', { siteSection: 'index', title: 'Expressio' });
});

module.exports = router;
