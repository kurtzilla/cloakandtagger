

//make sure _userid is parsed to in as in
// var _userid = parseInt(userid)

knex('players')
.where({userid:_userid})
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
)
.catch(function(err){
  next(err);
}
});
*/
