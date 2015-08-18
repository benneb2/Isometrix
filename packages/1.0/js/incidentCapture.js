_incidentCapture = {

    model: null,
    incidentStatus : [],
    incidentStatusSelect : null,
    users : [],
    usersSelect : null,
    sites : [],
    siteSelect : null,
    sitePath : null,
    views: [],
    viewSelect : [],
    description : null,
    date: null,
    time: null,
    person:null,
    location:null,
    external:"0",
    externalList:[],
    action: null,
    IncidentCategories:[],
    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;

      _model.getAll('controlService', function(model) {
        if(model.length == 0)
        {
          //alert("DOWNLOAD THE CONTROLLS");
        }
        _.model = model[model.length -1];

        for(var i in _.model.IncidentStatus)
        {
          var item =  _.model.IncidentStatus[i];
           _.incidentStatus.push(item);
        }

        for(var i in _.model.Views)
        {
          var item =  _.model.Views[i];
          item.checked = false;
           _.views.push(item);
        }

        if(_.incidentStatus.length > 0)
        {
          _.incidentStatusSelect = _.incidentStatus[0];
        }

        try{

          for(var i in _.model.ReportedTo)
          {
            var item = _.model.ReportedTo[i];

              user = {
                UserID : item.SourceListID,
                name : item.SourceList,
              }
               _.users.push(user);
          }

          for(var i in _.model.Levels)
          {
            var site = _.model.Levels[i];
             _.sites.push(site);
          }

          for(var i in _.model.External)
          {
            var external = _.model.External[i];
             _.externalList.push(external);
          }

          for(var i in _.model.IncidentCategories)
          {
            var categories = _.model.IncidentCategories[i];
             _.IncidentCategories.push(categories);
          }

          for(var i in _.views)
          {
            var view = _.views[i];
            for(var j in _.IncidentCategories)
            {
              var categories = _.IncidentCategories[j];
              if(view.SourceList == categories.SourceList)
              {
                if (typeof(view.categories ) === "undefined")
                { 
                  view.categories = [];
                }
                view.categories.push(categories);
              }
            }
            
          }

        }catch(err)
        {
          alert(err);
        }
      // _incidentCapture._Ctrl();
      });

      layout.attach('#incidentCaptureStep1');

    },

  getFullLocation: function(id,children)
  {
      var found = false;
      for(var i in children)
      {
        var site = children[i]
        if(site.SiteID == id)
        {
          found = true;
          return site.Site;
        }
      }
      if(found == false)
      {
        for(var i in children)
        {
          var site = children[i]

          if (typeof(site.children) !== "undefined") 
          {
            if(site.children.length > 0)
            {
              var ret = _incidentCapture.getFullLocation(id,site.children);
              if(ret != false)
              {
                return site.Site + " -> " + ret;
              }
              
            }else
            {
              return false;
            }
          }else
          {
            return false;
          }

        }
        return false;
      }

  }
  ,
  didPrep:false
  ,
  didtoggle:false
  ,
  prepareList : function() {

    if(_incidentCapture.didPrep == false)
    {
      _incidentCapture.didPrep = true;

      setTimeout(
      function() {
        _incidentCapture.didPrep = false;
      } , 1000);

      $("#expList").find('li').off("click"); 
      $('#expList').find('li').click( function(event) {

          if(_incidentCapture.locpop != false)
          {
            return;
          }
          

          if (this == event.target) {

            if(_incidentCapture.didtoggle != false)
            {
              return;
            }

            _incidentCapture.didtoggle = true;

            setTimeout(
              function() {
                _incidentCapture.didtoggle = false;
              } , 1000);


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

              $(this).children('div').toggle('medium');
              // _.currScrolls[0].destroy();
              _scroll.add($('#level-scroll')[0]);
              // _.currScrolls[0].refresh();
            }else
            {
              _incidentCapture.hide('popDiv');
              _incidentCapture.siteSelect = $(this).attr("siteId");
              _incidentCapture.sitePath = _incidentCapture.getFullLocation(_incidentCapture.siteSelect,_incidentCapture.sites);
              

             e = document.getElementById('incidentCaptureStep1__FACE');
             scope = angular.element(e).scope();

              _incidentCapture.usersSelect = scope.model.usersSelect;
              _incidentCapture.person = scope.model.person;
              _incidentCapture.location = scope.model.location;

               _incidentCapture._Ctrl();

            }
          }

          return false;
        }).addClass('collapsed').children('div').hide();

      $("#expList").find('x').off("click");
      $('#expList').find('x').click( function(event) {


          if (this == event.target) 
          {
            if(_incidentCapture.didtoggle != false)
            {
              return;
            }

            _incidentCapture.didtoggle = true;

            setTimeout(
              function() {
                _incidentCapture.didtoggle = false;
              } , 1000);

            var li = $(this).closest("li");
            if($(li).has('ul').length)
            {
              $(li).toggleClass('expanded');
              $(li).children('div').toggle('medium');

              if($(li).hasClass( "expanded" ))
              {
                $(li).children('x')[0].innerHTML = '&#xf068;';
              }else
              {
                $(li).children('x')[0].innerHTML = '&#xf067;';
              }
              // _.currScrolls[0].refresh();
              _.currScrolls[0].destroy();
              _scroll.add($('#level-scroll')[0]);
            }

          }
          return false;
        });
    }
    
  },

