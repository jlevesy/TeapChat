const _ = require('lodash');

class Command {
  static fromWs(message) {
    if (message.type !== 'utf8') {
      return null;
    }

    let parsedContent = null;

    try {
      parsedContent = JSON.parse(message.utf8Data);
    } catch (e) {
      console.log(`Failed to parse command, reason is #{e}`);
      return null;
    }

    return new Command(
      parsedContent.type,
      parsedContent.from,
      parsedContent.to,
      parsedContent.room,
      parsedContent.content
    );
  }

  constructor(type, from = null, to = null, room = null, content = null) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.room = room;
    this.content = content;
  }

  sanitizedTo() {
    return _.snakeCase(this.to);
  }

  sanitizedFrom() {
    return _.snakeCase(this.from);
  }

  sanitizedRoom() {
    return _.snakeCase(this.room);
  }

  asPayload() {
    return new Buffer(JSON.stringify(this));
  }
}

module.exports = Command
