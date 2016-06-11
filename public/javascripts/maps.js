
function initMap() {

  var errorDiv = document.querySelector('p.error');
  var mapDiv = document.getElementById('map');


  if ('geolocation' in navigator) {
    /* geolocation is available */

    // TODO ripe for a promise chain
    navigator.geolocation.getCurrentPosition(function(position) {

      var latLng = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);
      var location = document.querySelector('.location');

      location.innerHTML = latLng;

      // TODO: initial lat long should be set in session
      // TODO: save location data in session/cookies - remember users view settings
      // TODO: cookie expires every x minutes (configurable in admin) to facilitate update
      var map = new google.maps.Map(mapDiv, {
        center: latLng,
        tilt: 45,
        zoom: 12
      });

      // add a marker at the current user's location
      // TODO customize icon to indicate current player
      // TODO add markers for visible players
      var marker = new google.maps.Marker({
        position: latLng,
        map: map
      });

    });


  } else {
    /* geolocation IS NOT available */
    errorDiv.innerHTML = 'geolocation is not available!';
  }
}
