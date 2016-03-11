'use strict';

angular.module('dockerswarmUI')
.controller('MainCtrl',function($scope, DockerFactory){
  DockerFactory.infos().then(function(info){
    $scope.info=info.data;
    console.log($scope.info.SystemStatus[3]);
  },function(){
  //  toastr.error('Server is not responding', 'Dockerboard');
  });

  DockerFactory.version().then(function(version){
    $scope.version=version.data;
  },function(){
  //  toastr.error('Server is not responding', 'Dockerboard');
  });
});
