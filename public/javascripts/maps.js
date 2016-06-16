
var map;
var mapDiv = document.getElementById('map');
var gError = document.getElementById('geoerror');
var boulderCO = {"lat":40.0179492,"lng":-105.2821528}; // downtown galvanize


var markers = [];


// google request call
function initMap(){
    // console.log('initMap function');
    drawMap();
}

function drawMap(centerPos){
  // console.log('centerPos', centerPos);
  // ensure we have a reference!
  mapDiv = document.getElementById('map');
  gError = document.getElementById('geoerror');
  // console.log('mapDiv', mapDiv);
  if(mapDiv){
    // console.log('draw the map', centerPos);
    var _pos = centerPos || new google.maps.LatLng(boulderCO);
    //console.log('pos is now', _pos);

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
      //console.log('panning map to', _pos);
      map.panTo(_pos);
    }

    // add in the markers array
    for(var i=0;i<markers.length;i++){
      new google.maps.Marker({
        position: markers[i],
        map: map
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
      console.log('navigator.geolocation is available');
    }


    var watchId = navigator.geolocation.watchPosition(function(position) {
      if(gError){
        gError.innerHTML = ' watching Position: ' + new Date().toISOString();
      } else {
        console.log(' watching Position: ' + new Date().toISOString());
      }

      var userId = document.getElementById('userid');
      if(userId){

        var _userId = parseInt(userId.value);
        var _userPos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude);

        //ajax call to record location
        var _url = window.location.origin + '/locale/user/1';
        console.log('google watchPosition: ' + new Date().toISOString() + ' @ ' + _userPos);
        $.ajax({
          method: 'POST',
          url: _url,
          dataType: 'json',
          data: _userPos.toJSON()
        })
        .done(data =>{
          //console.log('returned data', data, data.lat, data.lng);
          if(data.lat !== '0' && data.lng !== '0'){
            var d = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
            //console.log('transformed locale', d);
            //reset markers
            markers = [];
            markers.push(d);
            drawMap(d);
          }
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
