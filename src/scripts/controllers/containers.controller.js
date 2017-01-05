/* global angular */
'use strict';

import nodeDetailTemplate      from '../../views/node-detail.template.html';
import containerDetailTemplate from '../../views/container-detail.template.html';

function ContainersCtrl($stateParams, ErrorsService, DockerService, ContainerService, $uibModal, $scope, $q, toastr) {
  console.log('containers controller');

  var vm = this;
  vm.isSearchCollapsed = true;
  vm.keyword = {
    node: $stateParams.node || ''
  };
  
  vm.displayNodeDetail = nodeName => {
    var detailModal = $uibModal.open({
      animation: true,
      templateUrl: nodeDetailTemplate,
      controller: 'DetailCtrl as nodeDetails',
      size: 'lg',
      resolve: {
        node: function() {
          console.log('opening info for node:', nodeName);
          return DockerService.updateInfo().then(() => {
            let nodes = DockerService.store.SystemStatus.nodes;
            console.log('nodes:', nodes);
            console.log('nodeName: ' + nodeName);
            let filtered = nodes.find(node => node.name == nodeName);
            console.log(filtered);
            return filtered;
          }).catch(ErrorsService.throw);
        }
      }
    });
  };

  function openContainerDetailModal (data) {
    return $uibModal.open({
      animation: true,
      templateUrl: containerDetailTemplate,
      controller: 'ContainerDetailCtrl as containerDetails',
      size: 'lg',
      resolve: {
        container: data
      }
    });
  }

  vm.displayContainerDetail = containerName => {
    ContainerService.getContainerInspectData(containerName)
      .then(openContainerDetailModal)
      .catch(ErrorsService.throw);
  };

  ContainerService.updateContainers()
    .then(function(containers) {
      var containers = containers;
      vm.containers = containers;
    })
    .catch(err => {
      toastr.error(
        'Failed to retrieve container data',
        `${err.status} - ${err.data}`
      );
      ErrorsService.throw(err);
    });
};

module.exports = { name: 'ContainersCtrl', fn: ContainersCtrl };
