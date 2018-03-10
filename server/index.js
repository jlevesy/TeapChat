const WebsocketServer = require('websocket').server,
  finalhandler = require('finalhandler'),
  serverStatic = require('serve-static'),
  http = require('http'),

  parseMessage = require('./parser'),
  MessageHandler = require('./handler'),
  Backend = require(`./backend/${process.env.BACKEND ? process.env.BACKEND : 'noop'}`);

const fileServer = serverStatic('client', { 'index': ['index.html', 'index.html'] });

const server = http.createServer((req, res) => {
  fileServer(req, res, finalhandler(req,res));
});

const backend = new Backend();
const handler = new MessageHandler(backend);

server.listen(1337, () => console.log('Server is listening on port 1337'));

wsServer =  new WebsocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', (req) => {
  const connection = req.accept('teapchat-protocol-v1', req.origin);
  console.log('accepted a new connection');

  connection.on('message', (message) => {
    parsedMessage = parseMessage(message);
    if (!parsedMessage) {
      console.log('Ignored invalid message');
    }

    handler.handleMessage(connection, parsedMessage);
  });

  connection.on('close', (reason, desc) => {
    console.log(`Peer ${connection.remoteAddress} disconnected.`);
  });
});
