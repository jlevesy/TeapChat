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
      parsedContent['type'],
      parsedContent['content'],
      parsedContent['to']
    );
  }

  constructor(type, content, to) {
    this.type = type;
    this.content = content;
    this.to = to;
  }

  sanitizedTo() {
    return _.snakeCase(this.to);
  }

  asPayload() {
    return new Buffer(JSON.stringify(this));
  }
}

module.exports = Message
