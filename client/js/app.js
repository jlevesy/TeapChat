(function () {
  const conn = new WebSocket(`ws://${location.host}`, "tea-chat-protocol");

  conn.onopen = () => {
    console.log('Connecton opened !');
  };

  conn.onerror = (error) => {
    console.log(`Connecton error ! ${error}`);
  };

  conn.onmessage = (message) => {
    console.log(`Message received ! ${message}`);
  };
})();
