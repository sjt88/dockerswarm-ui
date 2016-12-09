angular.module('dockerswarmUI')
  .factory('ImageFactory',function($http){
    function getList () {
      return $http.get(SERVER+'/images').then(function (images) {
        return images.data;
      });
    }

    function getImageName (imageData) {
      return imageData.RepoTags.length ? imageData.RepoTags[0].split(':')[0] : 'Untagged';
    }

    function getImageDate (imageData) {
      var d = new Date(0);
      d.setUTCSeconds(imageData.Created);
      return d.toLocaleString();
    }

    function getImageTags (imageData) {
      if (imageData.RepoTags.length > 0) {
        return imageData.RepoTags.map(function (tag) {
          return imageData.RepoTags[0].split(':')[1];
        }).join(', ');
      } else {
        return 'N/A';
      }
    }

    function getImageSize (imageData) {
      return (imageData.VirtualSize / 1000) / 1000;
    }

    var SERVER='/api';

    return {
      getList:      getList,
      getImageName: getImageName,
      getImageDate: getImageDate,
      getImageTags: getImageTags,
      getImageSize: getImageSize
    };
  });
