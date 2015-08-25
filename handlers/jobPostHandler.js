var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

//this is a callback that waits for the funtion call to finish
_log.d("Start Handler - fetch");
_log.d("Start Handler - fetch");
_log.d("Start Handler - fetch");
_log.d("Start Handler - fetch");
_log.d("Start Handler - fetch");

_log.d(JSON.stringify(obj));

try{
  sql.postIncident(obj, function(postIncident){

  	if(postIncident == false)
  	{
  		result = { req : postIncident.req, res : postIncident.res, msg : postIncident.msg  };
    	obj.RESPONSE = { jobID:obj.jobID, statusCode:postIncident.code, result:result};
  		cb(obj);
  	}else
  	{
		result = { req : postIncident.req, res : postIncident.res, msg : postIncident.msg  };
    	obj.RESPONSE = { jobID:obj.jobID, statusCode:postIncident.code, result:result};
  		cb(obj);
  	}
    
 
 	 });
	}catch(err)
	{
		_log.d(err);

	}
}
