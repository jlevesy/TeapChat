const EVT_CONNECTED = 'connected',
  EVT_DISCONNECTED = 'disconnected',
  EVT_WHISPERED = 'whispered',
  EVT_ERROR = 'error',
  EVT_MESSAGE = 'message',
  EVT_JOINED = 'joined',
  EVT_LEFT = 'left'
;

class Event {
  static connected() {
    return new Event(EVT_CONNECTED);
  }

  static disconnected() {
    return new Event(EVT_DISCONNECTED);
  }

  static error(reason) {
    return new Event(EVT_ERROR, null, null, null, reason);
  }

  static whispered(command) {
    return new Event(EVT_WHISPERED, null, command.to, null,  command.content);
  }

  static fromJSON(event) {
    let parsedContent = null;

    try {
      parsedContent = JSON.parse(event);
    } catch (e) {
      console.log(`Failed to parse event, reason is #{e}`);
      return null;
    }

    return new Event(EVT_MESSAGE, parsedContent.from, parsedContent.to, null, parsedContent.content);
  }

  static joined(command) {
    return new Event(EVT_JOINED, command.from, null, command.chan);
  }

  static left(command) {
    return new Event(EVT_LEFT, command.from, null, command.chan);
  }

  constructor(type, from = null, to = null, chan = null, content = null) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.chan = chan;
    this.content = content;
  }
}

module.exports = Event;
