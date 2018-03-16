class Producer {
  constructor(connection) {
    this.connection = connection
    this.channel = null;
  }

  connect(message) {
    return { type: 'connected' };
  }

  disconnect(message) {
    return { type: 'disconnected' };
  }

  close() {
  }
};

module.exports = Producer;
