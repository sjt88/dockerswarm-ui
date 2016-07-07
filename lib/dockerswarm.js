'use strict';

var request = require('request');

module.exports = function(app){
  var DOCKER_HOST=app.get('DOCKER_HOST');
  var DOCKER_TLS=app.get('DOCKER_TLS');
  var API="http://unix:///var/run/docker.sock:";

  var requestOptions = {};

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
  }

  //GET INFO
  app.get('/api/v1/info',function(req,res) {
    requestOptions.url = API+'/info';
    request.get(requestOptions, function (error, response, body){
      res.send(body);
    });
  });

  //GET Version
  app.get('/api/v1/version',function(req,res){
    requestOptions.url = API+'/version';
    request.get(requestOptions, function (error, response, body){
      res.send(body);
    });
  });

  //GET Images
  app.get('/api/v1/images',function(req,res){
    requestOptions.url = API+'/images/json';
    request.get(requestOptions, function (error, response, body){
      res.send(body);
    });
  });

  // //GET Containers
  app.get('/api/v1/containers',function(req,res){
    requestOptions.url = API+'/containers/json?all=1';
    request.get(requestOptions,function (error, response, body){
      res.send(body);
    });
  });

  app.get('/api/v1/networks', function (req, res) {
    requestOptions.url = API+'/networks';
    request.get(requestOptions, (err, response, body) => {
      res.send(body);
    });
  });
};
