'use strict';

function MainCtrl ($scope, DockerService, toastr){
  console.log('main controller');

  toastr.options = {
    closeButton: true,
    progressBar: true,
    showMethod: 'slideDown',
    timeOut: 2000
  };

  DockerService.getInfo().then(function(info){
    console.log('got info from docker service: ', info);
    $scope.info=info.data;
  },function(){
    toastr.error('Server is not responding', 'DockerSwarm UI');
  });

  DockerService.version().then(function(version){
    $scope.version=version.data;
  },function(){
    toastr.error('Server is not responding', 'DockerSwarm UI');
  });
};

module.exports = {
  name: 'MainCtrl',
  fn: MainCtrl
};
