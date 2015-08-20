_incidentCapture = {

    model: null,
    incidentStatus : [],
    incidentStatusSelect : null,
    users : [],
    usersSelect : null,
    sites : [],
    siteSelect : 1,
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
    currJobs : [],
    token : null,
    onExit : function() { var _ = this;
      alert("onexit ");
    },

    onLoaded: function () { var _ = this;

      layout.currLayoutID = "startPage";


      try{
        _incidentCapture.currStep = 1;
        _incidentCapture.description = null;
        _incidentCapture.incidentStatusSelect = null;
        _incidentCapture.date = null;
        _incidentCapture.time = null;
        _incidentCapture.usersSelect = null;
        _incidentCapture.person = null;
        _incidentCapture.location = null;
        _incidentCapture.sitePath = null;
        _incidentCapture.siteSelect = 1;
        // _incidentCapture.views = null;
        _incidentCapture.action = null;
        _incidentCapture.external = 0;
        // _incidentCapture.externalList = null;

        if(_incidentCapture.incidentStatus.length > 0)
        {
          _incidentCapture.incidentStatusSelect = _incidentCapture.incidentStatus[0];
        }
      }catch(err)
      {
        alert(err);
      }

      _model.getAll('incidentStatus', function(model) {
          _log.d("incidentStatus " + model.length);
          _.incidentStatus = model;
          if(_.incidentStatus.length > 0)
          {
            _.incidentStatusSelect = _.incidentStatus[0];
          }

          _incidentCapture._Ctrl();
      });

      _model.getAll('incidentUsers', function(model) {
          _log.d("incidentUsers " + model.length);
          _.users = model;
      });

      _model.getAll('incidentLevels', function(model) {
          _log.d("incidentLevels " + model.length);
          _.sites = _.buildTree(model,0);
      });

      _model.getAll('incidentViews', function(model) {
          _log.d("incidentViews " + model.length);
          for(var i in model)
          {
            var item =  model[i];
            item.checked = false;
             _.views.push(item);
             // alert("views " + item.SourceList);
          }

          _model.getAll('incidentCategory', function(model) {
            _log.d("incidentCategory " + model.length);
            _.IncidentCategories = _.buildCatTree(model,0);

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
        });

      });

      _model.getAll('externalParty', function(model) {
          _log.d("externalParty " + model.length);
          _.externalList = model;
      });

      layout.attach('#incidentCaptureStep1');

    }
    ,
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


            // if($(this).has('ul').length)
            // {
            //   $(this).toggleClass('expanded');
            //   if($(this).has('x').length)
            //   {
            //     if($(this).hasClass( "expanded" ))
            //     {
            //       $(this).children('x')[0].innerHTML = '&#xf068;';
            //     }else
            //     {
            //       $(this).children('x')[0].innerHTML = '&#xf067;';
            //     } 
            //   }

            //   $(this).children('div').toggle('medium');

            //   setTimeout(
            //     function() {
            //       _scroll.buffer['level-scroll'].refresh();
            //     } , 500);

            // }else
            {
              _incidentCapture.hide('popDiv');
              _incidentCapture.siteSelect = $(this).attr("siteId");
              _incidentCapture.sitePath = _incidentCapture.getFullLocation(_incidentCapture.siteSelect,_incidentCapture.sites);
              

             e = document.getElementById('incidentCaptureStep1__FACE');
             scope = angular.element(e).scope();

              _incidentCapture.usersSelect = scope.model.usersSelect;
              _incidentCapture.person = scope.model.person;
              _incidentCapture.location = scope.model.location;

               // _incidentCapture._Ctrl();
              scope.$apply(function() 
              {  
                scope.model.sitePath = _incidentCapture.sitePath;
              });

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

              setTimeout(
                function() {
                  _.currScrolls[0].refresh();
                  _scroll.buffer['level-scroll'].refresh();
                } , 500);
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
          // _.currScrolls[0].refresh();
          setTimeout(
            function() {
              _scroll.buffer['risk-scroll2'].refresh();
            } , 300);
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
                $(li).children('x')[0].innerHTML = '&#xf067;';
              }else
              {
                $(li).children('x')[0].innerHTML = '&#xf068;';
              }
              setTimeout(
                function() {
                  _scroll.buffer['risk-scroll2'].refresh();
                } , 300);
              // _.currScrolls[0].refresh();
            }

          }
          return false;
        });

},

