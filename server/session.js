const Event = require('./event');

class Session{
  constructor(client, producer, consumer) {
    this.client = client
    this.producer = producer;
    this.consumer = consumer;
  }

  handleMessage(message) {
    if (!(message.type in this.producer)) {
      console.log(`Unknown event type received ${message.type}`);
      return;
    }

    try {
        this.producer[message.type](message, (result) => {
          this.client.send(result);
        });
    } catch (e) {
      this.client.send(Event.error(e.toString()));
    }
  }

  close() {
    this.producer.close();
    this.consumer.close();
  }
}

module.exports = Session;
