/* global angular, toastr */
'use strict';

import detailTemplate from '../../views/node-detail.template.html';

function NodesCtrl(DockerFactory, $scope, $uibModal, toastr) {
  console.log($scope.nodes);
  DockerFactory.infos().then(function(info) {
    console.log(info);
    $scope.nodes = [];
    info.data.SystemStatus.nodes.forEach(function(node) {
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

  }).catch(err => {
    console.log(err);
    toastr.error(
      'Failed to retrieve node data',
      `${err.status} - ${err.data}`
    );
  });

  $scope.open = function(i) {
    var detailModal = $uibModal.open({
      animation: true,
      templateUrl: detailTemplate,
      controller: 'DetailCtrl',
      resolve: {
        node: function() {
          return $scope.nodes[i];
        }
      }
    });
  };
};

module.exports = {
  name: 'NodesCtrl',
  fn: NodesCtrl
};
