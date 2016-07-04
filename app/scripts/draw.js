function drawGraph(containers) {



  /*
   * Example for FontAwesome
   */
  var options = {
    groups: {
      container: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf13d',
          size: 15,
          color: '#57169a'
        }
      },
      node: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf233',
          size: 30,
          color: '#aa00ff'
        }
      }
    }
  };

  // create an array with nodes
  var nodesFA = [{
    id: 1,
    label: 'User 1',
    group: 'node'
  }, {
    id: 2,
    label: 'User 2',
    group: 'node'
  }, {
    id: 3,
    label: 'Usergroup 1',
    group: 'container'
  }, {
    id: 4,
    label: 'Usergroup 2',
    group: 'container'
  }, {
    id: 5,
    label: 'Organisation 1',
    group: 'container'
  }, {
    id: 6,
    label: 'Usergroup 1',
    group: 'container'
  }, {
    id: 7,
    label: 'Usergroup 2',
    group: 'container'
  }];

  // create an array with edges
  var edges = [{
    from: 1,
    to: 3
  }, {
    from: 1,
    to: 4
  }, {
    from: 1,
    to: 5
  }, {
    from: 2,
    to: 6
  }, {
    from: 2,
    to: 7
  }, {
    from: 1,
    to: 2
  }];

  // create a network
  var containerFA = document.getElementById('canvas');
  var dataFA = {
    nodes: nodesFA,
    edges: edges
  };

  var networkFA = new vis.Network(containerFA, dataFA, options);
}
