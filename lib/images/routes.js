'use strict';

const router = require('express').Router();
const request = require('request');

//GET Images
router.get('/api/images', function(req, res, next) {
  const BASE_URL = req.app.get('DOCKER_BASE_URL');
  let requestOptions = req.app.get('DOCKER_REQUEST_OPTS');

  requestOptions.url = `${BASE_URL}/images/json?all=1`;

  console.log(requestOptions);
  request.get(requestOptions, function(err, response, body) {
    if (err) {
      console.log(`${requestOptions.url} error: `);
      console.log(err);
      res.sendStatus(500);
      return next();
    }
    console.log('/api/' + DOCKER_API_VERSION + '/images response: ' + body);
    res.send(body);
    return next();
  });
});

module.exports = router;
