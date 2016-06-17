var knex = require('../db/knex');


//make sure _userid is parsed to integer as integer
//userid = current user's id
// var _userid = parseInt(userid.value)
// parseInt(req.session.user.id)

//make sure _userid is parsed to in as in
// var _userid = parseInt(userid)


knex('players')
.where({userid: parseInt(req.session.user.id)})
.orderBy('id', 'desc')
.first()
.then(function(currentplayer) {
  if(currentplayer){

    knex('activeplayers')
    .where({gameid:currentplayer.gameid, playerid:currentplayer.id})
    .first()
    .then(function(activeplayer){

      knex('players')
      .where({id:activeplayer.targetid})
      .first()
      .then(function(targetedplayer){

        knex('users')
        .where({id:targetedplayer.userid})
        .first()
        .then(function(targeteduser){

          // now access you vars via targeteduser (imageurl) and targetedplayer(lastlocation)
          console.log(targeteduser);

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
    res.send(targetlocale);
  }
})
.catch(function(err){
  next(err);
}
});
