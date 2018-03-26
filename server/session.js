const Event = require('./event');

class Session{
  constructor(client, producer, consumer) {
    this.client = client
    this.producer = producer;
    this.consumer = consumer;
  }

  async handleMessage(message) {
    if (!(message.type in this)) {
      this.client.send(Event.error(`Unknown message type received ${message.type}`));
      return;
    }

    try {
      this.client.send(await this[message.type](message));
    } catch (e) {
      console.log(e)
      this.client.send(Event.error(e.toString()));
    }
  }

  async disconnect(message) {
    let results = null;

    try {
      results  = await Promise.all(
        [
          this.producer.disconnect(message),
          this.consumer.disconnect(message),
        ]
      );
    } catch (e) {
      console.log(e);
      this.clent.send(Event.error(e.toString()));
    }

    const error  = results.find((e) => e.type === 'error');

    if (error) {
      return error
    }

    return Event.disconnected();
  }

  async connect(message) {
    let results = null;

    try {
      results = await Promise.all(
        [
          this.producer.connect(message),
          this.consumer.connect(message),
        ]
      );
    }
    catch (e) {
      console.log(e);
      this.client.send(Event.error(e.toString()));
    }

    const error = results.find((e) => e.type === 'error');

    if (error) {
      return error
    }

    return Event.connected();
  }

  async whisper(message) {
    return await this.producer.whisper(message);
  }

  async join(message) {
    return await this.producer.join(message);
  }

  async leave(message) {
    return await this.producer.leave(message);
  }
}

module.exports = Session;
