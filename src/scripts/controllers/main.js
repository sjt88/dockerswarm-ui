'use strict';

angular.module('dockerswarmUI')
.controller('MainCtrl',function($scope, DockerFactory){
  setTimeout(function() {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      showMethod: 'slideDown',
      timeOut: 2000
    };
    toastr.success('Manage your cluster', 'DockerSwarm UI');

  }, 1300);



  DockerFactory.infos().then(function(info){
    $scope.info=info.data;
  },function(){
    toastr.error('Server is not responding', 'DockerSwarm UI');
  });

  DockerFactory.version().then(function(version){
    $scope.version=version.data;
  },function(){
    toastr.error('Server is not responding', 'DockerSwarm UI');
  });
});
