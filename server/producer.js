const Event = require('./event');

class Producer {
  constructor(connection) {
    this.connection = connection
    this.channel = null;
  }

  connect(message, done) {
    done(Event.connected());
  }

  disconnect(message, done) {
    done(Event.disconnected());
  }

  close() {
  }
};

module.exports = Producer;
