angular.module('dockerswarmUI')
  .factory('ImageFactory',function($http){
    var SERVER='/api/v1';
    return{
      images:function(){
        return $http.get(SERVER+'/images');
      }
    }
  });
