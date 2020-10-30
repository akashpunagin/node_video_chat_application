const socket = io();

const videoGrid = document.getElementById('video-grid')
const video = document.createElement('video');
video.muted = true;
let videoStreamCurrentUser;


var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000'
})

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
var videoButton = $('#main_video__button')

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
var messages_ul = $('.messages');

$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    socket.emit('new-message', text.val());
    text.val('');
  }
});

socket.on('create-message', function (message) {
  var message_li = $('<li></li>');
  message_li.text(`User - ${message}`);
  message_li.addClass('message');
  messages_ul.append(message_li);
  scrollToBottom();
});

const scrollToBottom = function() {
  var d = $('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}
