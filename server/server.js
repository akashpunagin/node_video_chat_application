const express = require('express');
const http = require('http');
const {v4: uuidv4} = require('uuid');
const socketIO = require('socket.io');
const {ExpressPeerServer} = require('peer');
const bodyParser = require('body-parser');
const path = require('path');

const {Users} = require('./utils/users');

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
  let roomId = uuidv4();
  res.render('index.ejs', {roomId});
});

app.post('/room', (req, res) => {
  res.render('room.ejs', {
    roomId: req.body.roomId,
    username: req.body.username,
    peer_port: process.env.PEER_PORT
  });
});

var users = new Users();

io.on('connection', socket => {
  socket.on('join-room', (roomId, userPeerId, username, callback) => {
    if (!users.isUserNameAvailable(username)) {
      callback(`Username - ${username} is not available, please try with different username`);
    }
    socket.join(roomId);

    users.removeUser(socket.id);
    users.addUser(socket.id, username, roomId);
    io.to(roomId).emit("updateUserList", users.getUserList(roomId)); // TODO

    socket.to(roomId).broadcast.emit('user-connected', userPeerId);

    if (users.getUserList(roomId).length > 1) {
      socket.emit('create-message', `Members of this room welcomes you`, undefined);
    } else {
      socket.emit('create-message', `Invite members to this room`, undefined);
    }
    socket.broadcast.to(roomId).emit('create-message', `${username} joined the room`, undefined);

    socket.on('new-message', (message, username) => {
      var user = users.getUser(socket.id);
      if (user) {
        io.to(user.roomId).emit('create-message', message, username);
      }
    });
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      // io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      // TODO: remove video feed of dicsonnected user
      io.to(user.roomId).emit("create-message", `${user.name} left the room`, undefined);
    }
  });
});

server.listen(PORT, () => {
  console.log(`App running on PORT: ${PORT}`);
});
