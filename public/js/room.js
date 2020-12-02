const socket = io();

const videoGrid = $('#video-grid');
const video = document.createElement('video');
video.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: PEER_PORT === "" ? '3000' : PEER_PORT
});

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(function (stream) {
  addVideoStream(video, stream, USERNAME);
  socket.on('user-connected', function (userPeerId, username) {
    connectToNewUser(userPeerId, username, stream);
  });

  // var peerUsername;
  peer.on('connection', function (conn) {
    conn.on('data', function (username) {
      // peerUsername = username;

      peer.on('call', function (call) {
        console.log("PEER CALL");
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', function (userVideoStream) {
          console.log("ADD VIDEO STREAM in call");
          addVideoStream(video, userVideoStream, username);
        });
      });


    });
  });


  // peer.on('call', function (call) {
  //   call.answer(stream);
  //   const video = document.createElement('video');
  //   call.on('stream', function (userVideoStream) {
  //     addVideoStream(video, userVideoStream, peerUsername);
  //   });
  // });

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
  console.log("CONNECT TO NEW USER", username);
  var conn = peer.connect(userPeerId);
  conn.on('open', function(){
    conn.send(USERNAME);
    console.log("SENDING DATA: ", USERNAME);
    const call = peer.call(userPeerId, stream);
    const video = document.createElement('video');
    call.on('stream', function (userVideoStream) {
      console.log("ADD VIDEO STREAM in connect");
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
