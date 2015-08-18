_reportHistory = {

    model: null,
    currModel : null,
    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;

		_model.getAll("reportHistory",  function(records) {  

			_reportHistory.model = records;
			_log.d(JSON.stringify(records));
			layout.attach('#historyFront');
			layout.attach('#historyDetails');
        });

    },

    onMessage : function() {


    },

	Ctrl : function($scope)
    {
    	$scope.model = _reportHistory.model;
    	$scope.getDetails = function(id)
    	{
    		_reportHistory.currModel = _reportHistory.model[id];
    		_cardEngine.flip("reportHistory" , "historyDetails");
    	}
    },
    detailCtrl : function($scope)
    {
    	$scope.model = _reportHistory.currModel;
    },

     _Ctrl : function()
    {
        e = document.getElementById('historyFront__FACE');
        
        scope = angular.element(e).scope();
        
        scope.$apply(function() 
        {  
           scope.model = _reportHistory.model;
        }); 
    },




};
;;
