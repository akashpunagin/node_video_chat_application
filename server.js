const express = require('express');
const http = require('http');
const {v4: uuidv4} = require('uuid');
const socketIO = require('socket.io');
const {ExpressPeerServer} = require('peer');
const bodyParser = require('body-parser');

// Configurations
const PORT = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
const server = http.Server(app);
const io = socketIO(server);
const peerServer = ExpressPeerServer(server, {debug: true});
app.use('/peerjs', peerServer);

// Middelwares
const middlewares = [
  bodyParser.urlencoded({ extended: true }),
];
app.use(middlewares);

app.get('/', (req, res) => {
  // res.redirect(`/${uuidv4()}`);
  res.render('index.ejs');
});

app.post('/create-room', (req, res) => {
  console.log("CREATE ROOM", req.body);
  res.redirect(`/room/${uuidv4()}/${req.body.name}`);

});

app.post('/join-room', (req, res) => {
  console.log("JOIN ROOM", req.body);
  res.redirect(`/room/${req.body.roomId}/${req.body.name}`);
});

app.get('/room/:roomId/:name', (req, res) => {
  console.log("HERE", req.params);
  res.render('room.ejs', {
    roomId: req.params.roomId
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
