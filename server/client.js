class Client {
  constructor(connection) {
    this.connection = connection;
  }

  send(event) {
    this.connection.sendUTF(JSON.stringify(event));
  }
}

module.exports = Client;
