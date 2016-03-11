'use strict';

var request=require('request');
//http://unix:///var/run/docker.sock:/containers/json
module.exports=function(app){
  //GET INFO
  app.get('/api/v1/info',function(req,res){
    request.get('http://172.17.8.102:2376/info',function (error, response, body){
      res.send(body);
    });
  });

  //GET Version
  app.get('/api/v1/version',function(req,res){
    request.get('http://172.17.8.102:2376/version',function (error, response, body){
      res.send(body);
    });
  });

  //GET Images
  app.get('/api/v1/images',function(req,res){
    request.get('http://172.17.8.102:2376/images/json',function (error, response, body){
      res.send(body);
    });
  });

  // //GET Containers
  app.get('/api/v1/containers',function(req,res){
    request.get('http://172.17.8.102:2376/containers/json',function (error, response, body){
      res.send(body);
    });
  });
}
