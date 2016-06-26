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
  getUserPlayer_ByUserId: function(_id){
    if(!_id || _id === 0)
      return {rows:[]};

    var sql =
    'SELECT u.*, ' +
    'pl.id AS "player_id", pl.gameid, pl.lastlocation, ' +
    'ap.id AS "activeplayer_id", ap.targetid AS "targetplayer_id"' +
    'FROM users u ' +
    'LEFT OUTER JOIN players pl ON u.id = pl.userid ' +
    'LEFT OUTER JOIN activeplayers ap ON pl.id = ap.playerid AND pl.gameid = ap.gameid ' +
    'WHERE u.id = ? '
    'ORDER BY pl.gameid DESC ' +
    'LIMIT 1';

    return knex.raw(sql, [_id]);
  },

  getUserPlayer_ByPlayerId: function(_playerid){
    if(!_playerid || _playerid === 0) {
      return {rows:[]};
    }

    var sql =
    'SELECT u.*, ' +
    'pl.id AS "player_id", pl.gameid, pl.lastlocation, ' +
    'ap.id AS "activeplayer_id", ap.targetid AS "targetplayer_id"' +
    'FROM players pl ' +
    'LEFT OUTER JOIN users u ON pl.userid = u.id ' +
    'LEFT OUTER JOIN activeplayers ap ON pl.id = ap.playerid AND pl.gameid = ap.gameid ' +
    'WHERE pl.id = ? '
    'ORDER BY pl.gameid DESC ' +
    'LIMIT 1';

    return knex.raw(sql, [_playerid]);
  }
}
