const request = require('request');

function Networks() {}

Networks.prototype.list = function (filters) {
  if (Object.keys(filters).length > 0) {
    requestOptions.qs = { filters: JSON.stringify(filters) };
  }

  request.get(requestOptions, function(err, response, body) {
    console.log(response);
    if (err) {
      console.log(requestOptions.url + ' error: ');
      console.log(err);
      res.sendStatus(500);
      return next();
    }

    res.send(body);
    return next();
  });
};


module.exports = new Networks();
