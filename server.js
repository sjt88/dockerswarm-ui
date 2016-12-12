'use strict';

var express=require('express'),
    banner=require('./lib/banner'),
    dockerswarm=require('./lib/dockerswarm'),
    logger=require('morgan'),
    path=require('path'),
    fs=require('fs'),
    app=express();

if (!process.env.DOCKER_HOST) {
  console.log('Could not start dockerswarm UI as the DOCKER_HOST environment variable was not set.');
  console.log('try setting it and run me again. E.g:');
  console.log('');
  console.log('    export DOCKER_HOST=1.1.1.1:3375 && node path/to/server.js');
  console.log('');
  process.exit(1);
}

app.set('DOCKER_HOST', process.env.DOCKER_HOST);

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

app.set('DOCKER_API_VERSION', process.env.DOCKER_API_VERSION || 'v1.22');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'build')));

dockerswarm(app);

app.listen(3000,function(){
  banner();
});
