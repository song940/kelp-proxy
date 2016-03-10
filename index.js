const url   = require('url');
const http  = require('http');
const https = require('https');

module.exports = function(config){
  return function(request, response, next){
    if(config.path && !~request.url.indexOf(config.path))
      return next();
    var options = url.parse(config.proxy, true);
    options.path = options.path + request.url.replace(config.path, '');
    var req = (options.protocol == 'http:' ? http : https).request(options, function(res){
      response.writeHead(res.statusCode, res.headers);
      res.pipe(response);
    });
    for(var key in request.headers){
      if(key != 'host'){
        req.setHeader(key, request.headers[ key ]);
      }
    }
    request.pipe(req);
  };
};
