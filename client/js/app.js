(function () {
  const connectButton = document.getElementById('connect-btn'),
    usernameInput = document.getElementById('username-input'),
    mainChat = document.getElementById('main-chat'),
    messageInput = document.getElementById('message-input'),
    sendBtn = document.getElementById('send-btn'),
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

  function updateInterface(connected) {
    usernameInput.disabled = connected;
    messageInput.disabled = !connected;
    sendBtn.disabled = !connected;
    connectButton.innerText = connected ? 'Disconnect' : 'Connect';
  }

  const eventHandlers = {
    connected: (payload) => {
      connected = true;
      updateInterface(connected);
      renderMessage('info', 'system', 'Connected to chat !');
    },
    disconnected: (payload) => {
      connected = false;
      updateInterface(connected);
      renderMessage('info', 'system', 'Disconnected from chat !');
    }
  };

  conn.onopen = () => {
    renderMessage('info', 'system', 'Connected to server !');
  };

  conn.onerror = () => {
    renderMessage('error', 'system', 'Connection error, please refresh the page');
  };

  conn.onmessage = (event) => {
    const eventData = JSON.parse(event.data);

    if(!eventHandlers.hasOwnProperty(eventData.type)) {
      renderMessage('error', 'system', `Unknown event type ${eventData.type}`);
    }

    eventHandlers[eventData.type](eventData);
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
