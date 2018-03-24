const EVT_CONNECTED = 'connected',
  EVT_DISCONNECTED = 'disconnected',
  EVT_WHISPERED = 'whispered',
  EVT_ERROR = 'error'
  EVT_MESSAGE= 'message'
;

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
    return new Event(EVT_WHISPERED, null, message.to, message.content);
  }

  static fromJSON(event) {
    let parsedContent = null;

    try {
      parsedContent = JSON.parse(event);
    } catch (e) {
      console.log(`Failed to parse event, reason is #{e}`);
      return null;
    }

    return new Event(EVT_MESSAGE, parsedContent.from, parsedContent.to, parsedContent.content);
  }

  constructor(type, from = null, to = null, content = null) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.content = content;
  }
}

module.exports = Event;
