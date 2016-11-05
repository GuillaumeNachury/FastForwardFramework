/*
@author: __Guillaume
@date: 2016-08
*/

import Constants from './CoreConstants';
import CoreUtils from './CoreUtils';

var sortedIndexBy = require('lodash.sortedindexby');

class Core{

  constructor(){
    this.__id = CoreUtils.getUniqId();
    this.__LOG_NAME = "Core";
    this.__topicToFunc = {};
    this.__receiverToTopic = {};
    this.__TrackingMap = {};
  }

  init(options){
    if(options){
      this._logLvl = options.maxLoglvl ? options.maxLoglvl : Constants.LOG_OFF;
      this._verbose = options.verbose ? options.verbose : Constants.VERBOSE_LOG_OFF;
      this._isTracking = options.tracking ? options.tracking : Constants.TRACKING_DISABLE;
      this._isTimeStampActive = options.timeStamp ? options.timeStamp : Constants.TIMESTAMP_DISABLE;
    }
    else{
      this._logLvl = Constants.LOG_OFF;
      this._verbose = Constants.VERBOSE_LOG_OFF;
      this._isTracking = Constants.TRACKING_DISABLE;
      this._isTimeStampActive = Constants.TIMESTAMP_DISABLE;
    }

    this.log(Constants.LOG_INFO,this.__LOG_NAME, "Created (id:"+this.__id+')');
    this.log(Constants.LOG_INFO,this.__LOG_NAME, "The tracking system is "+ (this._isTracking?"ON":"OFF"));
    this.log(Constants.LOG_INFO,this.__LOG_NAME, "Timestamp are  "+ (this._isTimeStampActive?"ON":"OFF"));
    this.stamp("Core initialized");
  }




  /**
    Register for topics
  */
  register(id, topic, callback, priorityLvl){
    let _tpc = this.__topicToFunc[topic];
    if(_tpc == undefined){
      this.__topicToFunc[topic] = [];
      _tpc =   this.__topicToFunc[topic];
      this.__receiverToTopic[id] = [];
    }
    else{
      if(!this.__receiverToTopic[id]) this.__receiverToTopic[id] = [];
    }


    if(this.__isAlreadyRegister(_tpc, id)){
      this.log(Constants.LOG_WARN,this.__LOG_NAME, id+" already registed for "+topic+" notifications... SKIPPING");
    }
    else{
        var _obj = {id,callback, priorityLvl};
        if(_tpc.length == 0){
          _tpc.push(_obj);
        }
        else{
          var _idxArr = sortedIndexBy(_tpc, _obj, 'priorityLvl');
          _tpc.splice(_idxArr,0, _obj);
        }
        this.log(Constants.LOG_INFO,this.__LOG_NAME, id+" registered for "+topic+" notifications with priority lvl : "+priorityLvl);
        this.stamp(id+" registered for "+topic+" notifications with priority lvl : "+priorityLvl);
        this.__receiverToTopic[id].push(topic);
    }

  }

  __isAlreadyRegister(topic, id){
    let _entry;
    for(var i=0; i<topic.length; i++){
      if(topic[i].id == id) return true;
    }
    return false;
  }

  unregisterTopicFor(topic, receiver){
    let _cbks = this.__topicToFunc[topic];
    let _idx = -1;
    for(var i=0; _cbks.length; i++){
      if(_cbks[i].id == receiver){
        _idx = i;break;
      }
    }
    if(_idx>-1){
      _cbks.splice(_idx,1);
      delete this.__receiverToTopic[receiver];
      this.log(Constants.LOG_INFO,this.__LOG_NAME, "Unregistered "+topic+" for "+receiver);
      this.stamp("Unregistered "+topic+" for "+receiver);
    }
    else{
        this.log(Constants.LOG_WARN,this.__LOG_NAME, "Could not unregister "+topic+" for "+receiver+". No matching entry");
    }
  }

  unregisterAllFor(receiver){
    let _tpcs = this.__receiverToTopic[receiver];
    _tpcs.map((tpc)=>this.unregisterTopicFor(tpc,receiver));

  }

  dispatch(id, topic, data){
    this.stamp(id +" dispatched "+topic);
    let _func = this.__topicToFunc[topic];
    let _sequence = {time:new Date().getTime(), from: id , to:[]};
    if(_func && _func.length>0){
      this.log(Constants.LOG_INFO,this.__LOG_NAME, "Dispatching "+topic);
      if(this._verbose == Constants.VERBOSE_LOG_ON)
        this.log(Constants.LOG_INFO,this.__LOG_NAME, "Dispatching to "+_func.length + " receiver(s)");
      for(var i=0; i<_func.length; i++){
        let _ret = _func[i].callback(data);
        if(this._isTracking){
          _sequence.to.push({time:new Date().getTime(), id:_func[i].id})
        }
        this.stamp(_func[i].id +" received "+topic);
        if(_ret && _ret.ff_Block && _ret.ff_Block === true){
            this.log(Constants.LOG_WARN,this.__LOG_NAME, "Dispatch stoped by "+_func[i].id);
            break;
        }
      }
    }
    else {
      this.log(Constants.LOG_WARN,this.__LOG_NAME, "No receiver defined for this topic :  "+topic);
    }
    if(this._isTracking){
      var _tmap = this.__TrackingMap[topic];
      if(_tmap == undefined){
        this.__TrackingMap[topic] = [];
        _tmap = this.__TrackingMap[topic];
      }
      _tmap.push(_sequence);
    }
  }

/*
 --- Tracking ---
*/
  toggleTracking(isON){
    this.log(Constants.LOG_INFO,this.__LOG_NAME, "The tracking system is now "+ isON?"ON":"OFF");
    this._isTracking = isON;
  }

  resetTrackMap(){
    this.log(Constants.LOG_WARN,this.__LOG_NAME, "Track map reset");
    this.__TrackingMap = {};
  }

  dumpTrackMap(){
    this.log(Constants.LOG_INFO,this.__LOG_NAME, "Dumping the track map");
    return this.__TrackingMap;
  }
  /*
   --- --- ---
  */





  /*
   --- Timestamp ---
  */
  toggleTimeStamp(isON){
    this.log(Constants.LOG_INFO,this.__LOG_NAME, "Timestamp are now "+ isON?"ON":"OFF");
    this._isTimeStampActive = isON;
  }

  stamp(msg){
    if(this._isTimeStampActive) console.timeStamp(msg);
  }
  /*
   --- --- ---
  */






  getId(){ return this.__id}


  log(lvl, src, msg){
    if(lvl<=this._logLvl){
      console.log("%c"+Constants.LOG_TEXT_MAP[lvl]+"%c "+ CoreUtils.getFormatedDate() +" %c "+src+"->"+msg,
                  'background:'+Constants.LOG_COLOR_MAP[lvl]+'; color:#EFEFEF',
                  'background:#2C6733; color:#EFEFEF',
                  'color:#3C3C3C'
                  );
    }

  }

}


module.exports = new Core();
