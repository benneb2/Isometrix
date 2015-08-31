_incidentCapture = {

    model: null,
    incidentStatus : [],
    incidentStatusSelect : "",
    users : [],
    usersSelect : "",
    sites : [],
    siteSelect : "",
    sitePath : "",
    views: [],
    viewSelect : [],
    description : "",
    date: "",
    time: "",
    person:"",
    location:"",
    external:"0",
    externalList:[],
    action: "",
    IncidentCategories:[],
    rawIncidentCategories:[],
    currJob : "",
    currKey:"",
    showing:false, 
    riskScroll:null,
    riskScroll2:null,
    currStep : 1,
    step1:false,
    step2:false,
    step3:false,
    step4:false,
onExit:function(){
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
  _incidentCapture.saveCurrData();

},
    

    onLoaded: function () { var _ = this;

      _log.d("onloaded");
      
      $('#incidentCaptureStep1__FACE').off().on('click',function()
        {
          // alert("hide keybord");
          try
          {
            keyboard.hide();
          }catch(err)
          {
            _log.d("Hide error " + err);
          }
        });

      if(!isTablet)
      {
        $( "._tr" ).remove();
        $( "._tl" ).removeAttr("style");
        $( "._tl" ).removeAttr("ontouchend");
        $( "._tl").off().on('touchstart');
        $('#textArea').attr("rows","2")
        $('.stepBtn').off()
        .on('touchstart', function() { 
          $(this).css({opacity:0.2}) ;
      // setTimeout(
      // function() {
      //   $(this).css({opacity:1}); window.scrollTo(0,0); 
      // } , 1000);
    })
        .on('touchend', function() { $(this).css({opacity:1}); window.scrollTo(0,0); });

      }

      $('._br').off().on('touchstart');
      $('._br').off().on('touchend');

      $('._bl').off()
      .on('touchstart', function() {
        $(this).css({opacity:0.2}) ;        
      })
      .on('touchend', function() { 
        $(this).css({opacity:1}); window.scrollTo(0,0); 
        _incidentCapture.prevStep();});


      $('._brS').off()
      .on('touchstart', function() {
        $(this).css({opacity:0.2}) ;        
      })
      .on('touchend', function() { 
        $(this).css({opacity:1}); window.scrollTo(0,0); 
        _incidentCapture.save();});

      $('._brN').off()
      .on('touchstart', function() { 
        $(this).css({opacity:0.2}) ;
        // _incidentCapture.nextStep();
      //   setTimeout(
      // function() {
      //   $(this).css({opacity:1}); window.scrollTo(0,0); 
      // } , 1000);

      })
      .on('touchend', function() {
       $(this).css({opacity:1}); window.scrollTo(0,0); 
       _incidentCapture.nextStep();});

      layout.sendMessage('incidentSteps',_incidentCapture.currStep,false);
      layout.currLayoutID = "showControls";

      if (_startPage.currPage == "incidentCapture" ) 
      {
        _log.d("clearPage");

        navigator.notification.confirm("Click OK to create a New Incident.", function(idx) {
          if(idx == 1)
          {
             _incidentCapture.clearPage(); 
             _incidentCapture._Ctrl();
          }
        });
        
      }else if( _startPage.needsClear == true)
      {
        _startPage.needsClear = false;
        _log.d("clearPage");
        _incidentCapture.clearPage();
      }

      _startPage.currPage= "incidentCapture";

      _model.getAll('incidentStatus', function(model) {
          _log.d("incidentStatus " + model.length);
          _.incidentStatus = model;
          if(_.incidentStatus.length > 0)
          {
            _.incidentStatusSelect = _.incidentStatus[0];
          }

          _model.getAll('incidentUsers', function(model) {
              _log.d("incidentUsers " + model.length);
              _.users = model;

               _model.getAll('incidentLevels', function(model) {
                    _log.d("incidentLevels " + model.length);
                    _.sites = _.buildTree(model,0);

                    _model.getAll('externalParty', function(model) {
                        _log.d("externalParty " + model.length);
                        _.externalList = model;

                         _model.getAll('incidentViews', function(model) {
                              _log.d("incidentViews " + model.length);
                              _.views = [];
                              for(var i in model)
                              {
                                var item =  model[i];
                                item.checked = false;
                                 _.views.push(item);
                                 // alert("views " + item.SourceList);
                              }

                              _model.getAll('incidentCategory', function(model) {
                                _log.d("incidentCategory " + model.length);
                                // _.rawIncidentCategories = model;
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
                          
                                if(_.showing == false)
                                {
                                  _.showing = false;
                                  _incidentCapture.loadCurrData();
                                }

                            });

                          });

                    });

                });
          });

          
      });

      layout.attach('#incidentCaptureStep1');
      _.initScrolls();
    }
    ,
    initScrolls:function()
    {

      _incidentCapture.riskScroll = new iScroll($('#risk-scroll')[0], {
          onBeforeScrollStart: function (e) {
              e.stopPropagation();
          },
          preventDefaultException: {tagName: /.*/},
          mouseWheel: true,
          scrollbars: true,
          keyBindings: false,
          deceleration: 0.0002
      });

      _incidentCapture.riskScroll2 = new iScroll($('#risk-scroll2')[0], {
          onBeforeScrollStart: function (e) {
              e.stopPropagation();
          },
          preventDefaultException: {tagName: /.*/},
          mouseWheel: true,
          scrollbars: true,
          keyBindings: false,
          deceleration: 0.0002
      });

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

          
      _incidentCapture.exPartyScroll = new iScroll($('#exParty-scroll')[0], {
          onBeforeScrollStart: function (e) {
              e.stopPropagation();
          },
          preventDefaultException: {tagName: /.*/},
          mouseWheel: true,
          scrollbars: true,
          keyBindings: false,
          deceleration: 0.0002
      });

      _incidentCapture.testScroll = new iScroll($('#test-scroll')[0], {
          onBeforeScrollStart: function (e) {
              e.stopPropagation();
          },
          preventDefaultException: {tagName: /.*/},
          // mouseWheel: true,
          // scrollbars: false,
          hScrollbar:false, 
          vScrollbar:false,
          hideScrollbar: true,
          keyBindings: false,
          deceleration: 0.0002
      });
      _incidentCapture.testScroll.hScrollbar = false;
      _incidentCapture.testScroll.options.hScrollbar = false;

    }
    ,
    clearPage: function()
    {
      _log.d("clearPage");

      _model.nuke("currData", function() {  
        _log.d("Delete successful currData");
      });

      try{
        layout.sendMessage('incidentSteps',1,false);
        _incidentCapture.currKey = _util.getUnique();
        _incidentCapture.currJob = "";
        _incidentCapture.currStep = 1;
        _incidentCapture.description = "";
        _incidentCapture.incidentStatusSelect = "";
        _incidentCapture.date = "";
        _incidentCapture.time = "";
        _incidentCapture.usersSelect = "";
        _incidentCapture.person = "";
        _incidentCapture.location = "";
        _incidentCapture.sitePath = "";
        _incidentCapture.siteSelect = "";
        // _incidentCapture.views = null;
        _incidentCapture.action = "";
        _incidentCapture.external = 0;
        // _incidentCapture.externalList = null;
        _incidentCapture.IncidentCategories = JSON.parse(JSON.stringify(_incidentCapture.IncidentCategories).replace(new RegExp("\"checked\":true", 'g'), "\"checked\":false"));
        _incidentCapture.views = JSON.parse(JSON.stringify(_incidentCapture.views).replace(new RegExp("\"checked\":true", 'g'), "\"checked\":false"));
        _incidentCapture.externalList = JSON.parse(JSON.stringify(_incidentCapture.externalList).replace(new RegExp("\"checked\":true", 'g'), "\"checked\":false"));

        if(_incidentCapture.incidentStatus.length > 0)
        {
          _incidentCapture.incidentStatusSelect = _incidentCapture.incidentStatus[0];
        }
      }catch(err)
      {
        alert(err);
      }
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

        _log.d("explist.click");
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }

          event.stopPropagation();
          if(_incidentCapture.locpop != false)
          {
            return false;
          }
          
          if (this == event.target) 
          {

            // if(_incidentCapture.didtoggle != false)
            // {
            //   return false;
            // }

            // _incidentCapture.didtoggle = true;

            // setTimeout(
            //   function() {
            //     _incidentCapture.didtoggle = false;
            //   } , 300);

           // _incidentCapture.clicksAllowed = false;
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
            setTimeout(
              function() {
                _incidentCapture.testScroll.refresh();
              } , 1000);
            return false;
          }

          return false;
        }).addClass('collapsed').children('div').hide();

      $("#expList").find('x').off("click");
      $('#expList').find('x').click( function(event) {

          if (this == event.target) 
          {
            event.stopPropagation();

            if(_incidentCapture.didtoggle != false)
            {
              return false;
            }

            _incidentCapture.didtoggle = true;

            setTimeout(
              function() {
                _incidentCapture.didtoggle = false;
              } , 600);

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
                  _incidentCapture.levelScroll.refresh();
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

        if(_incidentCapture.didtoggle != false)
            {
              return false;
            }

            _incidentCapture.didtoggle = true;

            setTimeout(
              function() {
                _incidentCapture.didtoggle = false;
              } , 600);


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
          setTimeout(
            function() {
              _incidentCapture.riskScroll2.refresh();
            } , 600);
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
            
            if(_incidentCapture.didtoggle != false)
            {
              return false;
            }

            _incidentCapture.didtoggle = true;

            setTimeout(
              function() {
                _incidentCapture.didtoggle = false;
              } , 600);

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
                  _incidentCapture.riskScroll2.refresh();
                } , 600);
              // _.currScrolls[0].refresh();
            }

          }
          return false;
        });

},

