'use strict';

function DetailsCtrl ($scope,$uibModalInstance,node){
  console.log('detail Controller');
  var vm = this;

  vm.node = node;

  console.log('detail viewmodel:', vm);

  vm.close = function () {
    $uibModalInstance.close();
  };

  vm.nodeIsHealthy = () => {
    return vm.node.status === 'Healthy';
  };
};

module.exports = {
  name: 'DetailCtrl',
  fn: ['$scope', '$uibModalInstance', 'node', DetailsCtrl]
};
