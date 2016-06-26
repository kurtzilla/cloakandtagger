require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var multer  = require('multer');
var upload = multer({ dest: 'upfiles/' });
var del = require('del');
var cloudinary = require('cloudinary');
var photoapi = require("../modules/photoapi.js");
var query = require('../lib/query_user');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


router.get('/', function(req, res, next) {
  res.render('photos', { siteSection: 'photos', title: 'Photos' });
});


// TODO explore other upload options for security within the 'multer' module
// https://www.npmjs.com/package/multer
router.post('/tagphoto', upload.any(), function(req,res,next){
  var tempDestination = req.files[0].path;

  cloudinary.uploader.upload(
    tempDestination,
    function(result) {

        photoapi.faceDetectAPI(result.url)
        .then(function(data) {

          if(photoapi.valImage(data) === 'no face' ||
              photoapi.valImage(data) === "mult faces") {
                return Promise.reject('Error in detecting single face to match');
          }
          else if(photoapi.valImage(data) === "1 face") {
            var userFaceIdv = '';
            var targetFaceId = data[0].faceId;
            var targetCaptureImageUrl = result.url;

            if(req.session.user && req.session.user.id > 0){
              query
              .getUserPlayer_ByUserId(parseInt(req.session.user.id))
              .then(function(hunter) {
                if(hunter){
                  return query.getUserPlayer_ByPlayerId(hunter.targetplayer_id);
                } else {
                  return Promise.reject('no hunter found');
                }
              })
              .then(function(target){
                if(target && target.imageurl){
                  //now we have 2 images to compare
                  userFaceIdv = target.faceinfo;
                  return photoapi.faceVerifyAPI(targetFaceId, userFaceIdv);
                } else {
                    return Promise.reject('no target or no target image url');
                }
              })
              .then(function(faceverify){
                if(faceverify.error) {
                  return Promise.reject(faceverify.error);
                }
                else if(faceverify.isIdentical === true) {
                  console.log('Photo MATCH');
                  del([tempDestination]);
                  res.render('tagconfirmed', {
                    latestPhoto: result.url,
                    targetCrossed: "http://www.clker.com/cliparts/X/Z/1/Z/v/7/cross.svg"  });
                }
                else if(faceverify.isIdentical === false) {
                  console.log('Photo NO Match');
                  del([tempDestination]);
                  res.render('tagdenied', {
                    latestPhoto: 'https://pbs.twimg.com/profile_images/378800000563115809/b5bfa0c4b2e8670d09222c17856abef4.jpeg'});
                }
              })
              .catch(function(err){
                return Promise.reject(err.message);
              });
            } else {
              return Promise.reject('No valid Session User');
            }
          }
        })
        .catch(function(err){
          var _errors = [err];
          del([tempDestination]);
          res.render('photos', { siteSection: 'photos', title: 'Photos', errors: _errors });
        });
      },
      {
        crop: 'fit',
        width: 800,
        height: 800
      }
    )
});


router.get('/tagphoto', function(req, res, next) {
  res.render('photos');
})

module.exports = router;