onMsg : false,
onMessage : function(data) {
  
  if(_incidentCapture.onMsg == true)
  {
    return;
  }
  _incidentCapture.onMsg = true;

  setTimeout(
  function() {
    _incidentCapture.onMsg = false;
  } , 5000);

  if(!_incidentCapture.checkValid(_incidentCapture.currStep))
  {
    layout.sendMessage('incidentSteps',_incidentCapture.currStep,false);
    return;
  }
  
  _log.d("onMessage " + data);

  if(data > 4 || data < 1)
  {
    _log.d("onMessage Step does not exist " + data);
    return;
  }

  e = document.getElementById('incidentCaptureStep1__FACE');
  scope = angular.element(e).scope();

  // scope.$apply(function() 
  // { 
  //   scope.currStep = 0;

  // });

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
  _incidentCapture.saveCurrData();
  
  _incidentCapture._Ctrl();

}
,
Ctrl: function($scope){
  $scope.isTablet = isTablet;
  $scope.model = {};
  $scope.currStep = _incidentCapture.currStep;
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

  $scope.cansave = _incidentCapture.checkValidSave(_incidentCapture.currStep,$scope);

  setTimeout(
      function() {
        _incidentCapture.initScrolls();
        _incidentCapture.prepareList();
      } , 1000);

      // setTimeout(
        // function() {
          // _scroll.add($('#scrollWrapper_incidentCaptureStep1__FACE')[0])
        // } , 1000);

  
}
,
_Ctrl: function($scope){

  e = document.getElementById('incidentCaptureStep1__FACE');
      
  scope = angular.element(e).scope();
  scope.$apply(function() 
  {  
    scope.model = {};
    scope.isTablet = isTablet;
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
        _incidentCapture.initScrolls();
      } , 1000);

    scope.model.views = _incidentCapture.views;
    scope.model.subViews = [];
    if(_incidentCapture.currStep == 3)
    {
      setTimeout(
      function() {
        try
        {
          _log.d("prepPage3");
          _incidentCapture.preparePage3();
          // $("#userSelect")[0].selectedIndex = -1;

          // $('#userSelect option').filter(function() {
          //   return !this.value || $.trim(this.value).length == 0 || this.value == "?";
          // }).remove();

          // if( _incidentCapture.usersSelect == "")
          // {
            // $("#userSelect").attr("selectedIndex", -1);
          // }

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

      scope.cansave = _incidentCapture.checkValidSave(_incidentCapture.currStep,scope);
      
    // setTimeout(
    //     function() {
    //       _scroll.add($('#scrollWrapper_incidentCaptureStep1__FACE')[0])
    //     } , 300);

      _incidentCapture.onMsg = false;
    });

 
}
,
reloadSubCat : function()
{
  _incidentCapture.preparePage3();
   setTimeout(
        function() {
          _incidentCapture.riskScroll2.refresh();
        } , 300);
}
,
reloadExParty : function()
{
  setTimeout(
        function() {
          _incidentCapture.exPartyScroll.refresh();
        } , 300);
}
,
checkValidSave: function(step,scope)
{
  if(step != 1)
  {
    if(scope.model.description == "" || scope.model.incidentStatusSelect == "" || scope.model.date == "" || scope.model.time == "")
    {
      return false;
    }
  }
  if(step != 2)
  {
     if(scope.model.usersSelect == "" || scope.model.person == "" || scope.model.location == "" || scope.model.sitePath == "")
    {
      return false;
    }
  }
   if(step != 3)
  {
    if(JSON.stringify(scope.model.views).indexOf("\"checked\":true") == -1 )
    {
      return false;
    }
  }
   if(step != 4)
  {
    if(scope.model.action == "")
    {
      return false;
   }
   if(scope.model.external == 0 && JSON.stringify(scope.model.externalList).indexOf("\"checked\":true") == -1)
    {
      return false;
    }
 }

  return true
}
,
checkValid: function(step)
{
  // return true;
  _log.d("checkValid " + step);
  
  e = document.getElementById('incidentCaptureStep1__FACE');
  scope = angular.element(e).scope();

  if(step == 0)
  {

  }else if(step == 1)
  {
    if(scope.model.description == "" || scope.model.incidentStatusSelect == "" || scope.model.date == "" || scope.model.time == "")
    {
      navigator.notification.alert("Please Complete all fields");
      return false;
    }
  }else if(step == 2)
  {
    if(scope.model.usersSelect == "" || scope.model.person == "" || scope.model.location == "" || scope.model.sitePath == "")
    {
      navigator.notification.alert("Please Complete all fields");
      return false;
    }
  }else if(step == 3)
  {
      if(JSON.stringify(scope.model.views).indexOf("\"checked\":true") == -1 )
      {
        navigator.notification.alert("Please Complete all fields");
        return false;
      }

  }else if(step == 4)
  {
    if(scope.model.action == "")
    {
      navigator.notification.alert("Please Complete all fields");
      return false;
    }
    if(scope.model.external == 0 && JSON.stringify(scope.model.externalList).indexOf("\"checked\":true") == -1)
    {
      navigator.notification.alert("Please Complete all fields");
      return false;
    }

  }else
  {
    navigator.notification.alert("Step Whaaat? " + step);
    return false;
  }
  return true;
}
,
save: function()
{
  e = document.getElementById('incidentCaptureStep1__FACE');
  scope = angular.element(e).scope();

  if(!_incidentCapture.checkValid(_incidentCapture.currStep))
    return;

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
  
  _incidentCapture.submitData();

}
,
getCategories: function(list)
{
    returnlist = [];
    for(var i in list)
    {
      var cat = list[i];
      if(cat.HasChild)
      {
        returnlist = returnlist.concat(_incidentCapture.getCategories(cat.children));
      }else if(cat.checked)
      {
        returnlist.push(cat);
      }
    }
    return returnlist;
}
,
getExternalParties: function()
{
  returnlist = [];
  for(var i in _incidentCapture.externalList)
  {
    var ex = _incidentCapture.externalList[i];
    if(ex.checked)
    {
      returnlist.push(ex);
    }
  }
  return returnlist;
}
,
loadCurrData: function()
{
  // alert("loadCurrData ");
  _log.d("loadCurrData ");
  _model.getAll("currData",  function(records) {  
        if(records.length == 1)
        {
          _log.d(JSON.stringify(records));
          record = records[0];

          _incidentCapture.description = record.description;

          for(var i in _incidentCapture.incidentStatus)
          {
            var status = _incidentCapture.incidentStatus[i]
            if(status.SourceListID == record.incidentStatusSelect)
            {
              _incidentCapture.incidentStatusSelect = status;
              break;
            }
          }

          _incidentCapture.date = record.date;
          _incidentCapture.time = record.time;
          // _incidentCapture.usersSelect = record.usersSelect;

          _incidentCapture.person = record.person;
          for(var i in _incidentCapture.users)
          {
            var user = _incidentCapture.users[i]
            if(user.SourceListID == record.usersSelectID)
            {
              _incidentCapture.usersSelect = user;
              break;
            }
          }
          _incidentCapture.siteSelect = record.siteSelect;
          _incidentCapture.sitePath = _incidentCapture.getFullLocation(_incidentCapture.siteSelect,_incidentCapture.sites);
          _incidentCapture.location = record.location;

          // _incidentCapture.viewSelectId = record.viewSelect;

          for(var i in record.viewSelect)
          {
            var viewID = record.viewSelect[i];
            for(var j in _incidentCapture.views)
            {
              var view = _incidentCapture.views[j];
              if(view.SourceListID == viewID)
              {
                view.checked = true;
                break;
              }
            }
          }

          for(var i in record.category)
          {
            var catS = record.category[i];
            for(var j in _incidentCapture.rawIncidentCategories)
            {
              var cat = _incidentCapture.rawIncidentCategories[j];
              if(catS.SourceListID == cat.SourceListID && catS.Level == cat.Level)
              {
                cat.checked = true;
                break;
              }
            }
          }

          // _incidentCapture.siteSelect = record.siteSelect;
          // riskTypeID_xml: riskTypeID_xml,
          // _incidentCapture.category = record.category;

          _incidentCapture.action = record.action
          _incidentCapture.external = record.external
          for(var i in record.externalList)
          {
            var ex = record.externalList[i];
            for(var j in _incidentCapture.externalList)
            {
              var external = _incidentCapture.externalList[j];
              if(external.SourceListID == ex.SourceListID)
              {
                external.checked = true;
                break;
              }
            }
          }


          _incidentCapture.currJob = record.currJob
          _incidentCapture.currKey = record.currKey;

        }else
        {
          _incidentCapture.clearPage(); 
        }
        _incidentCapture._Ctrl();
    });
}
,
saveCurrData: function()
{
    _log.d("saveCurrData ");
    var catData = [];
    for(var i in _incidentCapture.views)
    {
        view = _incidentCapture.views[i];
        catData = catData.concat(_incidentCapture.getCategories(view.categories));
        
    }
    // alert(JSON.stringify(catData));
    //var catData = _incidentCapture.getCategories(_incidentCapture.IncidentCategories);
    var exData = _incidentCapture.getExternalParties();


    _incidentCapture.viewSelectId = [];
    for(var i in _incidentCapture.views )
    {
      var view = _incidentCapture.views[i];
      if(view.checked)
      {
        _incidentCapture.viewSelectId.push(view.SourceListID);
      }
    }

    var data = { 

      description : _incidentCapture.description,
      incidentStatusSelect : _incidentCapture.incidentStatusSelect.SourceListID,
      date : _incidentCapture.date,
      time : _incidentCapture.time,


      // usersSelect : _incidentCapture.usersSelect.SourceListID,
      person : _incidentCapture.person,
      usersSelectID : _incidentCapture.usersSelect.SourceListID,
      siteSelect: _incidentCapture.siteSelect,
      location : _incidentCapture.location,
      // siteSelect : _incidentCapture.siteSelect,



      // //views : _incidentCapture.views,
      viewSelect : _incidentCapture.viewSelectId,
      category : catData,
      // riskTypeID_xml: riskTypeID_xml,
      
      action : _incidentCapture.action,
      external : _incidentCapture.external,
      externalList : exData,

      currJob : _incidentCapture.currJob,
      currKey: _incidentCapture.currKey,

    };

    // if(_incidentCapture.external == 1)
    // {
    //   data.external = 3201;
    // }

    _model.nuke("currData", function() {  
      _log.d("Delete successful currData");
      _model.set("currData",
        data,
        function()
         {  
            _log.d('Save Successful currData');
         }
       ); 
    });
}
,
submitData : function()
{
  try
      {

        // var catData = _incidentCapture.getCategories(_incidentCapture.IncidentCategories);
        var catData = [];
        for(var i in _incidentCapture.views)
        {
            view = _incidentCapture.views[i];
            catData = catData.concat(_incidentCapture.getCategories(view.categories));
            
        }

        var exData = [];
        if(!_incidentCapture.external)
          exData = _incidentCapture.getExternalParties();

        var riskTypeID_xml = '<rt>';
        _incidentCapture.viewSelect = [];
        for(var i in _incidentCapture.views )
        {
          var view = _incidentCapture.views[i];
          if(view.checked)
          {
            // alert(JSON.stringify(view));
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
          category : catData,
          riskTypeID_xml: riskTypeID_xml,
          action : _incidentCapture.action,
          external : 3200,
          externalList : exData,
          // //externalList : _incidentCapture.externalList,

        };

        if(_incidentCapture.external == 1)
        {
          data.external = 3201;
        }

        if(_incidentCapture.currJob != "")
        {
          data.jobKey = _incidentCapture.currJob;
          jobQueue.jobs[_incidentCapture.currJob].data.data = data;
          var now = new Date();
          // ("00" + h).slice (-3);
          // var str = ("0" + now.getHours()).slice (-2) + ":" + ("0" + now.getMinutes()).slice (-2) + ":" + ("0" + now.getSeconds()).slice (-2) + " " + now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice (-2) + "-" + ("0" + now.getDate()).slice (-2) ;
          var str = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice (-2) + "-" + ("0" + now.getDate()).slice (-2)  + " " + ("0" + now.getHours()).slice (-2) + ":" + ("0" + now.getMinutes()).slice (-2) + ":" + ("0" + now.getSeconds()).slice (-2) ;
          jobQueue.jobs[_incidentCapture.currJob].jobName = _incidentCapture.description;
          jobQueue.jobs[_incidentCapture.currJob].jobDesc = "Update " + str;
          jobQueue.jobs[_incidentCapture.currJob].timeSubmitted = now.getTime();
          jobQueue.refresh();
          // var jobData = { action:'postIncident', data: "update"};
          // var JOB = {
          //   jobName: "Update",
          //   jobDesc: _incidentCapture.description,
          //   data: jobData,
          //   allowDuplicate: true,
          //   clearOnDone: false,
          // };

          // _log.d("JOB = " + JSON.stringify(JOB));
          // jobid = jobQueue.add(JOB);

          // data.jobKey = jobid;
          
        }else
        {
          var jobData = { action:'postIncident', data: data};
          var now = new Date();
          // var str = ("0" + now.getHours()).slice (-2) + ":" + ("0" + now.getMinutes()).slice (-2) + ":" + ("0" + now.getSeconds()).slice (-2) + " " + now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice (-2) + "-" + ("0" + now.getDate()).slice (-2) ;
          var str = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice (-2) + "-" + ("0" + now.getDate()).slice (-2)  + " " + ("0" + now.getHours()).slice (-2) + ":" + ("0" + now.getMinutes()).slice (-2) + ":" + ("0" + now.getSeconds()).slice (-2) ;
          var JOB = {
            jobName: _incidentCapture.description,
            jobDesc: "New " + str,
            data: jobData,
            allowDuplicate: true,
            clearOnDone: false,
          };

          _log.d("JOB = " + JSON.stringify(JOB));
          jobid = jobQueue.add(JOB);

          data.jobKey = jobid;
          _incidentCapture.currJob = jobid;
          _incidentCapture.saveCurrData();
        }

        data.incidentStatusSelectString = _incidentCapture.incidentStatusSelect.SourceList;
        data.userSelectString = _incidentCapture.usersSelect.SourceList;
        data.sitePath = _incidentCapture.sitePath;
        data.ID = "";
        data.status = "";
        data.key = _incidentCapture.currKey;

        data.viewSelect = _incidentCapture.viewSelect;
        
        if(_incidentCapture.external == 0)
          data.externalString = "Yes";
        else
          data.externalString = "No";

        _log.d(JSON.stringify(data));
        _model.set("reportHistory",
            data,
            function()
             {  
                _log.d('Save Successful');
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
    _incidentCapture.rawIncidentCategories = [];
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
        _incidentCapture.rawIncidentCategories.push(category);
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
          for(var j in _incidentCapture.rawIncidentCategories)
          {
            node = _incidentCapture.rawIncidentCategories[j];

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
                _incidentCapture.rawIncidentCategories.push(category);
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
clicksAllowed :true
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
    $(".locationOccurred").off("click");
    $('.locationOccurred').on("click", function (evt) {
          
        _incidentCapture.handlePopup();   
          return false;
     });

    // var clickNumber = 0,
    // clicksAllowed = true;

//   $("#step2").click(function (event) {
    
//     if (event.stopPropagation){
//        event.stopPropagation();
//    }
//    else if(window.event){
//       window.event.cancelBubble=true;
//    }

//     if(_incidentCapture.clicksAllowed)
//     {
//             _incidentCapture.clicksAllowed = false;
//             _log.d("step 2 click");
//             setTimeout(function() {
//                 _incidentCapture.clicksAllowed = true;
//       }, 1000);

//     }else
//     {
//       _log.d("step 2 false");
//       return false;
//     }
// });


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
locpop: false, 
pop : function(div) {

  if(_incidentCapture.locpop == false && (_incidentCapture.clicksAllowed))
    {
     _incidentCapture.locpop = true;
      document.getElementById(div).style.display = 'block';
      _scroll.buffer['scrollWrapper_incidentCaptureStep1__FACE'].disable();
      setTimeout(
      function() {
        _incidentCapture.locpop = false;
      } , 1000);
    }
  },
hide : function(div) {

    if(_incidentCapture.locpop == false)
    {
      
      setTimeout(
      function() {
        document.getElementById(div).style.display = 'none';
      _scroll.buffer['scrollWrapper_incidentCaptureStep1__FACE'].enable();
      } , 200);

      _incidentCapture.clicksAllowed = false;
      setTimeout(
      function() {
        _incidentCapture.locpop = false;
        _incidentCapture.clicksAllowed = true;
      } , 1000);
    }
    
  },
};
;;
