var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("controlHandler req");

   sql.getControls(function(controls){

		_log.d("controlHandler resp");

		obj.RESPONSE = controls;
		cb(obj);

 });
}
