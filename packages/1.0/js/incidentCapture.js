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

  getFullLocation: function(id,children)
  {
      _log.d("getFullLocation " + id);
      var found = false;
      for(var i in children)
      {
        _log.d("1");
        var site = children[i]
        _log.d("2 " +site.SiteID +"-" + id);
        if(site.SiteID == id)
        {
          _log.d("3");
          found = true;
          alert("Site GEkry " + site.Site );
          return  site.ParentID + "." + site.SiteID;
        }
        _log.d("4");
      }
      _log.d("5");
      if(found == false)
      {
        _log.d("6");
        for(var i in children)
        {
          var site = children[i]
          _log.d("7");

          if (typeof(site.children) !== "undefined") 
          {
            if(site.children.length > 0)
            {
              _log.d("8");
              var ret = _incidentCapture.getFullLocation(id,site.children);
              _log.d("11 " + ret);
              if(ret != false)
              {
                _log.d("12" );
                return site.ParentID + "." + ret;
              }
              
            }else
            {
              _log.d("13");
              return false;
            }
          }else
          {
            _log.d("14");
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
            }else
            {
              _incidentCapture.hide('popDiv')
              _incidentCapture.getFullLocation($(this).attr("siteId"),_incidentCapture.sites);
              
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
_incidentCapture.setupPopup();
$scope.model.sites = _incidentCapture.sites;

  setTimeout(
      function() {
        _incidentCapture.prepareList();
      } , 1000);

},

Ctrl4: function($scope){

  $scope.model = {};
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
      setTimeout(
    function() {
      _incidentCapture.locpop = false;
    } , 1000);
  },
hide : function(div) {

    if(_incidentCapture.locpop == false)
    {
      document.getElementById(div).style.display = 'none';
      
    }
    
  },
};
;;
