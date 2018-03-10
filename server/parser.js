module.exports = (message) => {
  if (message.type !== 'utf8') {
    return null;
  }

  try {
    parsedContent = JSON.parse(message.utf8Data);
  } catch (e) {
    return null;
  }

  return parsedContent;
}
