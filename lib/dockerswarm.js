'use strict';

var request = require('request');
module.exports = function(app){
  var DOCKER_HOST=app.get('DOCKER_HOST');
  var API="http://unix:///var/run/docker.sock:";

  if (DOCKER_HOST.indexOf('tcp://') === 0){
    DOCKER_HOST=DOCKER_HOST.replace('tcp://','');
    API="http://"+DOCKER_HOST;
  }

  //GET INFO
  app.get('/api/v1/info',function(req,res){
    request.get(API+'/info',function (error, response, body){
      res.send(body);
    });
  });

  //GET Version
  app.get('/api/v1/version',function(req,res){
    request.get(API+'/version',function (error, response, body){
      res.send(body);
    });
  });

  //GET Images
  app.get('/api/v1/images',function(req,res){
    request.get(API+'/images/json',function (error, response, body){
      res.send(body);
    });
  });

  // //GET Containers
  app.get('/api/v1/containers',function(req,res){
    request.get(API+'/containers/json',function (error, response, body){
      res.send(body);
    });
  });
};
