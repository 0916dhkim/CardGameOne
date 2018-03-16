const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingTimeout: 3000
})

var rooms = []

function onConnect (socket) {
  // Emit the list of rooms on server.
  socket.emit('rooms', rooms)
}

export var startServer = function (port) {
  // Statically serve frontend.
  app.use(express.static('frontend/dist'))

  io.on('connect', onConnect)
  server.listen(port, () => console.log('Card game server listening on port ' + port))
}
