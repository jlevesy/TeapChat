const Event = require('./event');

class Producer {
  constructor(connection) {
    this.connection = connection
    this.channel = null;
  }

  async connect(message, done) {
    if (this.channel) {
      return Event.error('Already connected');
    }

    this.channel = await this.connection.createChannel()

    return Event.connected();
  }

  async disconnect(message) {
    if (!this.channel) {
      return Event.error('Already disconnected');
    }

    await this.channel.close();
    this.channel = null;

    return Event.disconnected();
  }

  async message(message) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    console.log(message);
  }

  async whisper(message) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    this.channel.sendToQueue(message.sanitizedTo(), message.asPayload());

    return Event.whispered(message);
  }
};

module.exports = Producer;
