angular.module('dockerswarmUI').factory('ContainerFactory',function($http){
    var cache = [];
    var SERVER='/api';

    function formatContainersResponse (containerData) {
	    for (var i=0; i < containerData.data.length ; i++) {
	      var d = new Date(0);
	      d.setUTCSeconds(containerData.data[i].Created);
	      containerData.data[i].Created = d.toLocaleString();
	      var name=containerData.data[i].Names[0];
	      var c = name.slice(1,name.length);
	      var no = c.slice(0,c.indexOf('/'));
	      var co = c.slice(c.indexOf('/')+1,c.length);
	      containerData.data[i].Name=co;
	      containerData.data[i].Node=no;
	    }
	    return containerData;
    }

    return {
      containers: function () {
        return $http.get(SERVER+'/containers').then(formatContainersResponse);
      }
    };
  });
