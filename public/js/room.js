const socket = io();

const videoGrid = $('#video-grid');
const video = document.createElement('video');
video.muted = true;
let videoStreamCurrentUser;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: PEER_PORT === "" ? '3000' : PEER_PORT
});

// COPY ROOM ID
var roomTooltip = $('[data-toggle="tooltip"]');
roomTooltip.tooltip('disable');
roomTooltip.hover(function () {
  if (roomTooltip.find('i').hasClass('fa-door-closed')) {
    roomTooltip.find('i').removeClass('fa-door-closed').addClass('fa-door-open');
  } else if (roomTooltip.find('i').hasClass('fa-door-open')) {
    roomTooltip.find('i').removeClass('fa-door-open').addClass('fa-door-closed');
  }
});
function copyToClipboard() {
  roomTooltip.tooltip('enable');
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
  socket.on('user-connected', function (userPeerId, username) {
    connectToNewUser(userPeerId, username, stream);
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
  socket.emit('join-room', ROOM_ID, id, USERNAME, function (err) {
    if (err) {
      alert(err);
    }
    window.location.href = "/";
  });
});

const connectToNewUser = function (userPeerId, username, stream) {
  const call = peer.call(userPeerId, stream);
  const video = document.createElement('video');
  call.on('stream', function (userVideoStream) {
    addVideoStream(video, userVideoStream, username);
  });
};

const addVideoStream = function (video, stream, username) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', function () {
    video.play();
  });
  videoGrid.append(video);
};
