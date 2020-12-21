const socket = io();

const videoGrid = $('#video-grid');
const video = document.createElement('video');
video.muted = true;
var videoStreamCurrentUser;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: PEER_PORT === "" ? '3000' : PEER_PORT
});

navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(function (stream) {
  videoStreamCurrentUser = stream;
  addVideoStream(video, stream, USERNAME);
  socket.on('user-connected', function (userPeerId, username) {
    connectToNewUser(userPeerId, username, stream);
  });
  peer.on('connection', function (conn) {
    conn.on('data', function (username) {
      peer.on('call', function (call) {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', function (userVideoStream) {
          addVideoStream(video, userVideoStream, username);
        });
      });
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

socket.on('disconnect-user', function (username) {
  $('#video-grid > video').remove(`#${username}`);
});

const connectToNewUser = function (userPeerId, username, stream) {
  var conn = peer.connect(userPeerId);
  conn.on('open', function(){
    conn.send(USERNAME);
    const call = peer.call(userPeerId, stream);
    const video = document.createElement('video');
    call.on('stream', function (userVideoStream) {
      addVideoStream(video, userVideoStream, username);
    });
  });
};

const addVideoStream = function (video, stream, username) {
  var videoIds = $('#video-grid video').map(function () {
    return $(this).attr('id');
  }).get();
  if (!videoIds.includes(username)) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', function () {
      video.play();
    });
    video.setAttribute("id", username);
    videoGrid.append(video);
  }
};

$(window).on('beforeunload', function(){
  socket.close();
});
