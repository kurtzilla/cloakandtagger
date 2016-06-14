
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.integer('userid').references('id').inTable('users');
    table.integer('gameid').references('id').inTable('games');
    table.string('lastlocation').notNullable().defaultTo('');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
