(function () {
  const connectButton = document.getElementById('connect-btn'),
    usernameInput = document.getElementById('username-input'),
    mainChat = document.getElementById('main-chat'),
    conn = new WebSocket(`ws://${location.host}`, 'teapchat-protocol-v1');

  let connected = false;

  function sendMessage(msg) {
    conn.send(JSON.stringify(msg));
  }

  function renderMessage(type, source, text) {
    const elt = document.createElement('p');
    elt.innerHTML = `<span class="from">${source}</span>${text}`;
    mainChat.appendChild(elt);
  }

  const eventHandlers = {
    connected: (payload) => {
      connected = true;
      usernameInput.disabled = true;
      connectButton.innerText = 'Disconnect';
      renderMessage('info', 'system', 'Connected to chat !');
    },
    disconnected: (payload) => {
      connected = false;
      usernameInput.disabled = false;
      connectButton.innerText = 'Connect';
      renderMessage('info', 'system', 'Disconnected from chat !');
    }
  };

  conn.onopen = () => {
    renderMessage('info', 'system', 'Connected to server !');
  };

  conn.onerror = () => {
    renderMessage('error', 'system', 'Connetion error, please refresh the page');
  };

  conn.onmessage = (event) => {
    const eventData = JSON.parse(event.data);

    if(!eventHandlers.hasOwnProperty(eventData.type)) {
      renderMessage('error', 'system', `Unknown event type ${eventData.type}`);
    }
  };

  connectButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (connected) {
      renderMessage('info', 'system', 'Disconnecting from chat...');
      sendMessage({type: 'disconnect'});
    } else {
      renderMessage('info', 'system', 'Connecting to chat...');
      sendMessage({type: 'connect'});
    }
  });
})();
