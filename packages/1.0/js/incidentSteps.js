_incidentSteps = {

    model : [ ],
    step:1,
    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;
        layout.attach('#incidentStepsFront');
    },

    onMessage : function(step) {
        _incidentSteps.step = step;
        _incidentSteps._Ctrl();
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
    }
    ,
    gotoStep: function(step)
    {

        layout.sendMessage('incidentCapture',step,false);
        _incidentSteps.step = step;
        _incidentSteps._Ctrl();
    }
};
;;