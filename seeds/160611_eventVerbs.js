
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
    knex('eventverbs').insert({name: 'gameCreated', description: 'a game has been created'}),
    knex('eventverbs').insert({name: 'gameStarted', description: 'a game has begun'}),
    knex('eventverbs').insert({name: 'gameEnded', description: 'a game has ended'}),
    knex('eventverbs').insert({name: 'gamePlayersAssigned', description: 'players have been assign to the active roster and their targets have been defined'}),
    knex('eventverbs').insert({name: 'gameInitComplete', description: 'a game has run through the initialization process'}),


    knex('users').del(),

    knex('users').insert({ dtcreated: '2016-06-12 21:42:25.77689-06', roles: JSON.stringify(['user','admin','super']),
      email: 'rob@robkurtz.net', password: '$2a$08$YXR4x1YSq0.IWkmgtjvx/us4uQYWjXhfhY4dUdXtEEY55WmG5eIcm',
      loginprovider: 'website'}),
    knex('users').insert({ dtcreated: '2016-06-12 21:42:25.77689-06', roles: JSON.stringify(['user','admin','super']),
      email: 'smlcate@yahoo.com', password: '$2a$08$8EgMdEPPd6IOEcBsELTMVOSVD5ssD9/tt9VydPlvWk0UrSjVoyupW',
      loginprovider: 'website'}),
    knex('users').insert({ dtcreated: '2016-06-12 21:42:25.77689-06', roles: JSON.stringify(['user','admin','super']),
      email: 'ziopads@gmail.com', password: '$2a$08$Ylp785Fqy1fAozQ5yjOGmOxq8KWVbsK9o/xFxACvywNLb..tjtqjS',
      loginprovider: 'website'})
    //   ,
    // knex('users').insert({ dtcreated: '2016-06-12 21:42:25.77689-06', roles: JSON.stringify(['user','admin','super']),
    //   email: 'rob@robkurtz.net', password: '$2a$08$YXR4x1YSq0.IWkmgtjvx/us4uQYWjXhfhY4dUdXtEEY55WmG5eIcm',
    //   loginprovider: 'website'})

  );
};
