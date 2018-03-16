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
      this.client.send(
        this.producer[message.type](message)
      );
    } catch (e) {
      this.client.send({ type: 'error', message: e.toString() });
    }
  }

  close() {
    this.producer.close();
    this.consumer.close();
  }
}

module.exports = Session;
