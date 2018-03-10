const WebsocketServer = require('websocket').server,
      finalhandler = require('finalhandler'),
      serverStatic = require('serve-static'),
      http = require('http');


const fileServer = serverStatic('client', { 'index': ['index.html', 'index.html'] });

const server = http.createServer((req, res) => {
  fileServer(req, res, finalhandler(req,res));
});

server.listen(1337, () => console.log('Server is listening on port 1337'));

wsServer =  new WebsocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function checkOrigin(origin) {
  // TODO
  return true;
}

wsServer.on('request', (req) => {
  if (!checkOrigin(req.origin)) {
    req.reject();
    return;
  }

  const connection = req.accept('tea-chat-protocol', req.origin);
  console.log('accepted a new connection');

  connection.on('message', (message) => {
    if (message.type !== 'utf8') {
      console.log('ignoring invalid message');
    }
    connection.sendUTF(message.utf8Data);
  });

  connection.on('close', (reason, desc) => {
    console.log(`Peer ${connection.remoteAddress} disconnected.`);
  });
});
