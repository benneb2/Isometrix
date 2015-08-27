
/*
<card id="testCard">

	<face default>
    <ctl>SIGN IN</ctl>
    <ctr></ctr>

        <content>



        </content>
        <cbl></cbl>
        <cbr id="btnUserlogin">PROCEED</cbr>

	</face>
    <face id="">

    </face>

    <face id="">

    </face>

</card>


>>>


<div class="card-container" id="testCard">
   <div class="card">
       <div class="front">
           Front
       </div>
       <div class="back">
           Back
       </div>
   </div>
</div>

*/


/*
   TODO :

    //Make all cards hidden on load in layout.js / OR in bootloader put them in a hidden div.


*/


_cardEngine = {

    cards : {},


    add : function(elm, container) {

         var _instance = Object.create(__cardEngine_INSTANCE, { } );


         var opts = {};
         opts.id = $(elm).attr('id');
         opts.refresh = false;
         opts.width = $(elm).attr('width') ? $(elm).attr('width') : 320;
         opts.height = $(elm).attr('height') ? $(elm).attr('height') : 600;
         opts.dynamic = $(elm).attr('dynamic') == 'true' ? true : false;


         opts.fill    = $(elm).attr('fill') ? $(elm).attr('fill') : 'false';
         opts.fill    = (opts.fill == 'true') ? true : false;

         _log.d("CARDENGINE : ADDING CARD WITH OPTS "+JSON.stringify(opts));


          var card = _instance.init(opts, $(elm), container);

          card.elm = $(elm);
          card.id  = opts.id;
          card.instance = _instance;

          _cardEngine.cards[opts.id] =  card  ;

          return card;



    },

    del : function(cid) {

        _log.d("CARDENGINE REMOVING "+cid);

        try
        {

          var card = _cardEngine.cards[cid];

          //DESTROY THE SCROLLS
          for(var i in card.instance.currScrolls)
          {
            card.instance.currScrolls[i].destroy();
            delete card.instance.currScrolls[i];
          }

          card.instance = null;
          delete _cardEngine.cards[cid];



        }
        catch(e)
        {
          _log.d("CARDENGINE COULD NOT REMOVE "+cid);

        }


    },

    getInstanceFromFace : function(faceID) {

      _log.d("GETTING FACE FOR "+faceID);


      for(var c in _cardEngine.cards)
      {
         var card = _cardEngine.cards[c];

         for(var f in card.instance.faces )
         {
            _log.d("DOES FACE "+f+" == "+faceID+" ? ");

            if(f == faceID)
            {

              _log.d("FOUND "+faceID); //+" : "+JSON.stringify(card.instance.faces[f]));

              return card.instance;

            }

         }

      }

      return false;


    },

    getInstanceFromId : function(CID) {

      _log.d("_CARDENGINE.getInstanceFromId "+CID);
/*
      for(var i in _cardEngine.cards )
      {
        _log.d("_CARDENGINE.getInstanceFromId -> DOES "+i+" == "+CID);
      }
*/
      if(typeof _cardEngine.cards[CID] == 'undefined' || _cardEngine.cards[CID].instance == 'undefined')
      {
        return false;
      }
      else
      {
        //_log.d('_CARDENGINE.getInstanceFromId = GOT INSTANCE '+JSON.stringify(_cardEngine.cards[CID]));
        _log.d('_CARDENGINE.getInstanceFromId = GOT INSTANCE FOR '+CID);

        return _cardEngine.cards[CID].instance;
      }

    },


    flip : function(cid, targetid, cb) {

        _log.d("CARD ENGINE FLIPPING FROM "+cid+" -> "+targetid);

        if(typeof cb == 'undefined') { cb = false; }

        _cardEngine.hideSearch();



        var _instance = _cardEngine.cards[cid].instance;
        var _elm      = _cardEngine.cards[cid].elm;
        var _opts     = _cardEngine.cards[cid].opts;


        _instance.flipTo(targetid, _elm, _opts, cb);







    },

    fullScreen : function(cid, fid)
    {



          var elm = $('#'+fid);

					var eTop = elm.offset().top; //get the offset top of the element
					var eLeft = elm.offset().left;


					_log.d("GOING FULLSCREEN TO : "+_SW_+" x "+_SH_);

          elm.css({position:'absolute', background:'blue', top:eTop, left:eLeft, zIndex:99999999}).animate({left:-layout.gapHeight, top:-40, width:_SW_, height:_SH_}, 3000);
        //  elm.find('.cardContent').animate({width:_SW_, height:_SH_ - 80}, 3000);


    },

    revert : function(cid)
    {

        var _instance = _cardEngine.cards[cid].instance;
        var _elm      = _cardEngine.cards[cid].elm;
        var _opts     = _cardEngine.cards[cid].opts;

        _instance.flipTo('close', _elm, _opts);

    },


     callback : function(func) {

        try
         {
            var cmd = func;

            _log.d("CALLING CALLBACK : "+func);

            eval(cmd);
         }
        catch (e)
         {
            _log.d("COULD NOT CALL CALLBACK : "+func+" --> "+JSON.stringify(e));
         }

     },

     lastSearchCID : false,
     showSearch : function(cid, fid, btn) {

          var _instance = _cardEngine.cards[cid].instance;
          var _elm      = _cardEngine.cards[cid].elm;
          var _opts     = _cardEngine.cards[cid].opts;

          var settings = _instance.faces[fid].settings;

          _cardEngine.lastSearchCID = cid;

         // alert(JSON.stringify(_instance.faces[fid].settings));



          _instance.showSearch(cid, fid, _elm, settings, btn);


     },

     hideSearch : function() {
       if(_cardEngine.lastSearchCID)
       {
         try {
           var _instance = _cardEngine.cards[ _cardEngine.lastSearchCID ].instance;
          _instance.hideSearch();
        } catch (e) { _log.d("HIDESEARCH INSTANCE NOT FOUND"); }
       }


     },

     filterAndValidateInput : function(elm)
     {

        var filter = $(elm).attr('filter');

          //CHECK FILTER
         if(filter)
         {
           _log.d("CHECKING INPUT : "+$(elm).attr('valid')+" / "+$(elm).attr('filter'));

           var remove = false;
           var replace = false;
           var val = $(elm).val();

           if(filter.indexOf('alphanumeric') > -1)
            {
               var re = new RegExp("^[a-zA-Z0-9 ]+$");
               if(!re.test(val))
               {
                 remove = true;
               }

            }
            else if(filter.indexOf('numeric') > -1)
            {
               if(!$.isNumeric(val) )
                {
                  remove = true;
                }
            }
            else if(filter.indexOf('alpha') > -1)
            {
                 var re = new RegExp("^[a-zA-Z ]+$");
                 if(!re.test(val))
                 {
                   remove = true;
                 }


            }
            else
            {

            }

            if(filter.indexOf('ucfirst') > -1)
            {
                replace = true;
                val = val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                _log.d("UC FIRST NEW VALUE IS : "+val);
            }

              if(replace)
             {
                $(elm).val(val);
             }


            if(remove)
             {

                $(elm).val(val.substring(0,val.length-1));
             }


         }

        //CHECK VALID
        _cardEngine.validateFormElement(elm);



     },


     validateFormElement : function(elm)
     {
          var valid = $(elm).attr('valid');

         if(valid)
         {
          var val = $(elm).val();

          _log.d("val is : "+val);

          var emailTest = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          var formats = "(999)999-9999|999-999-9999|9999999999";
          var msisdnTest = RegExp("^(" +
                         formats
                           .replace(/([\(\)])/g, "\\$1")
                           .replace(/9/g,"\\d") +
                         ")$");

          var twitterTest = /(^|\W+)\@([\w\-]+)/gm;

          if(
               ( (valid.indexOf('null')  > -1) && val == '' ) ||
               ( (valid.indexOf('email') > -1) && !emailTest.test(val) ) ||
               ( (valid.indexOf('msisdn') > -1) && !msisdnTest.test(val) ) ||
               ( (valid.indexOf('twitter') > -1) && !twitterTest.test(val) )

            )
           {
             // _log.d("INVALID");
            //  $(elm).closest('.cardInlay').removeClass('validInput').addClass('invalidInput');
              $(elm).removeClass('validInput').addClass('invalidInput');

           }

          else
           {
             // _log.d("VALID");
             // $(elm).closest('.cardInlay').removeClass('invalidInput').addClass('validInput');
              $(elm).removeClass('invalidInput').addClass('validInput');

           }
         }


         var max = $(elm).attr('max');
         var min = $(elm).attr('min');


         if(max && min)
         {
          var val = $(elm).val();

          if( val.length > max || val.length < min)
           {
              $(elm).removeClass('validInput').addClass('invalidInput');

           }

          else
           {
              $(elm).removeClass('invalidInput').addClass('validInput');
           }
         }
         else if(min)
         {
          var val = $(elm).val();

          if( val.length < min)
           {
              $(elm).removeClass('validInput').addClass('invalidInput');

           }

          else
           {
              $(elm).removeClass('invalidInput').addClass('validInput');
           }
         }
         else if(max)
         {
          var val = $(elm).val();

          if( val.length > max)
           {
              $(elm).removeClass('validInput').addClass('invalidInput');

           }

          else
           {
              $(elm).removeClass('invalidInput').addClass('validInput');
           }
         }









     },

     processTagsFromXML : function(xml, CID)
     {
         var tmpContent = $('<div />')
          .html(xml)
          .attr('id', 'tmpTagProcess')
          .hide()
          .appendTo('body');


        xml = _cardEngine.processTags(tmpContent,CID);

        tmpContent.remove();

        return xml;


     },

     processTags : function(content, CID, FID, contentWidth, contentHeight) {
/*
          _log.d("================ PROCESSTAGS ===============> ORIGINAL CONTENT IS :")
          _log.d(content.html());
          _log.d("--------------------------------------------------- PROCESSING --->")
*/


        //GET THE CARD ID
        if(typeof CID == 'undefined')
          {
            CID = content.closest('card').attr('id');
          }

          if(typeof FID == 'undefined')
            {
              FID = content.closest('face').attr('id');
            }

        //IF STILL UNDEFINED... USE THE CURRENT CARD (HACK : Wont work with multicard layouts) -> TODO : TRY GET THE CID THROUGH ANGULAR DIRECTIVE (tabset in this case)
        if(!CID)
        {
          CID = layout.currCID;
        }

      //RAPID SELECT TAP IOS CRASH FIX
       content.find('select').each(function(){

         $(this).on('touchStart', function(e) {

            var currSel = $(this);
            if(currSel.data('locked')) {
              _log.d("SELECT IS LOCKED");
              e.preventDefault();
              return;
              }

              currSel.data('locked', true);

            setTimeout(function() {

              _log.d("UNLOCKING SELECT");

              currSel.data('locked', false);


            }, 5000);


         });

       });



      //PLACEHOLDER TAG
           content.find('placeholder').each(function() {

             var placeholder = $(this);
             var show = placeholder.attr('ng-show');
             var html = placeholder.html();

             if(show)
             {
                show = ' ng-show="'+show+'" ';
             }

             newXML = '<center><table style="width:90%; height:100%; padding:5px;" '+show+'>'
                    + '<tr><td style="color:black; text-align:center; font-family:HelveticaNeue" valign="middle">'+html+'</td></tr>'
                    + '</table></center>';


             placeholder.replaceWith(newXML);


         });


           content.find('plainListElement').each(function() {

              var listElement = $(this);
              var listElementClass  = listElement.attr('class');      listElementClass = (typeof listElementClass == 'undefined') ? '' : listElementClass;
              var listElementRepeat = listElement.attr('ng-repeat'); listElementRepeat = (typeof listElementRepeat == 'undefined') ? '' : listElementRepeat;
              var listElementShow   = listElement.attr('ng-show');   listElementShow = (typeof listElementShow == 'undefined') ? '' : listElementShow;
              var listElementIf     = listElement.attr('ng-if');     listElementIf = (typeof listElementIf == 'undefined') ? '' : listElementIf;

              var listElementFlipTarget       = listElement.attr('flip-target');     listElementFlipTarget = (typeof listElementFlipTarget == 'undefined') ? '' :  "flip-target='"+listElementFlipTarget+"' ";
              var listElementFlipCallback     = listElement.attr('flip-target');     listElementFlipCallback = (typeof listElementFlipCallback == 'undefined') ? '' : "flip-callback='"+listElementFlipCallback+"' ";


             var title = listElement.find('title');
               var titleClass = title.attr('class');
               var titleText  = title.html();

             var subtitle = listElement.find('subtitle');
               var subTitleClass = subtitle.attr('class');
               var subTitleText  = subtitle.html();



               newXML = "<li class='"+listElementClass+" cardListElement' "+listElementFlipTarget+" "+listElementFlipCallback+"  ng-repeat='"+listElementRepeat+"' ng-show='"+listElementShow+"' ng-if='"+listElementIf+"' style='max-height:50px; overflow:hidden;   text-overflow: ellipsis;'>"
                      + "  <table  cellpadding='0' cellspacing='0'><tr>"
                      + "    <td><table cellpadding='0' cellspacing='0' style='margin:0;padding:0'>"
                      + "          <tr><td style='overflow:hidden;   text-overflow: ellipsis; padding:0px; margin:0; max-height:14px; line-height:14px; vertical-align:bottom; '> <div class='"+titleClass+" cardListElementText'>"+titleText+"</div></td></tr>"
                      + "          <tr><td style='line-height:10px; overflow:hidden;   text-overflow: ellipsis; padding:0px; margin:0; max-height:20px; vertical-align:top; '> <div class='"+subTitleClass+" cardListElementSubText'>"+subTitleText+"</div></td></tr>"
                      + "    </table></td>"
                      + "    <td valign='middle' class='gui-extra' style='font-size:26pt;'' width='20'><center> &#xf105; </center></td>"
                      + "  </tr></table>"
                      + "</li>"

               _log.d("SIMPLE LIST ELEMENT IS : "+newXML);

               listElement.replaceWith(newXML);

           });

      //SIMPLE LIST ELEMENT
          content.find('simpleListElement').each(function() {

             var listElement = $(this);
             var listElementClass = listElement.attr('class');      listElementClass = (typeof listElementClass == 'undefined') ? '' : listElementClass;
             var listElementRepeat = listElement.attr('ng-repeat'); listElementRepeat = (typeof listElementRepeat == 'undefined') ? '' : listElementRepeat;
             var listElementShow   = listElement.attr('ng-show');   listElementShow = (typeof listElementShow == 'undefined') ? '' : listElementShow;
             var listElementIf     = listElement.attr('ng-if');     listElementIf = (typeof listElementIf == 'undefined') ? '' : listElementIf;


            var title = listElement.find('title');
              var titleClass = title.attr('class');
              var titleText  = title.html();

            var subtitle = listElement.find('subtitle');
              var subTitleClass = subtitle.attr('class');
              var subTitleText  = subtitle.html();

            var iconCode = !listElement.attr('icon') ? '' : listElement.attr('icon');


              newXML = "<li class='"+listElementClass+" cardListElement' ng-repeat='"+listElementRepeat+"' ng-show='"+listElementShow+"' ng-if='"+listElementIf+"' style='max-height:50px; overflow:hidden;   text-overflow: ellipsis;'>"
                     + "  <table  cellpadding='0' cellspacing='0'><tr>"
                     + "    <td class='gui-extra' style='font-size:17pt; padding:2px; width:22px; max-width:22px; min-width:22px; overflow:hidden;'><center>"+iconCode+"</center></td>"
                     + "    <td><table cellpadding='0' cellspacing='0' style='margin:0;padding:0'>"
                     + "          <tr><td style='overflow:hidden;   text-overflow: ellipsis; padding:0px; margin:0; max-height:14px; line-height:14px; vertical-align:bottom; '> <div class='"+titleClass+" cardListElementText'>"+titleText+"</div></td></tr>"
                     + "          <tr><td style='line-height:10px; overflow:hidden;   text-overflow: ellipsis; padding:0px; margin:0; max-height:20px; vertical-align:top; '> <div class='"+subTitleClass+" cardListElementSubText'>"+subTitleText+"</div></td></tr>"
                     + "    </table></td>"
                     + "    <td valign='middle' class='gui-extra' style='font-size:26pt;'' width='20'><center> &#xf105; </center></td>"
                     + "  </tr></table>"
                     + "</li>"

              _log.d("SIMPLE LIST ELEMENT IS : "+newXML);

              listElement.replaceWith(newXML);

          });




          content.find('iconListElement').each(function() {

             var listElement = $(this);
             var listElementClass = listElement.attr('class');      listElementClass = (typeof listElementClass == 'undefined') ? '' : listElementClass;
             var listElementRepeat = listElement.attr('ng-repeat'); listElementRepeat = (typeof listElementRepeat == 'undefined') ? '' : listElementRepeat;
             var listElementShow   = listElement.attr('ng-show');   listElementShow = (typeof listElementShow == 'undefined') ? '' : listElementShow;
             var listElementIf     = listElement.attr('ng-if');     listElementIf = (typeof listElementIf == 'undefined') ? '' : listElementIf;

            var title = listElement.find('title');
              var titleClass = title.attr('class');
              var titleText  = title.html();

            var subtitle = listElement.find('subtitle');
              var subTitleClass = subtitle.attr('class');
              var subTitleText  = subtitle.html();

            var icon = listElement.find('icon');
              var iconSrc = icon.attr('ng-src');




              newXML = "<li class='"+listElementClass+" cardListElement' ng-repeat='"+listElementRepeat+"' ng-show='"+listElementShow+"' ng-if='"+listElementIf+"'>"
                     + "  <table><tr>"
                     + "    <td> <img ng-src='"+iconSrc+"' width='50' height='50' /></td>"
                     + "    <td> <div class='"+titleClass+" cardListElementText'>"+titleText+"</div></td>"
                     + "    <td> <div class='"+subTitleClass+" cardListElementSubText'>"+subTitleText+"</div></td>"
                     + "    <td valign='middle' class='gui-extra' style='font-size:26pt;'' width='20'><center> &#xf105; </center></td>"
                     + "  </tr></table>"
                     + "</li>"

              _log.d("ICON LIST ELEMENT IS : "+newXML);

              listElement.replaceWith(newXML);

          });



       //FORM ELEMENT TAG
           content.find('formElement').each(function() {

            var formElement = $(this);
            var title   = formElement.attr('title') ?  formElement.attr('title') : '';
            var desc    = formElement.attr('desc')  ?  formElement.attr('desc')  : '';
            var descEvt = formElement.attr('descEvt')  ?  formElement.attr('descEvt')  : '';
            var text    = formElement.attr('text')  ?  formElement.attr('text')  : '';
            var name    = formElement.attr('name')  ?  formElement.attr('name')  : '';
            var ngShow  = formElement.attr('ng-show')  ?  'ng-show="'+formElement.attr('ng-show')+'"' : '';
            var ngIf    = formElement.attr('ng-if')  ?  'ng-if="'+formElement.attr('ng-if')+'"' : '';

            var show  = formElement.attr('show')  ?  formElement.attr('show')  : 'true';

            //  alert('-->'+show);

            show =  (show == 'true') ? '' : 'style="display:none"';



            var html  = formElement.html();

             text = (text == '') ? '' : '<br /><center><x class="cardFormElementInlayText">'+text+'</x></center><br />';


            newXML = '<center>'
                   + '<table '+show+' '+ngShow+' '+ngIf+' name="'+name+'" class="cardFormContainer cardFormElement" cellspacing="0" cellpadding="0">'
                   + '<tr>'
                   + '<td class="cardFormElementTitle">'+title+'</td>'
                   + '<td class="cardFormElementDesc" onclick="'+descEvt+'">'+desc+'</td>'
                   + '</tr><tr>'
                   + '<td colspan="2" class="cardFormElementContent">'
                   + text
                   + ' <div  class="cardInlay">'
                   + html
                   + '</div></td></tr></table></center>'

            formElement.replaceWith(newXML);


           });

           //FORM ELEMENT TAG
               content.find('tabset').each(function() {


                 _cardEngine.currTabTarget = false;





                 /*

                 <tabset>
            <tab title="{{todayTitle('Monday')}}" template-url="routes_day_template_monday"></tab>
            <tab title="{{todayTitle('Tuesday')}}" template-url="routes_day_template_tuesday"></tab>
            <tab title="{{todayTitle('Wednesday')}}" template-url="routes_day_template_wednesday"></tab>
            <tab title="{{todayTitle('Thursday')}}" template-url="routes_day_template_thursday"></tab>
            <tab title="{{todayTitle('Friday')}}" template-url="routes_day_template_friday"></tab>
            <tab title="{{todayTitle('Saturday')}}" template-url="routes_day_template_saturday"></tab>
            <tab title="{{todayTitle('Sunday')}}" template-url="routes_day_template_sunday"></tab>
            <tab title="All" template-url="routes_day_template_all"></tab>
        </tabset>*/


                //LOAD TAB DATA
                var tabSet = $(this);

                //SAVE ONCHANGE
                var _onChange = $(this).attr('onChange');
                    _onChange = ( _onChange && _onChange !== '') ? _onChange : false;





                _log.d("TABSET ONCHANGE IS : "+_onChange );


                var tabData  = [];

                var hasSelected = false;
                tabSet.find('tab').each(function() {

                    var tab = $(this);

                    //title
                    var title      = tab.attr('title');



                    //selected
                    var selected   = tab.attr('selected') ? tab.attr('selected') : false;
                    if(selected) { hasSelected = true; }

                    //id
                    var id = tab.attr('template-url');

                    //content
                    var template = id;
                    /*
                    var content    = $('#'+id).html();
                        content    = _cardEngine.processTagsFromXML(content, CID);
                    */




                    tabData.push({id:id, title:title, template:template, selected:selected});



                });

                if(!hasSelected)
                {
                  tabData[0].selected = true;
                }

                //IS THERE A FOOTER?
                var footer = tabSet.find('tabFooter');
                var footerHeight = 0;
                var footerXML = '';
                if(footer.length)
                {

                   _log.d("TABSET HAS FOOTER");

                   var height = _util.getCSSClassProp('tabFooter', 'height');

                   if(typeof height != 'undefined' && height)
                   {
                     footerHeight = height.replace('px', '');
                   }


                   footerXML = '<tr><td class="tabFooter" st yle="overflow:hidden" colspan="'+(tabData.length+1)+'" >'+footer.html()+'</td></tr>';

                }


                //TABs HEIGHT

                var tabHeight = _util.getCSSClassProp('tabSetTabContainer', 'height');
                if(typeof tabHeight != 'undefined' && tabHeight)
                {
                  tabHeight = tabHeight.replace('px', '');
                }
                else
                {
                  tabHeight = '40';
                }


                _log.d("TABHEIGHT : "+tabHeight+" // FOOTERHEIGHT : "+footerHeight);

                //RENDER TABSET

                for(var i in tabData)
                {
                   _log.d("CREATING TAB : "+tabData[i].id+" / "+tabData[i].title+" / "+tabData[i].selected+" / "+tabData[i].content);
                }

                //TABS

                var evt = _util.getEvt(true);


                xml = '<table class="tabSetContainer" style=" height:'+contentHeight+'px; width:'+contentWidth+'px; margin-top:1px">' +
                      '<tr class="tabSetTabContainer">';

                    for(var i in tabData)
                    {
                       var select = tabData[i].selected ? 'tabSelected' : '';
                       var row = '<td class="tabSetTab '+select+'" style="height:'+tabHeight+'px; max-height:'+tabHeight+'px; overflow:hidden;" target="'+tabData[i].id+'" '+evt+'="_cardEngine.switchTab(this, \''+CID+'\', \''+FID+'\', '+_onChange+');" >'+tabData[i].title+'</td>';

                      // _log.d("TABSET ADDING ROW "+row);
                       xml += row;
                    }


                //DO THE WIDGET
                tabWidget = tabSet.find('tabWidget').html();

                _log.d("WIDGET HTML IS "+tabWidget);

                if(!tabWidget || tabWidget.length == 0) { tabWidget = ''; }

                xml += '<td class="tabSetWidget">'+tabWidget+'</td></tr>';

                //CONTENT
                xml += '<tr>' +
                       '<td colspan="'+(tabData.length+1)+'" class="tabSetContentContainer" style="position:relative; width:'+contentWidth+'px; height:calc('+contentHeight+'px - '+tabHeight+'px - '+footerHeight+'px - 2px); overflow:hidden;">';


                  //    xml += '<ul class="tabSetContent"><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li><li>poo<br /><br />poo<br /><br />poo<br /><br />poo<br /><br /></li></ul>';

                     var placeholder = "<placeholder>LOADING DATA</placeholder>";
                         placeholder = _cardEngine.processTagsFromXML(placeholder);
/*
                     for(var i in tabData)
                     {
                        var selected  = tabData[i].selected ? 'selected' : '';
                        var visible = tabData[i].selected ? 'block' : 'none';
//                        xml += '<div style="width:100%; display:'+visible+'; position:absolute;top:0px; left:-'+_screen.W+'px; overflow:hidden; z-index:-10 " name="'+tabData[i].id+'" class="'+selected+' tabSetContent"><ul  style="width:100%;">'+tabData[i].content+
//                          xml += '<div style="width:100%; display:'+visible+'; position:absolute;top:0px; left:-'+_screen.W+'px; overflow:hidden; z-index:-10 " name="'+tabData[i].id+'" class="'+selected+' tabSetContent"><ul  style="width:100%;" template-url="'+tabData[i].template+'">'+placeholder+
                      xml += '<div style="width:100%; display:'+visible+'; position:absolute;top:0px; left:-'+_screen.W+'px; overflow:hidden; z-index:-10 " name="'+tabData[i].id+'" class="'+selected+' tabSetContent"><ul  style="width:100%;" >'+placeholder+

                         '<li><x style="height:50px">.</x></li>'+
                         '<li><x style="height:50px">.</x></li>'+
                         '<li><x style="height:50px">.</x></li>'+
                         '</ul></div>';
                     }
*/


                xml += '<div style="width:100%; position:absolute;top:0px; left:0px; overflow:hidden; z-index:10 " class="tabSetContent"><ul  style="width:100%;" >'+
                        placeholder;

                xml += '</td>' +
                       '</tr>' +
                       footerXML +
                       '</table>';

                       _log.d("FINAL XML "+xml);


                tabSet.replaceWith(xml);

                  //SELECTED




               });


        //INPUT FILTERS
          content.find('input').each(function() {


              if(!$(this).attr('onKeyUp') && $(this).attr('filter'))
               {

                  _log.d("FILTER TRIGGER");

                   evt = "_cardEngine.filterAndValidateInput(this)";

                  if($(this).attr('type') == 'date')
                   {
                     $(this).attr('onBlur', evt);
                   }
                   else
                   {
                    // $(this).attr('onKeyUp', evt);
                    //  $(this).attr('input', evt);
                      $(this).attr('onChange', evt);
                      $(this).attr('onKeyUp', evt);
                      $(this).attr('onInput', evt);
                      $(this).attr('onPaste', evt);

                   }

                  _cardEngine.validateFormElement($(this));

               }

             })


        // _log.d("---------------------------------------------------")
        // _log.d(content.html());
        // _log.d(": IS NEW CONTENT <================ PROCESSTAGS ===============")


        //MAIL TAGS

           content.find('mail').each(function() {

                elm = $(this);
                xml = '<div class="mail"><a href="mailto:'+elm.html()+'">'+elm.html()+'</a></div>';
                elm.replaceWith(xml);

             });

        //MSISDN TAGS
           content.find('msisdn').each(function() {

                elm = $(this);
                xml = '<div class="msisdn"><a href="tel:'+elm.html()+'">'+elm.html()+'</a></div>';
                elm.replaceWith(xml);

             });



        //FLIP TARGETS
           content.find('[flip-target]').each(function() {

                 elm = $(this);
                 var targetEvt = "_cardEngine.flip('"+CID+"', '"+elm.attr('flip-target')+"'); ";

                 //does it have a callback?
                 var callbackEvt = '';
                 if(elm.attr('flip-callback'))
                  {
                     callbackEvt = elm.attr('flip-callback');
                  }

                 xml = targetEvt+callbackEvt;

                 _log.d("FLIP CALLS REPLACED  : "+xml);

                 if( elm.attr('flip-event') )
                 {
                   evt = elm.attr('flip-event');
                 }
                 else
                 {
                   evt = _util.getEvt(true);
                 }

                 elm.attr(evt, xml);

           });






         return content.html();







     },


     switchTab : function(tab, CID, FID, change) {

       //GET THE CARD INSTANCE AND SEND THE REQUEST

       if(typeof change == 'undefined') { change = false; }

       _log.d("SENDING SWITCHTAB REQUEST TO INSTANCE "+CID+" // CHANGE IS "+change);


       var instance = _cardEngine.getInstanceFromId(CID);

       //attempt to extrapolate face if not defined
       if(typeof FID == 'undefined')
       {
         FID = $(tab).closest('.cardFace').attr('id');
       }

       instance.switchTab(tab, FID, change);



      },







}




