import $ from 'jquery'
import io from 'socket.io-client'
import conf from '../config.js'

const socket = io({
  transports: ['websocket']
})

socket.on(conf.ROOMS_CHANNEL, (data) => {
  createtable(data)
})

socket.on(conf.CREATE_CHANNEL, (data) => {
  if (data.success) {
    window.location.href = data.url
  } else {
    window.alert('Room cannot be created - Try another room name')
  }
})

socket.on(conf.JOIN_CHANNEL, (data) => {
  if (data.success) {
    window.location.href = data.url
  } else {
    window.alert('The room is full - Try another room')
  }
})

function createtable (rooms) {
  $('#tab').empty()
  // Create header.
  var header = $('<tr></tr>')
  header.append('<td>Name</td>')
  header.append('<td>Players</td')
  $('#tab').append(header)

  for (var roomname in rooms) {
    var row = $('<tr></tr>')
    var roomcell = $('<td></td>')
    var roomanchor = $('<a></a>')

    roomanchor.attr('id', roomname)
    roomanchor.click((event) => {
      socket.emit(conf.JOIN_CHANNEL, event.target.innerHTML)
      event.preventDefault()
    })

    roomanchor.append(roomname)
    roomcell.append(roomanchor)
    row.append(roomcell)
    $('#tab').append(row)
  }
}

$(document).ready(function () {
  console.log('ready!')
  $('#roomForm').submit(function (event) {
    socket.emit(conf.CREATE_CHANNEL, $('#selectedRoom').val())
    event.preventDefault()
  })
})
