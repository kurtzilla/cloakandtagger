var request = require("request");
var knex = require('../db/knex');

var faceDetectInput1 = "https://res.cloudinary.com/dfm9cmgix/image/upload/v1466015046/a5uhgghazpzt8p2laltu.jpg";
var faceDetectInput2 = "https://sims.ess.ucla.edu/people-images/2008_Dec_group.JPG";
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
    });
  });
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
    });
  });
};

function valImage(data) {
  var imgStatus = "";
  if(data.error) {
    imgStatus = "no face";
  }
  else if(data.length !== 1) {
    imgStatus = "mult faces";
  }
  else {
    imgStatus = "1 face";
  }
  return imgStatus;
};


module.exports = {
  faceDetectAPI,
  faceVerifyAPI,
  valImage
}
