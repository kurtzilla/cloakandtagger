require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');
var query = require('../lib/query_user');


// handle ajax calls to update location
router.post('/user/:id', function(req, res, next) {

  var _userid = parseInt(req.params.id);
  var _playerlatlng = req.body;
  var _targetlocale = {lat:'0',lng:'0'}; // default response
  var _hunter, _target;

  // TODO specify that the game must be active
  query
  .getUserPlayer_ByUserId(_userid)
  .then(function(hunter){
    if(hunter && hunter.rows.length > 0){
      _hunter = hunter.rows[0];

      return knex('players')
      .where({id:_hunter.player_id})
      .update({ lastlocation: JSON.stringify(_playerlatlng) })
    } else {
      return Promise.reject('hunter not found');
    }
  })
  .then(function(result){
    _hunter.lastlocation = JSON.stringify(_playerlatlng);
    return query.getUserPlayer_ByPlayerId(_hunter.targetplayer_id);
  })
  .then(function(target){
    _target = target.rows[0];
    res.send({hunter:_hunter, target:_target});
  })
  .catch(function(err){
    res.send({hunter:_hunter, target:_target});
  });
});


module.exports = router;
