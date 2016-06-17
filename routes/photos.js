require('dotenv').config();
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var multer  = require('multer');
var upload = multer({ dest: 'upfiles/' });
var del = require('del');
var cloudinary = require('cloudinary');
var photoapi = require("../modules/photoapi.js");



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
router.post('/tagphoto', upload.any(), function(req,res,next){
  console.log("-----------------------------------");
  console.log('in post');
  // TODO: derive title from user and some random info
  // var title = req.body.title.trim() || req.files[0].originalname;
  var tempDestination = req.files[0].path;

  cloudinary.uploader.upload(
    tempDestination,
    function(result) {

        // on upload of 'target player' image (input of faceDetectAPI is uploaded img)
        photoapi.faceDetectAPI(result.url)
        .then(function(data) {
          var targetFaceId = "";
          var userFaceIdv = "";
          console.log(photoapi.valImage)
          if(photoapi.valImage(data) === "no face") {
            // does not continue to run verify match, send error message to user
            console.log('error');
          }
          else if(photoapi.valImage(data) === "mult faces") {
            // does not continue to run verify match, send error message to user
            console.log('error');
          }
          else if(photoapi.valImage(data) === "1 face") {
            console.log('success - new target image validated');
            // success - go ahead and run verify match
            targetFaceId = data[0].faceId;
            console.log(targetFaceId);

            var targetTempImageUrl = result.url;
            console.log(req.session.user.id);

            // .where({userid: parseInt(req.session.user.id)})
            if(req.session.user && req.session.user.id > 0){

              knex('players')
              .where({userid: 5})
              .first()
              .then(function(hunter) {
                if(hunter){
                  console.log(hunter);
                    console.log("-----------------------------------");
                  knex('activeplayers')
                  .where({gameid:hunter.gameid, playerid:hunter.id})
                  .first()
                  .then(function(activehunter){
                    console.log(activehunter);
                    console.log("-----------------------------------");
                    knex('players')
                    .where({id:activehunter.targetid})
                    .first()
                    .then(function(targetedplayer){
                      console.log(targetedplayer);
                      console.log("-----------------------------------");
                      knex('users')
                      .where({id:targetedplayer.userid})
                      .first()
                      .then(function(targeteduser){
                        console.log(targeteduser);
                        console.log("-----------------------------------");
                        var targetProfileImage = targeteduser.imageurl;
                        if(targetProfileImage){
                          console.log(targetProfileImage);
                          console.log("-----------------------------------");

                          //targetTempImageUrl

                          //now we have 2 images to compare

                          knex('users')
                          .where({id:targeteduser.id})
                          .then(function(data) {
                            console.log(data);
                            console.log("-----------------------------------");
                            userFaceIdv = data[0].faceinfo;

                            photoapi.faceVerifyAPI(targetFaceId, userFaceIdv)
                            .then(function(data) {
                                console.log('arg1', targetFaceId);
                                console.log('arg2', userFaceIdv);
                                console.log("-----------------------------------");
                                console.log(data);
                                if(data.error) {
                                  console.log(data.error);
                                }
                                else if(data.isIdentical === true) {
                                  // require("jsdom").env("", function(err, window) {
                                  //  if (err) {
                                  //    console.error(err);
                                  //    return;
                                  //  }
                                  //
                                  //  var $ = require("jquery")(window);
                                  //  $('#tagConfirmed').openModal();
                                  // });
                                 // $('#tagConfirmed').openModal();
                                 // success - tag confirmed, target 'dies', new target assigned
                                 console.log('faces match');
                                }
                                else if(data.isIdentical === false) {
                                  // require("jsdom").env("", function(err, window) {
                                  //  if (err) {
                                  //    console.error(err);
                                  //    return;
                                  //  }
                                  //
                                  //  var $ = require("jquery")(window);
                                  //  $('#tagDenied').openModal();
                                  // });
                                 //  $('#tagDenied').openModal();
                                 // failure - captured face image is not a match, take user back to photo-upload page
                                 console.log('faces do not match');
                                }
                            }).catch(function(err){
                              console.log(err);
                              })
                          }).catch(function(err) {
                            next(err);
                          });

                        } else {
                          console.log('no target profie image');

                          //TODO send an error message that target has no profile image
                          res.render('photos', { siteSection: 'photos', title: 'Photos', latestPhoto: result.url });
                        }

                        // now access you vars via targeteduser (imageurl) and targetedplayer(lastlocation)
                        console.log(targeteduser);

                      }).catch(function(err){
                        next(err);
                      });
                    }).catch(function(err){
                      next(err);
                    });
                  }).catch(function(err){
                    next(err);
                  });
                } else {
                  console.log('player IS NOT member of game');
                  res.send(targetlocale);
                }

              }).catch(function(err){
                next(err);
              });
            } else {
              console.log('session user not valid');
            }

             // arguments below: new FaceId, targetFaceId pulled from target's DB
             // test: match = '5c265616-f3aa-41cf-a372-dbc02f16028a'
             // test: not match = '5cc77a0e-eb23-4913-9088-1411440ad945'

              }
             }).catch(function(err){
               next(err);
            })
          .catch(function(err){
            next(err);
          })
          // delete local temp file
          // don't bother waiting for promise resolve to move on
          del([tempDestination]);
          // .then(paths => {
          // 	console.log('Files and folders that would be deleted:\n', paths.join('\n'));
          // });
          res.render('photos', { siteSection: 'photos', title: 'Photos', latestPhoto: result.url });
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
