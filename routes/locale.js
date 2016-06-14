require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');


// handle ajax calls to update location
router.get('/', function(req, res) {
  res.send('locale called');
});


module.exports = router;
