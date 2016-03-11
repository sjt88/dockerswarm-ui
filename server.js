var express=require('express'),
    banner=require('./lib/banner'),
    dockerswarm=require('./lib/dockerswarm'),
    logger=require('morgan'),
    path=require('path'),
    app=express();

// Usage: dockerswarm-ui --DOCKER_HOST="unix:///var/run/docker.sock"
//
//   DOCKER_HOST DEFAULT["unix:///var/run/docker.sock"]

// http://IP:2375/version

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'app')));

dockerswarm(app);

app.listen(3000,function(){
  banner();
});
