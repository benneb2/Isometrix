_startPage = {

    model: null,
    token: null,
    onExit : function() { var _ = this;


    },

    onLoaded: function () { var _ = this;

      $('#startPageFront__FACE').find(".cardHeader").attr('hidden',true);
        $.pubsub('unsubscribe', _startPage.subscriber);
        _startPage.token = $.pubsub('subscribe', 'jobQueueUpdate', _startPage.subscriber);

    },

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

        _model.getAll("reportHistory",  function(records) {  

            for (var i in records)
            {
                var rjob = records[i];
                if(jobID == rjob.key)
                {
                  try
                  {
                    rjob.status = status;
                    if(status == 'DONE')
                    {
                      job = jobQueue.jobs[rjob.key];
                      var _MSG = (typeof job.result == 'undefined' || typeof job.result.msg == 'undefined')  ? "REQUEST TIMED OUT" : job.result.msg;
                      rjob.ID = _MSG;
                    }
                    _model.set("reportHistory",rjob,function(){
                          alert('Save Successful ' + _MSG);
                    });

                  }catch(err)
                  {
                    _log.d(err);
                  }
                  break;
                }
            }

        });
    }
};
;;