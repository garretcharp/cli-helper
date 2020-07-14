const routes = [{
  method: 'GET',
  path: '/test',
  handler: (request, h) => {
    return { test: "success" }
  }
}]

module.exports = routes