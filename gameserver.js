const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingTimeout: 3000
})

var rooms = []

function onCreate (data, socket) {
  // Check if the requested name already exists on the server.
  if (rooms.includes(data)) {
    // Room already exists.
    socket.emit('create', {success: false, url: ''})
  } else {
    // Room name is available.
    // Add the room name to the array.
    rooms.push(data)
    // Response with the room url.
    socket.emit('create', {success: true, url: '/room/' + data})

    // Notify all users on the server that a new room is created.
    socket.broadcast.emit('rooms', rooms)
    console.log('Room ' + data + ' is created.')
  }
}

function onConnect (socket) {
  // Emit the list of rooms on server.
  socket.emit('rooms', rooms)

  socket.on('create', (data) => onCreate(data, socket))
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
