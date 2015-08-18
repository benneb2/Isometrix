var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("incident Levels req");

   sql.getIncidentLevels(function(IncidentLevels){

		_log.d("incidentLevels resp");

		obj.RESPONSE = IncidentLevels;
		cb(obj);

 });
}
