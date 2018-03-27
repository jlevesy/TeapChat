const Event = require('./event');

class Session{
  constructor(client, producer, consumer) {
    this.client = client
    this.producer = producer;
    this.consumer = consumer;
  }

  async handleCommand(command) {
    if (!(command.type in this)) {
      this.client.send(Event.error(`Unknown command type received "${command.type}"`));
      return;
    }

    try {
      this.client.send(await this[command.type](command));
    } catch (e) {
      console.log(e)
      this.client.send(Event.error(e.toString()));
    }
  }

  async disconnect(command) {
    let results = null;

    try {
      results  = await Promise.all(
        [
          this.producer.disconnect(command),
          this.consumer.disconnect(command),
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

  async connect(command) {
    let results = null;

    try {
      results = await Promise.all(
        [
          this.producer.connect(command),
          this.consumer.connect(command),
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

  async whisper(command) {
    return await this.producer.whisper(command);
  }

  async join(command) {
    return await this.producer.join(command);
  }

  async leave(command) {
    return await this.producer.leave(command);
  }
}

module.exports = Session;
