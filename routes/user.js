var requiresLogin = require('requiresLogin');

console.log('user');

app.get('/user',
  requiresLogin,
  function (req, res) {
    res.render('user', {
      user: req.user
    });
  });
