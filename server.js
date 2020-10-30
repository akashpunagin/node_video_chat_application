const express = require('express');
const http = require('http');
const {v4: uuidv4} = require('uuid');
const socketIO = require('socket.io');
const {ExpressPeerServer} = require('peer');

// Configurations
const PORT = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
const server = http.Server(app);
const io = socketIO(server);
const peerServer = ExpressPeerServer(server, {debug: true});
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:roomId', (req, res) => {
  res.render('room', {
    roomId: req.params.roomId
  });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userPeerId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userPeerId);
    console.log("Joined room");

    socket.on('new-message', message => {
      io.to(roomId).emit('create-message', message);
    });
  });
});

server.listen(PORT, () => {
  console.log("App running on localhost 3000");
})
