/* global angular */
'use strict';

import detailTemplate from '../../views/nodes-detail.template.html';

function ContainersCtrl(DockerService, ContainerFactory, $uibModal, $scope, $q, toastr) {
  console.log('containers controller');

  var vm = this;

  $q.all([ContainerFactory.containers(), DockerService.getInfo()])
  .then(function(data) {
    var containers = data[0];
    var info = data[1];
    vm.containers = containers.data;
  })
  .catch(err => {
    console.log(err);
    toastr.error(
      'Failed to retrieve container data',
      `${err.status} - ${err.data}`
    );
  });

  vm.node = {
    open: function(nodeName) {
      var detailModal = $uibModal.open({
        animation: true,
        templateUrl: detailTemplate,
        controller: 'DetailCtrl as nodeDetails',
        size: 'lg',
        resolve: {
          node: function() {
            console.log('opening info for node:', nodeName);
            return nodeName;
          }
        }
      });
    }
  };
};

module.exports = { name: 'ContainersCtrl', fn: ContainersCtrl };
