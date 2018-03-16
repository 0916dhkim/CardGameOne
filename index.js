const gs = require('./gameserver.js')
const port = process.env.PORT || 3000

gs.startServer(port)
