const Event = require('./event')
  TEAPCHAT_EXCHANGE = 'teapchat';

class Producer {
  constructor(connection) {
    this.connection = connection
    this.channel = null;
  }

  async connect(command, done) {
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

  async disconnect(command) {
    if (!this.channel) {
      return Event.error('Already disconnected');
    }

    await this.channel.close();
    this.channel = null;

    return Event.disconnected();
  }

  async message(command) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    await this.channel.publish(TEAPCHAT_EXCHANGE, command.sanitizedChan(), command.asPayload());

    return Event.messaged(command);
  }

  async whisper(command) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    this.channel.sendToQueue(command.sanitizedTo(), command.asPayload());

    return Event.whispered(command);
  }

  async join(command) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    await this.channel.bindQueue(command.sanitizedFrom(), TEAPCHAT_EXCHANGE, command.sanitizedChan());

    return Event.joined(command);
  }

  async leave(command) {
    if (!this.channel) {
      return Event.error('Not connected !');
    }

    await this.channel.unbindQueue(command.sanitizedFrom(), TEAPCHAT_EXCHANGE, command.sanitizedChan());

    return Event.left(command);
  }
};

module.exports = Producer;
