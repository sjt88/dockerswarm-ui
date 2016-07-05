function drawGraph(data) {

  var options = {
    groups: {
      management: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf233',
          size: 60,
          color: '#23c6c8'
        }
      },
      node: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf233',
          size: 40,
          color: '#1ab394'
        }
      },
      container_running: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf13d',
          size: 20,
          color: '#1ab394'
        }
      },
      container_exited: {
        shape: 'icon',
        icon: {
          face: 'FontAwesome',
          code: '\uf13d',
          size: 20,
          color: '#ed5565'
        }
      }
    },
    physics: true,
    nodes: {
      font: {
        strokeColor: '#f3f3f4',
        strokeWidth: 5
      }
    }
  };

  // create the graph
  var graphContainer = document.getElementById('canvas');
  var graph = new vis.Network(graphContainer, data, options);
}
