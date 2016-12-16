'use strict';

const router = require('express').Router();
const request = require('request');

router.get('/', function(req, res, next) {
  const BASE_URL = req.app.get('DOCKER_BASE_URL');
  let requestOptions = req.app.get('DOCKER_REQUEST_OPTS');

  requestOptions.url = `${BASE_URL}/containers/json?all=1`;
  console.log(requestOptions.url);
  request.get(requestOptions, function(err, response, body) {
    if (err) {
      console.log(`${requestOptions.url} error:`);
      console.log(err);
      res.sendStatus(500);
      return next();
    }
    console.log(`${requestOptions.url} response:`);
    console.log(body);
    res.send(body);
    return next();
  });
});

router.get('/:containerId/json', function(req, res, next) {
  const BASE_URL = req.app.get('DOCKER_BASE_URL');
  let requestOptions = req.app.get('DOCKER_REQUEST_OPTS');
  let containerId = req.params.containerId;

  console.log(containerId);

  requestOptions.url = `${BASE_URL}/containers/${containerId}/json`;
  request.get(requestOptions, function(err, response, body) {
    if (err) {
      console.log(`${requestOptions.url} Error:`);
      console.log(err);
      res.sendStatus(500);
      return next();
    }
    console.log(`${requestOptions.url} Response: `);
    console.log(body);
    res.send(body);
    return next();
  });
});

module.exports = router;
