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
      parsedContent.type
    );
  }

  constructor(type) {
    this.type = type;
  }
}

module.exports = Message
