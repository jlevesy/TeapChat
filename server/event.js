const EVT_CONNECTED = 'connected',
  EVT_DISCONNECTED = 'disconnected',
  EVT_WHISPERED = 'whispered',
  EVT_ERROR = 'error';

class Event {
  static connected() {
    return new Event(EVT_CONNECTED);
  }

  static disconnected() {
    return new Event(EVT_DISCONNECTED);
  }

  static error(reason) {
    return new Event(EVT_ERROR, reason);
  }

  static whispered(message) {
    return new Event(EVT_WHISPERED, message.content, message.to);
  }

  constructor(type, content = null, to = null) {
    this.type = type;
    this.content = content;
    this.to = to;
  }
}

module.exports = Event;
