const Event = require('./event');

class Consumer {
  constructor(connection, onMessage) {
    this.connection = connection;
    this.onMessage = onMessage;
    this.channel = null;
  }

  async connect(message) {
    if (this.channel) {
      return Event.error('Already connected');
    }

    this.channel = await this.connection.createChannel();
    this.channel.assertQueue(message.sanitizedFrom(), {durable: false});
    this.channel.consume(message.sanitizedFrom(), (message) => {
      console.log('received message' + message);
    });

    return Event.connected();
  }

  async disconnect(message) {
    if (!this.channel) {
      return Event.error('Already disconnected');
    }

    return Event.disconnected();
  }
}

module.exports = Consumer;
