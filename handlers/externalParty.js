var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("externalParty req");

   sql.getExternalParty(function(externalParties){

		_log.d("externalParty resp");

		obj.RESPONSE = externalParties;
		cb(obj);

 });
}
