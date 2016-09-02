/*
@author: __Guillaume
@date: 2016-08
*/

import Core from './Core';
import Constants from './CoreConstants';
import CoreUtils from './CoreUtils';

class CoreProvider {
  constructor(name){
    this.__id = CoreUtils.getUniqId();
    this.id = name ? name :this.__id +"("+this.constructor.name+")";
    Core.log(Constants.LOG_INFO, "CoreProvider", "Creating provider #"+this.id);
  }

//FMWK stuff
  dispatch(topic, data){
    Core.dispatch(this.id, topic, data);
  }

  register(topic, callback){
    Core.register(this.id, topic, callback);
  }

  unregister(topic){
      Core.unregisterTopicFor(topic,this.id);
  }
  unregisterAll(){
    Core.unregisterAllFor(this.id);
  }

}
module.exports = CoreProvider;
