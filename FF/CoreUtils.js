module.exports = {
    getFormatedDate : (full)=>{
    	var d = new Date();
    	var DD = d.getDate();
    	var MM = d.getMonth()+1;
    	var HH = d.getHours();
    	var mm = d.getMinutes();
    	var ss = d.getSeconds();

      if(full){
    	return "["+(DD < 10 ? '0'+DD:DD)+"/"+ (MM < 10 ? '0'+MM:MM)+"@"+
    			(HH < 10 ? '0'+HH:HH)+":"+(mm < 10 ? '0'+mm:mm)+":"+(ss < 10 ? '0'+ss:ss)+
    			"] ";
        }
      else {
        return "["+
      			(HH < 10 ? '0'+HH:HH)+":"+(mm < 10 ? '0'+mm:mm)+":"+(ss < 10 ? '0'+ss:ss)+
      			"]";
      }
    },

    getUniqId:()=>{
      return new Date().getTime().toString(36);
    }
}
