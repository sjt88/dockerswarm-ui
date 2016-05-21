'use strict';

angular.module('dockerswarmUI')
.controller('NodesCtrl',function(DockerFactory, $scope, $uibModal){
  DockerFactory.infos().then(function(info){
    var nodes=info.data.SystemStatus;
    var nbr=nodes[3][1];
    var start=4;
    $scope.nodes=[];
    while(nbr>0){
      var update_date = new Date(Date.parse(nodes[start+8][1]));
      $scope.nodes.push({
        "name":nodes[start][0],
        "host":nodes[start][1],
        "status":nodes[start+2][1],
        "containers":nodes[start+3][1],
        "cpu":nodes[start+4][1],
        "memory":nodes[start+5][1],
        "labels":nodes[start+6][1],
        "errors":nodes[start+7][1],
        "update":update_date.toLocaleString()
      })
      start+=10;
      nbr--;
    }
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
