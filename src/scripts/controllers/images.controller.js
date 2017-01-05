'use strict';

import imageDetailTemplate from '../../views/images-detail.template.html';

function ImagesCtrl(ImageFactory, ErrorsService, $scope, $uibModal) {

  let vm = this;
  vm.images = [];
  vm.keyword = {};

  vm.imagesAvailable = function() {
    return vm.imageData.length > 0;
  };

  vm.imageData = [];

  function formatImageData (images) {
    return images.map((image, index) => {
      return {
        created: ImageFactory.getImageDate(image),
        tags: ImageFactory.getImageTags(image),
        name: ImageFactory.getImageName(image),
        size: ImageFactory.getImageSize(image),
        id: image.RepoTags[0]
      };
    });
  }

  function openImageDetailModal (data) {
    return $uibModal.open({
      animation: true,
      templateUrl:imageDetailTemplate,
      controller: 'imageDetailCtrl as imageDetails',
      size: 'lg',
      resolve: {
        image: data
      }
    });
  }

  vm.displayImageDetail = imageTag => {
    ImageFactory.getImageInspectData(imageTag)
      .then(openImageDetailModal)
      .catch(ErrorsService.throw);
  };

  ImageFactory.getList()
    .then(images => vm.imageData = formatImageData(images))
    .catch(() => toastr.error('Server is not responding', 'DockerSwarm UI'));
};


module.exports = {
  name: 'ImagesCtrl',
  fn: ImagesCtrl
};
