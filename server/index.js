const WebsocketServer = require('websocket').server,
  finalhandler = require('finalhandler'),
  serverStatic = require('serve-static'),
  http = require('http'),
  amqp = require('amqplib'),

  Command = require('./command'),
  Session = require('./session'),
  Client = require('./client'),
  Producer = require('./producer'),
  Consumer = require('./consumer');

async function run() {
  const fileServer = serverStatic('client', { 'index': ['index.html', 'index.html'] });

  const server = http.createServer((req, res) => {
    fileServer(req, res, finalhandler(req,res));
  });

  server.listen(1337, () => console.log('Server is listening on port 1337'));

  wsServer =  new WebsocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  let rmqConnection = null;

  try {
    rmqConnection = await amqp.connect(process.env.TEAPCHAT_AMQP_URL);
  } catch(e) {
    console.log('Failed to connect to the server');
    return;
  }

  console.log('Connected to the broker');

  wsServer.on('request', (req) => {
    const wsConnection = req.accept('teapchat-protocol-v1', req.origin);

    console.log('accepted a new connection');

    const producer = new Producer(rmqConnection),
      client = new Client(wsConnection),
      consumer = new Consumer(rmqConnection, client),
      session = new Session(client, producer, consumer);

    wsConnection.on('message', (message) => {
      command = Command.fromWs(message);

      if (!command) {
        console.log('Ignored invalid command');
      }

      session.handleCommand(command);
    });

    wsConnection.on('close', (reason, desc) => {
      session.disconnect();
      console.log(`Peer ${wsConnection.remoteAddress} disconnected.`);
    });
  });
}

run();
