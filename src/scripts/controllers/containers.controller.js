/* global angular */
'use strict';

function ContainersCtrl(DockerFactory, ContainerFactory, $scope, $q, toastr) {
  console.log('containers controller');
  $q.all([ContainerFactory.containers(), DockerFactory.infos()])
  .then(function(data) {
    var containers = data[0];
    var info = data[1];
    $scope.containers = containers.data;
  })
  .catch(err => {
    console.log(err);
    toastr.error(
      'Failed to retrieve container data',
      `${err.status} - ${err.data}`
    );
  });
};

module.exports = { name: 'ContainersCtrl', fn: ContainersCtrl };
