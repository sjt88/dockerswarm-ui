/* global angular */
'use strict';

angular.module('dockerswarmUI')
  .controller('ContainersCtrl', function(DockerFactory, ContainerFactory, $scope, $q){
    $q.all([
      ContainerFactory.containers(),
      DockerFactory.infos()
    ]).then(function(data){
    var containers = data[0];
    var info = data[1];

    console.log(JSON.stringify(containers));

    $scope.containers=containers.data;
  },function(){
     toastr.error('Server is not responding', 'DockerSwarm UI');
  });
});
