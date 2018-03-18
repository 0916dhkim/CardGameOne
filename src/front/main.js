import $ from 'jquery'
import io from 'socket.io-client'

const socket = io({
  transports: ['websocket']
})

socket.on('rooms', (data) => {
  createtable(data)
})

socket.on('create', (data) => {
  if (data.success) {
    window.location.href = data.url
  } else {
    window.alert('Room cannot be created - Try another room name')
  }
})

socket.on('join', (data) => {
  if (data.success) {
    window.location.href = data.url
  } else {
    window.alert('The room is full - Try another room')
  }
})

function createtable (arr) {
  $('#tab').empty()
  // Create header.
  var header = $('<tr></tr>')
  header.append('<td>Name</td>')
  header.append('<td>Players</td')
  $('#tab').append(header)

  for (var j = 0; j < arr.length; j++) {
    var row = $('<tr></tr>')
    var roomname = rooms[name]
    var roomcell = $('<td></td>')
    var roomanchor = $('<a></a>')

    roomanchor.attr('id', roomname)
    roomanchor.click((event) => {
      socket.emit('join', event.target.innerHTML)
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
    socket.emit('create', $('#selectedRoom').val())
    event.preventDefault()
  })
})
