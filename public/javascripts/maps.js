
var map;
var mapDiv = document.getElementById('map');
var gError = document.getElementById('geoerror');
var boulderCO = {"lat":40.0179492,"lng":-105.2821528}; // downtown galvanize

var markerData = [];
var markers = [];


// google request call
function initMap(){
    drawMap();
}

function drawMap(centerLatLng){
  // ensure we have a reference!
  mapDiv = document.getElementById('map');
  gError = document.getElementById('geoerror');

  if(mapDiv){

    var _pos = centerLatLng || new google.maps.LatLng(boulderCO);

    if(map == undefined) {
      var mapOptions = {
        zoom: 14,
        center: _pos,
        tilt: 45,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      map = new google.maps.Map(mapDiv, mapOptions);
    }
    else {
      map.panTo(_pos);
    }

    for(var i=0;i<markerData.length;i++){
      var mark = markerData[i];

      // TODO handle non-existent location data
      var contentString = '<div class="marker-container">' +
        '<div class="marker-inner">' +
        '<h5>' + mark.alias + '</h5>' + //end alias
        '<div class="info-wrapper">' +
        '<h6>' + mark.firstname + '</h6>' + //end firstname
        '<h6>' + mark.lastname + '</h6>' + //end lastname
        '<div class="image-wrapper"><img src="' + mark.imageurl + '" style="width:125px;" class="marker-image" /></div>' + //end image
        '</div>' + //end info-wrapper
        '<h6>@ ' + mark.location + '</h6>' + //end location
        '</div>' + //end marker-inner
        '</div>';//end marker-container

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var iconImg = mark.imageurl.replace(/upload/i,
        'upload/g_face,c_thumb,c_crop,w_45,h_45,bo_1px_solid_rgb:e91e63,z_0.7,r_3');

      var markInstance = new google.maps.Marker({
        position: mark.location,
        map: map,
        title: mark.alias,
        animation: google.maps.Animation.BOUNCE,
        icon:iconImg
      });

      markInstance.addListener('click', function() {
        if (this.getAnimation() !== null) {
          this.setAnimation(null);
        } else {
          this.setAnimation(google.maps.Animation.BOUNCE);
        }
        infowindow.open(map, markInstance);
      });
    }
  } else {
    // console.log('no map found');
  }
}

$(function(){

  if (navigator && navigator.geolocation) {
    gError = document.getElementById('geoerror');
    if(gError){
      gError.innerHTML = 'navigator.geolocation is available';
    } else {
      // console.log('navigator.geolocation is available');
    }

    var watchId = navigator.geolocation.watchPosition(function(position) {
      // console.log('Everytime through loop (watchPos)');
      if(gError){
        gError.innerHTML = ' watching Position: ' + new Date().toISOString();
      } else {
        // console.log(' watching Position: ' + new Date().toISOString());
      }

      var userId = document.getElementById('userid');
      if(userId){

        var _userId = parseInt(userId.value);
        var _userPos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude);

        var _url = window.location.origin + '/locale/user/' + _userId;

        //ajax call to record location
        $.ajax({
          method: 'POST',
          url: _url,
          dataType: 'json',
          data: _userPos.toJSON()
        })
        .done(data =>{

          var _hunter = data.hunter;
          var _target = data.target;
          var _mapcenter = new google.maps.LatLng(boulderCO);
          // reset data
          markerData = [];

          if(_target){
            // convert from string
            var locationObj = JSON.parse(_target.lastlocation);

            if(locationObj.lat === 0.0 && locationObj.lat === 0.0){
              console.log('target location is not available', _target.lastlocation);
            } else {

              _mapcenter = new google.maps.LatLng(
                locationObj.lat,
                locationObj.lng);

              var _location = _mapcenter;
              var _firstname = _target.firstname || '';
              var _lastname = _target.lastname || '';
              var _alias = _target.alias || '';
              var _imageurl = _target.imageurl || '';


              //TODO remove existing markers
              markerData.push({
                location:_location,
                firstname:_firstname,
                lastname:_lastname,
                alias:_alias,
                imageurl:_imageurl
              });
            }
          }

          drawMap(_mapcenter);

        });
      }
    });// end of watchPosition
  } else {
    if(gError){
      gError.innerHTML = 'no navigator or no navigator.geolocation';
    } else {
      console.log('no navigator or no navigator.geolocation');
    }
  }

});
