import Constants from './CoreConstants';
import CoreUtils from './CoreUtils';


class Core{

  constructor(){
    this.__id = CoreUtils.getUniqId();
    this.__LOG_NAME = "Core";
    this.__topicToFunc = {};
    this.__receiverToTopic = {};
  }

  init(options){
    if(options){
      this._logLvl = options.maxLoglvl ? options.maxLoglvl : Constants.LOG_OFF;
      this._verbose = options.verbose ? options.verbose : Constants.VERBOSE_LOG_OFF;
    }
    else{
      this._logLvl = Constants.LOG_OFF;
      this._verbose = Constants.VERBOSE_LOG_OFF;
    }

    this.log(Constants.LOG_INFO,this.__LOG_NAME, "Created (id:"+this.__id+')');
  }




  /**
    Register for topics :

    @param topics :
          String
          [Strings]
          {topic:String, callback:Function}
          [{topic:String, callback:Function}]
  */
  register(id, topic, callback){
    let _tpc = this.__topicToFunc[topic];
    if(_tpc == undefined){
      this.__topicToFunc[topic] = [];
      _tpc =   this.__topicToFunc[topic];
      this.__receiverToTopic[id] = [];
    }

    if(this.__isAlreadyRegister(_tpc, id)){
      this.log(Constants.LOG_WARN,this.__LOG_NAME, id+" already registed for "+topic+" notifications... SKIPPING");
    }
    else{
      _tpc.push({id,callback});
      this.__receiverToTopic[id].push(topic);
      this.log(Constants.LOG_INFO,this.__LOG_NAME, id+" registered for "+topic+" notifications");
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
      this.log(Constants.LOG_INFO,this.__LOG_NAME, "Unregistered "+topic+" for "+receiver);
    }
    else{
        this.log(Constants.LOG_WARN,this.__LOG_NAME, "Could not unregister "+topic+" for "+receiver+". No matching entry");
    }
  }

  unregisterAllFor(receiver){
    let _tpcs = this.__receiverToTopic[receiver];
    _tpcs.map((tpc)=>this.unregisterTopicFor(tpc,receiver));
    this.__receiverToTopic[receiver] = [];

  }

  dispatch(id, topic, data){
    let _func = this.__topicToFunc[topic];

    if(_func && _func.length>0){
      this.log(Constants.LOG_INFO,this.__LOG_NAME, "Dispatching "+topic);
      if(this._verbose == Constants.VERBOSE_LOG_ON)
        this.log(Constants.LOG_INFO,this.__LOG_NAME, "Dispatching to "+_func.length + " receiver(s)");
      for(var i=0; i<_func.length; i++) _func[i].callback(data);
    }
    else {
      this.log(Constants.LOG_WARN,this.__LOG_NAME, "No receiver defined for this topic :  "+topic);
    }
  }

  map(){

  }

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
