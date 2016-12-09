/* global document, angular, vis, toastr */
'use strict';

angular.module('dockerswarmUI')
.controller('VisualiserCtrl', function(VisualiserFactory, $scope, $q, $routeParams, $window){

  function defaultModels() {
    var models = {
      groupingCheckboxes: {
        imageName: false,
        agents: false
      },
      filterInputs: {
        textbox: '',
        radios: '',
        checkboxes: {
          activeOnly: false
        }
      },
      mouseIsDown: false,
      graphIsStabilizing: true,
      adjustedPageHeight: ($window.innerHeight - 100) + 'px'
    };
    return models;
  }

  function resetModels() {
    $scope.models = defaultModels();
  }


  (function bindResizeEvents() {
    var ix = 0;
    angular.element($window).bind('resize', function () {
      ix++;
      console.log('resizing');
      $scope.models.adjustedPageHeight = ($window.innerHeight - 100) + 'px';
      $scope.$digest();
    });
  })();

  $scope.models = defaultModels();

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
          },
        },
        node: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf233',
            size: 40,
            color: '#1ab394'
          },
        },
        container_running: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf13d',
            size: 20,
            color: '#1ab394'
          },
        },
        container_exited: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf13d',
            size: 20,
            color: '#ed5565'
          },
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
          enabled: false
        }
      },
      layout: {
        improvedLayout: false
      },
      physics: {
        stabilization: {
          enabled: false
        },
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -5000,
          centralGravity: 0.01,
          springConstant: 0.01,
          avoidOverlap: 0.01,
        },
        minVelocity: 2,
        maxVelocity: 200
      },
    };

    $scope.settings = {
      filter: $routeParams.filter || {},
      group: $routeParams.group || {}
    };

    // create copy of initial dataset
    $scope.rawData = JSON.stringify(data);
    $scope.rawData = JSON.parse($scope.rawData);

    $scope.graphData = {
      nodes: new vis.DataSet(data.nodes),
      edges: new vis.DataSet(data.edges)
    };

     /**
      * draws the network graph using data defined by graphData
      * @param {object} graphData - vis.js network chart structured node/link data
      */
    $scope.drawGraph = function (graphData) {
      var graphContainer = document.getElementById('canvas');
      $scope.graph = new vis.Network(graphContainer, graphData, graphOptions);

      // function fit() {
      //   $scope.graph.fit({
      //     animation: {easingFunction: 'easeInOutQuad'}
      //   });
      // }

      // $scope.graph.on('stabilized', function () {
      //   setTimeout(function() {
      //     fit();
      //   }, 1)
      // });
      $scope.graph.on('stabilized', function() {

        if ($scope.models.mouseIsDown) return;

        if ($scope.models.graphIsStabilizing) {
          $scope.graph.fit({
            animation: {
              easingFunction: 'linear',
              duration: 50
            }
          });
          setTimeout(function () {
            console.log('STABILIZING = FALSE');
            $scope.$apply(function () {
              $scope.models.graphIsStabilizing = false;
            });
          }, 51);
        }
      });

      $scope.graph.on('startStabilizing', function () {
        console.log('STABILIZING = TRUE');
        // $scope.$apply(function () {
        //   $scope.models.graphIsStabilizing = true;
        // });
      });
    };

    /**
     * Updates the network graph data (does not redraw the graph)
     * @param {object} data - vis.js network chart structured node/link data
     */
    $scope.setGraphData = function (data) {
      $scope.graphData = data;
    };

    /**
     * Refreshes the network graph using data in $scope.graphData
     * @return $q
     */
    $scope.refresh = function () {
      resetModels();
      $scope.groupings = {
        imageName: [],
        agents: []
      };
      return VisualiserFactory.graphData().then(function (data) {
        $scope.setGraphData(data);
        $scope.graph.setData($scope.graphData);
      });
    };

    $scope.fit = function () {
      $scope.graph.fit();
    };

    $scope.filter = function() {
      if ($scope.models.graphIsStabilizing) return;
      $scope.models.graphIsStabilizing = true;
      console.log('filtering');
      // if (filterValues === '' || filterValues === ' ') return $scope.refresh();

      var filterData = [];
      if ($scope.models.filterInputs.radios !== '') {
        filterData.push({
            filterBy: $scope.models.filterInputs.radios,
            filterValues: $scope.models.filterInputs.textbox !== '' ? $scope.models.filterInputs.textbox : null
        });
      }

      if ($scope.models.filterInputs.checkboxes.activeOnly) {
        filterData.push({
          filterBy: 'containersRunning',
        });
      }

      VisualiserFactory.filteredGraphData(filterData).then(function(data) {
        $scope.setGraphData(data);
        $scope.graph.setData($scope.graphData);
        $scope.groupings = defaultGroupings();
        for (var grouper in $scope.models.groupingCheckboxes) {
          if ($scope.models.groupingCheckboxes[grouper]) {
            $scope.toggleGrouping([grouper]);
          }
        }
      });
    };

    /**
     * Toggles grouping with a defined set of grouping methods
     * @param  {Array} groupers - ordered list of grouping method names to be invoked on the network graph data
     *                            e.g. ['imageName', 'agents'] would group by image names then by agent
     */
    $scope.toggleGrouping = function (groupers) {
      $scope.models.graphIsStabilizing = true;
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

    function defaultGroupings() {
      return {
        imageName: [],
        agents: []
      };
    }

    // state of 
    $scope.groupings = defaultGroupings();

    // methods for creating clusters of nodes on the visualiser 
    $scope.groupers = {
      imageName: function (opts) {
        if ($scope.groupings.agents.length > 0) opts.ignoreNodes = true;

        $scope.rawData.nodeNames.forEach(function (nodeName, ix) {
          // if nodes have already been grouped, return from all but the first element
          // so we only produce a single group connected to the single swarm cluster node
          if ($scope.models.groupingCheckboxes.agents && ix > 0) return;
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
                  id: id, // id given to the cluster, we reference this when declustering
                  mass: 1
                };
                console.log(properties);
                return properties;
              }
            });
          });
        });
      },
      agents: function () {
        var nodeProperties = graphOptions.groups.node;
        var imagesWereGrouped = false;
        if ($scope.models.groupingCheckboxes.imageName) {
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
            nodeProperties.mass = 1;
            return nodeProperties;
          },
        });
        if (imagesWereGrouped) {
          $scope.groupers.imageName({ignoreNodes: true});
        }
      }
    };

    // Methods for ungrouping clusters on the visualiser
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
      },
      agents: function () {
        if ($scope.groupings.agents) {
          $scope.graph.openCluster('swarm_cluster');
          $scope.groupings.agents = [];
          var imagesWereGrouped = false;
          if ($scope.groupings.imageName.length > 0) {
            imagesWereGrouped = true;
            $scope.ungroupers.imageName();
            $scope.groupers.imageName();
          }
        }
      }
    };

    $scope.drawGraph($scope.graphData);
  },function(){
     toastr.error('Server is not responding', 'DockerSwarm UI');
  });
});
