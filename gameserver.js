const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingTimeout: 3000
})

var rooms = []

function onCreate (data, socket) {
  console.log(socket.id + ': create request for room name: ' + data)
  // Check if the requested name already exists on the server.
  if (rooms.includes(data)) {
    // Room already exists.
    socket.emit('create', {success: false, url: ''})
    console.log(socket.id + ': create request failed.')
  } else {
    // Room name is available.
    // Add the room name to the array.
    rooms.push(data)
    // Response with the room url.
    socket.emit('create', {success: true, url: '/room/' + data})

    // Notify all users on the server that a new room is created.
    socket.broadcast.emit('rooms', rooms)
    console.log(socket.id + ': create request succeeded.')
  }
}

function onJoin (data, socket) {
  console.log(socket.id + ': join request for room name: ' + data)
  // Check if the requested room exists.
  if (rooms.includes(data)) {
    // Room exists.
    // Response with the room url.
    socket.emit('join', {sucess: true, url: '/room/' + data})
    console.log(socket.id + ': join request succeeded.')
  } else {
    // Room does not exist.
    socket.emit('join', {success: false, url: ''})
    console.log(socket.id + ': join request failed.')
  }
}

function onConnect (socket) {
  console.log(socket.id + ': connected')
  // Emit the list of rooms on server.
  socket.emit('rooms', rooms)

  socket.on('create', (data) => onCreate(data, socket))
  socket.on('join', (data) => onJoin(data, socket))
}

exports.startServer = function (port) {
  // Statically serve frontend.
  app.use(express.static('frontend/dist'))
  app.get('/room/:roomName', function (req, res, next) {
    res.sendFile('frontend/dist/room.html', {root: __dirname})
  })

  io.on('connect', onConnect)
  server.listen(port, () => console.log('Card game server listening on port ' + port))
}
