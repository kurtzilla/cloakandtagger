require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var multer  = require('multer');
var upload = multer({ dest: 'upfiles/' });
var del = require('del');
var cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// TODO require registered user to access
router.use(function(req,res,next){
  next();
});


router.get('/', function(req, res, next) {
  // console.log('photo get');
  res.render('photos', { siteSection: 'photos', title: 'Photos' });
});


// TODO explore other upload options for security within the 'multer' module
// https://www.npmjs.com/package/multer
router.post('/', upload.any(), function(req,res,next){

  // TODO: derive title from user and some random info
  var title = req.body.title.trim() || req.files[0].originalname;
  var tempDestination = req.files[0].path;

  cloudinary.uploader.upload(
    tempDestination,
    function(result) {
      // delete local temp file
      // don't bother waiting for promie resolve to move on
      del([tempDestination]);
      // .then(paths => {
      // 	console.log('Files and folders that would be deleted:\n', paths.join('\n'));
      // });

      res.render('photos', { siteSection: 'photos', title: 'Photos', latestPhoto: result.url });
    },
    {
      crop: 'fit',
      width: 600,
      height: 600
    }
  );
});

module.exports = router;
