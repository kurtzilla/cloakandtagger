
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.boolean('isactive').notNullable().defaultTo(true);
    table.json('roles').notNullable();
    table.string('email').notNullable().unique();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.string('imageurl').notNullable();
    table.string('loginprovider').notNullable();
    table.text('logintoken').notNullable().defaultTo('');
    table.timestamp('tokenexpiry').defaultTo(knex.fn.now());
    table.timestamp('lastlogin').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
