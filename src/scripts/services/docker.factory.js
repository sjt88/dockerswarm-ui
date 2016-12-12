/* global angular */
'use strict';

function DockerFactory($http, $q) {
  var SERVER = '/api';
  console.log('docker factory');

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
    delete parsedStatus.nodes;
    return Object.assign({ nodes: parsedNodes }, parsedStatus);
  }

  return {
    infos: function() {
      return $http.get(SERVER + '/info').then(function(info) {
        var key = 'SystemStatus';
        if (!info.data[key]) key = 'DriverStatus';
        info.data.SystemStatus = parseSystemStatus(info.data[key]);
        return info;
      });
    },
    version: function() {
      return $http.get(SERVER + '/version');
    }
  };
};

module.exports = {
  name: 'DockerFactory',
  fn: DockerFactory
};
