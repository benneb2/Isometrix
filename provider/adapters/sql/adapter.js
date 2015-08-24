var mssql = require('mssql');
var config   = require('../sql/config');
var _log = require('../../lib/log');
var grep = require('grep-from-array');
var fs = require('fs');
var crypto = require('crypto');
var sql = {

Views:3,
IncidentStatus:25,
Levels:1,
IncidentCategories:1050,
ReportedTo:474,
External:537,

getExternalParty: function(callback)
{
  sql.getFromSqlFile('externalParty.sql',callback);
}
,
getIncidentCategories: function(callback)
{
  sql.getFromSqlFile('incidentCategories.sql',callback);
}
,
getIncidentViews: function(callback)
{
  sql.getFromSqlFile('incidentViews.sql',callback);
}
,
getIncidentLevels: function(callback)
{
  sql.getFromSqlFile('incidentLevels.sql',callback);
}
,
getIncidentUsers: function(callback)
{
  sql.getFromSqlFile('incidentUsers.sql',callback);
}
,
getIncidentStatus: function(callback)
{
  sql.getFromSqlFile('incidentStatus.sql',callback);
}
,
getFromSqlFile: function(file,callback)
{
  fs.readFile('provider/adapters/sql/'+file, 'utf8', function (err,data) {
    if (err) {
       _log.d(err);
       return;
    }

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = data;
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getFromSqlFile: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      // request.multiple = true;
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getFromSqlFile: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            _log.d("getFromSqlFile: GOOD " );
            retData = [];

            for(var i in recordset)
            {
              record = recordset[i];
              retData.push(record);
              // _log.d("IncidentStatus " + record.SourceList);
            }

            callback(retData);
            return;
          }
      });
    }); 
  });

}
,
postIncident: function(obj, callback)
{
  var update = false;
  _log.d("postIncident - Start" );
  _log.d(JSON.stringify(obj) );
  //obj = JSON.parse(JSON.stringify(obj).replace(new RegExp("\"\"", 'g'), "null"));

  if(obj.data === "update")
  {
      _log.d("UPDATE GOOD ");
      response = { code : 10, req : obj.data, res : "Update Good", msg : "Update Good" };
      callback(response);
      return;
  }

  var conParams = config.conParams[GLOBAL.RELEASE];

  var sqlConfig =
  {
    user: conParams.user,
    password: conParams.password,
    server: conParams.server,
    database: conParams.database,
    options: {
      appName : conParams.applicationName
    }
  };

  

 var connection = new mssql.Connection(sqlConfig, function (err) {
    if (err)
    {
      _log.d("postIncident: mssql Conn Error " + err);
      callback(false);
      return;
    }
    var request = new mssql.Request(connection); // or: var request = connection.request();
    request.multiple = true;
    var storedProcedure = '[dbo].[spi_M380_1]';

     var siteID_xml = '<st><s id="" siteId="" /></st>';
    // var request = new mssql.Request(connection);
     request.input('SiteID_xml', siteID_xml);
     request.input('RiskTypeID_xml', obj.data.riskTypeID_xml);
     request.input('c1E8BCC9E', obj.data.person);
     request.input('c385D7025', obj.data.siteSelect);
     request.input('c3D7380B8', obj.data.description);
     request.input('c3E7CF6D4', obj.data.action);
     // request.input('c7C5F61F0', 13);
     request.input('c85B29C24', obj.data.usersSelect);
     request.input('cA299231D', obj.data.location);
     request.input('cAA24747C', obj.data.external);
     request.input('cBCDBB162', obj.data.date + " " + obj.data.time);
     request.input('cBF638E94', obj.data.incidentStatusSelect);
     request.input('UserID', obj.data.userID);
 
     request.output('Scope', mssql.BigInt);

    
    request.execute(storedProcedure, function (err, recordsets, returnValue)
    {
      if (err)
      {
        _log.d(err);
        response = { code : 0 , req : obj.data, res : recordsets, msg : err  };
        callback(response);
            return;
      }
      else
      {

        _log.d("GOOD ");
        _log.d(JSON.stringify(recordsets));
        _log.d(JSON.stringify(recordsets[0][0].ID));
        _log.d(JSON.stringify(recordsets[1][0].RV.data));
        var m380_1Recordset = recordsets;
        var IncidentId = recordsets[0][0].ID;
        _log.d(JSON.stringify(returnValue));
        // recordsets = [[{"ID":"113","RecordID":"113"}],[{"RV":{"type":"Buffer","data":[0,0,0,0,2,12,78,169]}}],[]]

        var cbl_xml = '<chl>';
        for(var i in obj.data.category )
        {
            var cat = obj.data.category[i];
            cbl_xml = cbl_xml + '<c id="'+IncidentId+'" moduleDefinitionID="99662" sourceID="1050" sourceListID="'+cat.SourceListID +'" />';
        }
        for(var i in obj.data.externalList )
        {
            var ex = obj.data.externalList[i];
            cbl_xml = cbl_xml + '<c id="'+IncidentId+'" moduleDefinitionID="99890" sourceID="537" sourceListID="'+ex.SourceListID +'" />';
        }

        

        cbl_xml = cbl_xml + '</chl>';

        var request = new mssql.Request(connection);
        request.input('XML', cbl_xml);

        var storedProcedure = '[dbo].[spi_M380_1_CheckboxList]';
        request.execute(storedProcedure, function (err, recordsets, returnValue)
        {
          if (err)
          {
            _log.d(err);
            response = { code : 0 , req : obj.data, res : m380_1Recordset, msg : err  };
            callback(response);
            return;
          }
          else
          {
            _log.d("GOOD ");
            _log.d(JSON.stringify(recordsets));
            _log.d(JSON.stringify(returnValue));
            response = { code : 10, req : obj.data, res : m380_1Recordset, msg : IncidentId };
            callback(response);

          }
        });
      }
    });
  });


}
,
getControls: function(callback)
{
    RESPONSE = [];

    sql.getInfoProc(function(controls){
      
      if(controls == false)
      {
        callback(false);
      }else
      {
        RESPONSE.push(controls);
        callback(RESPONSE);  
      }

    });

}
,
getInfoProc:function(callback)
{
  fs.readFile('provider/adapters/sql/InfoProc.sql', 'utf8', function (err,data) {
    if (err) {
       _log.d(err);
       return;
    }

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = data;
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getInfoProc: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.multiple = true;
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getInfoProc: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            _log.d("getInfoProc: GOOD " );
            controls = {
              controlID :0,
              Views:[],
              IncidentStatus:[],
              Levels:[],
              IncidentCategories:[],
              Users:[],
              ReportedTo:[],
              External:[],
            }

            var tmpLevels = [];
            var tmpCategories = [];
            for(var i in recordset[1])
            {
              record = recordset[1][i];
              if(record.SourceID == sql.Views)
              {
                controls.Views.push(record);
                _log.d("View " + record.SourceList);
              }else if(record.SourceID == sql.IncidentStatus)
              {
                controls.IncidentStatus.push(record);
                _log.d("IncidentStatus " + record.SourceList);
              }else if(record.SourceID == sql.Levels)
              {
                tmpLevels.push(record);
                _log.d("Levels " + record.SourceList);
              }else if(record.SourceID == sql.IncidentCategories)
              {
                tmpCategories.push(record);
                _log.d("IncidentCategories " + record.SourceList);
              }
              else if(record.SourceID == sql.ReportedTo)
              {
                controls.ReportedTo.push(record);
                _log.d("ReportedTo " + record.SourceList);
              }else if(record.SourceID == sql.External)
              {
                controls.External.push(record);
                _log.d("External " + record.SourceList);
              }

            }



            controls.Levels = sql.buildTree(tmpLevels,0);

            controls.IncidentCategories = sql.buildTree3(tmpCategories,0);

            _log.d(JSON.stringify(controls.IncidentCategories));

            callback(controls);
            return;

            // sql.getUsers(function(obj){
            //   if(obj != false)
            //   {
            //     controls.Users = obj;
            //     callback(controls);
            //     return;
            //   }
            // });
          }
      });
    }); 
  });
},

 buildTree3: function(elements,parentId) 
  {
      var level = 1;
      var found = false;
      var tree = [];
      var gbTree = [];
      for(var i in elements)
      {
        var element = elements[i];
        if(element.HierarchyLevel == level)
        {
          _log.d(level + " " + element.SourceList);
          var category = {
            SourceListID : element.SourceListID,
            SourceListParentID : element.SourceListParentID,
            SourceList : element.SourceList,
            HasChild : element.HasChild,
            children : [],
            Level : 1,
            checked : false,
          }
          gbTree.push(category);
          tree.push(category);
        }
      }

    do{
        level++;
        found = false;
        for(var i in elements)
        {
          var element = elements[i];
          if(element.HierarchyLevel == level)
          {
            // _log.d(level + " " + element.SourceList);
            for(var j in gbTree)
            {
              node = gbTree[j];

              if(node.SourceListID == element.SourceListParentID && node.Level == (level -1))
              {
                  var category = {
                    SourceListID : element.SourceListID,
                    SourceListParentID : element.SourceListParentID,
                    SourceList : element.SourceList,
                    HasChild : element.HasChild,
                    Level : level,
                    children : [],
                    checked : false,
                  }
                  node.children.push(category);
                  gbTree.push(category);
                  break;
                // _log.d("ELEMENT: " + JSON.stringify(element));
                // _log.d("PARENT: " + JSON.stringify(node));
              }
            }

            found = true
          }
        }
        // _log.d(level + " " + found);
      }while(found == true)


    return tree;  
  }
  ,
  buildTree2: function(elements,parentId) 
  {

    for(var i = elements.length; i--; )
    {
      for(var j in elements)
      {
        // _log.d(i + " " + j);
        if(elements[i].SourceListParentID == elements[j].SourceListID)
        {
            if (typeof(elements[j].children ) === "undefined")
            {
              elements[j].children = [];
              elements[j].children.push(JSON.parse(JSON.stringify(elements[i])));
            }else
            {
              elements[j].children.push(JSON.parse(JSON.stringify(elements[i])));
            }
            elements.splice(i,1);
            break;
        }
      }
    }
    return elements;
  }
  ,
  buildTree: function(elements,parentId) 
  {
    
    var branch = [];

    for (var i in elements) {
      var element = elements[i];

        if (element.SourceListParentID == parentId) {
            children = sql.buildTree(elements, element.SourceListID);
      
              newElement = {
              ParentID : element.SourceListParentID,
              SiteID : element.SourceListID,
              Site : element.SourceList,
              children : []
            };

            if (children.length > 0) {
              newElement.children = JSON.parse(JSON.stringify(children));
            }
            branch.push(newElement);
        }
    }
    return branch;
  }
  ,
  login : function(obj,callback)
  {

    _log.d("Login with " + JSON.stringify(obj));

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    shasum = crypto.createHash('sha1');
    shasum.update(obj.credentials.password);
    password = shasum.digest('hex');

    var queryString = "Select TOP 1 * from [dbo].[tblUser] where UserName = '"+ obj.credentials.username + "' and Password='"+password+"' and isDeleted IS NULL";
     _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("Login: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("Login: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
          if(recordset.length == 0)
          {
            _log.d("Login: User Not Found ");
            callback(false);
            return;
          }else
          {
            _log.d("Login: GOOD " + JSON.stringify(recordset[0]));
            callback(recordset[0]);
            return;
          }
        }
      });
    });    
  },
  getControls_old: function(callback)
  {
      RESPONSE = [];
      controls = {
        controlID :0,
        incidentStatus: [],
        users : [],
        sites : [],
        };

      sql.getIncidentStatus(function(obj){
        if(obj != false)
        {
          controls.incidentStatus = obj;
        }

        sql.getUsers(function(obj){
          if(obj != false)
          {
            controls.users = obj;
          }

          sql.getSites(function(obj){
            if(obj != false)
            {
              controls.sites = obj;
            }

            sql.getRiskType(function(obj){
              if(obj != false)
              {
                controls.risks = obj;
              }
              RESPONSE.push(controls);
              callback(RESPONSE);
            });

          });

        });
      });

  }
  ,
  getRiskType : function(callback)
  {
    _log.d("getRiskType");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select RiskTypeID, RiskType from [dbo].[tblRiskType] order by RiskType asc";
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getRiskType: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getRiskType: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            _log.d("getRiskType: GOOD " + JSON.stringify(recordset));

            for (var i in recordset) 
            {
              _log.d("TYPE: " + JSON.stringify(recordset[i]));
            }

            _log.d("getRiskType: riskTypeObj " + JSON.stringify(recordset));
            callback(recordset);
            return;
        }
      });
    }); 
  }
  ,

  getSites : function(callback)
  {
    _log.d("getSites");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select SiteID, ParentID,Site from [dbo].[tblSite] where isDeleted IS NULL";
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getSites: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getSites: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            _log.d("getSites: GOOD " + JSON.stringify(recordset));

            // for (var i in recordset) 
            // {
            //   _log.d("SITE: " + JSON.stringify(recordset[i]));
            // }

            siteObj = sql.buildTree(recordset,0);
            callback(siteObj);
            return;
        }
      });
    }); 
  }
  ,
  getUsers : function(callback)
  {
    _log.d("getUsers");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select UserID, FirstName,LastName from [dbo].[tblUser] where isDeleted IS NULL order by FirstName";;
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getUser: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getUser: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            // _log.d("getUser: GOOD " + JSON.stringify(recordset));
            callback(recordset);
            return;
        }
      });
    }); 
  }
  ,
  getIncidentStatus : function(callback)
  {
    _log.d("getIncidentStatus");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select * from [dbo].[tblModuleDefinitionSourceList] where SourceID = '"+ 25 + "'";
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("Login: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("Login: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
          if(recordset.length == 0)
          {
            _log.d("Login: User Not Found ");
            callback(false);
            return;
          }else
          {
            _log.d("Login: GOOD " + JSON.stringify(recordset));
            callback(recordset);
            return;
          }
        }
      });
    }); 

  },
  getControlsWithValues_old: function(callback)
  {
    var LoggedInUserID = 1;  //change this to use the actual user
    // _log.d("getControlsWithValues - Start");
    sql.getControls(function (controls, LoggedInUserID)
    {
      // _log.d("Initial Record set:");
      // _log.d(JSON.stringify(controls));
      //
      // _log.d("getControlsWithValues - for loop start");
      for(i = 0; i < controls.length; i++)
      {
        if (controls[i].MultiOptionControl=="true")
        {
          // _log.d("i == " + i);
          // _log.d("initial controls[i]: ");
          // _log.d(JSON.stringify(controls[i].ModuleDefinitionLabel));
          // _log.d("controls[i].ModuleDefinitionSourceID: ");
          // _log.d(controls[i].ModuleDefinitionSourceID);

          sql.getControlValues(controls[i].ModuleDefinitionSourceID, LoggedInUserID, (function (controlValues)
          {
            sql.putControlValuesIntoRecordset(controls, controlValues, function (controls){
              // _log.d("getControlsWithValues - Checkfilled start");
              if (sql.checkFilled(controls))
              {
                // _log.d("Complete recordset: ");
                // _log.d(controls);
                // _log.d("getControlsWithValues - Finished");
                callback(controls);
              }

            });

          }));
        }
      }
      //callback();
    });
  },

  getControls_old: function (cb, LoggedInUserID)
  {
     _log.d("getControls - Start");

    var conParams = config.conParams[GLOBAL.RELEASE];
     _log.d(JSON.stringify(conParams) );

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    // _log.d(JSON.stringify(sqlConfig) );

    var queryString = "Select * from MobileControl";

    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d(err);
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d(err);
          cb(400, err);
        }
        else
        {
          cb(recordset);
        }
      });
    });
  },

  getControlValues: function (SourceID, LoggedInUserID, cb)
  {
    // _log.d("getControlValues - Start");
    // _log.d("SourceID: " + SourceID);
    // _log.d("LoggedInUserID: " + LoggedInUserID);
    //this might not return a value so we need to implement a callback
    var conParams = config.conParams[GLOBAL.RELEASE];
    // _log.d(JSON.stringify(conParams) );

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };
    // _log.d(JSON.stringify(sqlConfig) );

    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d(err);
      }

      var request = new mssql.Request(connection); // or: var request = connection.request();

      request.input('LoggedInUserID', LoggedInUserID);
      request.input('SourceID', SourceID);
      var storedProcedure = '[dbo].[spm_GetControlSourceInformationBySourceID]';
      request.execute(storedProcedure, function (err, recordsets, returnValue)
      {
        if (err)
        {
          _log.d(err);
        }
        else
        {
          // _log.d("i == " + i);
          // _log.d("Control Record set:");
          // _log.d("SourceID: " +SourceID);
          // _log.d("LoggedInUserID: " + LoggedInUserID);
          _log.d(JSON.stringify(recordsets));
          _log.d("attempting to establish hierarchy");
          sql.arrangeControlValuesIntoHeirarchy(recordsets[0], function (retval) {
          _log.d("controlValues (post hierarchy): " + JSON.stringify(retval));
          cb(retval);
          });

        }
      });

    });
  },

  putControlValuesIntoRecordset: function (controls, controlValues, cb)
  {
    // _log.d("putControlValuesIntoRecordset - Start");
    // _log.d("controlValues: " + JSON.stringify(controlValues));
    // _log.d("control SourceID: " + JSON.stringify(controlValues[0].SourceID));

    for(i = 0; i < controls.length; i++)
    {
      if (controls[i].ModuleDefinitionSourceID == controlValues[0].SourceID)
      {
        controls[i].controlValues = controlValues;
        // _log.d("control: " + i + " Control definition" + JSON.stringify(controls[i]));
      }
    }
    // _log.d("putControlValuesIntoRecordset - Finished");
    cb(controls);
  },

  checkFilled: function (controls)
  {
    // _log.d("checkFilled - Start");
    for(i = 0; i < controls.length; i++)
    {
      // _log.d("controls[i].MultiOptionControl: " + controls[i].MultiOptionControl);
      if (controls[i].MultiOptionControl=="true")
      {
        // _log.d("controls[i].controlValues: " + JSON.stringify(controls[i].controlValues));
        if (typeof(controls[i].controlValues) === "undefined")
        {
          // _log.d("Checkfilled: false (controlValues NULL): "  + JSON.stringify(controls[i]));
          return false;
        }
      }
    }
    // _log.d("Checkfilled: true");
    return true;
  },

  arrangeControlValuesIntoHeirarchy: function (controlValues, cb)
  {
    //first identify if the control is a hierarchy
    var isHeirarchy = false;

    var parentNodes = grep(controlValues, function(e){
      _log.d("e.HierarchyLevel: " + JSON.stringify(e.HierarchyLevel));
      return e.HierarchyLevel == 1 || e.HierarchyLevel == null || e.HierarchyLevel == "";
    });
    _log.d(typeof(controlValues[0].SourceListParentID));
    _log.d("parentNodes: " + JSON.stringify(parentNodes));

    if (parentNodes.length === 0)
    {
      _log.d("there are NO parent nodes");
      isHeirarchy = false;
    }
    else
    {
      _log.d("there are parent nodes");
      isHeirarchy = true;
    }

    //if it's a heirarchy arrange the controls accordingly
    if (isHeirarchy) {
      //attach relevant children to the parent nodes

      sql.attachChildrenToParent(parentNodes,controlValues, function (parentNodes) {
        controlValues = parentNodes;
        _log.d("Hierarchical: " + JSON.stringify(controlValues));
      });
    }
    else {
      _log.d("non-Hierarchical: " + JSON.stringify(controlValues));
      //return controlValues;
    }
    cb(controlValues);

  },

  attachChildrenToParent: function (parentNodes, controlValues, done)
  {
    //go through each parent node and attach children
    for(p = 0; p < parentNodes.length; p++)
    {
      _log.d("parentNodes[" + p + "] of : " + parentNodes.length-1 + " (" +  parentNodes[p].SourceListID + " - " + parentNodes[p].SourceList +") HasChild: " + parentNodes[p].HasChild);

      if ((parentNodes[p].HasChild == 1) || (parentNodes[p].HasChild == "1"))
      {
        //get the nodes that belong to this parent
        var nodesToAddAsChildren = grep(controlValues, function(e){
          var isHierachyLvl2 = JSON.stringify(e.HierarchyLevel) == "2";
          var isCorrectParent = JSON.stringify(e.SourceListParentID) == JSON.stringify(parentNodes[p].SourceListID);
          if (parentNodes[p].SourceID == 1050)
          {
          _log.d("e.HierarchyLevel: " + JSON.stringify(e.HierarchyLevel));
          _log.d("e.SourceListParentID: " + JSON.stringify(e.SourceListParentID));
          _log.d("parentNodes[p].SourceListID: " + JSON.stringify(parentNodes[p].SourceListID));
}
          if (isHierachyLvl2 && isCorrectParent)
          {
            if (parentNodes[p].SourceID == 1050)
            {
              _log.d("e.HierarchyLevel: " + JSON.stringify(e.HierarchyLevel));
              _log.d("e.SourceListParentID: " + JSON.stringify(e.SourceListParentID));
              _log.d("parentNodes[p].SourceListID: " + JSON.stringify(parentNodes[p].SourceListID));
            }
            return true;
          }
          else {
            {return false;}
          }
        });

        _log.d("children to add to parent (" + JSON.stringify(parentNodes[p]) + "): " + JSON.stringify(nodesToAddAsChildren));
        //only if there are items do we add the children.
        if (nodesToAddAsChildren.length !=0)
        {
          //add them to the parent
          parentNodes[p].Children = nodesToAddAsChildren;

          for (c = 0; c < parentNodes[p].Children.length; c++)
          {
            if (parentNodes[p].Children[c].SourceID == 1050)
            {
              _log.d("childNode[" + c + "] of : " + parentNodes[p].Children[c].length-1 + " (" +  parentNodes[p].Children[c].SourceListID + " - " + parentNodes[p].Children[c].SourceList +") HasChild: " + parentNodes[p].Children[c].HasChild);
            }

            if (parentNodes[p].Children[c].HasChild == 1)
            {
              var nodesToAddAsChildren1 = grep(controlValues, function(e){
                return e.HierarchyLevel == 3 && e.SourceListParentID == parentNodes[p].Children[c].SourceListID;
              });

              if (nodesToAddAsChildren1.length !=0)
              {
                parentNodes[p].Children[c].Children = nodesToAddAsChildren1;
              }
            }
          }

        }
        if (parentNodes[p].SourceID == 1050)
        {
        _log.d("Final Parent Node: " + JSON.stringify(parentNodes[p]));
      }
      }
    }

    _log.d("pre-Return Hierarchical Parents: " + JSON.stringify(parentNodes[p]));


    if (grep(parentNodes,function(e){return e.HasChild==1 && typeof(e.Children) == "undefined";}).length == 0) {
      _log.d("Return Hierarchical Parents: " + JSON.stringify(parentNodes));
      done(parentNodes);
    }
  }
  ,
  postIncident_old: function(obj, callback)
  {
    _log.d("postIncident - Start");
    _log.d("obj: " + JSON.stringify(obj));
    //this might not return a value so we need to implement a callback
    var conParams = config.conParams[GLOBAL.RELEASE];
    _log.d(JSON.stringify(conParams) );

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };
    _log.d(JSON.stringify(sqlConfig) );

    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d(err);
      }

      var request = new mssql.Request(connection);
                 request.input('SiteID_xml', obj.data.spValues.SiteID_xml);
                 request.input('RiskTypeID_xml', obj.data.spValues.RiskTypeID_xml);
                 request.input('c1E8BCC9E', obj.data.spValues.c1E8BCC9E);
                 request.input('c385D7025', obj.data.spValues.c385D7025);
                 request.input('c3D7380B8', obj.data.spValues.c3D7380B8);
                 request.input('c3E7CF6D4', obj.data.spValues.c3E7CF6D4);
                 request.input('c7C5F61F0', obj.data.spValues.c7C5F61F0);
                 request.input('c85B29C24', obj.data.spValues.c85B29C24);
                 request.input('cA299231D', obj.data.spValues.cA299231D);
                 request.input('cAA24747C', obj.data.spValues.cAA24747C);
                 request.input('cBCDBB162', obj.data.spValues.cBCDBB162);
                 request.input('cBF638E94', obj.data.spValues.cBF638E94);
                 request.input('UserID', obj.data.UserID);
                 request.output('Scope', mssql.BigInt);

      var storedProcedure = '[dbo].[spi_M380_1]';
      request.execute(storedProcedure, function (err, recordsets, returnValue)
      {
        if (err)
        {
          _log.d(err);
        }
        else
        {
          //TODO: Notification triggers use  request.parameters.Scope.value
          //TODO: Checkbox lists

          cb(retval);

        }
      });

    });

  }
}
module.exports = sql;
