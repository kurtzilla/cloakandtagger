require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */

// require registered user to access maps
router.use(function(req,res,next){

  // if(res.locals.user.isAdmin){
  //   next();
  // }
  // else {
  //   res.redirect('/');
  // }

  next();
});


router.get('/', function(req, res, next) {
  res.render('admin', { siteSection: 'admin', title: 'Admin' });
});

module.exports = router;
