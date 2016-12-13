'use strict';

const router = require('express').Router();
const request = require('request');


router.get('/', function (req, res, next) {
  let requestOptions = req.app.get('DOCKER_REQUEST_OPTS');
  const BASE_URL = req.app.get('DOCKER_BASE_URL');
  let qs = {};

  requestOptions.url = BASE_URL + '/networks';

  let filters = {};
  if (req.query.id) {
    let id = req.query.id;
    filters.id = Array.isArray(id) ? id : [id];
  }
  if (req.query.name) {
    let name = req.query.name;
    filters.name = Array.isArray(name) ? name : [name];
  }
  if (req.query.type) {
    let type = req.query.type;
    if (type == 'custom' || type == 'builtin') {
      filters.type = Array.isArray(type) ? type : [type];
    }
  }

  if (Object.keys(filters).length > 0) {
    requestOptions.qs = {filters: filters};
  }

  request.get(requestOptions, function (err, response, body) {
    if (err) {
      res.sendStatus(500);
      return next();
    }

    res.send(body);
    return next();
  });
});

router.get('/:networkId', function (req, res, next) {
  if (!req.params.networkId) return res.sendStatus(500);

  let requestOptions = req.app.get('DOCKER_REQUEST_OPTS');
  const BASE_URL = req.app.get('DOCKER_BASE_URL');

  requestOptions.url = BASE_URL + '/networks/' + req.params.networkId;

  request.get(requestOptions, function (err, response, body) {
    if (err) {
      res.sendStatus(500);
      return next();
    }

    res.send(body);
    return next();
  });
});

module.exports = router;
