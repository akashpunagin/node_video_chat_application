$(document).ready(function() {
  var submitButton = $('button[type="submit"]');
  var roomIdInput = $('#roomId');
  var radioButtons = $('input[type="radio"]');
  radioButtons[0].checked = true;
  $('input[type="radio"]').on('click', function(e) {
    var mode = $(this).val();
    if (mode == "join_room") {
      roomIdInput.prop('readonly', false).attr('value', "");
      // roomIdInput.show().attr('required', 'required');
      // submitButton.text("Join Room");
    } else if (mode == "create_room") {
      roomIdInput.prop('readonly', true).attr('value', ROOM_ID);
      // roomIdInput.hide().removeAttr('required');
      // submitButton.text("Create Room");
    }
  });
});
