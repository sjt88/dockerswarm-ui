var express=require('express'),
    banner=require('./lib/banner'),
    dockerswarm=require('./lib/dockerswarm'),
    logger=require('morgan'),
    path=require('path'),
    app=express();


app.set('DOCKER_HOST',process.env.DOCKER_HOST);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'app')));

dockerswarm(app);

app.listen(3000,function(){
  banner();
});