preparePage3:function()
{
  if(_incidentCapture.didPrep == true)
  {
    return;
  }

  _incidentCapture.didPrep = true;

  setTimeout(
  function() {
    _incidentCapture.didPrep = false;
  } , 1000);

  setTimeout(
      function() {
        try
        {
          _log.d("prepPage3");
          _.currScrolls[0].destroy();
          _scroll.add($('#risk-scroll')[0]);
          _scroll.add($('#risk-scroll2')[0]);
        }catch(err)
        {
          alert("preppage3 " + err);
        }
      } , 1000);

    $("#catList").find('li').off("click");
    $('#catList').find('li').click( function(event) {

      if (this == event.target) {
        if($(this).has('ul').length)
        {
          $(this).toggleClass('expanded');
          if($(this).has('x').length)
          {
            if($(this).hasClass( "expanded" ))
            {
              $(this).children('x')[0].innerHTML = '&#xf067;';
            }else
            {
              $(this).children('x')[0].innerHTML = '&#xf068;';
            } 
          }

          $(this).children('div').toggle('medium');
          _.currScrolls[0].refresh();
        }else
        {
          // _incidentCapture.hide('popDiv');
          // _incidentCapture.siteSelect = $(this).attr("siteId");
          // _incidentCapture.sitePath = _incidentCapture.getFullLocation(_incidentCapture.siteSelect,_incidentCapture.sites);
          // _incidentCapture._Ctrl2();

        }
      }
    }).addClass('collapsed').children('div');//.hide();

    $("#catList").find('x').off("click");
    $('#catList').find('x').click( function(event) {

          if (this == event.target) 
          {
            var li = $(this).closest("li");
            if($(li).has('ul').length)
            {
              $(li).toggleClass('expanded');
              $(li).children('div').toggle('medium');

              if($(li).hasClass( "expanded" ))
              {
                $(li).children('x')[0].innerHTML = '&#xf068;';
              }else
              {
                $(li).children('x')[0].innerHTML = '&#xf067;';
              }
              _.currScrolls[0].refresh();
            }

          }
          return false;
        });

},

