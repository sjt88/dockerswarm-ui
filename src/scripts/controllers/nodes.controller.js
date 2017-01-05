/* global angular, toastr */
'use strict';

import detailTemplate from '../../views/node-detail.template.html';

function NodesCtrl($scope, ErrorsService, DockerService, $uibModal, $interval, toastr) {
  var vm = this;
  vm.isSearchCollapsed = true;
  vm.nodes = [];
  vm.keyword = {};

  vm.open = function(i) {
    var detailModal = $uibModal.open({
      animation: true,
      templateUrl: detailTemplate,
      controller: 'DetailCtrl as nodeDetails',
      size: 'lg',
      resolve: {
        node: function() {
          console.log('opening info for node:', vm.nodes[i]);
          return vm.nodes[i];
        }
      }
    });
  };

  vm.updateNodeInfo = () => {
    console.log('updating node info');
    console.log(vm);
    return DockerService.getInfo()
      .then(vm.applyNodes)
      .catch(ErrorsService.throw);
  };

  vm.nodeIsHealthy = (index) => {
    return vm.nodes[index].status === 'Healthy';
  };

  vm.applyNodes = nodes => {
    this.nodes = DockerService.store.SystemStatus.nodes;
  };

  vm.updateNodeInfo().then(() => {
    vm.nodeRefreshInterval = DockerService.startRefreshInterval(vm.applyNodes);
  });

  $scope.$on('$destroy', () => {
    $interval.cancel(vm.nodeRefreshInterval);
  });
};

module.exports = {
  name: 'NodesCtrl',
  fn: [
    '$scope',
    'ErrorsService',
    'DockerService',
    '$uibModal',
    '$interval',
    'toastr',
    NodesCtrl
  ]
};
