_startPage = {

    model: null,
    token: null,
    realPROCESS : null,
    realretryAll: null,
    didretry:false,
    pollInt:false,
    updateInterval:5000,
    currPage:"startPage",
    needsClear:false,
    tempvar:null,
    onExit : function() { var _ = this;


    },

    onLoaded: function () { var _ = this;
      _startPage.currPage= "startPage";
      $('#startPageFront__FACE').find(".cardHeader").attr('hidden',true);
      $.pubsub('unsubscribe', _startPage.subscriber);
      _startPage.token = $.pubsub('subscribe', 'jobQueueUpdate', _startPage.subscriber);

      if(_startPage.realPROCESS == null)
        _startPage.realPROCESS = jobQueue.PROCESS;

      _startPage.realretryAll = jobQueue.retryAll;

      clearInterval(jobQueue.pollInt);

      jobQueue.PROCESS =  function() {
        clearInterval(jobQueue.pollInt);
        _log.d("PROCESS " + _startPage.realPROCESS);
      }

      jobQueue.retryAll =  function() {

        _model.nuke("currData", function() {  
          _log.d("Delete successful currData");
        });

        _log.d("retryall");
        if(layout.currLayoutID == "showControls")
        {
            _incidentCapture.clearPage();
            _incidentCapture._Ctrl();
        }else
        {
          _startPage.needsClear = true;
        }

        for (var i in jobQueue.jobs) 
        {
          job = jobQueue.jobs[i];

          if (job.jobStatus == "FAILED" || job.jobStatus == "DELIVERED" || job.jobStatus == "STOPPED") {
            job.jobStatus = "QUEUED";
          }
        }
        jobQueue.refresh();

        if(_startPage.didretry)
        {
          return;
        }

        _startPage.didretry = true;
        setTimeout(
          function() {
            _startPage.didretry = false;
          } , 1000);


        // _startPage.realretryAll();
        _startPage.PROCESS();
    };

  },
  PROCESS: function()
  {
    clearInterval(_startPage.pollInt);
    _startPage.realPROCESS();
    _startPage.pollInt = setInterval(function() {

      _log.d("start PROCESS");
      foundQueued = false;
      for (var i in jobQueue.jobs) 
      {
        job = jobQueue.jobs[i];

        if (job.jobStatus == 'QUEUED') {
          _log.d("JOBQUEUE PROCESSING : " + job.jobID);
          foundQueued = true;
          break;
        }
      }
      if(foundQueued == false)
      {
        clearInterval(_startPage.pollInt);
      }

      _startPage.realPROCESS();

    }, _startPage.updateInterval);

  }
  ,

    onMessage : function() {


    },

    Ctrl:function($scope)
    {

    }
    , subscriber: function(topic, data)
    {

        var jobID = data.jobId;
        var status = data.status;
        _log.d("data = " + JSON.stringify(data));
        _log.d("topic = " + JSON.stringify(topic));
        _log.d("topic = " + JSON.stringify(status));


        _model.getAll("reportHistory",  function(records) {  
            _startPage.tempvar = records;
            console.log("in reportHistory " + jobID);
            _log.d(JSON.stringify(records));
            var found = false;
            for (var i in records)
            {
                var rjob = records[i];
                if(jobID == rjob.jobKey)
                {
                  found = true;
                  _log.d("jobID == rjob.jobKey  " + jobID);
                  try
                  {
                    rjob.status = status;
                    if(status == 'DONE')
                    {
                      job = jobQueue.jobs[rjob.jobKey];
                      var _MSG = (typeof job.result == 'undefined' || typeof job.result.msg == 'undefined')  ? "REQUEST TIMED OUT" : job.result.msg;
                      rjob.ID = _MSG;
                      _log.d( status + " " + _MSG);
                    }
                    _log.d('Before Save' + status + ' - ' + _MSG);
                    _model.set("reportHistory",rjob,function(){
                          _log.d('Save Successful ' + status );
                    });

                  }catch(err)
                  {
                    _log.d(err);
                    _log.d(err);
                    _log.d(err);
                    _log.d(err);
                    _log.d(err);

                  }
                  break;
                }
            }
            if(found == false)
            {
              // alert("Not Found FALSE");
            }
              



        });
    }
};
;;