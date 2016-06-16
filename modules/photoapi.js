var request = require("request");

var faceDetectInput = "http://res.cloudinary.com/dfm9cmgix/image/upload/v1466015046/a5uhgghazpzt8p2laltu.jpg";
var faceDetectInput2 = "";

function faceDetectAPI(imageurl) {

  var options = { method: 'POST',
    url: 'https://api.projectoxford.ai/face/v1.0/detect',
    qs: { returnFaceId: 'true', returnFaceLandmarks: 'true' },
    headers:
     {
       'ocp-apim-subscription-key': '7c7a3aa51b274726aecc9844e89e6d77'
    },
    json: {
        url: imageurl
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    return(body);
  });
}

function faceVerifyAPI() {

  var options = { method: 'POST',
    url: 'https://api.projectoxford.ai/face/v1.0/verify',
    headers:
     {
       'ocp-apim-subscription-key': '7c7a3aa51b274726aecc9844e89e6d77'
    },
    json: {
        faceId1: '',
        faceId2: ''
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}

var promise = new Promise(function(resolve, reject) {
  reject(new Error('error'));
  resolve('success');
  return 
})

faceDetectAPI(faceDetectInput).then(function(data) {
  console.log(data);
});
// faceVerifyAPI()


// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//   console.log(body);
// });

module.exports = {
  faceDetectAPI
}
