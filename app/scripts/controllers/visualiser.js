/* global document, angular, vis, toastr */
'use strict';

angular.module('dockerswarmUI')
.controller('VisualiserCtrl', function(VisualiserFactory, $scope, $q, $routeParams){
  console.log(VisualiserFactory);
  VisualiserFactory.graphData().then(function(data){
    console.log(data);
    const graphOptions = {
      groups: {
        management: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf233',
            size: 60,
            color: '#23c6c8'
          }
        },
        node: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf233',
            size: 40,
            color: '#1ab394'
          }
        },
        container_running: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf13d',
            size: 20,
            color: '#1ab394'
          }
        },
        container_exited: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf13d',
            size: 20,
            color: '#ed5565'
          }
        }
      },
      physics: true,
      nodes: {
        font: {
          strokeColor: '#f3f3f4',
          strokeWidth: 5
        }
      }
    };

    $scope.settings = {
      filter: $routeParams.filter || {},
      group: $routeParams.group || {}
    };

    // cache initial dataset
    $scope.rawData = JSON.stringify(data);
    $scope.rawData = JSON.parse($scope.rawData);

    $scope.graphData = data;

    $scope.drawGraph = function (graphData) {
      var graphContainer = document.getElementById('canvas');
      $scope.graph = new vis.Network(graphContainer, graphData, graphOptions);
    };

    $scope.setGraphData = function (data) {
      $scope.graphData = data;
    };

    $scope.refresh = function () {
      console.log('refreshing graph');
      return VisualiserFactory.graphData().then(function (data) {
        $scope.setGraphData(data);
        $scope.graph.setData($scope.graphData);
      });
    };

    $scope.groupData = function (groupers) {
      var data = JSON.stringify($scope.rawData);
      data = JSON.parse(data);
      groupers.forEach(function (modifier) {
        $scope.groupers[modifier](data);
      });
    };

    $scope.groupings = {};

    $scope.groupers = {
      imageName: function (opts) {
        $scope.rawData.nodeNames.forEach(function (nodeName, ix) {
          if (opts.ignoreNodes && ix > 0) return;
          console.log('asdasdasd');
          $scope.rawData.imageNames.forEach(function (imageName) {
            $scope.graph.cluster({
              joinCondition: function (nodeOptions) {
                if (nodeOptions.data) {
                  var nodeMatch = nodeOptions.data.node === nodeName;
                  console.log(nodeOptions);
                  console.log(opts.ignoreNodes);
                  if (opts.ignoreNodes) nodeMatch = true;
                  var imageMatch = nodeOptions.data.image === imageName;
                  var join = nodeMatch && imageMatch;
                  return join;
                }
              },
              processProperties: function (clusterOpts, childNodesOpts, childEdgesOptions) {
                console.log(clusterOpts);
                console.log(childNodesOpts);
                console.log(childEdgesOptions);
                var count = clusterOpts.count || 1;
                return {label: imageName + ' (' + (count + 1) + ')', count: count + 1};
              }
            });
          });
        });
        $scope.groupings.imageName = true;
      },
      containerName: function() {
      },
      agents: function () {
        var nodeProperties = graphOptions.groups.node;
        nodeProperties.label = "Swarm Cluster";
        $scope.graph.cluster({
          joinCondition: function (nodeOptions) {
            return nodeOptions.group === 'node' || nodeOptions.group === 'management';
          },
          clusterNodeProperties: nodeProperties
        });
        if ($scope.groupings.imageName) {
          console.log('grouping with ignored nodes');
          $scope.groupers.imageName({ignoreNodes: true});
        }
        $scope.groupings.agents = true;
      }
    };

    $scope.drawGraph($scope.graphData);
  },function(){
     toastr.error('Server is not responding', 'DockerSwarm UI');
  });
});
