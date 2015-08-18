var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("incident Users req");

   sql.getIncidentUsers(function(IncidentUsers){

		_log.d("incidentUsers resp");

		obj.RESPONSE = IncidentUsers;
		cb(obj);

 });
}
