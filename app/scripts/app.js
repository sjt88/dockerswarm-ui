'use strict';

angular.module('dockerswarmUI',['ngRoute'])
  .config(function($routeProvider){
    $routeProvider
      .when('/',{
        templateUrl:'views/main.html',
        controller:'MainCtrl'
      })
      .when('/images',{
        templateUrl:'views/images.html',
        controller:'ImagesCtrl'
      })
      .when('/containers',{
        templateUrl:'views/containers.html',
        controller:'ContainersCtrl'
      })
      .when('/nodes',{
        templateUrl:'views/nodes.html',
        controller:'NodesCtrl'
      })
      .otherwise({redirectTo:'/'});
  });
