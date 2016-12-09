function config($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/images', {
      templateUrl: 'views/images.html',
      controller: 'ImagesCtrl'
    })
    .when('/containers', {
      templateUrl: 'views/containers.html',
      controller: 'ContainersCtrl'
    })
    .when('/nodes', {
      templateUrl: 'views/nodes.html',
      controller: 'NodesCtrl'
    })
    .when('/visualiser', {
      templateUrl: 'views/visualiser.html',
      controller: 'VisualiserCtrl'
    })
    .otherwise({ redirectTo: '/' });
}

module.exports = config;