$(function(){

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 2, // Creates a dropdown of 15 years to control year
    format: 'yyyy/mm/dd',
    onSet: function( arg ){
        if ( 'select' in arg ){ //prevent closing on selecting month/year
            this.close();
        }
    }
  });

  $('.button-collapse').sideNav({edge: 'right'});

  $('#hunt').on('click', function(e){
    $.get( "/testgameplayhunt", function( data ) {
      $("#gameplayContent").html( data );
    });
  })
  $('#dossier').on('click', function(e){
    $.get( "/testgameplaydossier", function( data ) {
      $("#gameplayContent").html( data );
    });
  })
  $('#game').on('click', function(e){
    $.get( "/testgameplaygame", function( data ) {
      $("#gameplayContent").html( data );
    });
  })
});
