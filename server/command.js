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

module.exports = Command
