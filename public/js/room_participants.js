socket.on('update-participants-list', function (users) {
  var participantsTemplate = $('#participants-template').html();
  var html = Mustache.render(participantsTemplate, {
    users: users
  });
  $("#participants").html(html);
});
