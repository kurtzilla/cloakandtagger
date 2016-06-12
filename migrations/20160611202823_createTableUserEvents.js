
exports.up = function(knex, Promise) {
  return knex.schema.createTable('userevents', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.string('status').notNullable();
    table.integer('userid').references('id').inTable('users');
    table.string('eventverb').notNullable();
    table.text('oldvalue');
    table.text('newvalue');
    table.text('description');
    table.string('ipaddress');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('userevents');
};
