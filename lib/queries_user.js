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
  }
}
