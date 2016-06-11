


Use this link for Session Key (and others) generation
node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });"

///////////////////////////
Cloudinary image handling
///////////////////////////
Face detection based cropping
Cloudinary can automatically crop a clear picture of a person in a way that the face of the person is in the center of the derived picture.
https://devcenter.heroku.com/articles/cloudinary

TODO: implement direct upload with jquery
http://cloudinary.com/documentation/node_image_upload#direct_uploading_from_the_browser



TODO:
  - obfuscate google api key in api script call (layout.jade)
