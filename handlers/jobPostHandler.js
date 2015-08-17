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
 		  obj.RESPONSE = postIncident;
 		  cb(obj);
 
 	 });
	}catch(err)
	{
		_log.d(err);

	}
}
