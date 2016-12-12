'use strict';

function DetailsCtrl ($scope,$uibModalInstance,node){
  $scope.node=node;
  $scope.node.labels=$scope.node.labels.split(',');
  var labels=[];

  $scope.node.labels.forEach(function(label){
    var data=label.split("=");
    labels.push({
      name:data[0],
      value:data[1]
    });
  });

  $scope.node.labels=labels;
  
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

module.exports = {
  name: 'DetailCtrl',
  fn: DetailsCtrl
};
