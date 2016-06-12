require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');

// TODO require registered user for access
router.use(function(req,res,next){
  next();
});

//games
router.get('/', function(req, res) {
  knex('games').orderBy('id', 'desc').then(function(data){
    res.render('admin/games', { siteSection: 'admin', title: 'Admin', rows: data});
  });
});

//Users
router.get('/users', function(req, res, next) {
  knex('users').orderBy('email', 'asc').then(function(data){
    res.render('admin/users', { siteSection: 'admin', title: 'Admin', rows: data});
  });
});

//Verbs
router.get('/verbs', function(req, res, next) {
  knex('eventverbs').orderBy('id', 'asc').then(function(data){
    res.render('admin/verbs', { siteSection: 'admin', title: 'Admin', rows: data});
  });
});

//Enums
router.get('/enums', function(req, res, next) {
  res.render('admin/enums', { siteSection: 'admin', title: 'Admin', rows: enums });
});

//UserEvents
router.get('/userevents', function(req, res, next) {
  knex('userevents').orderBy('id', 'desc').then(function(data){
    res.render('admin/userevents', { siteSection: 'admin', title: 'Admin', rows: data});
  });
});

//GameEvents
router.get('/gameevents', function(req, res, next) {
  knex('gameevents').orderBy('id', 'desc').then(function(data){
    res.render('admin/gameevents', { siteSection: 'admin', title: 'Admin', rows: data});
  });
});

//scaffolds
router.get('/scaffolds', function(req, res, next) {
  res.render('admin/scaffolds', { siteSection: 'admin', title: 'Admin' });
});

module.exports = router;
