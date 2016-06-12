
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('eventverbs').del(),

    // Inserts seed entries
    knex('eventverbs').insert({name: 'signup', description: 'new user signup'}),
    knex('eventverbs').insert({name: 'signin', description: 'existing user signin'}),
    knex('eventverbs').insert({name: 'signout', description: 'existing user signout'}),
    knex('eventverbs').insert({name: 'locationUpdate', description: 'log location change'}),
    knex('eventverbs').insert({name: 'locationCloaked', description: 'a player\'s location has been hidden'}),
    knex('eventverbs').insert({name: 'locationUnCloak', description: 'a player\'s cloak has been removed'}),
    knex('eventverbs').insert({name: 'targetLocated', description: 'a player target has been found'}),
    knex('eventverbs').insert({name: 'targetPhotod', description: 'a player target has been photographed'}),
    knex('eventverbs').insert({name: 'targetTagged', description: 'a player target has been tagged'}),
    knex('eventverbs').insert({name: 'targetAssigned', description: 'a player target has been assigned'}),
    knex('eventverbs').insert({name: 'targetRemoved', description: 'a player target has been removed from the active player list'}),
    knex('eventverbs').insert({name: 'gameStarted', description: 'a game has begun'}),
    knex('eventverbs').insert({name: 'gameEnded', description: 'a game has ended'}),
    knex('eventverbs').insert({name: 'gamePlayersAssigned', description: 'players have been assign to the active roster and their targets have been defined'}),
    knex('eventverbs').insert({name: 'gameInitComplete', description: 'a game has run through the initialization process'})
  );
};
