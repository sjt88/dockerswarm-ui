'use strict';

angular.module('dockerswarmUI')
  .controller('ImagesCtrl', function(ImageFactory, $scope) {

    $scope.imagesAvailable = function () {
      return $scope.imageData.length > 0;
    };

    $scope.imageData = [];

    ImageFactory.getList().then(function(images) {
      console.log('got images:');
      console.log(images);
      $scope.imageData = images.map(function (image, index) {
        return {
          created: ImageFactory.getImageDate(image),
          tags: ImageFactory.getImageTags(image),
          name: ImageFactory.getImageName(image),
          size: ImageFactory.getImageSize(image)
        };
      });
      console.log($scope.imageData);

    }, function() {
      toastr.error('Server is not responding', 'DockerSwarm UI');
    });

    $scope.keyword = {};

    $scope.open = function() {
      $scope.popup.opened = true;
    };

    $scope.popup = {
      opened: false
    };
  });
