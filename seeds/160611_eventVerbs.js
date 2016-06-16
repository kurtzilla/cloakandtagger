
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



    knex('activeplayers').del(),
    knex('players').del(),
    knex('gameevents').del(),
    knex('games').del(),
    knex('userevents').del(),
    knex('users').del(),

    knex('users').insert({id:2, dtcreated: '2016-06-12 21:42:25.77689-06', roles: JSON.stringify(['user','admin','super']),
      email: 'smlcate@yahoo.com', password: '$2a$08$8EgMdEPPd6IOEcBsELTMVOSVD5ssD9/tt9VydPlvWk0UrSjVoyupW',
      loginprovider: 'website'}),
    knex('users').insert({ id:3,dtcreated: '2016-06-12 21:42:25.77689-06', roles: JSON.stringify(['user','admin','super']),
      email: 'ziopads@gmail.com', password: '$2a$08$Ylp785Fqy1fAozQ5yjOGmOxq8KWVbsK9o/xFxACvywNLb..tjtqjS',
      loginprovider: 'website'}),
    knex('users').insert({id:1,  dtcreated:'2016-06-12 21:42:25.77689-06', roles:JSON.stringify(["user","admin","super"]),
      email:'rob@robkurtz.net',password:'$2a$08$YXR4x1YSq0.IWkmgtjvx/us4uQYWjXhfhY4dUdXtEEY55WmG5eIcm',firstname:'rob',lastname:'kurtz',alias:'Bobaloolah',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466010627/pje9ijvifabcoevjopbu.jpg',loginprovider:'website'}),
    knex('users').insert({id:4,  dtcreated:'2016-06-15 19:15:55.006187-06', roles:JSON.stringify(["user"]),
      email:'joseph@',password:'$2a$08$lKjSDNNNwev6H36nfdONWubyrPNJLhLR0spBzTQ6/u7MMxiEf7ut.',firstname:'fred',lastname:'skippy',alias:'john',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466039775/ue7pk3jzupjraz9jykaf.jpg',loginprovider:'website'}),
    knex('users').insert({id:5,  dtcreated:'2016-06-16 11:03:04.703871-06', roles:JSON.stringify(["user"]),
      email:'gregory@gma.com',password:'$2a$08$bnzzDULuuIJmQp7q6TLUk.aBAynqOyIY.8WTlUL8may3FYpZJGdbm',firstname:'greg',lastname:'brady',alias:'greg brady',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466097329/naihe1yprdptwlm9crru.jpg',loginprovider:'website'}),
    knex('users').insert({id:6,  dtcreated:'2016-06-16 11:16:03.136434-06', roles:JSON.stringify(["user"]),
      email:'miley@onelove.com',password:'$2a$08$/qaDWjFhrC2Hwjs3QOiJM.jcyNCjnU96hS0rg/axZ4q4C9whFaMYu',firstname:'miley',lastname:'cyrus',alias:'disney gal',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466097388/mta5ol6h3gu692si1y3t.jpg',loginprovider:'website'}),
    knex('users').insert({id:7,  dtcreated:'2016-06-16 11:22:11.432257-06', roles:JSON.stringify(["user"]),
      email:'joe@ws.com',password:'$2a$08$MSrJr1MG5b8JT93e5Rktfe2GU/kstQ6o6jkQ8qZe3iTF9PZ1LfDZ',firstname:'joe',lastname:'cool',alias:'snoopy',bio:'one cool cat',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466097781/oqlz4jumereuni7rpncf.jpg',loginprovider:'website'}),
    knex('users').insert({id:8,  dtcreated:'2016-06-16 11:23:28.200202-06', roles:JSON.stringify(["user"]),
      email:'fred@m.com',password:'$2a$08$Eda6/JnFCoXW3FcTR.UTD.XjcfCGxB4SrPluYYvSYrczlkSpYllZW',firstname:'freddy',lastname:'mercury',alias:'LaserBeam',bio:'Guaranteed to blow your mind',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466097857/wkbobcrfcpnvfq3snyyw.jpg',loginprovider:'website'}),
    knex('users').insert({id:9,  dtcreated:'2016-06-16 11:24:38.859215-06', roles:JSON.stringify(["user"]),
      email:'jon@bonj.com',password:'$2a$08$rPDhemlK8WXoXNTqGFTHaOlzDRLGyb9E8437A4BiewC6n./2Qtqaq',firstname:'Jon',lastname:'Bon Jovi',alias:'Just a Guy',bio:'Givin love a bad name',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466097937/cqmrj967rg7gujhu3jwv.jpg',loginprovider:'website'}),
    knex('users').insert({id:10, dtcreated:'2016-06-16 11:28:01.555258-06', roles:JSON.stringify(["user"]),
      email:'ren@rem.com',password:'$2a$08$d2AxUORpfHa92FK8va894e2WEmYl.133RI3rOkBMfteQvDRVIQZP6',firstname:'ren',lastname:'renny',alias:'renaldo',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466098100/r3i47qztycdwffirboeg.jpg',loginprovider:'website'}),
    knex('users').insert({id:11, dtcreated:'2016-06-16 11:28:46.917467-06', roles:JSON.stringify(["user"]),
      email:'stimpy@ws.com',password:'$2a$08$OkgqMe8xRCb41S1uCZd09OdD3QDSbdtTWbv7c4S.QpD0gjRLKRtBq',firstname:'stimpy',lastname:'stee',alias:'stimpy',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466098149/v3hj72wscfxkqsqvzjxw.jpg',loginprovider:'website'}),
    knex('users').insert({id:12, dtcreated:'2016-06-16 11:30:09.219523-06', roles:JSON.stringify(["user"]),
      email:'aretha@w.com',password:'$2a$08$chzxbS7KSwVdNj10xJEkKu.R9o5R4jotDk7WR7kCrXfI9PNKwX4sO',firstname:'aretha',lastname:'franklin',alias:'The Diva',bio:'lorem',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466098228/vxv80imjjzfcpxtjobsl.jpg',loginprovider:'website'}),
    knex('users').insert({id:13, dtcreated:'2016-06-16 11:31:05.471462-06', roles:JSON.stringify(["user"]),
      email:'al@w.com',password:'$2a$08$PXLhS86InlVYy8U0Yhi.tuQKX7NKITeO8RXPPbvSvtu/2asLBbV0u',firstname:'Albert',lastname:'Einstein',alias:'mc einstein',bio:'e!!!!!',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466098296/fmifqimib8gcbtxnq9eh.jpg',loginprovider:'website'}),


    knex('games').insert({id:1,dtcreated:'2016-06-16 12:01:31.369926-06',hostuserid:1,title:'george',
      imageurl:'http://res.cloudinary.com/dfm9cmgix/image/upload/v1466100090/wkrvckssr1tymdfepfcb.jpg',
      dtstart:'2016-06-22 08:00:00-06',
      dtend:'2016-06-25 08:00:00-06'})

  );
};
