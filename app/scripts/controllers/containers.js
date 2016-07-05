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

    $scope.containers=containers.data;
    for(var i=0;i<$scope.containers.length;i++){
      var d = new Date(0);
      d.setUTCSeconds($scope.containers[i].Created);
      $scope.containers[i].Created=d.toLocaleString();

      var name=$scope.containers[i].Names[0];
      var c=name.slice(1,name.length);
      var no=c.slice(0,c.indexOf('/'));
      var co=c.slice(c.indexOf('/')+1,c.length);

      $scope.containers[i].Name=co;
      $scope.containers[i].Node=no;

    }

    console.log(info.data.SystemStatus.nodes);
    console.log(containers.data);

    containers=$scope.containers;
    // var arr = [];
    // for (var prop in containers) {
    //   arr.push(containers[prop]);
    // }

    var graphNodes = [{
      label: 'Swarm Management Cluster',
      group: 'management',
      id: 0,
      level: 0
    }];

    var nodeIndex = ['Management Cluster'];
    var edges = [];
    var index = 1;
    info.data.SystemStatus.nodes.forEach((node, nix) => {
      graphNodes.push({
        label: node.name,
        group: 'node',
        id: index,
        level: 1
      });
      // links to management cluster
      edges.push({
        from: index,
        to: 0
      });
      index++;
      nodeIndex.push(node.name);
    });

    containers.forEach(function(container, cix) {
      let nodeObj = {
        label: '\n ' + container.Name + ' \n (' + container.Image + ') ',
        id: index,
        level: 2
      };
      nodeObj.group = container.State === 'running' ? 'container_running' : 'container_exited';
      graphNodes.push(nodeObj);

      edges.push({
        from: index,
        to: nodeIndex.indexOf(container.Node)
      });
      index++;
    });

    console.log($scope.data);
    $scope.chartdata = {
      nodes: graphNodes,
      edges: edges
    };

    drawGraph($scope.chartdata);


  },function(){
     toastr.error('Server is not responding', 'DockerSwarm UI');
  });
  });
