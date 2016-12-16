'use strict';

function ContainerService($http, $q) {
  var cache = [];
  var SERVER = '/api';

  function formatContainerData(containerData) {
    var d = new Date(0);
    d.setUTCSeconds(containerData.Created);
    containerData.Created = d.toLocaleString();
    var name = containerData.Names[0];
    var c = name.slice(1, name.length);
    var no = c.slice(0, c.indexOf('/'));
    var co = c.slice(c.indexOf('/') + 1, c.length);

    containerData.Name = co;
    containerData.Node = no;
    return containerData;
  }

  function formatContainersResponse(containersResponse) {
    console.log('containersResponse', containersResponse.data);
    for (var i = 0; i < containersResponse.data.length; i++) {
      containersResponse.data[i] = formatContainerData(containersResponse.data[i]);
    }
    return containersResponse;
  }

  this.cacheContainersResponse = response => {
    this.containers = response.data;
    console.log('this.containers:', this.containers);
    return this.containers;
  };

  this.updateContainers = () => {
    return $http.get(SERVER + '/containers')
      .then(formatContainersResponse)
      .then(this.cacheContainersResponse);
  };

  this.getContainerInspectData = id => {
    return $http.get(`${SERVER}/containers/${id}/json`)
      .then(response => response.data);
  };

  this.getContainers = () => {
    return $q((resolve, reject) => {
      if (this.containers.length > 0) return resolve(this.containers);
      else return resolve(this.updateContainers());
    });
  };


  this.getContainerById = id => {
    return this.getContainers().then(containers => {
      return containers.find(container => container.Id == id);
    });
  };

  this.getContainerByName = name => {
    return this.getContainers().then(containers => {
      return containers.find(container => container.Name == name);
    });
  };
};

module.exports = {
  name: 'ContainerService',
  fn: ContainerService
};
