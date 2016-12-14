/* global angular, toastr */
'use strict';

import detailTemplate from '../../views/nodes-detail.template.html';

function NodesCtrl(ErrorsFactory, DockerFactory, $scope, $uibModal, toastr) {
  var vm = this;

  vm.nodes = [];

  function formatNodeInfo(node) {
    console.log('formatting node info');
    return {
      name: node.name,
      host: node.host,
      status: node.status,
      containers: node.containers,
      cpu: node.reservedcpus,
      memory: node.reservedmemory,
      labels: node.labels,
      errors: node.errors ? node.errors : null,
      update: new Date(node.updatedat).toLocaleString()
    };
  }

  function formatAllNodeInfo(info) {
    console.log('formatting all node info');
    console.log(info);
    let nodeInfo = info.data.SystemStatus.nodes;
    nodeInfo = nodeInfo.map(formatNodeInfo);
    console.log('nodeinfo:');
    console.log(nodeInfo);
    return nodeInfo;
  }

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
    DockerFactory.infos()
      .then(info => {
        vm.nodes = formatAllNodeInfo(info);
      })
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
    'DockerFactory',
    '$scope',
    '$uibModal',
    'toastr',
    NodesCtrl
  ]
};
