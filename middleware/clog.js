const clog = (req, res, next) => {
    const fgCyan = '\x1b[36m';
    const fgWhite = '\x1b[37m'
    switch (req.method) {
      case 'GET': {
        console.info(`📗 ${fgCyan}${req.method} request to ${req.path}${fgWhite} ${res.statusCode}`);
        break;
      }
      case 'POST': {
        console.info(`📘 ${fgCyan}${req.method} request to ${req.path}${fgWhite} ${res.statusCode}`);
        break;
      }
      default:
        console.log(`📙${fgCyan}${req.method} request to ${req.path}${fgWhite} ${res.statusCode}`);
    }
  
    next();
  };
  
  exports.clog = clog;