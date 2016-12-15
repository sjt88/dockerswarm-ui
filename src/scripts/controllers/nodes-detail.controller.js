'use strict';

function DetailsCtrl ($scope, DockerService, $uibModalInstance, node){
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

  if (node.name) {
    console.log('DockerService:');
    console.log(DockerService);
  }

};

module.exports = {
  name: 'DetailCtrl',
  fn: ['$scope', 'DockerService', '$uibModalInstance', 'node', DetailsCtrl]
};
