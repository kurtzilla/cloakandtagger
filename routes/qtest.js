require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var enums = require('../lib/enums');
var query = require('../lib/query_user');
var request = require('request');
var CURRENTTEST = 'get hunter details';

router.use(function(req,res,next){
  next();
});


router.get('/', function(req, res, next){
  query
  .usersAll()
  .then(function(users){
    res.render('qtest', { siteSection: 'qtest',
      title: 'Query Testing',
      currentTest: CURRENTTEST,
      userList: users });
  })
  .catch(function(err){
    next(err);
  });

});

router.get('/:id', function(req, res, next){

  var _errors = [];
  var _userid = parseInt(req.params.id);
  var _qdata; // to log query info
  var _hunter = [], _target = [];

  // validate input ?
  if(!Number.isInteger(_userid)){
    _errors.push('Invalid user id');

    query.usersAll()
    .then(function(_users){
      res.render('qtest', {
        siteSection: 'qtest',
        title: 'Query Testing',
        currentTest: CURRENTTEST,
        userList: _users,
        qdata: _qdata,
        hunter: _hunter,
        target: _target,
        errors: _errors });
    })
    .catch(function(err){
      next(err);
    });
  } else {

    query.getUserPlayer_ByUserId(_userid)
    .on('query', function(qdata) {
      _qdata = { sql: qdata.sql, bindings: qdata.bindings };
    })
    .then(function(hunter){
      console.log('HUNTER', hunter.rows);

      _hunter = hunter.rows[0];

      // console.log('HUNTER => TARGET ID', _hunter.targetplayer_id);
      var _targetid = (_hunter.targetplayer_id) ? _hunter.targetplayer_id : 0;
      console.log('TARGET ID', _targetid);


      return query.getUserPlayer_ByPlayerId(_targetid);
    })
    .then(function(target){
      console.log('TARGET', target.rows);
      _target = target.rows[0];

      return query.usersAll()
    })
    .then(function(users){
      res.render('qtest', {
        siteSection: 'qtest',
        title: 'Query Testing',
        currentTest: CURRENTTEST,
        userList: users,
        qdata: _qdata,
        hunter: _hunter,
        target: _target,
        errors: _errors });
    })
    .catch(function(err){
      next(err);
    });
  }
});

module.exports = router;
