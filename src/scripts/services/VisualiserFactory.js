angular.module('dockerswarmUI')
.factory('VisualiserFactory',function(DockerFactory, ContainerFactory, $http, $q) {
  
  function getData() {
    return $q.all([
      ContainerFactory.containers(),
      DockerFactory.infos()
    ]);
  }

  function visJsFormatter(data) {
    var containers = data[0];
    var info = data[1];

    var graphNodes = [{
      label: 'Swarm Management Cluster',
      group: 'management',
      id: 0,
      level: 0
    }];

    var nodeIndex = ['Management Cluster'];
    var edges = [];
    var index = 1;
    info.data.SystemStatus.nodes.forEach(function (node, nix) {
      graphNodes.push({
        label: node.name,
        group: 'node',
        id: index,
        level: 1
      });
      // links to management cluster
      edges.push({
        from: index,
        to: 0
      });
      index++;
      nodeIndex.push(node.name);
    });

    var imageNameHash = {};

    containers.data.forEach(function(container, cix) {
      imageNameHash[container.Image] = true;
      let nodeObj = {
        label: '\n ' + container.Name + ' \n (' + container.Image + ') ',
        id: index,
        level: 2,
        data: {
          image: container.Image,
          name: container.Name,
          node: container.Node
        }
      };
      nodeObj.group = container.State === 'running' ? 'container_running' : 'container_exited';
      graphNodes.push(nodeObj);

      edges.push({
        from: index,
        to: nodeIndex.indexOf(container.Node)
      });
      index++;
    });

    var images = [];
    for (var name in imageNameHash) {
      images.push(name);
    }

    nodeNames = nodeIndex;
    nodeNames.shift();

    return {
      nodes: graphNodes,
      edges: edges,
      imageNames: images,
      nodeNames: nodeNames
    };
  }

  /**
   * Methods for filtering getData() response
   */
  const filters = {
    /**
     * Remove containers which are not running images with any name defined in imageNames
     * @param  {Object} data       - getData() response
     * @param  {Array} imageNames  - image names to filter containers by
     * @return {Object}            - modified getData() response
     */
    imageNames: function(data, imageNames) {
      var containers = data[0];
      var info = data[1];
      var newContainerData = [];
      if (!imageNames) return [containers, info];
      containers.data.forEach(function(container, ix) {
        imageNames.forEach(function(imageName) {
          if (container.Image.indexOf(imageName) !== -1) {
            newContainerData.push(container);
          }
        });
      });
      console.log(newContainerData);
      containers.data = newContainerData;
      return [containers, info];
    },
    /**
     * Remove containers which do not have names containing any values in containerNames
     * @param  {Object} data       - getData() response
     * @param  {Array} imageNames  - image names to filter containers by
     * @return {Object}            - modified getData() response
     */
    containerNames: function(data, containerNames) {
      var containers = data[0];
      var info = data[1];
      var newContainerData = [];
      containers.data.forEach(function(container, ix) {
        console.log(container)
        containerNames.forEach(function(containerName) {
          if (container.Name.indexOf(containerName) !== -1) {
            newContainerData.push(container);
          }
        });
      });
      containers.data = newContainerData;
      return [containers, info];
    },
    containersRunning: function(data) {
      var containers = data[0];
      var info = data[1];
      var newContainerData = [];
      containers.data.forEach(function(container, ix) {
        console.log(container);
        if (container.State === 'running') {
          newContainerData.push(container);
        }
      });
      containers.data = newContainerData;
      console.log(containers.data);
      return [containers, info];
    }
  };

  /**
   * filtering middleware for manipulating getData() response before formatting
   * @param  {String} filter - Name of filter to apply to the data
   * @param  {Array} values  - Array of values to pass to the filter
   * @return {Object}        - getData() response with 
   */
  function filterMiddleware (filter, names) {
    console.log(filter)
    return function (data) {
      if (typeof names === 'string') names = [names];
      return filters[filter](data, names);
    }
  }


  return {
    info: function() {
      return getData();
    },
    graphData: function () {
      return getData().then(visJsFormatter);
    },
    filteredGraphData: function(filters) {
      // return getData().then(filterMiddleware(filterBy, filterValues)).then(visJsFormatter);
      var middlewareChain = getData();
      filters.forEach(function(data) {
        console.log(data);
        if (data.filterValues) {
          middlewareChain = middlewareChain.then(filterMiddleware(data.filterBy, data.filterValues));
        } else {
          middlewareChain = middlewareChain.then(filterMiddleware(data.filterBy));
        }
      });
      return middlewareChain.then(visJsFormatter);
    }
  };
});
