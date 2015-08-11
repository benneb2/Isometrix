_example = {

    model: null,

    onExit : function() { var _ = this;




    },

    onLoaded: function () { var _ = this;





    },

    onMessage : function() {



    },



};
;;
_help = {

    model: null,

    onExit : function() { var _ = this;




    },

    onLoaded: function () { var _ = this;





    },

    onMessage : function() {



    },



};
;;

_incidentCapture = {

    model: null,
    incidentStatus : [],
    incidentStatusSelect : null,
    users : [],
    usersSelect : null,
    sites : [],
    siteSelect : null,
    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;


      _model.getAll('controlService', function(model) {

        if(model.length == 0)
        {
          alert("DOWNLOAD THE CONTROLLS");
        }
        _incidentCapture.model = model[0];

        for(var i in _incidentCapture.model.incidentStatus)
        {
          var item = _incidentCapture.model.incidentStatus[i];

          if(item.SourceID == 25)
          {
             _.incidentStatus.push(item);
          }
        }
        if(_.incidentStatus.length > 0)
        {
          _.incidentStatusSelect = _.incidentStatus[0];
        }

        for(var i in _incidentCapture.model.users)
        {
          var item = _incidentCapture.model.users[i];
          user = {
            UserID : item.UserID,
            name : item.FirstName + " " + item.LastName,
          }
           _.users.push(user);
        }

        for(var i in _incidentCapture.model.sites)
        {
          var site = _incidentCapture.model.sites[i];
          
           _.sites.push(site);
        }
      // _incidentCapture._Ctrl();
      });

      layout.attach('#incidentCaptureFront');
      layout.attach('#incidentCaptureStep1');
      layout.attach('#incidentCaptureStep2');
      layout.attach('#incidentCaptureStep3');
      layout.attach('#incidentCaptureStep4');
      layout.attach('#incidentCaptureComplete');

    },
  didPrep:false,
  prepareList : function() {
    if(_incidentCapture.didPrep == false)
    {
      
      setTimeout(
      function() {
        _incidentCapture.didPrep = false;
      } , 1000);

      $('#expList').find('li').click( function(event) {

            if (this == event.target) {
              if($(this).has('ul').length)
              {
                
                $(this).toggleClass('expanded');
                if($(this).has('x').length)
                {
                  if($(this).hasClass( "expanded" ))
                  {
                    $(this).children('x')[0].innerHTML = '&#xf068;';
                  }else
                  {
                    $(this).children('x')[0].innerHTML = '&#xf067;';
                  }
                  
                }

                $(this).children('ul').toggle('medium');
              }else
              {
                alert("END ITEM");
              }
          }
          
          return false;
        }).addClass('collapsed').children('ul').hide();

      $('#expList').find('x').click( function(event) {

          if (this == event.target) 
          {
            var li = $(this).closest("li");
            if($(li).has('ul').length)
            {
              $(li).toggleClass('expanded');
              $(li).children('ul').toggle('medium');

              if($(li).hasClass( "expanded" ))
              {
                $(li).children('x')[0].innerHTML = '&#xf068;';
              }else
              {
                $(li).children('x')[0].innerHTML = '&#xf067;';
              }

            }

          }
          
          return false;
        });
    }
    
  },


currStep : 0,
onMessage : function(data) {
  currStep = data;
  _incidentCapture.FlipCard('incidentCaptureStep' + data,false);

},

Ctrl: function($scope){

},

Ctrl1: function($scope){
  $scope.model = {};
  $scope.model.incidentStatus = _incidentCapture.incidentStatus;
  $scope.model.incidentStatusSelect = _incidentCapture.incidentStatusSelect;
},

_Ctrl: function($scope){
  // e = document.getElementById('barcodeFront__FACE');
      
  //     scope = angular.element(e).scope();
      
  //     scope.$apply(function() 
  //     {  
  //         scope.incidentStatus = _incidentCapture.incidentStatus;
  //     });
},

Ctrl2: function($scope){
$scope.model = {};
$scope.model.users = _incidentCapture.users;
$scope.model.usersSelect = _incidentCapture.usersSelect;
},

