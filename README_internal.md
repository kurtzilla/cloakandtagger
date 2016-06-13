


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



Brendan Haskins [11:19 AM]  
Image APIs
https://skybiometry.com/start-building/
https://www.microsoft.com/cognitive-services/en-us/face-api
http://www.faceplusplus.com/uc_home/

Native app conversion
https://tabrisjs.com/



TODO:
  - obfuscate google api key in api script call (layout.jade)


/////////// From slack
Rob Kurtz [6:49 PM]  
aha - and what did you use for face recog - (and would you recommend it)?

Teddi Maull [7:43 PM]  
@rkurtz: I used Project Oxford which is part of this collection of APIs (https://www.microsoft.com/cognitive-services/en-us/documentation). I’m posting the link to their suite in case anyone finds inspiration in the choices :slightly_smiling_face:.  
A link from my code journal directly to the actual API I used - https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f0375749c3f70a50e79b82

[7:43]  
Recommend…well it worked, haahahaha.




////////////////////////////////////////////////
To drop all tables within postgres:
drop schema public cascade;
create schema public;
