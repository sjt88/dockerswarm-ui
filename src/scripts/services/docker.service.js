/* global angular */
'use strict';

function DockerService($http, $q) {
  var SERVER = '/api';
  console.log('docker factory');
  this.store = {};

  /**
   * Parses <HTTP GET /info>.data.SystemStatus into an object
   * @param  {Array} </info>.data.SystemStatus
   * @return {Object}
   * {
   *   data: {
   *     SystemStatus: {
   *       nodes: [{<node1>}, {<node2>}],
   *       ...
   *     },
   *     ...
   *   },
   *   ...
   * }
   */
  function parseSystemStatus(systemStatus) {
    // headers containing global system statistics
    const statHeaders = [
      'Role',
      'Strategy',
      'Filters',
      'Nodes'
    ];
    var parsedNodes = [];
    var parsedStatus = {};

    var nodeInfo = {}; // container for node information, populated for each node
    systemStatus.forEach(function(line, index) {
      let key = line[0];
      let value = line[1];

      // global stat headers
      if (statHeaders.indexOf(key) !== -1) {
        parsedStatus[key.toLowerCase()] = value;
        return;
      }

      if (key[0] === ' ' && key[1] !== ' ' || index === systemStatus.length - 1) {
        // this this element is a node name or the last element in the array
        if (Object.keys(nodeInfo).length > 0) {
          // found a new node, so push the previous node info onto parsedNodes
          // & reset the nodeInfo object.
          nodeInfo.labels = nodeInfo.labels.split(', ').map(label => {
            return { name: label.split('=')[0], value: label.split('=')[1] };
          });

          parsedNodes.push(nodeInfo);
          nodeInfo = {};
          if (index === systemStatus.length - 1) return;
        }
        nodeInfo.name = key.substr(1, key.length);
        nodeInfo.host = value;
      } else {
        // this element contains info about a node
        nodeInfo[key.substr(4, key.length).toLowerCase().split(' ').join('')] = value;
      }

    });

    parsedStatus.nodeCount = parsedStatus.nodes;
    console.log('node 0', parsedNodes);
    delete parsedStatus.nodes;
    return Object.assign({ nodes: parsedNodes }, parsedStatus);
  }

  function formatNodeInfo(node) {
    console.log('formatting node info');
    return {
      name: node.name,
      host: node.host,
      status: node.status,
      containers: node.containers,
      cpu: node.reservedcpus,
      memory: node.reservedmemory,
      labels: node.labels,
      errors: node.errors ? node.errors : null,
      update: new Date(node.updatedat).toLocaleString()
    };
  }

  function formatAllNodeInfo(info) {
    console.log('formatting all node info');
    console.log(info);
    let nodeInfo = info.data.SystemStatus.nodes;
    nodeInfo = nodeInfo.map(formatNodeInfo);
    console.log('nodeinfo:');
    console.log(nodeInfo);
    return nodeInfo;
  }

  this.storeIsPopulated = () => {
    return Object.keys(this.store).length > 0;
  };

  this.updateInfo = () => {
    return $q((resolve, reject) => {
      $http.get(SERVER + '/info').then(info => {
        var key = 'SystemStatus';
        if (!info.data[key]) key = 'DriverStatus';
        info.data.SystemStatus = parseSystemStatus(info.data[key]);
        info.data.SystemStatus.nodes = formatAllNodeInfo(info);
        this.store = info.data;
        console.log('parsed docker info :', info);
        return resolve(info.data);
      }).catch(err => {
        return reject(err);
      });
    });
  };

  /**
   * Resolve with the contents of the store, or fetches info
   * @return {Object} formatted docker /info response
   */
  this.getInfo = () => {
    return $q(resolve => {
      if (this.storeIsPopulated()) return resolve(this.store);

      return resolve(this.updateInfo());
    });
  };

  this.version = () => {
    return $http.get(SERVER + '/version');
  };

  this.getNodes = () => {
    return $q(resolve => {
      if (this.storeIsPopulated()) return resolve(this.store.SystemStatus.nodes);

      return resolve(this.updateInfo().then(() => this.store.SystemStatus.nodes));
    });
  };
};

module.exports = {
  name: 'DockerService',
  fn: ['$http', '$q', DockerService]
};
