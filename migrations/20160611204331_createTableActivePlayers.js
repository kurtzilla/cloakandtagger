
exports.up = function(knex, Promise) {
  return knex.schema.createTable('activeplayers', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.integer('gameid').references('id').inTable('games');
    table.integer('playerid').references('id').inTable('players');
    table.integer('targetid').references('id').inTable('players');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('activeplayers');
};
