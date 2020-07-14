const testRoutes = require('./test')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return {
      hello: "world"
    }
  }
}].concat(testRoutes)