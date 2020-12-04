var submitButton = $('button[type="submit"]');
var roomIdInput = $('#roomId');
var radioButtons = $('input[type="radio"]');

$(document).ready(function() {
  radioButtons.on('click', function(e) {
    var mode = $(this).val();
    if (mode == "join_room") {
      submitButton.text("Join Room");
      roomIdInput.prop('readonly', false).val("");
    } else if (mode == "create_room") {
      submitButton.text("Create Room");
      roomIdInput.prop('readonly', true).val(ROOM_ID);
    }
  });
});
