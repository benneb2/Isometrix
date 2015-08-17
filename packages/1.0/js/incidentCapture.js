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
    external:0,
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
          // for(var i in _.model.Users)
          // {
          //   var item = _.model.Users[i];

          //   if(item.FirstName != "" && item.LastName)
          //   {
          //     user = {
          //       UserID : item.UserID,
          //       name : item.FirstName + " " + item.LastName,
          //     }
          //      _.users.push(user);
          //   }
          // }
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

      // layout.attach('#incidentCaptureFront');
      layout.attach('#incidentCaptureStep1');
      layout.attach('#incidentCaptureStep2');
      layout.attach('#incidentCaptureStep3');
      layout.attach('#incidentCaptureStep4');
      layout.attach('#incidentCaptureComplete');

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

      }

  }
  ,
  didPrep:false
  ,
  prepareList : function() {
    if(_incidentCapture.didPrep == false)
    {
      _incidentCapture.didPrep = true;

      setTimeout(
      function() {
        _incidentCapture.didPrep = false;
      } , 1000);

      $('#expList').find('li').click( function(event) {

          if(_incidentCapture.locpop != false)
          {
            return;
          }
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

              $(this).children('div').toggle('medium');
              _.currScrolls[0].refresh();
            }else
            {
              _incidentCapture.hide('popDiv');
              _incidentCapture.siteSelect = $(this).attr("siteId");
              _incidentCapture.sitePath = _incidentCapture.getFullLocation(_incidentCapture.siteSelect,_incidentCapture.sites);
              

              _incidentCapture._Ctrl2();

            }
          }

          return false;
        }).addClass('collapsed').children('div').hide();

      $('#expList').find('x').click( function(event) {

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

currStep : 0,
onMessage : function(data) {
  
    _incidentCapture.currStep = data;
    _incidentCapture.FlipCard('incidentCaptureStep' + data,false);


},

Ctrl: function($scope){

}
,
_Ctrl: function($scope){

}
,
Ctrl1: function($scope){
  $scope.model = {};
  $scope.currStep = 1;
  // if(_incidentCapture.currStep == 1)
    $scope.model.show = true;
  // else
  //   $scope.model.show = false;

  $scope.model.description = _incidentCapture.description;
  $scope.model.date = _incidentCapture.date;
  $scope.model.time = _incidentCapture.time;
  $scope.model.incidentStatus = _incidentCapture.incidentStatus;
  $scope.model.incidentStatusSelect = _incidentCapture.incidentStatusSelect;
}
,
Ctrl2: function($scope){
  $scope.model = {};
  $scope.model.users = _incidentCapture.users;
  $scope.model.usersSelect = _incidentCapture.usersSelect;
  $scope.model.person = _incidentCapture.person;
  $scope.model.sites = _incidentCapture.sites;
  $scope.model.location = _incidentCapture.location;
  $scope.model.sitePath = _incidentCapture.sitePath;

  _incidentCapture.setupPopup();

  setTimeout(
      function() {
        _incidentCapture.prepareList();
      } , 1000);

}
,
_Ctrl2: function($scope){

    e = document.getElementById('incidentCaptureStep2__FACE');
      
      scope = angular.element(e).scope();
      alert(scope.person);
      alert(scope.location);
      scope.$apply(function() 
      {  
        scope.model = {};
        scope.model.users = _incidentCapture.users;
        scope.model.usersSelect = _incidentCapture.usersSelect;
        scope.model.person = _incidentCapture.person;
        scope.model.sites = _incidentCapture.sites;
        scope.model.location = _incidentCapture.location;
        scope.model.sitePath = _incidentCapture.sitePath;

      });


}
,

Ctrl3: function($scope)
{
  $scope.model = {};
  $scope.model.views = _incidentCapture.views;
  _incidentCapture.preparePage3();

}
,
reloadSubCat : function()
{
  _incidentCapture.preparePage3();
   // setTimeout(
   //    function() {
   //      _incidentCapture._Ctrl3();
   //    } , 300);

  
}
,
_Ctrl3: function($scope){

    e = document.getElementById('incidentCaptureStep3__FACE');
    


      scope = angular.element(e).scope();
      
      scope.$apply(function() 
      {  
        scope.model = {};
        scope.model.views = _incidentCapture.views;
        scope.model.subViews = [];
        _incidentCapture.preparePage3();
      });


}
,

Ctrl4: function($scope){

  $scope.model = {};
  $scope.model.action = _incidentCapture.action;
  $scope.model.external = _incidentCapture.external;
  $scope.model.externalList = _incidentCapture.externalList;
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
flipBusy:function(cb)
{
  setTimeout(
      function() {
        if( _cardEngine.cards.incidentCapture.instance.flipBusy)
        {
          _log.d("flipBusy");
          _incidentCapture.flipBusy(cb);
        }
        else
        {
          cb();
        }
      } , 100);
}
,
FlipCard: function(flipTarget, cb){

  if( _cardEngine.cards.incidentCapture.instance.isFlipped )
  {
    _cardEngine.revert("incidentCapture");

    _incidentCapture.flipBusy(function()
    {
        _cardEngine.flip("incidentCapture" , flipTarget, function(release) {
      _log.d("Flip Target:");
      _log.d(flipTarget);
      release();
      layout.attach('#'+flipTarget);

        if(cb) {
          cb();
        }
      });


    })


  }else
  {
      _cardEngine.flip("incidentCapture" , flipTarget, function(release) {
      _log.d("Flip Target:");
      _log.d(flipTarget);
      release();
      layout.attach('#'+flipTarget);

        if(cb) {
          cb();
        }
      });
    }
  },
didLocPop:false,
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
    $('.locationOccurred').on(evt, function () {
          var me = $(this);
          _incidentCapture.handlePopup(me);   
     });
  }

},
locbox: null,
handlePopup : function(me)
{
  try{
      
        _incidentCapture.locbox = me;
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
      _scroll.add($('#expList')[0])

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
      _scroll.add($('#scrollWrapper_incidentCaptureStep2__FACE')[0])
    }
    
  },
};
;;
