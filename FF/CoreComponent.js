import React, { Component } from 'react';
import Core from './Core';
import Constants from './CoreConstants';
import CoreUtils from './CoreUtils';


class CoreComponent extends Component{
  constructor(props){
    super(props);
    this.__id = CoreUtils.getUniqId();
    let {FFId}=props;
    this.id = FFId ? FFId+" ("+this.__id+")" :this.__id +"("+this.constructor.name+")";
    Core.log(Constants.LOG_INFO, "CoreComponent", 'Creating component #'+this.id);

  }


//FMWK stuff
  register(topic, callback){
    Core.register(this.id, topic, callback);
  }

  dispatch(topic, data){
    Core.dispatch(this.id, topic, data);
  }

  unregister(topic){
      Core.unregisterTopicFor(topic,this.id);
  }
  unregisterAll(){
    Core.unregisterAllFor(this.id);
  }


//React Stuff
  componentDidMount(){
    Core.log(Constants.LOG_INFO, "CoreComponent",this.id+' -> Mount');
  }


  componentWillUnmount(){
    Core.unregisterAllFor(this.id);
  }

  render(){
    return null;
  }

}


module.exports = CoreComponent;
