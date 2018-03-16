import $ from 'jquery'
import io from 'socket.io-client'

const socket = io({
  transports: ['websocket']
})

socket.on('rooms', (data) => {
  createtable(data)
})

function createtable (arr) {
  for (var j = 0; j < arr.length; j++) {
    $('#tab').append('<tr><td>' + arr[j] + ' </td></tr>')
  }
}

$(document).ready(function () {
  console.log('ready!')
  $('#roomForm').submit(function (event) {
    socket.emit('create', $('#selectedRoom').val())
    event.preventDefault()
  })
})
