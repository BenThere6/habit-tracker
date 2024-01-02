const clog = (req, res, next) => {
    const fgCyan = '\x1b[36m';
    const fgWhite = '\x1b[37m';
    
    switch (req.method) {
      case 'GET': {
        console.info(`📗 ${res.statusCode} ${fgCyan}${req.method} request to ${req.path}${fgWhite}`);
        break;
      }
      case 'POST': {
        console.info(`📘 ${res.statusCode} ${fgCyan}${req.method} request to ${req.path}${fgWhite}`);
        break;
      }
      default:
        console.log(`📙 ${res.statusCode} ${fgCyan}${req.method} request to ${req.path}${fgWhite}`);
    }
    next();
  };
  
  exports.clog = clog;