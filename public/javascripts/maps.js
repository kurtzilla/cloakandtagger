
var map;
var mapDiv = document.getElementById('map');
var boulderCO = {"lat":40.0179492,"lng":-105.2821528}; // downtown

var userId = document.getElementById('userid');
var markers = [];


// google request call
function initMap(){
    drawMap();
}

function drawMap(centerPos){
  console.log('centerPos', centerPos);
  if(mapDiv){
    console.log('draw the map', centerPos);
    var _pos = centerPos || new google.maps.LatLng(boulderCO);
    console.log('pos is now', _pos);

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
      console.log('panning map to', _pos);
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

    var watchId = navigator.geolocation.watchPosition(function(position) {

      var _userId = parseInt(userId.value);
      var _userPos = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude);


      //ajax call to record location
      var _url = window.location.origin + '/locale/user/1';

      // console.log('User Pos', _userPos);
      // console.log('User Pos', _userPos.toString());
      // console.log('User Pos', JSON.stringify(_userPos));
      // console.log('User Pos', JSON.parse(_userPos));

      // var dataArray = [];
      // dataArray.push({'userPos': JSON.stringify(_userPos)});

      console.log('URL', _url);
      $.ajax({
        method: 'POST',
        url: _url,
        dataType: 'json',
        data: _userPos.toJSON()
      })
      .done(data =>{
        console.log('returned data', data, data.lat, data.lng);
        if(data.lat !== '0' && data.lng !== '0'){
          var d = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
          console.log('transformed locale', d);
          //reset markers
          markers = [];
          markers.push(d);
          drawMap(d);
        }
      });


      // .catch(err =>{
      //   console.log('ajax error calling locale', err);
      // });

      // drawMap(_userPos);

    });// end of watchPosition
  }

});