currStep : 1,
onMessage : function(data) {
  

  _log.d("onMessage " + data);

  if(data > 4 || data < 1)
  {
    _log.d("onMessage Step does not exist " + data);
    return;
  }

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
    if(_incidentCapture.currStep == 3)
    {
      _incidentCapture.preparePage3();
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

    }else if(_incidentCapture.currStep == 4)
    {
      setTimeout(
      function() {
        try
        {
          _log.d("prepPage4");
          _.currScrolls[0].destroy();
          _scroll.add($('#exParty-scroll')[0]);
        }catch(err)
        {
          alert("preppage3 " + err);
        }
      } , 1000);
    }
    


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
   setTimeout(
        function() {
          _scroll.buffer['risk-scroll2'].refresh();
        } , 300);
}
,
reloadExParty : function()
{
  setTimeout(
        function() {
          _scroll.buffer['exParty-scroll'].refresh();
        } , 300);
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


        var riskTypeID_xml = '<rt>';
        for(var i in _incidentCapture.views )
        {
          var view = _incidentCapture.views[i];
          if(view.checked)
          {
            
            riskTypeID_xml = riskTypeID_xml + '<r id="" riskTypeId="'+view.SourceListID+'" />';
            _incidentCapture.viewSelect.push(view.SourceList);
          }
        }
        riskTypeID_xml = riskTypeID_xml + '</rt>';

        var data = { 
          userID : _login.roles,
          description : _incidentCapture.description,
          incidentStatusSelect : _incidentCapture.incidentStatusSelect.SourceListID,
          date : _incidentCapture.date,
          time : _incidentCapture.time,
          usersSelect : _incidentCapture.usersSelect.SourceListID,
          person : _incidentCapture.person,
          location : _incidentCapture.location,
          siteSelect : _incidentCapture.siteSelect,
          // //views : _incidentCapture.views,
          riskTypeID_xml: riskTypeID_xml,
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

        data.key = jobid;
        data.incidentStatusSelectString = _incidentCapture.incidentStatusSelect.SourceList;
        data.userSelectString = _incidentCapture.usersSelect.SourceList;
        data.sitePath = _incidentCapture.sitePath;
        data.ID = "";
        data.status = "";

        if(_incidentCapture.external == 0)
          data.externalString = "Yes";
        else
          data.externalString = "No";

        _incidentCapture.currJobs.push(data);

        _log.d(JSON.stringify(data));
        _model.set("reportHistory",
            data,
            function()
             {  
                alert('Save Successful');
             }
           );



      }catch(err)
      {

          alert(err);

      }
}
,
buildTree: function(elements,parentId) 
{
  
  var branch = [];

  for (var i in elements) {
    var element = elements[i];

      if (element.SourceListParentID == parentId) {
          children = _incidentCapture.buildTree(elements, element.SourceListID);
    
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
buildCatTree: function(elements,parentId) 
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
nextStep : function()
{
  _log.d("nextStep " + _incidentCapture.currStep + " " + (_incidentCapture.currStep + 1));
  _incidentCapture.onMessage(_incidentCapture.currStep + 1);
  layout.sendMessage('incidentSteps',_incidentCapture.currStep,false);
}
,
prevStep : function()
{
  _log.d("prevStep " + _incidentCapture.currStep + " " + (_incidentCapture.currStep - 1));
  _incidentCapture.onMessage(_incidentCapture.currStep - 1);
  layout.sendMessage('incidentSteps',_incidentCapture.currStep ,false);
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


      // setTimeout(
    // function() {
      _scroll.buffer['scrollWrapper_incidentCaptureStep1__FACE'].destroy();
      _.currScrolls[0].destroy();
      _scroll.add($('#level-scroll')[0]);
      _scroll.buffer['level-scroll'].refresh();
    // } , 300);
    
_.currScrolls[0].vScrollbar= true;

_incidentCapture.levelScroll = new iScroll($('#level-scroll')[0], {
                            onBeforeScrollStart: function (e) {
                                e.stopPropagation();
                            },
                            preventDefaultException: {tagName: /.*/},
                            mouseWheel: true,
                            scrollbars: true,
                            keyBindings: false,
                            deceleration: 0.0002
                        });

  _.currScrolls[0] = _incidentCapture.levelScroll;


      setTimeout(
    function() {
      _incidentCapture.locpop = false;
    } , 1000);
  },
hide : function(div) {

    if(_incidentCapture.locpop == false)
    {
      document.getElementById(div).style.display = 'none';
      _scroll.buffer['level-scroll'].destroy();
      _scroll.add($('#scrollWrapper_incidentCaptureStep1__FACE')[0])
    }
    
  },
};
;;
