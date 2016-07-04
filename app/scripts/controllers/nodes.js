'use strict';

angular.module('dockerswarmUI')
.controller('NodesCtrl',function(DockerFactory, $scope, $uibModal){
  DockerFactory.infos().then(function(info){
    $scope.nodes=[];
    info.data.SystemStatus.nodes.forEach(node => {
      $scope.nodes.push({
        name: node.name,
        host: node.host,
        status: node.status,
        containers: node.containers,
        cpu: node.reservedcpus,
        memory: node.reservedmemory,
        labels: node.labels,
        errors: node.errors ? node.errors : null,
        update: new Date(node.updatedat).toLocaleString()
      });
    });
  },function(){
      toastr.error('Server is not responding', 'DockerSwarm UI');
  });

  $scope.open=function(i){
    var detailModal = $uibModal.open({
      animation: true,
      templateUrl: 'views/node-detail.html',
      controller: 'DetailCtrl',
      resolve:{
        node:function(){
          return $scope.nodes[i];
        }
      }
    });
  }
});
