'use strict';

angular.module('dockerswarmUI')
  .controller('NodesCtrl',function(DockerFactory, $scope){
    DockerFactory.infos().then(function(info){
      var nodes=info.data.SystemStatus;
      var nbr=nodes[3][1];
      var start=4;
      $scope.nodes=[];
      while(nbr>0){
        $scope.nodes.push({
          "name":nodes[start][0],
          "host":nodes[start][1],
          "status":nodes[start+1][1],
          "containers":nodes[start+2][1],
          "cpu":nodes[start+3][1],
          "memory":nodes[start+4][1]
        })
        start+=8;
        nbr--;
      }
    },function(){
    //  toastr.error('Server is not responding', 'Dockerboard');
    });
  });
