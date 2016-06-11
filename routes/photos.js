require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var multer  = require('multer');
// const rimrafPromise  = require('rimraf-promise');
var upload = multer({ dest: 'upfiles/' });
var rmdir = require('rmdir');
// var mkdirp = require('mkdirp');
// var fs = require('fs');


var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


/* GET home page. */

// require registered user to access
router.use(function(req,res,next){
  // console.log('photo middleware');
  // if(res.locals.user.isAdmin){
  //   next();
  // }
  // else {
  //   res.redirect('/');
  // }

  next();
});


router.get('/', function(req, res, next) {
  // console.log('photo get');
  res.render('photos', { siteSection: 'photos', title: 'Photos' });
});


// TODO explore other upload options for security
// https://www.npmjs.com/package/multer
router.post('/', upload.any(), function(req,res,next){
  console.log('photo post files', req.files);
  console.log('photo post body', req.body);

  var title = req.body.title.trim() || req.files[0].originalname;
  console.log('title: ', title);


  // TODO: derive title from user and some random info

  cloudinary.uploader.upload(
    req.files[0].path,
    function(result) {
      console.log(result);
      res.render('photos', { siteSection: 'photos', title: 'Photos', latestPhoto: result.url });
    },
    {
      public_id: 'sample_id',
      crop: 'limit',
      width: 200,
      height: 200
      // tags: ['special', 'for_homepage']
    }
  );


  // TODO: delete temp files from upload.dest folder
  // console.log('upload', upload);
  // rmdir('upfiles', function (err, dirs, files) {
  //   console.log(dirs);
  //   console.log(files);
  //   console.log('all files are removed');
  // });


  // pass back uploaded photo

});

module.exports = router;
