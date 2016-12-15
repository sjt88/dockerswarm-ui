/* global angular, toastr */
'use strict';

import detailTemplate from '../../views/nodes-detail.template.html';

function NodesCtrl(ErrorsFactory, DockerService, $scope, $uibModal, toastr) {
  var vm = this;

  vm.nodes = [];

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
    DockerService.getInfo()
      .then(info => vm.nodes = info.data.SystemStatus.nodes)
      .then(() => console.log(vm))
      .catch(ErrorsFactory.throw);
  };

  vm.nodeIsHealthy = (index) => {
    return vm.nodes[index].status === 'Healthy';
  };

  vm.updateNodeInfo();

};

module.exports = {
  name: 'NodesCtrl',
  fn: [
    'ErrorsFactory',
    'DockerService',
    '$scope',
    '$uibModal',
    'toastr',
    NodesCtrl
  ]
};
