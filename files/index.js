const Hapi = require('@hapi/hapi')

const HapiWebSocket = require('hapi-plugin-websocket')
const H2o2 = require('@hapi/h2o2')

const apiRoutes = require('./api')
const socketRoutes = require('./socket')

const { config } = require('./helpers')

const start = async () => {
  const server = new Hapi.Server({ port: config.port })

  // Register Plugins/Modules
  await server.register(HapiWebSocket)
  await server.register(H2o2)

  // Register Routes
  server.route(apiRoutes)
  server.route(socketRoutes)

  await server.start()
}

start().catch(error => {
  console.error(`ERROR: ${error}`)
  process.exit(1)
})