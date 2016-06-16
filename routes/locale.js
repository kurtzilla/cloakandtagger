require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var enums = require('../lib/enums');


// handle ajax calls to update location
router.post('/user/:id', function(req, res, next) {

  console.log('REQUEST',req.originalUrl);

  var _userid = parseInt(req.params.id);
  console.log('locale update called on userid:', _userid);

  var playerlatlng = req.body;
  // set a default response
  var targetlocale = {lat:'0',lng:'0'};
  // format is {lat:'xxxxx',lng:'xxxxx' }
  // console.log('LatLng', latlng);

  // TODO specify that the game must be active
  // this query returns one row - latest game only
  knex('players')
  .where({userid:_userid})
  .orderBy('id', 'desc')
  .first()
  .then(player => {
    if(player){
      // we have a row/player to work with
      // so update the players current location => lastlocation
      knex('players')
      .where({id:player.id})
      .update({lastlocation:JSON.stringify(playerlatlng)})
      .returning('id')
      .then(function(id){

        console.log('player acquired', player.id);
        // find an activeplayer row to get the target
        // an activeplayer will match the gameid and playerid of this player
        knex('activeplayers')
        .where({gameid:player.gameid, playerid:player.id})
        .first()
        .then(function(activeplayer){
          //console.log('activeplayer found', activeplayer);
          // console.log('activeplayer target', activeplayer);
          // console.log('activeplayer target - gameid', activeplayer.gameid);
          // console.log('activeplayer target - target id', activeplayer.targetid);
          //use this info to get at target

          knex('players')
          .where({gameid:activeplayer.gameid, id:activeplayer.targetid})
          .first()
          .then(function(target){
            //console.log('is this your target?', target);
            // TODO return the targets' icon - users imageurl
            if(target){
              console.log('Target acquired:', target);
              if(target.lastlocation.length > 0){
                targetlocale = target.lastlocation;
              }
              console.log('sending target locale', targetlocale);
              res.send(targetlocale);
            } else {
              console.log('sending target locale not found', targetlocale);
              res.send(targetlocale);

              console.log('hgfshgsh', gsyjsg);

              
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
