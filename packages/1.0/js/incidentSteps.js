_incidentSteps = {

    model : [ ],
    step:1,
    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;
        _incidentSteps.step = 1;
        layout.attach('#incidentStepsFront');
    },

    onMessage : function(step) {
        try{
            _incidentSteps.step = step;
            _incidentSteps._Ctrl();
        }catch(err)
        {
            _log.d(err);
        }
    },

    Ctrl : function($scope)
    {
        $scope.step  = _incidentSteps.step;
    },

    _Ctrl : function()
  	{
        e = document.getElementById('incidentStepsFront__FACE');

        scope = angular.element(e).scope();
        scope.$apply(function() 
        { 
            scope.step  = _incidentSteps.step;
        });
    },
    
    gotoStep: function(step)
    {

        layout.sendMessage('incidentCapture',step,false);
        _incidentSteps.step = step;
        _incidentSteps._Ctrl();
    }
};
;;