$(document).ready(function() {
  submitButton = $('button[type="submit"]');
  roomIdInput = $('#roomId');
  $('input[type="radio"]').on('click', function(e) {
    var mode = $(this).val();
    if (mode == "join_room") {
      roomIdInput.show().attr('required', 'required');
      submitButton.text("Join Room");
    } else if (mode == "create_room") {
      roomIdInput.hide().removeAttr('required');
      submitButton.text("Create Room");
    }
  });
});
