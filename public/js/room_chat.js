var text = $('input');
var messages_ul = $('#messages');

$("form").on('submit', function() {
  if (text.val().length !== 0) {
    socket.emit('new-message', text.val(), USERNAME);
    text.val('');
  }
});

socket.on('create-message', function (message, username) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var messageTemplate = $('#message-template').html();

  var card_bg_class;
  if (USERNAME === username) {
    card_bg_class = "bg-primary";
  } else if (username == undefined) {
    card_bg_class = "bg-secondary";
  } else {
    card_bg_class = "bg-dark";
  }

  var html = Mustache.render(messageTemplate, {
    from: USERNAME === username ? 'You' : username,
    createAt: formattedTime,
    message: message,
    card_bg_class: card_bg_class,
  });
  messages_ul.append(html);
  scrollToBottom();
});

const scrollToBottom = function() {
  var d = $('.chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}
