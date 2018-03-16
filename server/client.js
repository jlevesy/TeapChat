class Client {
  constructor(connection) {
    this.connection = connection;
  }

  send(message) {
    this.connection.sendUTF(JSON.stringify(message));
  }
}

module.exports = Client;
