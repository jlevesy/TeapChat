const Event = require('./event');

class Producer {
  constructor(connection) {
    this.connection = connection
    this.channel = null;
  }

  connect(message, done) {
    this.connection.createChannel().then(
      (channel) => {
        this.channel = channel;
        done(Event.connected());
      }
    );
  }

  disconnect(message, done) {
    if (!this.channel) {
      done(Event.error('Already disconnected'));
      return;
    }

    this.channel.close().then(() => {
      done(Event.disconnected());
    });
  }

  close() {
  }
};

module.exports = Producer;