Ctrl4: function($scope){

  
  $scope.model = {};
  $scope.model.sites = _incidentCapture.sites;

  setTimeout(
      function() {
        _incidentCapture.prepareList();
      } , 1000);
  
  
},

save: function(step)
{
  if(step == 1)
  {
    e = document.getElementById('incidentCaptureStep1__FACE');
    scope = angular.element(e).scope();
    alert("save " + scope.model.incidentStatusSelect.SourceList);

  }else if(step == 2)
  {
    alert("SAVE2");
    e = document.getElementById('incidentCaptureStep2__FACE');
    scope = angular.element(e).scope();
    alert("save " + scope.model.usersSelect.name);

  }

},
FlipCard: function(flipTarget, cb){

      _cardEngine.flip("incidentCapture" , flipTarget, function(release) {

      _log.d("Flip Target:");
      _log.d(flipTarget);
      release();
      layout.attach('#'+flipTarget);

      if(cb) {
        cb();
      }
    });
  },

};
;;

_incidentSteps = {

    model : [ ],

    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;

    },

    onMessage : function() {

    },

    Ctrl : function($scope)
    {

    },

    _Ctrl : function()
  	{

  }
};
;;
_landing = {

    model : [ ],

    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;


    	 _model.getAll('landing', function(model) {
    	 	_landing.model = model;
    	 });

    	 layout.attach('#landingFront');

		setTimeout(
			function() {
				_landing._Ctrl();
			}	, 1000);

    },

    onMessage : function() {


    },

    Ctrl : function($scope)
    {
    	$scope.data = _landing.model;
    },

    _Ctrl : function()
  	{
	    e = document.getElementById('landingFront__FACE');

	    scope = angular.element(e).scope();

	    scope.$apply(function()
	    {
	       scope.data = _landing.model;
	    });
  },



};
;;
_logo = {

    model: null,

    onExit : function() { var _ = this;




    },

    onLoaded: function () { var _ = this;





    },

    onMessage : function() {



    },

Ctrl : function($scope){},

};
;;

_reportHistory = {

    model: null,

    onExit : function() { var _ = this;




    },

    onLoaded: function () { var _ = this;





    },

    onMessage : function() {



    },



};
;;

