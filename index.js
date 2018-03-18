const gs = require('./src/back/gameserver.js')
const port = process.env.PORT || 3000

gs.startServer(port)
