const _ = require('lodash');

class Message {
  static fromWsMessage(wsMessage) {
    if (wsMessage.type !== 'utf8') {
      return null;
    }

    let parsedContent = null;

    try {
      parsedContent = JSON.parse(wsMessage.utf8Data);
    } catch (e) {
      console.log(`Failed to parse message, reason is #{e}`);
      return null;
    }

    return new Message(
      parsedContent.type,
      parsedContent.from,
      parsedContent.to,
      parsedContent.chan,
      parsedContent.content
    );
  }

  constructor(type, from = null, to = null, chan = null, content = null) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.chan = chan;
    this.content = content;
  }

  sanitizedTo() {
    return _.snakeCase(this.to);
  }

  sanitizedFrom() {
    return _.snakeCase(this.from);
  }

  sanitizedChan() {
    return _.snakeCase(this.chan);
  }

  asPayload() {
    return new Buffer(JSON.stringify(this));
  }
}

module.exports = Message
