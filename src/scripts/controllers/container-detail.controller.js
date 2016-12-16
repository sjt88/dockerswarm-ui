'use strict';

function ContainerDetailCtrl ($scope, DockerService, $uibModalInstance, container){
  console.log('container detail Controller');
  var vm = this;
  console.log(container);

  vm.container = formatContainerData(container);

  function formatContainerData (data) {
    data.Created = new Date(data.Created).toLocaleString();
    data.Args = data.Args.join(' ');
    return data;
  }

  console.log('container detail viewmodel:', vm);

  vm.close = function () {
    $uibModalInstance.close();
  };

};

module.exports = {
  name: 'ContainerDetailCtrl',
  fn: ['$scope', 'DockerService', '$uibModalInstance', 'container', ContainerDetailCtrl]
};
