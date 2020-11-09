const express = require('express');
const http = require('http');
const {v4: uuidv4} = require('uuid');
const socketIO = require('socket.io');
const {ExpressPeerServer} = require('peer');
const bodyParser = require('body-parser');
const path = require('path');

// Configurations
const PORT = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
const server = http.Server(app);
const io = socketIO(server);
const peerServer = ExpressPeerServer(server, {debug: true});
app.use('/peerjs', peerServer);

const middlewares = [
  bodyParser.urlencoded({ extended: true }),
];
app.use(middlewares);

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/room', (req, res) => {
  res.render('room.ejs', {
    roomId: req.body.join_or_create === "create_room" ? uuidv4() : req.body.roomId,
    username: req.body.username,
    peer_port: process.env.PEER_PORT
  });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userPeerId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userPeerId);

    socket.on('new-message', message => {
      io.to(roomId).emit('create-message', message);
    });
  });
});

server.listen(PORT, () => {
  console.log("App running on localhost 3000");
})
