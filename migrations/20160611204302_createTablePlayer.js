
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.integer('gameid').references('id').inTable('games');
    table.string('alias').notNullable();
    table.text('bio').notNullable().defaultTo('');
    table.json('lastlocation').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