__cardEngine_INSTANCE = {


   cardElm : null,
   faces   : {},
   _CW     : 0,  //card width
   _CH     : 0,  //card height

   _hH     : 0,  //header / footer height

   _cH     : 0, //content height

   currScroll : false,

   heightLimit : 0,

   opts : null,

  //function(target, staticHeight, innerScroll, refresh) {
   init : function(opts, elm, target)
    {   var _ = this;



        _log.d("CARD INIT - TARGET  : "+$(target).attr('id'));
        _log.d("CARD INIT - ELEMENT : "+$(elm).attr('id')+" ==> "+$(elm).html());

        _.faces = {};

        _.container = target;

        //TRANSLATE THE HTML INTO FLIPCARD FORMAT

        var CID = opts.id;

        _.opts = opts;

         //PROCESS REAL DIMS...
         _.setWidth = $(target)[0].style.width;
         _.setHeight = $(target)[0].style.height;


          _log.d("LAYOUT GAP (PADDING) FOR CARDS IS : "+layout.gapHeight);
          _log.d("CONTAINER DIMS ARE : "+$(elm).outerWidth()+" x "+$(elm).outerHeight());


          _log.d("INITIAL SET DIMS OF CARD ("+CID+") IS : "+_.setWidth+" x "+_.setHeight);


         if(_.setWidth != '')
         {
           _.widthLimit  = ( _.setWidth.indexOf('%') > -1) ? (  parseInt(_screen.W - layout.gapHeight) * (  parseInt(_.setWidth.replace('%', '')) / 100  )    ) : parseInt(_.setWidth.replace('px', ''));
         }
         else
         {
           _.widthLimit  = parseInt( $(target).outerWidth() );
         }

         if(_.setHeight != '')
         {
           _.heightLimit = ( _.setHeight.indexOf('%') > -1) ? (  parseInt(_screen.H - layout.gapHeight) * (  parseInt(_.setHeight.replace('%', '')) / 100  )    ) : parseInt(_.setHeight.replace('px', ''));
         }
         else
         {
           _.heightLimit = parseInt( $(target).outerHeight() );
         }



        //SEE IF THESE ARE LARGER THAN THE SCREEN... AND LIMIT..

        _log.d("INITIAL DETECTED DIMS OF CARD ("+CID+") IS : "+_.widthLimit+" x "+_.heightLimit);


        //limit height...
        _.heightLimit = ( _.heightLimit > (_screen._iH - (layout.gapHeight/2)) || opts.fill ) ? (_screen._iH - (layout.gapHeight/2) ) : _.heightLimit;


        _log.d("LIMITED DIMS OF CARD ("+CID+") IS : "+_.widthLimit+" x "+_.heightLimit);



         _._CW = opts.fill ? _.widthLimit : opts.width;
         _._CH = opts.fill ? ( _.heightLimit - (layout.gapHeight/2) ) : opts.height;


         _._CH = ( _._CH > _.heightLimit ) ? _.heightLimit : _._CH;
         _._CW = ( _._CW > _.widthLimit  ) ? _.widthLimit  : _._CW;


        _log.d("FINAL DIMS OF CARD ("+CID+") IS : "+_._CW+" x "+_._CH);


        //ADJUST THE OPTS AND SET
        opts.height = _._CH;
        opts.width  = _._CW;




        var REFRESH = opts.refresh;

        //GET THE CARD
        var card = _.cardElm = $(elm);

        if(!card.length) {

          _.abort("Card ID "+CID+" not found");
          return;

        }


         //TEST STYLE
          _._hH = _util.getCSSClassProp('cardHeader', 'height').replace('px', '');  //header height
          _._fH = _util.getCSSClassProp('cardFooter', 'height').replace('px', '');  //footer height


          _._cH = _._CH - _._hH - _._fH;  //calculated content height
          _._cW = _._CW - (layout.gapHeight );


        //CAPTURE THE FACES
        card.find('face').each(function() {

             var face   = $(this);
             var faceID = face.attr('id');
             if(!faceID) { _.abort("A face with no id was found. All faces MUST have an id attribute"); return; }

             faceID = faceID+'__FACE';

             _log.d("CREATING FACE "+faceID);


             _.faces[faceID] = {};



             _.faces[faceID].elm      = face;

             //ADD SETTINGS
                var settings = face.attr('settings');
                if(!settings)  { settings = false;  }
                else
                 {
                   try
                     {
                       settings = 'settings = {'+settings+'}';
                        _log.d("TRYING TO PARSE SETTINGS : "+settings);
                       settings = eval(settings);

                     }
                    catch (e)
                     {
                        _log.d("COULD NOT PARSE SETTINGS ON CARD!!! PLEASE CHECK ITS VALID JSON");
                        settings = false;
                     }
                 }
                 _.faces[faceID].settings = settings;



             _.faces[faceID].front = (typeof settings['default'] == 'undefined') ? false : true;
             _.faces[faceID].controller = ( face.attr('controller') ) ? face.attr('controller') : false;
             _.faces[faceID].id         = faceID;
             //BUILD THE FACE XML

          //HEADER AND FOOTER
          var tl = face.find('ctl');
          var tr = face.find('ctr');


          var bl = face.find('cbl');
          var br = face.find('cbr');

          var bm = false;
          if(!bl && !br)
           {
             bm = face.find('cbm');
           }

          evt = _util.getEvt(true);


          _log.d("CARD EVENT DECIDED AS : "+evt);

          var tlID = (typeof tl.attr('id') == 'undefined') ? '' : "id='" + tl.attr('id') + "'";
          var trID = (typeof tr.attr('id') == 'undefined') ? '' : "id='" + tr.attr('id') + "'";

          if(!bm)
          {
           var blID = (typeof bl.attr('id') == 'undefined') ? '' : "id='" + bl.attr('id') + "'";
           var brID = (typeof br.attr('id') == 'undefined') ? '' : "id='" + br.attr('id') + "'";
          }
          else
          {
            var bmID =  (typeof bm.attr('id') == 'undefined') ? '' : "id='" + bm.attr('id') + "'";
          }

          var tlTarget = (typeof tl.attr('flip-target') == 'undefined') ? '' : "_cardEngine.flip(\""+CID+"\", \""+tl.attr('flip-target')+"\") ";
          var trTarget = (typeof tr.attr('flip-target') == 'undefined') ? '' : "_cardEngine.flip(\""+CID+"\", \""+tr.attr('flip-target')+"\") ";

          if(!bm)
          {
           var blTarget = (typeof bl.attr('flip-target') == 'undefined') ? '' : "_cardEngine.flip(\""+CID+"\", \""+bl.attr('flip-target')+"\") ";
           var brTarget = (typeof br.attr('flip-target') == 'undefined') ? '' : "_cardEngine.flip(\""+CID+"\", \""+br.attr('flip-target')+"\") ";
          }
          else
          {
            var bmTarget = (typeof bm.attr('flip-target') == 'undefined') ? '' : "_cardEngine.flip(\""+CID+"\", \""+bm.attr('flip-target')+"\") ";
          }


/*
          tlClass = (typeof tl.attr('class') == 'undefined') ? '' : "class='"+tl.attr('class')+'"';
          trClass = (typeof tr.attr('class') == 'undefined') ? '' : "class='"+tr.attr('class')+'"';
          blClass = (typeof bl.attr('class') == 'undefined') ? '' : "class='"+bl.attr('class')+'"';
          brClass = (typeof br.attr('class') == 'undefined') ? '' : "class='"+br.attr('class')+'"';

*/
          var tlCallback = (typeof tl.attr('flip-callback') == 'undefined') ? '' : "_cardEngine.callback(\""+tl.attr('flip-callback')+"\")";
          var trCallback = (typeof tr.attr('flip-callback') == 'undefined') ? '' : "_cardEngine.callback(\""+tr.attr('flip-callback')+"\")";

          if(!bm)
          {
          var blCallback = (typeof bl.attr('flip-callback') == 'undefined') ? '' : "_cardEngine.callback(\""+bl.attr('flip-callback')+"\")";
          var brCallback = (typeof br.attr('flip-callback') == 'undefined') ? '' : "_cardEngine.callback(\""+br.attr('flip-callback')+"\")";
          }
         else
          {
            var bmCallback = (typeof bm.attr('flip-callback') == 'undefined') ? '' : "_cardEngine.callback(\""+bm.attr('flip-callback')+"\")";

          }

/*
          tlEvent  = evt+"='"+tlCallback+";"+tlTarget+"'";
          trEvent  = evt+"='"+trCallback+";"+trTarget+"'";
          blEvent  = evt+"='"+blCallback+";"+blTarget+"'";
          brEvent  = evt+"='"+brCallback+";"+brTarget+"'";
*/

          var tlEvent  = evt+"='"+tlTarget+";"+tlCallback+"'";
          var trEvent  = evt+"='"+trTarget+";"+trCallback+"'";

          if(!bm)
          {
           var blEvent  = evt+"='"+blTarget+";"+blCallback+"'";
           var brEvent  = evt+"='"+brTarget+";"+brCallback+"'";
          }
          else
          {
            var bmEvent  = evt+"='"+bmTarget+";"+bmCallback+"'";

          }

          var tlClick = (typeof tl.attr('onclick') == 'undefined') ? '' : "onclick='event.preventDefault(); " + _util.escapeFragment(tl.attr('onclick')) + " '";
          var trClick = (typeof tr.attr('onclick') == 'undefined') ? '' : "onclick='event.preventDefault(); " + _util.escapeFragment(tr.attr('onclick')) + " '";

          if(!bm)
          {
          var blClick = (typeof bl.attr('onclick') == 'undefined') ? '' : "onclick='event.preventDefault(); " + _util.escapeFragment(bl.attr('onclick')) + " '";
          var brClick = (typeof br.attr('onclick') == 'undefined') ? '' : "onclick='event.preventDefault(); " + _util.escapeFragment(br.attr('onclick')) + " '";
          }
          else
          {
            var bmClick = (typeof bm.attr('onclick') == 'undefined') ? '' : "onclick='" + _util.escapeFragment(bm.attr('onclick')) + "'";

          }

          var tlNgShow = (typeof tl.attr('ng-show') == 'undefined') ? '' : "ng-show='" + tl.attr('ng-show') + "'";
          var trNgShow = (typeof tr.attr('ng-show') == 'undefined') ? '' : "ng-show='" + tr.attr('ng-show') + "'";

          if(!bm)
          {
            var blNgShow = (typeof bl.attr('ng-show') == 'undefined') ? '' : "ng-show='" + bl.attr('ng-show') + "'";
            var brNgShow = (typeof br.attr('ng-show') == 'undefined') ? '' : "ng-show='" + br.attr('ng-show') + "'";
          }
          else
          {
            var bmNgShow = (typeof bm.attr('ng-show') == 'undefined') ? '' : "ng-show='" + bm.attr('ng-show') + "'";

          }

          var tlNgClick = (typeof tl.attr('ng-click') == 'undefined') ? '' : "ng-click='" + _util.escapeFragment(tl.attr('ng-click')) + "'";
          var trNgClick = (typeof tr.attr('ng-click') == 'undefined') ? '' : "ng-click='" + _util.escapeFragment(tr.attr('ng-click')) + "'";

          if(!bm)
          {
            var blNgClick = (typeof bl.attr('ng-click') == 'undefined') ? '' : "ng-click='" + _util.escapeFragment(bl.attr('ng-click')) + "'";
            var brNgClick = (typeof br.attr('ng-click') == 'undefined') ? '' : "ng-click='" + _util.escapeFragment(br.attr('ng-click')) + "'";
          }
          else
          {
            var bmNgClick = (typeof bm.attr('ng-click') == 'undefined') ? '' : "ng-click='" + _util.escapeFragment(bm.attr('ng-click')) + "'";
          }


            //IS THIS FACE SEARCHABLE?
            var searchBtn = '';
            if(typeof settings.search != 'undefined')
            {
                 searchBtn = '<x class="gui-extra" onclick="_cardEngine.showSearch(\''+CID+'\', \''+faceID+'\', this);">&#xf002;</x>&nbsp;&nbsp;'
            }

            //IS THIS FACE FULLSCREENABLE?
             var fullscreenBtn = '';
            if(typeof settings.fullscreen != 'undefined')
            {
                fullscreenBtn = '<x class="gui-extra" onclick="_cardEngine.fullScreen(\''+CID+'\', \''+faceID+'\');">&#xf0b2;</x>&nbsp;&nbsp;'
            }


          //BUILD THE CONTENT

            var faceXML = '<table class="cardHeader" style="overflow:hidden">'
                        +  '<tr>';

            if(device.platform == 'Android'  && parseFloat(device.version) < 4.4)
            {
                faceXML += '        <td '+tlNgShow+' '+ tlID + ' class="_tl ' + tl.attr('class') + '"  align="left" style="padding-left:10px;">'
                    +  '             <button style="padding:0px; margin:0; background:none; border:none;" '+ tlEvent + '  ' + tlClick + ' ' + tlNgClick +' ><x class="cardHeaderText">'
                    +       searchBtn + fullscreenBtn + '<x class="tlOriginal">' + tl.html() + '</x>'
                    +  '               </x></button>'
                    +  '            </td>'
                    +  '            <td '+trNgShow+' '+ trID + ' class="_tr ' + tr.attr('class') + '"  align="right" style="padding-right:10px;">'
                    +  '             <button style="padding:5px; margin:0; background:none; border:none;" '+ trEvent + '  ' + trClick + ' ' + trNgClick +' ><x class="cardHeaderText">'+   tr.html()  + '</x></button>'
                    +  '            </td>'
              }
              else
              {
                faceXML += '        <td '+tlNgShow+' '+ tlID + ' class="_tl ' + tl.attr('class') + '"  align="left" '+ tlEvent + '  ' + tlClick + ' ' + tlNgClick +' style="padding-left:10px;">'
                    +       searchBtn + fullscreenBtn + '<x class="tlOriginal">' + tl.html() + '</x>'
                    +  '            </td>'
                    +  '            <td '+trNgShow+' '+ trID + ' class="_tr ' + tr.attr('class') + '"  align="right" '+ trEvent + '  ' + trClick + ' ' + trNgClick +' style="padding-right:10px;">'
                    +                 tr.html()
                    +  '            </td>'

              }
                //-webkit-transform: translate3d(0px,0px,0px);

                var content = _cardEngine.processTags(face.find('content'), CID, faceID, _._cW, _._cH);

                faceXML +=  '</tr>'
                    +  '   </table>'
                    +  '   <div class="contentWrapper scrollTarget" style="overflow:hidden; " id="scrollWrapper_' + faceID + '" ' + REFRESH + '>'

                //     +  '   <div class="contentWrapper"  id="scrollWrapper_' + faceID + '" ' + REFRESH + '>'
                //    +  '     <div >'
                    +  '      <ul class="cardContent">' + content + '</ul>'
                //    +  '     </div>'
                    +  '   </div>';

            if (typeof bl[0] != 'undefined' && typeof br[0] != 'undefined') {
              faceXML += '<table class="cardFooter" style="overflow:hidden">'
                  + '<tr>';

                if(device.platform == 'Android' && parseFloat(device.version) < 4.4)
                {



                if(!bm)
                {
                  faceXML  += '<td '+blNgShow+' '+ blID + ' class="_bl ' + bl.attr('class') + '"  align="left" style="padding-left:10px;">'
                           +  '             <button  style="padding:5px; margin:0; background:none; border:none;" '+ blEvent + '  ' + blClick + ' ' + blNgClick +' ><x class="cardFooterText">'+   bl.html()  + '</x></button>'
                           + '</td>'
                           + '<td '+brNgShow+' '+ brID + ' class="_br ' + br.attr('class') + '"  align="right" style="padding-right:10px;">'
                           +  '             <button  style="padding:5px; margin:0; background:none; border:none;" '+ brEvent + '  ' + brClick + ' ' + brNgClick +' ><x class="cardFooterText">'+   br.html()  + '</x></button>'
                           + '</td>';
                }
                else
                {
                  faceXML += '<td '+bmNgShow+' '+ bmID + ' class="_bm ' + bm.attr('class') + '"  align="center" style="padding-right:10px; padding-left:10px">'
                          +  '     <button  style="padding:5px; margin:0; background:none; border:none;" '+ bmEvent + '  ' + bmClick + ' ' + bmNgClick +' ><x class="cardFooterText">'+   bm.html()  + '</x></button>'
                          + '</td>';
                }


                 }
              else
                {

                  if(!bm)
                  {

               faceXML  += '<td '+blNgShow+' '+ blID + ' class="_bl cardFooterText ' + bl.attr('class') + '"  align="left"  '+ blEvent + '  ' + blClick + ' ' + blNgClick +'  style="padding-left:10px;">'
                        +   bl.html()
                        + '</td>'
                        + '<td '+brNgShow+' '+ brID + ' class="_br cardFooterText ' + br.attr('class') + '"  align="right"  '+ brEvent + '  ' + brClick + ' ' + brNgClick +'  style="padding-right:10px;">'
                        +   br.html()
                        + '</td>';

                      }
                      else
                      {
                        faceXML  += '<td '+bmNgShow+' '+ bmID + ' class="_bm cardFooterText ' + bm.attr('class') + '"  align="center"  '+ bmEvent + '  ' + bmClick + ' ' + bmNgClick +'  style="padding-right:10px; padding-left:10px">'
                                 +   bm.html()
                                 + '</td>'


                      }
                }
            }


            faceXML += '</tr>' + '</table>'


            //_log.d("======xxxx=====")
          // _log.limit(1000000);   _log.d(faceXML);  _log.limit();
          //  _log.d("======xxxx=====")




              _.faces[faceID].xml             = faceXML;



        });

        //CAPTURE THE FACES


        //CHECK IF A FRONT (DEFAULT) FACE WAS SET. IF NOT, USE THE FIRST ONE
         var hasFront = false;
         for(var f in _.faces )
         {
            if(_.faces[f].front) { hasFront = true; break }
         }
         if(!hasFront)
         {
            for(var f in _.faces )
             {
               _.faces[f].front = true; break;
             }
         }



        //BUILD THE INITIAL CARD WITH FRONT FACE AND NOW BACK FACE (FOR NOW)
        var xml = '<div class="card-container" id="'+CID+'" style="width:'+_._CW+'px; height:'+_._CH+'px;">'
                + '<div class="card">';





        //ADD THE FRONT FACE
        for(var f in _.faces )
         {
            var _face = _.faces[f];
            if(_face.front)
             {
              // alert( _face.controller + ' ' + _face.id );
                if(_face.controller) { controller = 'ng-controller="'+_face.controller+'"'; } else { controller = ""; }
                if(_face.id) { id = 'id="'+_face.id+'"'; } else { id = ""; }

                f = '<div '+id+' class="front cardFace" style="-webkit-backface-visibility: hidden;" '+controller+'>' + _face.xml + '</div>';

                //_log.d("CARD FACE HEADER IS : "+f);

               // alert(f);

                xml += f;

             }
         }

        //ADD TEMP BACK FACE
        xml += '<div class="back cardFace"></div>';


        //DONE.
      //  _log.d("CARD XML BEFORE IS : "+elm.html());


        //REPLACE THE ORIGINAL
        elm.html(xml);


        //ADD MUTATION LISTENER FOR THE FRONT
      /*
        var evtElm = elm.find('.front').find('.cardContent');
        evtElm.off().on('touchStart', function() {

          evtElm.find('input').blur();

        });
       */

        elm.find('.front').find('.cardContent').off().on('DOMChanged',  $.debounce( 250, function(event) {

             //TAKE THE SCROLLERS POSITION...
             var currY = (typeof _.currScrolls == 'undefined' ) ? 0 : _.currScroll.y;

             var currYs = [];
             if(typeof _.currScrolls != 'undefined' && _.currScrolls.length > 0)
              {
                 for(var i in _.currScrolls)
                 {
                   if(typeof _.currScrolls[i] != 'undefined')
                   {
                     _log.d("A CURR SCROLL Y IS : "+_.currScrolls[i].y) ;
                     currYs.push(_.currScrolls[i].y);
                   }
                 }
              }


             id = $(event.target).closest('.front').attr('id');

             _log.d("CARD MUTATION ON "+id);
             _.dynamicResize( _.cardElm , 'front');

             //PUBLISH IT
             $.pubsub( 'publish', 'cardMutation', { id : id, currYs : currYs} );




            if(typeof _.currScrolls != 'undefined' && _.currScrolls.length > 0 )
             {
               for(var i in _.currScrolls)
               {
                 if(typeof _.currScrolls[i] != 'undefined')
                 {
                  _.currScrolls[i].scrollTo(0,currYs[i]);
                 }
               }

             }



        }));

/*

        if(opts.dynamic && !opts.fill)
         {


         }
        else
         {
            $(elm).find('.contentWrapper').css({height: _._cH, width: _._cW});


         }
  */

         _.dynamicResize(elm);



        _.initScroll(elm, 'front');


        //TRIGGER ALL FILTERS
        $(elm).find('input').each(function() {

               _cardEngine.filterAndValidateInput($(this));

        });


        //MAKE BUTTONS FANCY
          $('._br').off()
           .on('touchstart', function() { $(this).css({opacity:0.2}) })
           .on('touchend', function() { $(this).css({opacity:1}); window.scrollTo(0,0); });

           $('._bl').off()
            .on('touchstart', function() { $(this).css({opacity:0.2}) })
            .on('touchend', function() { $(this).css({opacity:1}); window.scrollTo(0,0); });

            $('._tl').off()
             .on('touchstart', function() { $(this).css({opacity:0.2}) })
             .on('touchend', function() { $(this).css({opacity:1}); window.scrollTo(0,0); });

             $('._tr').off()
              .on('touchstart', function() { $(this).css({opacity:0.2}) })
              .on('touchend', function() { $(this).css({opacity:1}); window.scrollTo(0,0); });


         _.processControls(elm);


        //RETURN REFERENCE
        return { id : CID, xml : xml, opts : opts }



    },

    processControls : function(elm) {  var _ = this;

      _log.d("PROCESSING CONTROLS ON "+$(elm).html());

      //ACCORDION
      $(elm).find('.collapseme').each(function() {

          _log.d("PROCESSING AN ACCORDION")

          var target = $(this);


          target.collapse({
                      open: function() {
                          this.slideDown(100);
                      },
                      close: function() {
                          this.slideUp(100);
                      },
                      accordion: true
           });

           target.bind("opened", function(e, section) {

             //TODO : ABSTRACT ICONS / TARGET
/*
                     var chevronTarget     = $(e.target).attr('chevron-target');
                     var chevronIconOpen   = $(e.target).attr('chevron-icon-open');
                     var chevronIconClose  = $(e.target).attr('chevron-icon-close');


                    chevronTarget
                     .html('')
                     .removeClass( chevronIconOpen )
                     .addClass( chevronIconClose );
*/

                    $(e.target).children("a").children('span').html('')
                    .removeClass( "fa-chevron-circle-down").addClass("fa-chevron-circle-up");

                      setTimeout(function() {
                          _.currScrolls[0].refresh();
                      }, 800);

                  });

            target.bind("closed", function(e, section) {
/*
                      var chevronTarget     = $(e.target).attr('chevron-target');
                      var chevronIconOpen   = $(e.target).attr('chevron-icon-open');
                      var chevronIconClose  = $(e.target).attr('chevron-icon-close');


                     chevronTarget
                      .html('')
                      .removeClass( chevronIconClose )
                      .addClass( chevronIconOpen );
*/
$(e.target).children("a").children('span').html('')
.removeClass( "fa-chevron-circle-up").addClass("fa-chevron-circle-down");

                       setTimeout(function() {
                           _.currScrolls[0].refresh();
                       }, 800);

                   });



        });



    },

    currTab       : false,
    currTabTarget : false,
    currTabFID    : false,
    tabBusy       : false,
    tabScrollYCache : {},
    tabContentCache : {},
    currTabCallback : false,

    switchTab : function(tab, FID, change) { var _ = this;


      _log.d("SWITCHTAB CALLED ON FACE "+FID+" // CHANGE : "+change);

      if( _.tabBusy )
       {
          _log.d("CARD ENGINE BUSY. RETURNING");
          return;
       }


      var target = $(tab).attr('target');

      _log.d("SWITCHTAB TARGET IS "+target);

      //SAME TAB
      if(_.currTabTarget && _.currTabTarget == target) { _log.d("SAME TAB. NOT SWITCHING"); return;  }

      _.tabBusy = true;





      //REMOVE TAB STYLES
      $('#'+FID).find('.tabSetTab').removeClass('tabSelected');



      //FADE THE CONTENT

      var timeout = 500;

      layout.showLoader('#000', false);

      //SEE IF PREV
      if(_.currTab)
       {
          $(_.currTab).animate({opacity:0}, {duration:300, complete: function(){




              //CAPTURE THE SCROLLPOS
              _.tabScrollYCache[_.currTabTarget] = _.currScrolls[0].y;

            //  $('.tabSetContent').removeClass('scroll').css({zIndex:-10}).hide();

              _.currTab.removeClass('scroll').hide();


              $(tab).addClass('tabSelected');


          }});
       }
       else
       {
         timeout = 0;
       }


       setTimeout(function() {

         //GET THE CONTENT
         var content = null;
         if(typeof _.tabContentCache[target] == 'undefined')
         {

             content = $('#'+target).html();
             content = _cardEngine.processTagsFromXML(content);
             _.tabContentCache[target] = content;
         }
         else
         {
             content = _.tabContentCache[target];
         }

         //INJECT CONTENT
//         $('#'+FID).find('[name="'+target+'"]').find('ul').html(content);
          $('#'+FID).find('.tabSetContent').find('ul').html(content);


   //_log.limit(1000000000);  _log.d("TAB ---> CARD HTML IS : "+ $('#'+FID).html()); _log.limit(1000);

         //TRY DESTROY CURRENT
         layout.destroy('#'+_.currTabFID);


         //FIND THE CONTROLLER
         var faceID = FID.replace('__FACE', '');
         _.currTabFID = faceID;

         _log.d("RE-ATTACHING FACE "+faceID);
         layout.attach("#"+faceID, true);


/*
         _log.d("CURRSCROLLS : ");

         for(var i in _.currScrolls)
         {
            _log.d("====> "+i);
         }


*/





       _.currTab = $('#'+FID).find('.tabSetContent');

       _.processControls(_.currTab);

       _.currTabTarget = target;

       if(change)
       {
         try { change(target); } catch(e) { _log.e("COULD NOT CALL TAB CHANGE CALLBACK "+change+" ----> "+e); }
       }





       _.currTab.css({left:0}).show().addClass('scroll').delay(600).animate({opacity:1}, {duration: 300, complete: function() {

         _.tabBusy = false;

         _.initScroll( $('#'+FID).closest('.card-container'), 'front');

         if(typeof   _.tabScrollYCache[_.currTabTarget] != 'undefined')
         {
           _.currScrolls[0].scrollTo(0,_.tabScrollYCache[_.currTabTarget]);
         }
         else
         {
           _.currScrolls[0].scrollTo(0,0);
         }



         setTimeout(function() {     layout.hideLoader(); }, 500);


       }});

       }, timeout);




     // _scroll.add( $('[name="'+target+'"]')[0] );


     },


    insert : function(face, element, xml, cb)
    {

       alert("inserting onto card "+face+" element "+element+" xml : "+xml);

       if(typeof cb == 'undefined') { cb = function() { }; }

        $('#'+face+'__FACE').find(element).html(xml);

          var elm = $('#'+face+'__FACE').find('.cardContent');


        _.dynamicResize(elm);






    },

    currSearchBtn : null,
    hideSearch : function() {  var _ = this;

      if(_.lastSearchTarget)
      {

      var hasSearch = _.lastSearchTarget.find('.cardSearch');
      if(hasSearch.length > 0)
       {

          _.currSearchBtn.html('&#xf002;');


          hasSearch.animate({height:0}, {duration:300, complete:function() {

               for(var t in _.currSearchTargets)
               {
                  for(var i in _.currSearchTargets[t])
                   {
                      _.currSearchTargets[t][i].obj.show();
                   }
               }

               hasSearch.remove();

          }});

          return true;

       }
      else
       {
         return false;
       }

     } else { return false; }


    },


    currSearchTargets : [],
    lastSearchTarget  : false,
    showSearch : function(cid, fid, elm, settings, btn) { var _ = this;

      // alert('show search : '+cid+' '+fid+' '+settings);

       //SEE IF SEARCH ALREADY VISIBLE
        var target =  $(elm).find('#'+fid);

        _.lastSearchTarget = target;


        var hadSearch = _.hideSearch();
        if(hadSearch) { return; }

        _.currSearchBtn = $(btn);
        _.currSearchBtn.html('&#xf00d;');



        //PRELOAD INTO MEM
        var searchTargets = {};
        for(var i in settings.search)
         {
           searchTargets[settings.search[i]] = [];

           target.find('.'+settings.search[i]).each(function() {

                           searchElm = {obj:$(this).closest('li'), match:$.trim($(this).html()).toUpperCase()};
                           _log.d('SEARCH ---> PRECACHED .'+settings.search[i]+' WITH VALUE '+$(this).html().toUpperCase());
                           searchTargets[settings.search[i]].push(searchElm);

           });
         }

         _.currSearchTargets = searchTargets;

         _log.d("SEARCHTARGET BUFFER LENGTHS ARE : ");
         for(var i in searchTargets)
          {
              _log.d("                        "+i+" --> "+searchTargets[i].length);
          }


        var input = $('<input />').attr('placeholder', 'Search...')
                              .attr('type', 'text')
                              .attr('fields', settings.search)
                              .data('searchTargets', searchTargets)
                              .data('contentTarget', target.find('.cardContent'))
                              .addClass('cardSearchInput')
                              .off().on('keyup', function(evt) {

                                 var _ref = $(evt.target);
                                 var val = _ref.val().toUpperCase();


                                 //ONLY TRIGGER ON ENTER
                                 var keycode = (evt.keyCode ? evt.keyCode : evt.which);
                                 if (keycode == '13' || val == '' ) {


                                                                    $(this).remove('.trigger');

                                                                    var _ref = $(evt.target);
                                                                    var val = _ref.val().toUpperCase();

                                                                    var _searchTargets = $(this).data('searchTargets');

                                                                    //RESET MATCHES
                                                                    for(var t in _searchTargets)
                                                                    {

                                                                      var _searchTarget = _searchTargets[t];

                                                                      for(var i in _searchTarget)
                                                                      {
                                                                         _searchTarget[i].obj.data('hadMatch', false);
                                                                      }

                                                                    }


                                                                    //DO THE SEARCH
                                                                    for(var t in _searchTargets)
                                                                    {
                                                                      var _searchTarget = _searchTargets[t];

                                                                      for(var i in _searchTarget)
                                                                      {
                                                                               matchVal = _searchTarget[i].match;
                                                                               if(matchVal.indexOf(val) > -1)
                                                                                {
                                                                                    _log.d("FOUND : "+val+' IN '+matchVal);

                                                                                    _searchTarget[i].obj.data('hadMatch', true);
                                                                                    _searchTarget[i].obj.show();
                                                                                }
                                                                               else if(!_searchTarget[i].obj.data('hadMatch'))
                                                                                {
                                                                                  _log.d("NOT FOUND : "+val+' IN '+matchVal+' AND hadMatch == false');

                                                                                   _searchTarget[i].obj.hide();
                                                                                }

                                                                      }

                                                                    }


                                                                    //trigger a refresh..
                                                                    $(this).data('contentTarget').append('<x class="trigger"></x>');



                                 }





                              });


        var btnSearchClear = $('<div />')
                              .css({
                                  fontFamily : 'Helvetica',
                                  fontSize : '12pt',
                                  color    : 'rgba(0,0,0,0.7)',
                                  position : 'absolute',
                                  top : 14, right:15

                               })
                              .html('CLEAR')
                              .on('click', function() {


                                  var e = jQuery.Event("keyup")
                                  e.keyCode = '8';
                                  $('.cardSearchInput').val('').trigger(e);

                              });

        search = $('<div />').addClass('cardSearch')
                            .css({

                                width: '100%',
                                height:50,
                                position: 'absolute',
                                left:0,
                                top:40,
                                zIndex:20000


                            }).append(input).append(btnSearchClear) //.animate({height:50}, {duration:300});



         wrapper = $(elm).find('#'+fid).find('.contentWrapper');
      //   var _currH = $(wrapper).find('.cardContent').outerHeight();
      //   $(wrapper).find('.cardContent').css({height:_currH - 50});

         $(search).insertBefore(wrapper).find('.cardSearchInput').focus();




    },

    dynamicResize : function(elm, face) { _ = this;

            face = (typeof face == 'undefined') ? 'front' : face;

            if(_.opts.fill) {


               var _contentHeight = parseInt(_.opts.height) - parseInt(_._hH) - parseInt(_._fH)

            }
            else
            {
                 var _contentHeight = $(elm).find('.'+face).find('.cardContent').outerHeight();
              //   var _contentHeight = $(elm).find('.'+face).find('.contentWrapper').outerHeight();

            }

            _log.d("DYNAMIC RESIZE -> contentHeight : "+_contentHeight);
            var _cardHeight = parseInt(_contentHeight) + parseInt(_._hH) + parseInt(_._fH);

            _log.d("DYNAMIC RESIZE -> cardHeight : "+ parseInt(_contentHeight) +" + "+ parseInt(_._hH) +" + "+ parseInt(_._fH)+ " = "+_cardHeight);

            _log.d("DATA : FINDING ELM "+elm+" WITH FACE ."+face+" FOR DATA currWidth");

						var wTarget = $(elm).find('.'+face).find('.cardContent');

            _log.d("DATA : GOT DATA "+JSON.stringify(wTarget.data()));
            var _cardWidth  = wTarget.outerWidth();

            if(!$(elm).data('currWidth'))
						 {
                _cardWidth -= (layout.gapHeight);
								$(elm).data('currWidth', _cardWidth);
								_log.d("DYNAMIC RESIZE --> WIDTH NOT SAVED --> SAVING "+_cardWidth);
					   }
						else
						 {
							  var _cardWidth = $(elm).data('currWidth');
								_log.d("DYNAMIC RESIZE --> WIDTH SAVED --> RESTORING TO "+_cardWidth);

					   }


            _log.d("DYNAMIC RESIZE ON [PRE] : "+face+" -> CONTENT HEIGHT : "+_contentHeight);
            _log.d("DYNAMIC RESIZE ON [PRE] : "+face+" -> CARD HEIGHT : "+_cardHeight+" x "+_cardWidth);
            _log.d("DYNAMIC RESIZE ON [PRE] : HEIGHTLIMIT = "+_.heightLimit+ " / WIDTHLIMIT = "+_.widthLimit);


             //RE-ADJUST LIMITS

             if(_cardHeight > _.heightLimit)
             {
                _cardHeight = _.heightLimit;
                _contentHeight = parseInt(_cardHeight) - parseInt(_._hH) -  parseInt(_._fH);


                    _cardHeight -= layout.gapHeight;
                    _contentHeight -= layout.gapHeight;


             }


              if(_cardWidth > _.widthLimit)
             {
                _cardWidth = _.widthLimit;

             }




            _log.d("DYNAMIC RESIZE ON [POST] : "+face+" -> "+_contentHeight);
            _log.d("DYNAMIC RESIZE ON [POST] : "+face+" -> "+_cardHeight+" x "+_cardWidth);

						//SEE IF LEFT ADJUST IS REQUIRED TO CENTER RELATIVE TO CONTAINER...

						var elmContainer = _.container;
						var oW = $(elmContainer).outerWidth();
            var oH = $(elmContainer).outerHeight();

            _log.d("CONTAINER DIMS ARE : "+oW+" x "+oH);


            //POSITION
            var _TOP =  (oH/2) - (_cardHeight/2);
            var _LEFT = (oW/2) - (_cardWidth/2);
            _log.d("FINAL CARD POS IS : top "+_TOP+" / left "+_LEFT);
            $(elm).css({top: _TOP, left:_LEFT });





            $(elm).find('.card-container').css({height: _cardHeight, width:_cardWidth});
            $(elm).find('.contentWrapper').css({height: _contentHeight, width:_cardWidth});

             _.initScroll(elm, face);


    },

    refreshScroll : function()
    {
        _ = this;
        if(typeof _.currScrolls != 'undefined')
        {
            for(var i in _.currScrolls)
             {
               _.currScrolls[i].refresh();
             }
        }

    },


    currScrolls : [],
    initScroll : function(elm, face) {   _ = this;


        if(_.currScrolls.length > 0) {

              _log.d("DESTROYING CURRENT SCROLLS");

              for(var i in _.currScrolls)
              {
                try { _.currScrolls[i].destroy(); } catch (e) {  _log.d("COULD NOT DESTROY CURR SCROLLS");  }
              }
                _.currScrolls = [];

        }


          var currFace = $(elm).find('.'+face);
          var faceID = currFace.attr('id');




        _log.d("SCROLL FACE ID IS "+faceID);

        var settings = ( typeof _.faces[faceID].settings == 'undefined' ) ? {} : _.faces[faceID].settings;

        var inertia = (typeof settings.inertia != 'undefined' && !settings.inertia) ? false : true;

        _log.d("INIT SCROLL : FID "+faceID+" // INERTIA "+inertia);


        //INIT SCROLL ON CUSTOM TARGETS (IF ANY)
        var targets = currFace.find('.scroll');

        _log.d("CUSTOM TARGETS LENGTH : "+targets.length);

        var hasCustomScrolls = false;
        targets.each(function() {

            if($(this).css('display') != 'none')
             {
               var target = $(this);
               hasCustomScrolls = true;

               _log.d("FOUND NOMINATED SCROLL");

                 //SET HEIGHT
                 var tabCont = $(target).closest('.cardContent').find('.tabSetContentContainer');
                 var tH = _._cH;

                 if( tabCont.length )
                 {
                    tH = tabCont.outerHeight()
                 }

                 _log.d("NO HEIGHT SET ON NOMINATED SCROLL WRAPPER -> SETTING AUTOMATICALLY TO DETECTED HEIGHT ("+tH+")");


                 $(target).css({height : tH });

                 if(typeof settings.refresh != 'undefined' && settings.refresh)
                  {
                    var refreshTarget = $(target).find('ul');
                    _.currScrolls.push(  _scroll.add(target[0], refreshTarget, function(cb) {


                           //SYNC THE FUCKER
                           sync.syncOne(settings.refresh, function(status) {

                              //  alert('refresh done with status : '+status);





                                     try
                                    {



                                     cmd = "setTimeout(function() { _"+$(elm).attr('id')+".onLoaded(false, false, function(lock) { }); }, 2000);";
                                     _log.d("executing : "+cmd);
                                     eval(cmd);

                                    }
                                   catch (e)
                                    {
                                     _log.d('could not call onLoaded for '+layout.lastLoadedView);

                                    }


                                    cb();




                             });


                    }, inertia, !_.isFlipped ));


                  }
                else
                  {
                    _.currScrolls.push(  _scroll.add(target[0], false, false, inertia, !_.isFlipped ));
                  }




             }

        });


        //INIT SCROLL ON THE DEFAULT SCROLLTARGET
        if(!hasCustomScrolls)
        {


           var target        = currFace.find('.scrollTarget');
           var refreshTarget = '.cardContent';


           if(typeof settings.refresh != 'undefined' && settings.refresh)
            {

              _log.d("FACE IS REFRESHABLE WITH SERVICE : "+settings.refresh);

                _.currScrolls[0] =  _scroll.add(target[0], target.find(refreshTarget), function(cb) {


                       //SYNC THE FUCKER
                       sync.syncOne(settings.refresh, function(status) {

                          //  alert('refresh done with status : '+status);





                                 try
                                {



                                 cmd = "setTimeout(function() { _"+$(elm).attr('id')+".onLoaded(false, false, function(lock) { }); }, 2000);";
                                 _log.d("executing : "+cmd);
                                 eval(cmd);

                                }
                               catch (e)
                                {
                                 _log.d('could not call onLoaded for '+layout.lastLoadedView);

                                }


                                cb();




                         });


                }, inertia, !_.isFlipped);



            }
           else
            {

           //    setTimeout(function(){

                _.currScrolls[0] =  _scroll.add(target[0], false, false, inertia, !_.isFlipped);

           //   }, 2000);

            }



        }

      //  alert('==>'+target.length);



        //_log.d("===>"+$(target).html());

      //  alert('qq');





    },


    revert : function()  {



    },



    isFlipped : false,
    flipBusy  : false,
    currBackElm : null,
    flipTo : function(targetID, elm, _opts, cb)
    {
       var _ = this;

       if(typeof cb == 'undefined') { cb = false; }


       //$(elm).addClass('zoomOut');
        _log.d("CARD INSTANCE FLIP TO "+targetID+" (FLIP BUSY -> "+_.flipBusy+")");


        if(_.flipBusy) { return; }

          window.moveTo(0,0);


        _.flipBusy = true;

        setTimeout(function() { _.flipBusy = false; }, 1000);


        //ADD THE CONTENT TO THE BACK OF THE CARD.
        _elm = $(elm);

        //block all events
        var evtElm = _elm.find('.card-container');
        evtElm.off().on('click touchstart touchend', function(e) { e.preventDefault(); e.stopPropagation;  });
        setTimeout(function() {

             evtElm.off().on('touchstart', function() {

               _scroll.blurFields();

             });

        }, 1000);


        flip = ( _elm.attr('flip') ) ? _elm.attr('flip') : 'lr';
/*
      var opts = {
         direction: flip,
         speed: '400ms',
         timingfunction: 'ease-in-out-circ'
       }
*/
        var opts = {
        direction: flip,
        speed: '300ms',
        timingfunction: 'ease-out-cubic'
        }


       //BLUR ALL INPUTS
       //_elm.find('input').each(function() {  $(this).blur(); })
        _elm.find('input').blur();


        var _elmBack = _elm.find('.back');




       //alert(targetID);


        if(targetID != 'close' && !_.isFlipped)
         {
             //find the back xml..

             if(typeof _.faces[targetID+'__FACE'] == 'undefined')
             {
               _log.d("INVALID TARGET ID SPECIFIED. CANNOT FLIP TO "+targetID);
               return;
             }

            var xml = _.faces[targetID+'__FACE'].xml

          //  _log.d("FACE XML IS "+xml);

           _.currBackElm = _elm;

        //    var _XML = $(xml).css({opacity:0}).delay(3000).animate({opacity:1}, 300);


            //add it to the cards back...
            _elmBack.html(xml).find('.cardContent').hide();


            if(typeof _.faces[targetID+'__FACE'].controller != 'undefined')
              {

                _elmBack.attr('ng-controller', _.faces[targetID+'__FACE'].controller );

              }
            if(typeof _.faces[targetID+'__FACE'].id != 'undefined')
              {
                _elmBack.attr('id', _.faces[targetID+'__FACE'].id );
              }



           // _log.d("ELM HTML IS : "+elm.html());
            _.isFlipped = true;

            _elm.find('.front').find('.cardContent').hide();


            //resize -> add small delay to give jq time to finish adding the xml;
            if(_opts.dynamic) { setTimeout(function()
               {
                 _.dynamicResize(elm, 'back');

               }, 50);
               }
            else
               {
                 _elmBack.find('.contentWrapper').css({height: _._cH});

               }




             //REVALIDATE - WITh TIMEOUT --> GIVE MODEL TIME TO APPLY VALUES..
               setTimeout(function() {



               _elm.find('.back').find('.cardContent').find('input').each(function() {

                   var elm = $(this);
                  _cardEngine.validateFormElement(elm);

               });

                }, 1200);


             //ADD MUTATION LISTENER FOR THE BACK
/*
             var evtElm = _elmBack.find('.cardContent');
             evtElm.off().on('touchEnd', function() {

               evtElm.find('input').blur();

             });
*/
             _elmBack.find('.cardContent').off().on('DOMChanged',  $.debounce( 250, function(event) {

                id = $(event.target).closest('.back').attr('id');

                //TAKE THE SCROLLER POSITIONS...
                var currYs = [];
                if(typeof _.currScrolls != 'undefined' && _.currScrolls.length > 0)
                 {
                    for(var i in _.currScrolls)
                    {
                      if(typeof _.currScrolls[i] != 'undefined')
                      {
                        _log.d("B CURR SCROLL Y IS : "+_.currScrolls[i].y) ;
                        currYs.push(_.currScrolls[i].y);
                      }

                    }
                 }


                id = $(event.target).closest('.front').attr('id');

                _log.d("CARD MUTATION ON "+id);
                _.dynamicResize( _.currBackElm , 'back');

                //PUBLISH IT
                $.pubsub( 'publish', 'cardMutation', { id : id, currYs : currYs} );






               if(typeof _.currScrolls != 'undefined' && _.currScrolls.length > 0 )
                {
                  for(var i in _.currScrolls)
                  {
                    if(typeof _.currScrolls[i] != 'undefined')
                    {
                     _.currScrolls[i].scrollTo(0,currYs[i]);
                    }
                  }

                }



             }));


             //INITIALIZE ANY WIDGETS
             // TODO --> MOVE THIS OFF INTO A "PLUGIN" ARCHITECTURE

             //SIGNATURE
             _elm.find(".SIGNATURE").jSignature({height:200, width:300, left:0});


             //SEE IF THERE IS A RELEASE
             if(cb)
             {


               //SHOW THE LOADER
               _elmBack.find('.cardContent').hide();
               _elmBack.data('CBR_ORIGINAL', _elmBack.find('._tr').html());
               _elmBack.find('._tr').html('<img src="img/loader_black.gif" width="20" />');

               //_elmBack.css({opacity:0}).delay(3000).animate({opacity:1}, 300);
               cb(function() {

                 _log.d("RELEASE CALLED");

                   layout.attach('#'+targetID);






                 setTimeout(function()
                  {

                  //  _elm.find('.front').find('.cardContent').hide();
                   _elmBack.find('.cardContent').show();
                   _elmBack.find('._tr').html(_elmBack.data('CBR_ORIGINAL'));


                    setTimeout(function() {

                         _.initScroll(_elm, 'back');

                      }, 500);



                  }, 500);


               });

             }
             else
             {
               _elmBack.find('.cardContent').show();

               //CALL THE CONTROLLER
               setTimeout(function()
               {

                 layout.attach('#'+targetID);
                 //  _elm.find('.front').find('.cardContent').hide();
                 setTimeout(function()
                  {

                    _.initScroll(_elm, 'back');


                  }, 500);


               }, 500);


             }

            // alert('adding');

            //FLIP IT.
             _log.d("FLIPPING ELM : "+$(elm).attr('id')+" -> "+$(elm).find('.card-container').length);

             try
             {
             	_elm.find('.card-container').flip(opts);
             }catch(err)
             {
             	alert(err);
             }







         }
        else
         {  //UNFLIP THE CARD


             _.isFlipped = false;
             _elm.find('.front').find('.cardContent').show();

            if(_opts.dynamic) { setTimeout(function() { _.dynamicResize(elm, 'front');  }, 10); }

               _.initScroll(_elm, 'front');

              //reset back state
              _elm.find('.back').find('.cardContent').off();
              _.currBackElm = null;

              //REMOVE BACK (RESETS ANGULAR AS WELL)
              _elm.find('.back').remove();
              _elm.find('.card').append('<div class="back cardFace"></div>');

              //FLIP IT.
               _log.d("FLIPPING ELM : "+$(elm).attr('id')+" -> "+$(elm).find('.card-container').length);

               _elm.find('.card-container').flip(opts);




         }















    },

    abort : function(msg)
    {
        msg = (!msg) ? 'AN ERROR OCCURRED' : msg;
        _log.d("CARD INSTANCE ABORTED WITH MESSAGE : "+msg);

        _modal.show('warning',
            'COULD NOT LOAD CARD',
            msg,
            false,
            function () {
                //CANCEL THE SYNC
                layout.isBusy = false;
                layout.showDefault();

                _modal.hide();


            });


    }


}
;;
