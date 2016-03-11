angular.module('dockerswarmUI')
  .factory('ContainerFactory',function($http){
    var SERVER='/api/v1';
    return{
      containers:function(){
        return $http.get(SERVER+'/containers');
      }
    }
  });
