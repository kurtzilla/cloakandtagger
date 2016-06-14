
function initMap() {

  var errorDiv = document.querySelector('p.error');
  var mapDiv = document.getElementById('map');
  var map;


  if (navigator && navigator.geolocation) {
  //if ('geolocation' in navigator) {
    /* geolocation is available */

    // TODO ripe for a promise chain
    // navigator.geolocation.getCurrentPosition(function(position) {

    // http://stackoverflow.com/questions/35294154/cordova-geolocation-watchposition-frequency-is-higher-than-the-options-allow-it


    var watchId = navigator.geolocation.watchPosition(function(position) {

      //alert('watched');

      var latLng = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);
      var location = document.querySelector('.location');

      location.innerHTML = latLng;

      // TODO: initial lat long should be set in session
      // TODO: save location data in session/cookies - remember users view settings
      // TODO: cookie expires every x minutes (configurable in admin) to facilitate update
      if(map == undefined) {
        var myOptions = {
          zoom: 12,
          center: latLng,
          tilt: 45,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapDiv, myOptions);
      }
      else map.panTo(latLng);

      // add a marker at the current user's location
      // TODO customize icon to indicate current player
      // TODO add markers for visible players
      var marker = new google.maps.Marker({
        position: latLng,
        map: map
      });

    },
    function(err){
      // log any errors
      errorDiv.innerHTML = 'getCurrentPositionError: ' + err;
    },
    {enableHighAccuracy:true, timeout:60000, maximumAge:0} // age 5 minutes = 300000
  );


  } else {
    /* geolocation IS NOT available */
    errorDiv.innerHTML = 'geolocation is not available!';
  }
}
