socket.on('update-participants-list', function (users) {
  // TODO: display participants
  // console.log(users);

  var participantsTemplate = $('#participants-template').html();
  var html = Mustache.render(participantsTemplate, {
    users: users
  });

  // var cardHtml = '\
  // <div class="card bg-secondary" style="width: inherit;">\
  //   <div class="card-body py-2" style="white-space: normal; word-wrap: break-word;">\
  //     <p class="card-text m-0">user</p>\
  //   </div>\
  // </div>\
  // ';

  // var ol = $("<ol></ol>");
  // users.forEach(function (user) {
  //   console.log("Current users:", user);
  //   ol.append($("<li></li>").html(userCard));
  // });



  $("#participants").html(html);
});

// var cardDiv = $("<div></div>").addClass('card').addClass('bg-secondary');
// var cardBodyDiv = $("<div></div>").addClass('card-body').addClass('py-2');
// var cardText = $("<p></p>").addClass('card-text').addClass('m-0');
// var userCard = cardDiv.appendTo(cardBodyDiv).appendTo(cardText.val("hi"));


// var cardHtml = '\
// <div class="card bg-secondary">\
//   <div class="card-body py-2">\
//     <p class="card-text m-0">user</p>\
//   </div>\
// </div>\
// ';
