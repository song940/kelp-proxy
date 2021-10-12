const url = require('url');
const http = require('http');
const https = require('https');

module.exports = config => {
  return function (request, response, next) {
    if (config.path && request.url.indexOf(config.path) !== 0)
      return next();
    const remoteURL = config.proxy + request.url.replace(config.path, '');
    const options = url.parse(remoteURL, true);
    options.method = request.method;
    const req = (options.protocol == 'http:' ? http : https).request(options, res => {
      response.writeHead(res.statusCode, res.headers);
      res.pipe(response);
    });
    req.on('error', err => console.log('-x proxy', err.message));
    for (const key in request.headers) {
      if (key != 'host') {
        req.setHeader(key, request.headers[key]);
      }
    }
    request.pipe(req);
  };
};
