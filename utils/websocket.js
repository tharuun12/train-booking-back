const WebSocket = require('ws');

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  init() {
    this.wss.on('connection', (ws) => {
      console.log('New WebSocket connection established');

      ws.on('message', (message) => {
        this.broadcast(message);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  broadcast(message) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  notifySeatUpdate() {
    this.broadcast(JSON.stringify({ type: 'SEAT_UPDATE' }));
  }
}

module.exports = WebSocketManager;