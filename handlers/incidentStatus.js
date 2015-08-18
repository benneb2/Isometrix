var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("incident Status req");

   sql.getIncidentStatus(function(IncidentStatus){

		_log.d("incidentStatus resp");

		obj.RESPONSE = IncidentStatus;
		cb(obj);

 });
}
