const Event = require('./event')
  TEAPCHAT_EXCHANGE = 'teapchat';

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

    await this.channel.assertExchange(
      TEAPCHAT_EXCHANGE,
      'direct',
      {durable: false, autoDelete: true}
    );

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

    await this.channel.publish(TEAPCHAT_EXCHANGE, message.sanitizedChan(), message.asPayload());

    return Event.joined(message);
  }

  async whisper(message) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    this.channel.sendToQueue(message.sanitizedTo(), message.asPayload());

    return Event.whispered(message);
  }

  async join(message) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    await this.channel.bindQueue(message.sanitizedFrom(), TEAPCHAT_EXCHANGE, message.sanitizedChan());

    return Event.joined(message);
  }

  async leave(message) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    await this.channel.unbindQueue(message.sanitizedFrom(), TEAPCHAT_EXCHANGE, message.sanitizedChan());

    return Event.left(message);
  }
};

module.exports = Producer;
