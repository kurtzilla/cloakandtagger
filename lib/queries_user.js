var knex = require('../db/knex');

module.exports = {

  userByEmail: function(_email){
    return knex('users')
      .where({email:_email})
      .first();
  },
  userById: function(_id){
    return knex('users')
      .where({id:_id})
      .first();
  },
  usersAll: function(_sortcolumn, _sortdirection){
    var _col = _sortcolumn || 'id';
    var _dir = _sortdirection || 'asc';
    return knex('users')
      .orderBy(_col, _dir);
  },



  playerByUser: function(_userid, _gameid){
    return knex('players')
      .where({userid:_userid, gameid:_gameid})
      .first();
  },
  activePlayer: function(_playerid, _gameid){
    return knex('activeplayers')
      .where({playerid:_playerid, gameid:_gameid})
      .first()
  },
  activePlayerByUser: function(_userid, _gameid){
    return playerByUser(_userid, _gameid)
      .then(function(data){
        if(data){
          return activePlayer(data.id, _gameid);
        }
        return null;
      })
  },

  userGetGameTarget_PlayerUser: function(_userid, _gameid){
    playerByUserId(_userId, _gameid)
    .then(function(data){
      //now get active player and tie back to target
      if(data){

      } else {
        return null;
      }
    })



  }
}
