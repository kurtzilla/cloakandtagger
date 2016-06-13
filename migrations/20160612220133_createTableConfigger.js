
exports.up = function(knex, Promise) {
  return knex.schema.createTable('configger', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.string('name').notNullable().unique();
    table.string('value').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('configger');
};
