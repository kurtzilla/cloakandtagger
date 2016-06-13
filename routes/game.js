require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');


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
    res.render('game/gamelanding', { siteSection: 'game', title: 'Games', rows: data });
  })
  .catch(function(err){
    next(err);
  })
});

// table.increments('id').primary();
// table.timestamp('dtcreated').defaultTo(knex.fn.now());
// table.integer('hostuserid').references('id').inTable('users');
// table.string('title').notNullable();
// table.timestamp('dtstart').defaultTo(knex.fn.now());
// table.timestamp('dtend');
// table.timestamp('dtactualend');


router.post('/', function(req, res, next) {
  res.render('game/gamelanding', { siteSection: 'game', title: 'Games' });
});



module.exports = router;
