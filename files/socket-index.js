const methods = require('./methods')

module.exports = [{
  method: 'POST',
  path: '/',
  config: {
    plugins: {
      websocket: {
        only: true,
        autoping: 30 * 1000,
        connect: ({ ws: client, wss: server }) => {
          if (!server.ctx) server.ctx = {}
          client.ctx = {}

          // handle connect
        },
        disconnect: ({ ws: client, wss: server, peers }) => {
          // handle disconnect
        }
      }
    }
  },
  handler: (request, h) => {
    const { id, method, data } = request.payload

    if (typeof id !== 'number') {
      return {
        type: 'reply',
        id: null,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid request payload expected an id'
      }
    } else if (typeof method !== 'string' || method === '') {
      return {
        type: 'reply',
        id,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid request payload expected a method'
      }
    } else if (!methods[method]) {
      return {
        type: 'reply',
        id,
        statusCode: 400,
        error: 'Bad Request',
        message: `Invalid request payload expected a valid method. ${method} is not a valid method.`
      }
    }

    return methods[method]({ id, method, data }, request.websocket())
  }
}]
