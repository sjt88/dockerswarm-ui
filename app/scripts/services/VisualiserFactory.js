angular.module('dockerswarmUI')
.factory('VisualiserFactory',function(DockerFactory, ContainerFactory, $http, $q) {
  
  function getData() {
    return $q.all([
      ContainerFactory.containers(),
      DockerFactory.infos()
    ]);
  }

  function prepareVisJsData(data) {
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

  const filters = {
    imageNames: function(data, imageNames) {
      var containers = data[0];
      var info = data[1];
      var newContainerData = [];
      containers.data.forEach(function(container, ix) {
        imageNames.forEach(function(imageName) {
          if (container.Image === imageName) {
            newContainerData.push(container);
          }
        });
      });
      console.log(newContainerData);
      containers.data = newContainerData;
      return [containers, info];
    }
  };


  return {
    info: function() {
      return getData();
    },
    graphData: function () {
      return getData().then(prepareVisJsData);
    },
    getGraphDataWithImageName: function(imageNames) {
      return getData().then(function (data) {
        if (typeof imageNames === 'string') imageNames = [imageNames];
        console.log(imageNames)
        return filters.imageNames(data, imageNames);
      }).then(prepareVisJsData);
    }
  };
});
