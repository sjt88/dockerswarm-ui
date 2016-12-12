import mainTemplate from '../views/main.template.html';
import imageTemplate from '../views/images.template.html';
import containersTemplate from '../views/containers.template.html';
import nodesTemplate from '../views/nodes.template.html';
import visualiserTemplate from '../views/visualiser.template.html';

function config($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(false);

  let states = [
    {
      name: 'main',
      url: '/',
      templateUrl: mainTemplate,
      controller: 'MainCtrl as main'
    },
    {
      name: 'images',
      url: '/images',
      templateUrl: imageTemplate,
      controller: 'ImagesCtrl as images'
    },
    {
      name: 'containers',
      url: '/containers',
      templateUrl: containersTemplate,
      controller: 'ContainersCtrl as containers'
    },
    {
      name: 'nodes',
      url: '/nodes',
      templateUrl: nodesTemplate,
      controller: 'NodesCtrl as nodes'
    },
    {
      name: 'visualiser',
      url: '/visualiser',
      templateUrl: visualiserTemplate,
      controller: 'VisualiserCtrl as visualiser'
    }];

    states.forEach(state => $stateProvider.state(state.name, state));
    $urlRouterProvider.otherwise('/');
}

module.exports = config;
