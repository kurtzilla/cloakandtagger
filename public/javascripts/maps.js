
function initMap() {

  var errorDiv = document.querySelector('p.error');
  var userId = document.getElementById('userid');
  var userlocale = document.getElementById('userlocale');
  var targetlocale = document.getElementById('targetlocale');
  var mapDiv = document.getElementById('map');
  var map;
  var userMarker;
  var targetMarker;


  // if we have access to the api on this device
  if (navigator && navigator.geolocation) {

    var watchId = navigator.geolocation.watchPosition(function(position) {

      var userPos = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude);

      // record position to hidden input
      userlocale.innerHTML = JSON.stringify(userPos);

      console.log('UserId: ', userId);
      if(parseInt(userId.val()) > 0){
        // update db
        // retrieve any target info as well
      }

      // if we have a map div
      if(mapDiv.length > 0){

        if(map == undefined) {
          var myOptions = {
            zoom: 12,
            center: userPos,
            tilt: 45,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          map = new google.maps.Map(mapDiv, myOptions);
        }
        else map.panTo(userPos);


      }

        // TODO how to?
        // clear out old markers
        userMarker = null;
        targetMarker = null;



        // redraw markers
        userMarker = new google.maps.Marker({
          position: latLng,
          map: map
        });

        targetMarker = new google.maps.Marker({
          position: latLng,
          map: map
        });



      }
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
