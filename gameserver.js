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
    socket.emit('create', {success: false, roomname: ''})
  } else {
    // Room name is available.
    rooms.push(data)
    socket.emit('create', {success: true, roomname: data})
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

  io.on('connect', onConnect)
  server.listen(port, () => console.log('Card game server listening on port ' + port))
}
