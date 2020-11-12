socket.on('update-participants-list', function (users) {
  // TODO: display participants
  // var ol = $("<ol></ol>");
  users.forEach(function (user) {
    console.log(user);
    // ol.append($("<li></li>").text(user));
  });

  // $("#users").html(ol);
});
