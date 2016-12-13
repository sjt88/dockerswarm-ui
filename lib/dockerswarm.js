'use strict';

var request = require('request');
const networks = require('./networks/routes.js');

module.exports = function(app){
  var DOCKER_HOST=app.get('DOCKER_HOST');
  var DOCKER_TLS=app.get('DOCKER_TLS');
  var DOCKER_API_VERSION=app.get('DOCKER_API_VERSION');
  var API="http://unix:///var/run/docker.sock:";

  console.log('Connecting to: ' + DOCKER_HOST);
  console.log('TLS Enabled: ' + DOCKER_TLS);

  var requestOptions = {};

  if (!DOCKER_API_VERSION) DOCKER_API_VERSION = 'v1.22';

  console.log('Using Docker API version: ' + DOCKER_API_VERSION)

  if (DOCKER_HOST.indexOf('tcp://') === 0) {
    DOCKER_HOST = DOCKER_HOST.replace('tcp://','');
    var requestProtocol = DOCKER_TLS ? 'https://' : 'http://';
    API = requestProtocol + DOCKER_HOST;
  }

  if (DOCKER_TLS) {
    console.log('Using TLS for communication with swarm manager');
    requestOptions.cert=app.get('DOCKER_TLS_CERT');
    requestOptions.key=app.get('DOCKER_TLS_KEY');
    requestOptions.ca=app.get('DOCKER_TLS_CACERT');
  } else {
    console.log('Not using TLS for communication with swarm manager');
  }

  console.log('Using API base URL: ' + API);

  console.log('request options:');
  console.log(requestOptions);

  app.set('DOCKER_REQUEST_OPTS', requestOptions);
  app.set('DOCKER_BASE_URL', API + '/' + DOCKER_API_VERSION);

  //GET INFO
  app.get('/api/info',function(req, res, next) {
    requestOptions.url = API + '/' + DOCKER_API_VERSION + '/info';
    console.log(requestOptions);
    request.get(requestOptions, function (err, response, body){
      if (err) {
        console.log('/api/' + DOCKER_API_VERSION + '/info error: ');
        console.log(err);
        res.sendStatus(500);
        return next();
      }
      console.log('/api/' + DOCKER_API_VERSION + '/info response: ' + body);
      res.send(body);
      return next();
    });
  });

  //GET Version
  app.get('/api/version',function(req, res, next){
    requestOptions.url = API + '/' + DOCKER_API_VERSION + '/version';
    console.log(requestOptions);
    request.get(requestOptions, function (err, response, body) {
      if (err) {
        console.log('/api/' + DOCKER_API_VERSION + '/version error: ');
        console.log(err);
        res.sendStatus(500);
        return next();
      }
      console.log('/api/' + DOCKER_API_VERSION + '/version response: ' + body);
      res.send(body);
      return next();
    });
  });

  //GET Images
  app.get('/api/images',function(req, res, next){
    requestOptions.url = API + '/' + DOCKER_API_VERSION + '/images/json?all=1';
    console.log(requestOptions);
    request.get(requestOptions, function (err, response, body){
      if (err) {
        console.log('/api/' + DOCKER_API_VERSION + '/images error: ');
        console.log(err);
        res.sendStatus(500);
        return next();
      }
      console.log('/api/' + DOCKER_API_VERSION + '/images response: ' + body);
      res.send(body);
      return next();
    });
  });

  // //GET Containers
  app.get('/api/containers',function(req, res, next){
    requestOptions.url = API + '/' + DOCKER_API_VERSION + '/containers/json?all=1';
    console.log(requestOptions);
    request.get(requestOptions,function (err, response, body){
      if (err) {
        console.log('/api/' + DOCKER_API_VERSION + '/containers error: ');
        console.log(err);
        res.sendStatus(500);
        return next();
      }
      console.log('/api/' + DOCKER_API_VERSION + '/containers response: ' + body);
      res.send(body);
      return next();
    });
  });

  app.use('/api/networks', networks);

  // app.get('/api/networks', function (req, res, next) {
  //   requestOptions.url = API + '/' + DOCKER_API_VERSION + '/networks';
  //   console.log(requestOptions);
  //   request.get(requestOptions, (err, response, body) => {
  //     if (err) {
  //       console.log('/api/' + DOCKER_API_VERSION + '/networks error: ');
  //       console.log(err);
  //       res.sendStatus(500);
  //       return next();
  //     }
  //     console.log('/api/' + DOCKER_API_VERSION + '/networks response: ' + body);
  //     res.send(body);
  //     return next();
  //   });
  // });
};
