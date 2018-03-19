const conf = require('../config.js')
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingTimeout: 3000
})

var rooms = {}

function createRoom (roomname) {
  var ret = {}
  ret.name = roomname

  return ret
}

function onCreate (data, socket) {
  console.log(socket.id + ': create request for room name: ' + data)
  // Check if the requested name already exists on the server.
  if (rooms[data] !== undefined) {
    // Room already exists.
    socket.emit(conf.CREATE_CHANNEL, {success: false, url: ''})
    console.log(socket.id + ': create request failed.')
  } else {
    // Room name is available.
    // Add the room name to the array.
    rooms[data] = createRoom(data)
    // Response with the room url.
    socket.emit(conf.CREATE_CHANNEL, {success: true, url: '/room/' + data})

    // Notify all users on the server that a new room is created.
    socket.broadcast.emit(conf.ROOMS_CHANNEL, rooms)
    console.log(socket.id + ': create request succeeded.')
  }
}

function onJoin (data, socket) {
  console.log(socket.id + ': join request for room name: ' + data)
  // Check if the requested room exists.
  if (rooms[data] !== undefined) {
    // Room exists.
    // Response with the room url.
    socket.emit(conf.JOIN_CHANNEL, {success: true, url: '/room/' + data})
    console.log(socket.id + ': join request succeeded.')
  } else {
    // Room does not exist.
    socket.emit(conf.JOIN_CHANNEL, {success: false, url: ''})
    console.log(socket.id + ': join request failed.')
  }
}

function onConnect (socket) {
  console.log(socket.id + ': connected')
  // Emit the list of rooms on server.
  socket.emit(conf.ROOMS_CHANNEL, rooms)

  socket.on(conf.CREATE_CHANNEL, (data) => onCreate(data, socket))
  socket.on(conf.JOIN_CHANNEL, (data) => onJoin(data, socket))
}

exports.startServer = function (port) {
  // Statically serve frontend.
  app.use(express.static('dist'))
  app.get('/room/:roomName', function (req, res, next) {
    res.sendFile(path.resolve(path.dirname(require.main.filename), 'dist', 'room.html'))
  })

  io.on('connect', onConnect)
  server.listen(port, () => console.log('Card game server listening on port ' + port))
}
