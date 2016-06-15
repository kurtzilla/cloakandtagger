
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.string('roles').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable().defaultTo('');
    table.string('firstname').notNullable().defaultTo('');
    table.string('lastname').notNullable().defaultTo('');
    table.string('alias').notNullable().defaultTo('');
    table.text('bio').notNullable().defaultTo('');
    table.string('imageurl').notNullable().defaultTo('');
    table.string('loginprovider').notNullable();
    table.text('logintoken').notNullable().defaultTo('');
    table.timestamp('tokenexpiry');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
