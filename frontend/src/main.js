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

function createtable (arr) {
  $('#tab').empty()
  for (var j = 0; j < arr.length; j++) {
    $('#tab').append('<tr><td><a href="" id="' + arr[j] + '">' + arr[j] + '</a></td></tr>')
    // $('#tab').append('<tr><td>' + arr[j] + ' </td></tr>')
    $('#' + arr[j]).click(function () {
      socket.emit('join', arr[j])
    })
  }
}

$(document).ready(function () {
  console.log('ready!')
  $('#roomForm').submit(function (event) {
    socket.emit('create', $('#selectedRoom').val())
    event.preventDefault()
  })
})
