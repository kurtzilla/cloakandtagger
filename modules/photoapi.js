var request = require("request");
var knex = require('../db/knex');

var faceDetectInput1 = "http://res.cloudinary.com/dfm9cmgix/image/upload/v1466015046/a5uhgghazpzt8p2laltu.jpg";
var faceDetectInput2 = "http://sims.ess.ucla.edu/people-images/2008_Dec_group.JPG";
var faceDetectInput3 = "https://touchofhopefoundation.files.wordpress.com/2011/01/img_0941.jpg"

function faceDetectAPI(imageurl) {

  return new Promise(function(resolve, reject) {

    var options = { method: 'POST',
      url: 'https://api.projectoxford.ai/face/v1.0/detect',
      qs: { returnFaceId: 'true', returnFaceLandmarks: 'true' },
      headers:
       {
         'ocp-apim-subscription-key': process.env.MS_FACE_API_KEY
      },
      json: {
          url: imageurl
      }
    };

    request(options, function (error, response, body) {
      if (error) reject(error);
      resolve(body);
    })
  })
};

function faceVerifyAPI(id1, id2) {

  return new Promise(function(resolve, reject) {

  var options = { method: 'POST',
    url: 'https://api.projectoxford.ai/face/v1.0/verify',
    headers:
     {
       'ocp-apim-subscription-key': process.env.MS_FACE_API_KEY
    },
    json: {
        faceId1: id1,
        faceId2: id2,
    }
  };

  request(options, function (error, response, body) {
    if (error) reject(error);
    resolve(body);
    })
  })
};

function valImage(data) {
  var imgStatus = "";
  if(data.error) {
    imgStatus = "no face";
  }
  else if(data.length !== 1) {
    imgStatus = "mult faces"
  }
  else {
    imgStatus = "1 face"
  }
  return imgStatus
};

// faceDetectAPI(faceDetectInput1)
//  .then(function(data) {
//    console.log(data);
//    var userFaceId = data[0].faceId;
//    console.log(userFaceId);
//      if(valImage(data) === "no face") {
//        // does not upload, send error message to user
//        console.log('error');
//      }
//      else if(valImage(data) === "mult faces") {
//        // does not upload, send error message to user
//        console.log('error');
//      }
//      else if(valImage(data) === "1 face") {
//        // success - update column in database with object
//        console.log('success');
//        knex('users')
//       //  .where({id: parseInt(req.session.user.id)})
//        .where({id: 4})
//        .update({faceinfo: userFaceId})
//        .then(function(data){
//          console.log(data);
//        })
//        .catch(function(err){
//          next(err);
//        });
//       //  .finally(function() {
//       //    knex.destroy();
//       //  })
//     }
//   }).catch(function(err){
//     next(err);
// });

// on upload of 'target player' image (input of faceDetectAPI is uploaded img)
// faceDetectAPI(faceDetectInput1)
// .then(function(data) {
//   var targetFaceId = "";
//   var userFaceIdv = "";
//   if(valImage(data) === "no face") {
//     // does not continue to run verify match, send error message to user
//     console.log('error');
//   }
//   else if(valImage(data) === "mult faces") {
//     // does not continue to run verify match, send error message to user
//     console.log('error');
//   }
//   else if(valImage(data) === "1 face") {
//     console.log('success - new target image validated');
//     // success - go ahead and run verify match
//     targetFaceId = data[0].faceId;
//     console.log(targetFaceId);
//
//     // id in .where() needs to equal target's stored faceinfo faceId -- consult with brendan/rob
//     knex('users')
//     .where({id:4})
//     .then(function(data) {
//       userFaceIdv = data[0].faceinfo;
//
//      // arguments below: new FaceId, targetFaceId pulled from target's DB
//      // test: match = '5c265616-f3aa-41cf-a372-dbc02f16028a'
//      // test: not match = '5cc77a0e-eb23-4913-9088-1411440ad945'
//
//      faceVerifyAPI(targetFaceId, userFaceIdv)
//      .then(function(data) {
//          console.log('arg1', targetFaceId);
//          console.log('arg2', userFaceIdv);
//          console.log(data);
//          if(data.error) {
//            console.log(data.error);
//          }
//          else if(data.isIdentical === true) {
//           // success - tag confirmed, target 'dies', new target assigned
//           console.log('faces match');
//          }
//          else if(data.isIdentical === false) {
//           // failure - captured face image is not a match, take user back to photo-upload page
//           console.log('faces do not match');
//          }
//      }).catch(function(err){
//        console.log(err);
//        })
//      }).catch(function(err){
//        console.log(err);
//     })
//   }
// }).catch(function(err){
//   console.log(err);
// });

module.exports = {
  faceDetectAPI,
  faceVerifyAPI,
  valImage
}
