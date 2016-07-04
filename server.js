'use strict';

var express=require('express'),
    banner=require('./lib/banner'),
    dockerswarm=require('./lib/dockerswarm'),
    logger=require('morgan'),
    path=require('path'),
    fs=require('fs'),
    app=express();

app.set('DOCKER_HOST',process.env.DOCKER_HOST);

if (process.env.DOCKER_TLS) {
  if (!process.env.DOCKER_TLS_CERT || !process.env.DOCKER_TLS_KEY || !process.env.DOCKER_TLS_CACERT) {
    console.log('To connect to a TLS sercured swarm manager ensure the following environment variables are set:');
    console.log('DOCKER_TLS_CERT');
    console.log('DOCKER_TLS_KEY');
    console.log('DOCKER_TLS_CACERT');
    process.exit(1);
  }
  app.set('DOCKER_TLS', true);
  let options = {encoding: 'utf-8'};
  app.set('DOCKER_TLS_CERT', fs.readFileSync(process.env.DOCKER_TLS_CERT, options));
  app.set('DOCKER_TLS_KEY', fs.readFileSync(process.env.DOCKER_TLS_KEY, options));
  app.set('DOCKER_TLS_CACERT', fs.readFileSync(process.env.DOCKER_TLS_CACERT, options));
}

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'app')));

dockerswarm(app);

app.listen(3000,function(){
  banner();
});
