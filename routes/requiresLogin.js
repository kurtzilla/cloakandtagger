module.exports = function(req, res, next) {
  console.log('requiresLogin');
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}
