
exports.up = function(knex, Promise) {
  return knex.schema.createTable('gameevents', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.string('status').notNullable();
    table.integer('gameid').references('id').inTable('games');
    table.integer('playerid').references('id').inTable('players');
    table.integer('targetid').references('id').inTable('players');
    table.string('eventverb').notNullable();
    table.text('oldvalue');
    table.text('newvalue');
    table.text('description');
    table.string('ipaddress');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gameevents');
};
