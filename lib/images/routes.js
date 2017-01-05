'use strict';

const router = require('express').Router();
const request = require('request');

//GET Images
router.get('/', function(req, res, next) {
  const BASE_URL           = req.app.get('DOCKER_BASE_URL');
  const DOCKER_API_VERSION = req.app.get('DOCKER_API_VERSION');
  let requestOptions       = req.app.get('DOCKER_REQUEST_OPTS');

  requestOptions.url = `${BASE_URL}/images/json`;

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

router.get('/:imageId', function (req, res, next) {
  const BASE_URL           = req.app.get('DOCKER_BASE_URL');
  const DOCKER_API_VERSION = req.app.get('DOCKER_API_VERSION');
  let requestOptions       = req.app.get('DOCKER_REQUEST_OPTS');

  console.log('request for image:');
  console.log(req.params);

  requestOptions.url = `${BASE_URL}/images/${req.params.imageId}/json`;

  console.log(requestOptions);
  request.get(requestOptions, function(err, response, body) {
    if (err) {
      console.log(`${requestOptions.url} error: `);
      console.log(err);
      res.sendStatus(500);
      return next();
    }
    console.log('/api/' + DOCKER_API_VERSION + requestOptions.url + ' response: ' + body);
    res.send(body);
    return next();
  });
});

module.exports = router;
