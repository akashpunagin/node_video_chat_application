const socket = io();

const videoGrid = document.getElementById('video-grid')
const video = document.createElement('video');
video.muted = true;
let videoStreamCurrentUser;

console.log("HERE", PEER_PORT === "");
var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: PEER_PORT === "" ? '3000' : PEER_PORT
});
// TODO: PORT 443 for heroku

var roomTooltip = $('[data-toggle="tooltip"]');
roomTooltip.hover(function () {
  if (roomTooltip.find('i').hasClass('fa-door-closed')) {
    roomTooltip.find('i').removeClass('fa-door-closed').addClass('fa-door-open');
  } else if (roomTooltip.find('i').hasClass('fa-door-open')) {
    roomTooltip.find('i').removeClass('fa-door-open').addClass('fa-door-closed');
  }
});

function copyToClipboard() {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(ROOM_ID).select();
  document.execCommand("copy");
  $temp.remove();

  roomTooltip.tooltip('show');
  roomTooltip.mouseleave(function(){
    roomTooltip.tooltip('dispose');
  });
}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(function (stream) {
  videoStreamCurrentUser = stream;
  addVideoStream(video, stream);
  socket.on('user-connected', function (userPeerId) {
    connectToNewUser(userPeerId, stream);
  });
  peer.on('call', function (call) {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', function (userVideoStream) {
      addVideoStream(video, userVideoStream);
    });
  });
}).catch(function (err) {
  alert("Couldn't connect to your device's media");
});

peer.on('open', function (id) {
  socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = function (userPeerId, stream) {
  const call = peer.call(userPeerId, stream);
  const video = document.createElement('video');
  call.on('stream', function (userVideoStream) {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = function (video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', function () {
    video.play();
  });
  videoGrid.append(video);
};

// CONTROLS
var muteButton = $('#main__mute__button');
var videoButton = $('#main_video__button');
var chatButton = $('#main__chat__button');
var mainChatWindow = $('#main__chat__window');
var mainVideoWindow = $('#main__video_window');

const muteUnmute = function () {
  const enabled = videoStreamCurrentUser.getAudioTracks()[0].enabled;
  if (enabled) {
    videoStreamCurrentUser.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    videoStreamCurrentUser.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
}

const playStopVideo = function () {
  const enabled = videoStreamCurrentUser.getVideoTracks()[0].enabled;
  if (enabled) {
    videoStreamCurrentUser.getVideoTracks()[0].enabled = false;
    setVideoStopButton();
  } else {
    videoStreamCurrentUser.getVideoTracks()[0].enabled = true;
    setVideoPlayButton();
  }
}

$(document).ready(function () {
  chatButton.on('click', function () {
    if (mainChatWindow.is(":visible")) {
      mainChatWindow.removeClass('d-flex').addClass('d-none');
      mainVideoWindow.removeClass('col-md-9').addClass('col-md-12');
      setChatShowButton();
    } else {
      mainChatWindow.removeClass('d-none').addClass('d-flex');
      mainVideoWindow.removeClass('col-md-12').addClass('col-md-9');
      setChatHideButton();
    }
  });
});

const setChatShowButton = function () {
  chatButton.find("i").removeClass("fa-comment-slash").removeClass("controls__disabled").addClass('fa-comment');
  chatButton.find("span").text("Show Chat");
};

const setChatHideButton = function () {
  chatButton.find("i").removeClass("fa-comment-slash").addClass("controls__disabled").addClass("fa-comment-slash");
  chatButton.find("span").text("Hide Chat");
}

const setMuteButton = function () {
  muteButton.find("i").removeClass("fa-microphone-slash").removeClass("controls__disabled").addClass("fa-microphone");
  muteButton.find("span").text("Mute");
};

const setUnmuteButton = function () {
  muteButton.find("i").removeClass("fa-microphone").addClass("fa-microphone-slash").addClass("controls__disabled");
  muteButton.find("span").text("Unmute");
};

const setVideoPlayButton = function () {
  videoButton.find("i").removeClass("fa-video-slash").removeClass("controls__disabled").addClass("fa-video");
  videoButton.find("span").text("Stop Video");
};

const setVideoStopButton = function () {
  videoButton.find("i").removeClass("fa-video").addClass("fa-video-slash").addClass("controls__disabled");
  videoButton.find("span").text("Play Video");
};

// CHAT
var text = $('input');
var messages_ul = $('#messages');

$("form").on('submit', function() {
  if (text.val().length !== 0) {
    socket.emit('new-message', text.val());
    text.val('');
  }
});

socket.on('create-message', function (message) {
  var message_li = $('<li></li>');
  message_li.text(`${USERNAME}: ${message}`);
  message_li.addClass('list-group-item').addClass('text-white'); // TODO: can add active class if it is message of current user
  messages_ul.append(message_li);
  scrollToBottom();
});

const scrollToBottom = function() {
  var d = $('.chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}