currStep : 1,
onMessage : function(data) {
  
  _log.d("onMessage " + data);

  e = document.getElementById('incidentCaptureStep1__FACE');
  scope = angular.element(e).scope();

  if(_incidentCapture.currStep == 1)
  {
    
    _incidentCapture.description = scope.model.description ;
    _incidentCapture.incidentStatusSelect = scope.model.incidentStatusSelect ;
    _incidentCapture.date = scope.model.date;
    _incidentCapture.time = scope.model.time;

  }else if(_incidentCapture.currStep == 2)
  {
     _incidentCapture.usersSelect = scope.model.usersSelect;
     _incidentCapture.person = scope.model.person;
     _incidentCapture.location = scope.model.location;
     _incidentCapture.sitePath = scope.model.sitePath;
     // _incidentCapture.siteSelect = scope.model.siteSelect;
  }else if(_incidentCapture.currStep == 3)
  {
     _incidentCapture.views = scope.model.views;
  }else if(_incidentCapture.currStep == 4)
  {
    _incidentCapture.action = scope.model.action;
    _incidentCapture.external = scope.model.external;
    _incidentCapture.externalList = scope.model.externalList;
  }


    _incidentCapture.currStep = data;
    _incidentCapture._Ctrl();

}
,
Ctrl: function($scope){
  $scope.model = {};
  $scope.currStep = 1;
  $scope.model.show = true;
  $scope.model.description = _incidentCapture.description;
  $scope.model.date = _incidentCapture.date;
  $scope.model.time = _incidentCapture.time;
  $scope.model.incidentStatus = _incidentCapture.incidentStatus;
  $scope.model.incidentStatusSelect = _incidentCapture.incidentStatusSelect;

  $scope.model.users = _incidentCapture.users;
  $scope.model.usersSelect = _incidentCapture.usersSelect;
  $scope.model.person = _incidentCapture.person;
  $scope.model.sites = _incidentCapture.sites;
  $scope.model.location = _incidentCapture.location;
  $scope.model.sitePath = _incidentCapture.sitePath;

  // _incidentCapture.setupPopup();

  $scope.model.views = _incidentCapture.views;
  $scope.model.subViews = [];
  _incidentCapture.preparePage3();


  $scope.model.action = _incidentCapture.action;
  $scope.model.external = _incidentCapture.external;
  $scope.model.externalList = _incidentCapture.externalList;

  setTimeout(
      function() {
        _incidentCapture.prepareList();
      } , 1000);

      setTimeout(
        function() {
          _scroll.add($('#scrollWrapper_incidentCaptureStep1__FACE')[0])
        } , 1000);

  
}
,
_Ctrl: function($scope){

  e = document.getElementById('incidentCaptureStep1__FACE');
      
  scope = angular.element(e).scope();
  scope.$apply(function() 
  {  
    scope.model = {};
    scope.currStep = _incidentCapture.currStep;
    scope.model.description = _incidentCapture.description;
    scope.model.date = _incidentCapture.date;
    scope.model.time = _incidentCapture.time;
    scope.model.incidentStatus = _incidentCapture.incidentStatus;
    scope.model.incidentStatusSelect = _incidentCapture.incidentStatusSelect;

    scope.model.users = _incidentCapture.users;
    scope.model.usersSelect = _incidentCapture.usersSelect;
    scope.model.person = _incidentCapture.person;
    scope.model.sites = _incidentCapture.sites;
    scope.model.location = _incidentCapture.location;
    scope.model.sitePath = _incidentCapture.sitePath;

setTimeout(
    function() {
      _incidentCapture.setupPopup();
    } , 1000);

    

    scope.model.views = _incidentCapture.views;
    scope.model.subViews = [];
    _incidentCapture.preparePage3();


    scope.model.action = _incidentCapture.action;
    scope.model.external = _incidentCapture.external;
    scope.model.externalList = _incidentCapture.externalList;

    setTimeout(
        function() {
          _incidentCapture.prepareList();
        } , 1000);

    setTimeout(
        function() {
          _scroll.add($('#scrollWrapper_incidentCaptureStep1__FACE')[0])
        } , 300);

    });

 
}
,
reloadSubCat : function()
{
  _incidentCapture.preparePage3();
}
,
save: function()
{
  e = document.getElementById('incidentCaptureStep1__FACE');
  scope = angular.element(e).scope();

  if(_incidentCapture.currStep == 1)
  {
    
    _incidentCapture.description = scope.model.description ;
    _incidentCapture.incidentStatusSelect = scope.model.incidentStatusSelect ;
    _incidentCapture.date = scope.model.date;
    _incidentCapture.time = scope.model.time;

  }else if(_incidentCapture.currStep == 2)
  {
     _incidentCapture.usersSelect = scope.model.usersSelect;
     _incidentCapture.person = scope.model.person;
     _incidentCapture.location = scope.model.location;
     _incidentCapture.sitePath = scope.model.sitePath;
     // _incidentCapture.siteSelect = scope.model.siteSelect;
  }else if(_incidentCapture.currStep == 3)
  {
     _incidentCapture.views = scope.model.views;
  }else if(_incidentCapture.currStep == 4)
  {
    _incidentCapture.action = scope.model.action;
    _incidentCapture.external = scope.model.external;
    _incidentCapture.externalList = scope.model.externalList;

    _incidentCapture.submitData();
  }

},
submitData : function()
{
  try
      {

        var data = { 
          userID : _login.roles,
          description : _incidentCapture.description,
          incidentStatusSelect : _incidentCapture.incidentStatusSelect.SourceListID,
          date : _incidentCapture.date,
          time : _incidentCapture.time,
          usersSelect : _incidentCapture.usersSelect.UserID,
          person : _incidentCapture.person,
          location : _incidentCapture.location,
          siteSelect : _incidentCapture.siteSelect,
          // //views : _incidentCapture.views,
          action : _incidentCapture.action,
          external : 3200,
          // //externalList : _incidentCapture.externalList,

        };

        if(_incidentCapture.external == 1)
        {
          data.external = 3201;
        }

        var jobData = { action:'postIncident', data: data};

        var JOB = {
          jobName: "Name",
          jobDesc: _incidentCapture.description,
          data: jobData,
          allowDuplicate: true,
          clearOnDone: false,
        };
      
        _log.d("JOB = " + JSON.stringify(JOB));
        jobid = jobQueue.add(JOB);

        data.incidentStatusSelectString = _incidentCapture.incidentStatusSelect.SourceList;
        data.userSelectString = _incidentCapture.usersSelect.name;
        data.sitePath = _incidentCapture.sitePath;

        if(_incidentCapture.external == 0)
          data.externalString = "Yes";
        else
          data.externalString = "No";

        _log.d(JSON.stringify(data));
        _model.set("reportHistory",
            data,
            function()
             {  
                alert('Save Successful');
                try{
                  _incidentCapture.description = null;
                  _incidentCapture.incidentStatusSelect = null;
                  _incidentCapture.date = null;
                  _incidentCapture.time = null;
                  _incidentCapture.usersSelect = null;
                  _incidentCapture.person = null;
                  _incidentCapture.location = null;
                  _incidentCapture.sitePath = null;
                  _incidentCapture.siteSelect = null;
                  _incidentCapture.views = null;
                  _incidentCapture.action = null;
                  _incidentCapture.external = null;
                  _incidentCapture.externalList = null;

                  if(_incidentCapture.incidentStatus.length > 0)
                  {
                    _incidentCapture.incidentStatusSelect = _incidentCapture.incidentStatus[0];
                  }
                }catch(err)
                {
                  alert(err);
                }

                _incidentCapture.onMessage(1);
             }
           );



      }catch(err)
      {

          alert(err);

      }
}
,
nextStep : function()
{
  _log.d("nextStep " + _incidentCapture.currStep + " " + (_incidentCapture.currStep + 1));
  _incidentCapture.onMessage(_incidentCapture.currStep + 1);
}
,
prevStep : function()
{
  _log.d("prevStep " + _incidentCapture.currStep + " " + (_incidentCapture.currStep - 1));
  _incidentCapture.onMessage(_incidentCapture.currStep - 1);
}
,
didLocPop:false
,
setupPopup : function()
{

  if(_incidentCapture.didLocPop == false)
  {
    _incidentCapture.didLocPop = true;

    setTimeout(
    function() {
      _incidentCapture.didLocPop = false;
    } , 1000);

    var evt = _util.getEvt();
    $(".locationOccurred").off(evt);
    $('.locationOccurred').on(evt, function () {
          var me = $(this);
          _incidentCapture.handlePopup(me);   
     });
  }

},

handlePopup : function()
{
  try{
      
        _incidentCapture.pop('popDiv');

      }catch(err)
      {
        alert(err);
      }
}, 
locpop: null, 
pop : function(div) {
     _incidentCapture.locpop = true;
      document.getElementById(div).style.display = 'block';
      _.currScrolls[0].destroy();
      _scroll.add($('#level-scroll')[0]);

      setTimeout(
    function() {
      _incidentCapture.locpop = false;
    } , 1000);
  },
hide : function(div) {

    if(_incidentCapture.locpop == false)
    {
      document.getElementById(div).style.display = 'none';
      _.currScrolls[0].destroy();
      _scroll.add($('#scrollWrapper_incidentCaptureStep1__FACE')[0])
    }
    
  },
};
;;
