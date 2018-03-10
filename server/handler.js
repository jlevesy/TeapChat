function sendResponse (connection, message) {
  connection.sendUTF(JSON.stringify(message));
}

class MessageHandler {
  constructor(backend) {
    this.backend = backend;
  }

  handleMessage(connection, message) {
    if (!(message.type in this.backend)) {
      console.log(`Unknown event type received ${message.type}`);
      return;
    }

    let result = null;

    try {
      result = this.backend[message.type](message);
    } catch (e) {
      sendResponse(connection, { type: 'error', message: e.toString() });
    }

    sendResponse(connection, result);
  }
}

module.exports = MessageHandler
