require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');



// handle ajax calls to update location
router.post('/user/:id', function(req, res, next) {

  console.log('REQUEST',req.originalUrl);
  var _userid = parseInt(req.params.id);
  var playerlatlng = req.body;
  console.log('going to update location to ', playerlatlng);

  // set a default response
  var targetlocale = {lat:'0',lng:'0'};

  // TODO specify that the game must be active
  // this query returns one row - latest game only
  knex('players')
  .where({userid:_userid})
  .orderBy('id', 'desc')
  .first()
  .then(function(oldplayer) {
    if(oldplayer){
      // we have a row/player to work with
      // so update the players current location => lastlocation
      // console.log('current in db player acquired', oldplayer.id);

      knex('players')
      .where({id:oldplayer.id, gameid:oldplayer.gameid})
      .update({lastlocation:JSON.stringify(playerlatlng)})
      .returning('id')
      .then(function(id){
        // console.log('hunterplayer location updated');

        //s requery to get fresh data
        knex('players')
        .where({id:Array.isArray(id) ? id[0] : id})
        .first()
        .then(function(hunterplayer) {

          // console.log('updated hunterplayer acquired?', hunterplayer.lastlocation);

          knex('users')
          .select('*')
          .where({id:hunterplayer.userid})
          .first()
          .then(function(hunteruser){
            // console.log('hunteruser acquired', hunteruser.id);

            //get active player row to match to target
            knex('activeplayers')
            .select('*')
            .where({gameid:hunterplayer.gameid, playerid:hunterplayer.id})
            .first()
            .then(function(hunteractive){
              // console.log('hunteractive acquired', hunteractive.id);

              //now get the matching target info
              knex('players')
              .where({gameid:hunterplayer.gameid, id:hunteractive.targetid})
              .first()
              .then(function(targetplayer){
                // console.log('targetplayer acquired', targetplayer.id);

                if(targetplayer){

                  knex('users')
                  .where({id:targetplayer.userid})
                  .first()
                  .then(function(targetuser){
                    // console.log('targetuser acquired', targetuser.id);

                    // console.log('sending target/user info found', targetuser.id);
                    console.log('sending hunters update location', hunterplayer.targetlocation);
                    res.send({targetplayer:targetplayer, targetuser:targetuser,
                      hunterplayer:hunterplayer, hunteruser:hunteruser});

                  })
                  .catch(function(err){
                    next(err);
                  });
                } else {
                  console.log('sending target info NOT found');
                  res.send({targetplayer:null, targetuser:null,
                    hunterplayer:null, hunteruser:null});
                }

              })
              .catch(function(err){
                next(err);
              });
            })
            .catch(function(err){
              next(err);
            });
          })
          .catch(function(err){
            next(err);
          });
        })
        .catch(function(err){
          next(err);
        });
      })
      .catch(function(err){
        next(err);
      });
    } else {
      console.log('player IS NOT member of game');
      res.send(targetlocale)
    }
  })
  .catch(function(err){
    next(err);
  });
});


module.exports = router;
