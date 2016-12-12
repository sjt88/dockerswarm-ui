'use strict';

function MainCtrl ($scope, DockerFactory, toastr){
  console.log('main controller');

  toastr.options = {
    closeButton: true,
    progressBar: true,
    showMethod: 'slideDown',
    timeOut: 2000
  };

  DockerFactory.infos().then(function(info){
    $scope.info=info.data;
  },function(){
    toastr.error('Server is not responding', 'DockerSwarm UI');
  });

  DockerFactory.version().then(function(version){
    $scope.version=version.data;
  },function(){
    toastr.error('Server is not responding', 'DockerSwarm UI');
  });
};

module.exports = {
  name: 'MainCtrl',
  fn: MainCtrl
};
