class Message {
  static fromWsMessage(wsMessage) {
    if (wsMessage.type !== 'utf8') {
      return null;
    }

    try {
      parsedContent = JSON.parse(wsMessage.utf8Data);
    } catch (e) {
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
