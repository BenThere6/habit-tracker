const clog = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
      console.info(getLogString(req, res, data));
      originalSend.apply(res, arguments);
  };
  next();
};

function getLogString(req, res, data) {
  const fgCyan = '\x1b[36m';
  const fgWhite = '\x1b[37m';
  const method = req.method;
  const path = req.path;
  const statusCode = res.statusCode;
  const statusEmoji = getEmojiByStatusCode(statusCode);

  return `${statusEmoji} ${statusCode} ${fgCyan}${method} request to ${path}${fgWhite}`;
}

function getEmojiByStatusCode(statusCode) {
  if (statusCode >= 200 && statusCode < 300) {
      return '📗'; // Successful responses
  } else if (statusCode >= 300 && statusCode < 400) {
      return '📘'; // Redirection messages
  } else if (statusCode >= 400 && statusCode < 500) {
      return '📙'; // Client error responses
  } else if (statusCode >= 500) {
      return '📕'; // Server error responses
  }
  return '📓'; // Unknown status
}

exports.clog = clog;