_showControls = {

  model: [],

  onExit : function()
  {
    var _ = this;
  },

  onLoaded: function ()
  {
    var _ = this;
    //_model.getAll(name of service in config, anan funct  )
    _model.getAll('controlService', function(controlService){
      _showControls.model=controlService;
      layout.attach('#showControlsFront');
    });
  },

  onMessage : function()
  {

  },

  getAll: function($scope)
  {
    $scope.controls = _showControls.model;
    $scope.isControlValueChecked = function(controlGUID, sourceList)
    {
      _log.d("isControlValueChecked - start");
      // _log.d("checking control: " + JSON.stringify(passedInScope));
      _log.d("sourceList: " + JSON.stringify(sourceList));
      if (controlGUID == "" || controlGUID == null)
      {
        _log.d("No control GUID: ");
        return true;
      }
      _log.d("trying to find control with GUID: " + controlGUID);
      var control = $.grep($scope.controls, function(e){ return e.GUID == controlGUID; });
      _log.d("the following control(s) was found: " + JSON.stringify(control));

      if (control.length == 0)
      {
        _log.d("no valid control found");
        return false;
      }
      else if (control.length == 1)
      {
        _log.d("control is a valid control");
        _log.d("trying to find source List: " + sourceList + " in control");
        _log.d(JSON.stringify(control[0].controlValues));
        var sourceListItem = $.grep(control[0].controlValues, function(f){
          _log.d("compare source List: '" + sourceList + "' to '" + f.SourceList + "' with result: " + f.SourceList == sourceList);
          return f.SourceList == sourceList;
        });
        _log.d("the following source List item was found: " + JSON.stringify(sourceListItem));
        if (sourceListItem.length == 0)
        {
          _log.d("sourceListItem is not a valid item");
          return false;
        }
        else if (sourceListItem.length == 1)
        {
          _log.d("sourceListItem is a valid item");
          _log.d(JSON.stringify(sourceListItem[0]));
          if (typeof(sourceListItem[0].isChecked) == "undefined")
          {
            _log.d("isChecked is undefined");
            return false;
          }
          _log.d("returning Checked status: "+JSON.stringify(sourceListItem[0].isChecked));
          _log.d(sourceListItem[0].isChecked);
          _log.d(sourceListItem[0].isChecked == true);
          return sourceListItem[0].isChecked;
        }
        else {
          // multiple items found
          _log.d("multiple control values found with source List: " + sourceList);
          return false;
        }
      }
      else
      {
        // multiple items found
        _log.d("multiple controls found with GUID: " + controlGUID);
        return false;
      }
    };
    $scope.CreatePostingObject = function (){
      var spValues = [];
      var cbLists = [];
      for(c = 0; c < $scope.controls.length; c++)
      {
        //Checkbox List controls need  to be added using [dbo].[spi_M380_1_CheckboxList], so we make a seperate list for them
        var controlGUID = $scope.controls[c].GUID;
        var controlValue = $scope.controls[c].value;
        if ( $scope.controls[c].ModuleDefinitionType != "Checkbox List")
        {
          switch (controlGUID)
          {
            case 'F61463A0':
            controlGUID = 'RiskTypeID_xml';
            controlValue = "<rt>";
            for (var v = 0; v < $scope.controls[c].controlValue; v++)
            {
              if ($scope.controls[c].controlValue[v].isChecked)
              {
                controlValue += "<r id=\" \" riskTypeId=\"" + $scope.controls[c].controlValue[v].SourceListID + "\">";
              }
            }
            controlValue += "</rt>";
            break;
            case '385D7025': //SiteID has 2 values that need to get added
            //we add the default one
            spValues.push({controlGUID : controlValue});
            //and then we make another one for the XML that will get added after the switch
            controlGUID = "SiteID_xml";
            controlValue = "<st><s id=\"\" siteId=\"" +$scope.controls[c].value + "\"></st>";
            break;
            default:
            //do nothing
            break;
          }
          spValues.push({controlGUID : controlValue});

        }
        else
        {
          controlGUID = $scope.controls[c].GUID;
          controlValue = "<chl>";
          for (var cb = 0; cb < $scope.controls[c].controlValue; cb++)
          {
            if ($scope.controls[c].controlValue[cb].isChecked){
              controlValue += "<c id=\"" + cb + "\" moduleDefinitionID=\"" + $scope.controls[c].ModuleDefinitionID + "\" sourceID=\"" + $scope.controls[c].ModuleDefinitionSourceID + "\" sourceListID=\"" + $scope.controls[c].controlValue[cb].SourceListID + "\">";
            }
          }
          controlValue += "</chl>";
          cbLists.push({controlGUID : controlValue});

        }
      }
      var retval = {"cbLists" : cbLists , "spValues" : spValues};
      _log.d(JSON.stringify(retval));
      return retval;
    };
  },
  sendJob : function($scope,name,description,allowDuplicate,clearOnDone,lockUI,cb)
  {
    _log.d("Send job to queue");
    if(typeof name == 'undefined') {  name = "JOB NAME " + code; }
    if(typeof description == 'undefined') {  description = "JOB DESC "; }
    if(typeof allowDuplicate == 'undefined') {  allowDuplicate = false; }
    if(typeof clearOnDone == 'undefined') {  clearOnDone = false; }
    if(typeof lockUI == 'undefined') {  lockUI = false; }
    if(typeof cb == 'undefined') {  cb = false; }


    try
    {

      response = $scope.CreatePostingObject;
      _log.d("Job Data: " + JSON.stringify(response));
      jobData = { action:'postIncident', data: response};

      JOB = {
        jobName: name,
        jobDesc: description,
        data: jobData,
        allowDuplicate: allowDuplicate,
        clearOnDone: clearOnDone,
        lockUI: lockUI,
        callback: cb,
      };

      _log.d("JOB = " + JSON.stringify(JOB));
      jobQueue.add(JOB);



    }catch(err)
    {

      alert(err);

    }

  }

};
;;