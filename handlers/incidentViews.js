var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("incident Views req");

   sql.getIncidentViews(function(IncidentViews){

		_log.d("incidentViews resp");

		obj.RESPONSE = IncidentViews;
		cb(obj);

 });
}
