const Event = require('./event');

class Producer {
  constructor(connection) {
    this.connection = connection
    this.channel = null;
  }

  connect(message, done) {
    if (this.channel) {
      done(Event.error('Already connected'));
      return;
    }

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
      this.channel = null;
      done(Event.disconnected());
    });
  }

  message(message, done) {
    if (!this.channel) {
      done(Event.error('Not connected !'));
      return;
    }

    console.log(message);
  }

  whisper(message, done) {
    if (!this.channel) {
      done(Event.error('Not connected !'));
      return;
    }

    console.log(message);
  }

  close() {
    if (!this.channel) {
      return;
    }

    this.channel.close();
  }
};

module.exports = Producer;
