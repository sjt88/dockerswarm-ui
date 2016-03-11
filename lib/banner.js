'use strict';

var banner = require('ascii-banner');

module.exports=function(){
  banner
      .write('DockerSwarm UI')
      .color('red')
      .after('>v{{version}}', 'yellow')
      .before('>Developed by {{author}}<')
      .out();
}
