function ImageFactory($http) {
  const SERVER = '/api';

  function getList() {
    return $http.get(SERVER + '/images').then(function(images) {
      return images.data;
    });
  }

  function getImageName(imageData) {
    let name = imageData.RepoTags[0].split(':');
    name.pop();
    name = name.join(':');
    return imageData.RepoTags.length ? name : 'Untagged';
  }

  function getImageDate(imageData) {
    var d = new Date(0);
    d.setUTCSeconds(imageData.Created);
    return d.toLocaleString();
  }

  function getImageTags(imageData) {
    if (imageData.RepoTags.length > 0) {
      return imageData.RepoTags.map(function(tag) {
        return imageData.RepoTags[0].split(':')[1];
      }).join(', ');
    } else {
      return 'N/A';
    }
  }

  function getImageSize(imageData) {
    return (imageData.VirtualSize / 1000) / 1000;
  }


  function getImageInspectData (id) {
    return $http.get(`${SERVER}/images/${id}`).then(response => response.data);
  }


  return {
    getList: getList,
    getImageName: getImageName,
    getImageDate: getImageDate,
    getImageTags: getImageTags,
    getImageSize: getImageSize,
    getImageInspectData: getImageInspectData
  };
};

module.exports = {
  name: 'ImageFactory',
  fn: ['$http', ImageFactory]
};
