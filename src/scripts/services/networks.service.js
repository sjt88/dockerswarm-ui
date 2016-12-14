function NetworksService ($http) {

  this.networks = [];

  this.getNetworkList = () => {
    return $http.get('/api/networks').then(networks => {
      this.networks = networks;
      return networks.data;
    });
  };

  this.getNetworkInfo = (id) => {

  };

  return {
    getNetworkList: this.getNetworkList
  };  
}

module.exports = {
  name: 'NetworksService',
  fn: ['$http', NetworksService]
};
