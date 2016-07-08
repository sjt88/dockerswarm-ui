/* global document, angular, vis, toastr */
'use strict';

angular.module('dockerswarmUI')
.controller('VisualiserCtrl', function(VisualiserFactory, $scope, $q, $routeParams){

  $scope.models = {
    groupingCheckboxes: {
      imageName: false,
      agents: false
    }
  };

  VisualiserFactory.graphData().then(function(data){

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
      nodes: {
        font: {
          strokeColor: '#f3f3f4',
          strokeWidth: 5
        }
      },
      edges: {
        smooth: {
          type: 'continuous'
        }
      },
      layout: {
        improvedLayout: true,
      },
      physics: {
        solver: 'barnesHut',
        barnesHut: {
          avoidOverlap: 1,
          centralGravity: -0.5,
          damping: 1
        }
      },
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
      $scope.groupings = {
        imageName: [],
        agents: []
      };
      return VisualiserFactory.graphData().then(function (data) {
        $scope.setGraphData(data);
        $scope.graph.setData($scope.graphData);
      });
    };

    $scope.toggleGrouping = function (groupers) {
      var data = JSON.stringify($scope.rawData);
      data = JSON.parse(data);
      console.log($scope.models);
      groupers.forEach(function (modifier) {
        if ($scope.models.groupingCheckboxes[modifier]) {
          $scope.groupers[modifier](data);
        } else {
          $scope.ungroupers[modifier](data);
        }
      });
    };

    $scope.redraw = function () {
      $scope.graph.redraw();
    };

    $scope.groupings = {
      imageName: [],
      agents: []
    };

    $scope.groupers = {
      imageName: function (opts) {
        if ($scope.groupings.agents.length > 0) opts.ignoreNodes = true;

        $scope.rawData.nodeNames.forEach(function (nodeName, ix) {
          // if nodes have already been grouped, return from all but the first element
          // so we only produce a single group connected to the single swarm cluster node
          if (opts && opts.ignoreNodes && ix > 0) return;
          $scope.rawData.imageNames.forEach(function (imageName, ix2) {

            $scope.graph.cluster({
              joinCondition: function (nodeOptions) {
                if (nodeOptions.data) {
                  var nodeMatch; 
                  if (opts && opts.ignoreNodes) nodeMatch = true;
                  else nodeMatch = nodeOptions.data.node === nodeName;

                  var imageMatch = nodeOptions.data.image === imageName;
                  var join = nodeMatch && imageMatch;
                  return join;
                }
              },
              processProperties: function (clusterOpts, childNodesOpts, childEdgesOptions) {
                var count = 0;
                // count all the children of this cluster
                childNodesOpts.forEach(function (childNode) {
                  if (childNode.count) {
                    count += childNode.count;
                  } else {
                    count += 1;
                  }
                });

                var id;
                if (opts && opts.ignoreNodes) id = nodeName + '_' + imageName + '_cluster';
                else id = id = nodeName + '_' + imageName + '_cluster_cluster';
                $scope.groupings.imageName.push(id);
                console.log(id);

                var properties = {
                  label: imageName + ' (' + count + ')', // <image name> (<container count>)
                  count: count,
                  data: {image: imageName},
                  level: 2, // level for heirarchical layout
                  id: id // id given to the cluster, we reference this when declustering
                };
                console.log(properties);
                return properties;
              }
            });
            $scope.graph.stabilize();
          });
        });
      },
      agents: function () {
        var nodeProperties = graphOptions.groups.node;
        var imagesWereGrouped = false;
        if ($scope.groupings.imageName.length > 0) {
          $scope.ungroupers.imageName();
          imagesWereGrouped = true;
        }

        $scope.graph.cluster({
          joinCondition: function (nodeOptions) {
            return nodeOptions.group === 'node' || nodeOptions.group === 'management';
          },
          processProperties: function (clusterOpts, childNodesOpts) {
            var id = 'swarm_cluster';
            $scope.groupings.agents.push(id);
            nodeProperties.id = id;
            nodeProperties.label = 'Swarm Cluster';
            nodeProperties.level = 1;
            return nodeProperties;
          },
        });
        if (imagesWereGrouped) {
          $scope.groupers.imageName({ignoreNodes: true});
        }
        $scope.graph.stabilize();
      }
    };

    $scope.ungroupers = {
      imageName: function () {
        console.log('ungrouping imageNames');
        console.log($scope.groupings);
        if ($scope.groupings.imageName) {
          $scope.groupings.imageName.forEach(function (id) {
            console.log(id);
            $scope.graph.openCluster(id);
          });
          $scope.groupings.imageName = [];
        }
        $scope.graph.stabilize();
      },
      agents: function () {
        if ($scope.groupings.agents) {
          $scope.graph.openCluster('swarm_cluster');
          $scope.groupings.agents = [];
          var imagesWereGrouped = false;
          if ($scope.groupings.imageName.length > 0) {
            imagesWereGrouped = true;
            $scope.ungroupers.imageName();
            $scope.graph.stabilize();
            $scope.groupers.imageName();
          }
        }
        $scope.graph.stabilize();
      }
    };

    $scope.drawGraph($scope.graphData);
  },function(){
     toastr.error('Server is not responding', 'DockerSwarm UI');
  });
});
