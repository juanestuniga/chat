const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

var numberUsers = 0;
io.on('connection', (socket) => {
var userStarted = false;
socket.on('new_message', (msg) => {
socket.broadcast.emit('new_message', {
username: socket.username,
message: msg
});
});
socket.on('user_added', (username) => {
if (userStarted) return;
socket.username = username;
userStarted = true;
numberUsers++;
socket.emit('login', {
numberOfUsers: numberUsers
});
socket.broadcast.emit('user_joined', {
username: socket.username,
numberOfUsers: numberUsers
});
});
socket.on('disconnect', () => {
if (userStarted) {
--numberUsers;
socket.broadcast.emit('user_left', {
username: socket.username,
numberOfUsers: numberUsers
});

}
});
});