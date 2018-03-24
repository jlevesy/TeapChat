const Event = require('./event');

class Consumer {
  constructor(connection, client) {
    this.connection = connection;
    this.client = client;
    this.channel = null;
  }

  async connect(message) {
    if (this.channel) {
      return Event.error('Already connected');
    }

    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(message.sanitizedFrom(), {durable: false, autoDelete: true});
    await this.channel.consume(message.sanitizedFrom(), (message) => {
      const event = Event.fromJSON(message.content.toString());

      if (!event) {
        this.client.send(Event.error('Failed to parse received message'));
        this.channel.nack(message);
      }

      this.client.send(event);
      this.channel.ack(message);
    });

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
}

module.exports = Consumer;
