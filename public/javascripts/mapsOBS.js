







var httpRequest;

function parseLocale() {
  // alert('parse Locale');
  console.log('Parsing locale');
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    alert('readystate = DONE');
    if (httpRequest.status === 200) {
      alert('ajax response', httpRequest.responseText);
      // draw the map with data


    } else {

      alert('ajax error!!!');
      errorDiv.innerHTML = 'There was a problem with the request.';
    }
  } else {
    console.log('Parsing ready state = ' + httpRequest.readyState);
    console.log('done state= ' + XMLHttpRequest.DONE);
  }
}















function initMap() {

  var errorDiv = document.querySelector('p.error');
  var userId = document.getElementById('userid');
  var userlocale = document.getElementById('userlocale');
  var targetlocale = document.getElementById('targetlocale');
  var mapDiv = document.getElementById('map');
  var map;
  var markers = [];
  var userMarker;
  var targetMarker;


  // Adds a marker to the map and push to the array.
  function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
  }

  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Shows any markers currently in the array
  function showMarkers() {
    setMapOnAll(map);
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }





  // if we have access to the api on this device
  if (navigator && navigator.geolocation) {

    var watchId = navigator.geolocation.watchPosition(function(position) {

      var _userPos = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude);

      // record position to hidden input
      userlocale.innerHTML = JSON.stringify(_userPos);


      console.log('UserId: ', userId);
      var _userId = parseInt(userId.value);
      if(_userId > 0){
        console.log('we have user with id and pos: ', _userId, _userPos);
        // pos is an object with 2 funcs
        // update db
        // ajax call to get player info - user and target
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
          errorDiv.innerHTML = 'ajaxError: could not create httpRequest';
        } else{

          console.log('request? ', httpRequest);
          httpRequest.onreadystatechange = parseLocale();

          console.log('LOCATION', window.location);
          var url = window.location.origin + '/locale/user/' + _userId;
          console.log('URL', url);

          try{
            httpRequest.open('GET', url);
            httpRequest.send();
          }
          catch(e){
            console.log('catching errors in request call: ', e);
          }
        }
      }

      // draw the map
      // if(mapDiv){
      //
      //   if(map == undefined) {
      //     var myOptions = {
      //       zoom: 12,
      //       center: _userPos,
      //       tilt: 45,
      //       mapTypeId: google.maps.MapTypeId.ROADMAP
      //     }
      //     map = new google.maps.Map(mapDiv, myOptions);
      //   }
      //   else map.panTo(_userPos);
      // }

      // remove markers by id
      //http://stackoverflow.com/questions/8521766/google-maps-api-3-remove-selected-marker-only

      // deleteMarkers();





        // // TODO how to?
        // // clear out old markers
        // userMarker = null;
        // targetMarker = null;
        //
        //
        //
        // // redraw markers
        // userMarker = new google.maps.Marker({
        //   position: _userPos,
        //   map: map
        // });
        //
        // targetMarker = new google.maps.Marker({
        //   position: _userPos,
        //   map: map
        // });
        //


      },
      function(err){
        // log any errors
        errorDiv.innerHTML = 'getCurrentPositionError: ' + err;
      },
      {enableHighAccuracy:true, timeout:60000, maximumAge:0}
    );//end watchid
  } else {
    //TODO some sort of error notification
    errorDiv.innerHTML = 'geolocation is not available!';
  }
}
