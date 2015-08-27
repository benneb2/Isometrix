var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("IncidentCategories req");

   sql.getIncidentCategories(function(IncidentCategories){

		_log.d("IncidentCategories resp " );
		for(var i in IncidentCategories)
		{
			cat = IncidentCategories[i];
			// _log.d(cat.SourceListID + "-" + cat.HierarchyLevel);
			cat.key = cat.SourceListID + "-" + cat.HierarchyLevel;
		}

		obj.RESPONSE = IncidentCategories;
		cb(obj);

 });
}
