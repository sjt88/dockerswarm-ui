'use strict';

function DetailsCtrl ($scope, $uibModalInstance, images){
  console.log('detail Controller');
  var vm = this;

  vm.images = images;

  console.log('detail viewmodel:', vm);

  vm.close = function () {
    $uibModalInstance.close();
  };
};

module.exports = {
  name: 'DetailCtrl',
  fn: ['$scope', '$uibModalInstance', 'images', DetailsCtrl]
};
