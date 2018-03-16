class Consumer {
  constructor(connection, onMessage) {
    this.connection = connection;
    this.onMessage = onMessage;
    this.channel = null;
  }

  close() {

  }
}

module.exports = Consumer;
