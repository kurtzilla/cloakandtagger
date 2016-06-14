
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.integer('hostuserid').references('id').inTable('users');
    table.string('title').notNullable();
    table.string('imageurl').notNullable().defaultTo('');
    table.timestamp('dtstart').defaultTo(knex.fn.now());
    table.timestamp('dtend');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
