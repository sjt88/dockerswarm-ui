/* global angular */
'use strict';

// import detailTemplate from '../../views/networks-detail.template.html';

function NetworksCtrl($scope, NetworksService, toastr) {
  console.log('networks controller');

  var vm = this;

  vm.networks = [];

  NetworksService.getNetworkList().then(networks => {
    vm.networks = networks;

    vm.networks.forEach(network => {
      network.containerCount = Object.keys(network.Containers).length;
      network.shortId = network.Id.slice(0, 9);
    });

    console.log('got networks:', networks);
  }).catch(err => {
    toastr.error('Failed to retrieve network data',
    `${err.status} - ${err.data}`);
  });

  // vm.open = function(i) {
  //   var detailModal = $uibModal.open({
  //     animation: true,
  //     templateUrl: detailTemplate,
  //     controller: 'NetworksDetailCtrl',
  //     resolve: {
  //       node: function() {
  //         return vm.networks[i];
  //       }
  //     }
  //   });
  // };

};

module.exports = { name: 'NetworksCtrl', fn: NetworksCtrl };
