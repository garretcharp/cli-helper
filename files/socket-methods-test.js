module.exports = ({ id, method, data }, { /* wss: server,*/ ws: client, peers }) => {
  console.log({ clientContext: client.ctx, connectedPeers: peers.length })

  return {
    method,
    received: { id, data }
  }
}