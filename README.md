# Fast-Forward-Framework
#### A simple Event Driven Framework for React Native developers

_"Focus on your app logic and your cool UI ... we manage the rest"_

_**Fast-Forward**_ provides a convenient way to communicate between all the elements (components, providers, stores, utils, ...etc.) that compose your app and prevents [Spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code).

_**Fast-Forward**_ is lightweight, you can use it on an existing project without breaking changes or in a brand new one.

_**Fast-Forward**_ also offer a way to monitor what's happening in your app, via :
* Clear console logs
* A tracking system that stores every _**F-F**_ communication. You can dump the data so it can be analyzed/visualized with an external tool (*to be released*)
* An integrated ```console.timeStamp()``` system to efficiently debug/analyze in chrome

## Install
In your React Native project folder
```sh
	npm install fast-forward-framework --save
```
## Usage
#### Initialize the Framework
``` javascript
import {ff_Core, ff_Constants} from 'fast-forward-framework'
[...]
//during your app start up
constructor(props){
	super(props)
    ff_Core.init(options); //see API section for options detail
}
```
#### Create a set of trigger constants

```javascript
module.exports = {
  //Providers triggers
  FETCH_DATA:'fetchData',

  //Components triggers
  ON_DATA_LOADED:'ondataloaded',
  ON_DATA_LOADING_PROGRESS:'ondataloadingProgress'
}
```

#### Create a _**Fast-Forward**_ compatible RN component
```javascript
import {ff_Component} from 'fast-forward-framework';
import Triggers from './Triggers'

class SimpleView extends ff_Component{

  constructor(props){
    super(props);
    this.state = {
      data:""
    }
  }

  componentDidMount(){
    this.register(Triggers.ON_DATA_LOADED, this._onDataLoaded.bind(this));
    this.register(Triggers.ON_DATA_LOADING_PROGRESS,      this._onDataLoaded.bind(this), 0); // register an handler with a HIGH priority
    }

  _onDataLoaded(d){
    this.setState({data:d})
    return {ff_Block:true}; // stop propagation
  }

  render(){
    return(
     //Your rendering
    )
  }

}
```

using *SimpleView* component

``` javascript
import SimpleView from './your/SimpleView';
[...]
//in the JSX
<SimpleView FFId="functionalView#1"></SimpleView>
```



#### Create a _**Fast-Forward**_ compatible custom object
```javascript
import {ff_Dispatcher} from 'fast-forward-framework';
import Triggers from './Triggers';

const __NAME="mySimpProvider";

class SimpleProvider extends ff_Dispatcher{
  constructor(){
    super(__NAME);
    this.initTiggers();
    }

    initTiggers(){
      this.register(Triggers.FETCH_DATA,this.doFetchData.bind(this));
    }

    doFetchData(data){
      this.dispatch(Triggers.ON_DATA_LOADED, (Math.random()*1000)>>0)
    }
}

module.exports = new SimpleProvider();

```

## API

#### Core init
``` javascript
ff_Core.init({options})
```
##### Options :
* ###### maxLoglvl (default : OFF)
The maximun log level displayed in the console. Can be any of the following values:

``` ff_Constants.LOG_ERROR``` , ``` ff_Constants.LOG_WARN```, ``` ff_Constants.LOG_INFO```, ``` ff_Constants.LOG_OFF```

Example :
``` javascript
ff_Core.init({maxLoglvl:ff_Constants.LOG_ERROR});
```

* ###### verbose (default : OFF)
Gives you some extra logs. Can be any of the following values:

``` ff_Constants.VERBOSE_LOG_ON``` , ``` ff_Constants.VERBOSE_LOG_OFF```

Example :
``` javascript
ff_Core.init({verbose:ff_Constants.VERBOSE_LOG_ON});
```

* ###### tracking (default: DISABLE)
Enable the event tracking system. Can be any of the following values:
``` ff_Constants.TRACKING_ENABLE``` , ``` ff_Constants.TRACKING_DISABLE```


* ###### timeStamp (default: DISABLE)
Enable console timestamps. Can be any of the following values:
``` ff_Constants.TIMESTAMP_ENABLE``` , ``` ff_Constants.TIMESTAMP_DISABLE```

---

#### Core Toggle Tracking system
```` javascript
ff_Core.toggleTracking(ff_Constants.TRACKING_ENABLE);
````
Activate or deActivate the tracking. Can use any of the following values:
``` ff_Constants.TRACKING_ENABLE``` , ``` ff_Constants.TRACKING_DISABLE```

---

#### Core Reset Tracking map
```` javascript
ff_Core.resetTrackMap();
````
Clear the stored data.

---

#### Core Dump Tracking map
```` javascript
ff_Core.dumpTrackMap();
````
return all the tracked data

---

#### Core Toggle TimeStamp
```` javascript
ff_Core.toggleTimeStamp(ff_Constants.TIMESTAMP_ENABLE);
````
Activate or deActivate the tracking. Can use any of the following values:
``` ff_Constants.TIMESTAMP_ENABLE``` , ``` ff_Constants.TIMESTAMP_DISABLE```

---

#### Core Register
```` javascript
ff_Core.register(id, topic, callback, priorityLvl);
````
Manually add a listener for a given topic (or trigger or event or whatever you want to call it)
* **id** : A unique string that represents the object that is registering
* **topic** : A string which represents a Trigger (see *Create a set of trigger constants*)
* **callback** : A function, that will act as a handler
* **priorityLvl** : A number which defined the priority lvl of the callback. The lower the priority, the sooner the callback back will be called.

---

#### Core Unregister an component for a topic
```` javascript
ff_Core.unregisterTopicFor(topic, receiver);
````
Remove the listener of a component for a specific topic
* **topic** : The topic we want to stop listening for
* **receiver** : The component/class that registered for the topic

---

#### Core Unregister All topics
```` javascript
ff_Core.unregisterAllFor(receiver);
````
Remove the listener of a component for a specific topic
* **receiver** : The component / class that registered for topics

---

#### Core Dispatch
```` javascript
ff_Core.dispatch(id, topic, data);
````
Send an topic/event/trigger/...etc. thru the framework
* **id** : The id of the component / class that is emitting
* **topic** : The topic that is going to be broadcasted
* **data** : The data to be carried to the handlers

---

## Notice
You can use _**Fast-Forward**_ without using the *ff_Dispatcher* nor the *ff_Component* classes but they provide a good abstraction to the Framework. For instance, the *ff_Component* automaticcaly unregister all the listener when the component is unmounted.

In order to properly use the trackin system each dispatcher (*ff_Component* or *ff_Dispatcher*) should provide an ID:
* ff_Component : thru the ```props.FFID```
* ff_Dispatcher : thru the super() method  
```javascript
import ff_Dispatcher from 'fast-forward-framework';

const __NAME="mySimpProvider";

class SimpleProvider extends ff_Dispatcher{
  constructor(){
    super(__NAME);
    }
}
```

An handler can stop the propagation of the event by return a specific property :  ```ff_Block``` set to TRUE
```javascript
this.register(Triggers.ON_DATA_LOADED, this._onDataLoaded.bind(this));

_onDataLoaded(d){
    this.setState({data:"Data from provider : "+d})
    return {ff_Block:true};
  }
```

## TODO
* Release a Sample app
* Release the track map visualization tool



## Contributors
* Guillaume Nachury ( @__Guillaume )
