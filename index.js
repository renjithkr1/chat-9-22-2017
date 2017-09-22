var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");

server.listen(3001);
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var users = [];
var rooms = [{
  name: 'public',
  color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
  id: 'public',
  type: 'ROOM',
  default: true
}]
app.post('/login', function (req, res) {
  username = req.body.username;
  if (!isExist(username)) {
    newUser = {
      name: username,
      color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
      auth: true,
      id: null,
      type: 'SINGLE'
    }
    res.send(newUser);
  }
  else {
    newUser = {
      auth: false
    }
    res.send(newUser);
  }
})

function isExist(username) {
  user = users.filter(function (user) {
    return user.name == username;
  });
  return user[0] ? true : false;
}

var nsp = io.of('/new');
nsp.on('connection', function (socket) {
  console.log('someone connected');
  socket.on('send:msg',function(){
    console.log('joined in new');
  })
});



io.on('connection', function (socket) {

  socket.on('get:user', function (user) {
    socket.username = username;
    user.id = socket.id;
    users.push(user);
    socket.broadcast.emit('get:msg', { msg: socket.username + ' joined', type: 'info', to: { id: 'public' }, from: { id: user.id } });
    io.emit('newUser', users, user);
  });

  socket.on('get:rooms', function () {
    io.emit('newRoom', rooms);
  });

  socket.on('send:msg', function (data) {
    console.log('joined in default')
    if (data.selectedUser && data.selectedUser.id) {
      socket.broadcast.to(data.selectedUser.id).emit('get:msg', data);
    } else {
      socket.broadcast.emit('get:msg', data);
    }
  });

  socket.on('disconnect', function (data) {
    users = users.filter(function (user) {
      return user.name !== socket.username;
    });
    socket.broadcast.emit('newUser', users);
    if (socket.username) { // this checking for avoid doubly disconnet messages and one of them is username undefined 
      socket.broadcast.emit('get:msg', { msg: socket.username + ' left just now', type: 'info', to: { id: 'public' }, from: { id: socket.id } });
    }
  });

});

