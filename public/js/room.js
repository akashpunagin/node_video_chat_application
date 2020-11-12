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

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(function (stream) {
  videoStreamCurrentUser = stream;
  addVideoStream(video, stream, USERNAME);
  socket.on('user-connected', function (userPeerId, username) {
    connectToNewUser(userPeerId, username, stream);
  });


  var peerUsername;
  peer.on('connection', function(conn) {
    console.log("PEER CONNECTION");
    conn.on('data', function(data) {
      console.log("PEER CONNECTION DATA:",data);
      peerUsername = data;
      console.log("SET PEER USERNAME");
    });
  });


  peer.on('call', function (call) {
    console.log("PEER CALL", call);
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', function (userVideoStream) {
      console.log("PEER USER NAME TO STREAM: ", peerUsername);
      addVideoStream(video, userVideoStream, peerUsername); // TODO: pass username
    });
  });

}).catch(function (err) {
  alert("Couldn't connect to your device's media");
  alert(err); // TODO: delete
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

  var conn = peer.connect(userPeerId);
  conn.on('open', function(){
    console.log("SENDING DATA: ", USERNAME);
    conn.send(USERNAME);
  });

  const call = peer.call(userPeerId, stream);

  const video = document.createElement('video');
  call.on('stream', function (userVideoStream) {
    console.log("CONNECT TO NEW USER", username);
    addVideoStream(video, userVideoStream, username);
  });
};

const addVideoStream = function (video, stream, username) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', function () {
    video.play();
  });
  video.setAttribute("id", username);
  videoGrid.append(video);
};
