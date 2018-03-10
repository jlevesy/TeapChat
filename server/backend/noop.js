class NoopBackend {
  connect(message) {
    return { type: 'connected' };
  }

  disconnect(message) {
    return { type: 'disconnected' };
  }
};

module.exports = NoopBackend;
