$(document).ready(function() {
  $('#create__room').removeClass('d-none').hide();
});

$('#toggle_join_create').on('click', function () {
  $('#join__room').toggle();
  $('#create__room').toggle();
  if ($('#join__room').is(':visible')) {
    $('#toggle_join_create').text("Create Room");
  } else {
    $('#toggle_join_create').text("Join Room");
  }
});
