const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  pingTimeout: 3000
});
const port = process.env.PORT || 3000;

app.use(express.static('frontend/dist'));

server.listen(port, ()=>console.log('Card game server listening on port ' + port));
