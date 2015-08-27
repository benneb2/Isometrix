menu = {

	xml  : '',
	open : false,
	isBusy : false,

	currSelected : false,

	transitionTime : '0.5s',

	init : function() {
/*

position: absolute;
top: 65%;
left: 25px;

*/


		if(device.platform != "iOS")
		 {
			$('#linkMenuWrapper').find('.icon').css({ position: 'relative', top:'-3'});
		 }



	   $('#linkMenuWrapper').find('.icon').css({zIndex:1000}).off().on(_util.getEvt(), menu.toggle);
		xml = '<div class="menuHeaderLeft" style="height:'+( app.toolbarHeight + app.toolbarGapHeight )+'px;"><center><table style="width:100%; height:'+( app.toolbarHeight + app.toolbarGapHeight )+'px;"><tr><td valign="middle"><center><img src="img/logomain.png" height="30" style="margin-right:15px; max-width:120px;" /></center></td></tr></table></center></div><div id="menuScroll" style="height:'+(_screen._iH)+'; overflow:hidden; cursor:pointer;"><ul>';



	    $('#linkMenuWrapper').find(".icon").bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
	      $('.tap').removeClass('active');
	    });





		for(var i in layout.currLayout)
		{

			_item = layout.currLayout[i];

				//CHECK IF LOGOUT -> HIDE IF LOGIN DISABLED..
					  if(typeof _item.action != 'undefined' && _item.action == 'app.logout')
						 {
										if(typeof client.currConfig.SETTINGS.login.enabled != 'undefined')
										{
												enabled = client.currConfig.SETTINGS.login.enabled;
												if(!enabled)
												{

														continue;

												}

										}
						 }



			if(_item.menu)
			 {
				 // alert(JSON.stringify(_item));
					//process roles
					if(typeof _item.roles != 'undefined')
					 {

							 checker = [];
							 for(var c in _login.roles)
								{
								   if(typeof _login.roles[c] != 'undefined' && typeof _login.roles[c].role != 'undefined') {
										 _log.d("pushing role : "+_login.roles[c].role);
									   checker.push(_login.roles[c].role.toUpperCase());
								   }
								}

						 	 //see if required roles are provided
							 var hasRole = false;
							 for(var r in _item.roles)
							 {
								 	 if( $.inArray(_item.roles[r].toUpperCase(), checker) > -1 )
										 {
										    hasRole = true; break;
										 }
							 }

							if(!hasRole)
							 {
								 	_log.d("USER ROLES "+JSON.stringify(_login.roles)+" CANNOT ACCESS VIEW ("+_item.label+") WITH ROLES "+JSON.stringify(_item.roles));
									continue;
							 }
						  else
							 {
								 	_item.canView = true;
							 }

					 }
				 else
					 {
						  	  _item.canView = true;
					 }

			 	  var subtext = "";
			 		if (_item.subtext) {

			 			subtext = _item.subtext;

			 		}

			 		if (_item.icon) {

			 			icon = '<td class="gui-extra" style="font-size:18pt; width:25px; max-width:25px;min-width:25px; overflow:hidden">'+_item.icon+'</td>';

			 		} else { icon = ''; }

					seg = "    <li class='menuTarget menuItem item_"+i+"' style='padding:10px; position:relative;' onClick='menu.go(this, \""+i+"\")'>"
						+ "    <table style='padding:5px;'>"
						+ "       <tr>"+icon+"<td style='padding-left:15px; font-family: HelveticaNeue-Light; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); width:200px; font-size:20pt; color:#ccc;'>"+_item.label+"<br /><div class='menuSubText'>"+subtext+"</div></td>"
					//	+ "           <td class='gui' style='vertical-align:middle' width='10'>></td>"
						+ "         </tr>"
						+ "    </table></li>";


					xml += seg;


			 }
		}


			appVers =  _bootConfig.APPVERSION;
			baseVers = client.currConfig.baseVersion;
			coreVers = client.currConfig.coreVersion;
			qas      = client.currConfig.DEBUG;


			//descString = ' <img style="padding-top:4px;" src="img/logo_plain.png" width="150" /> ';
			// descString = client.currConfig.SETTINGS.appDescription;

			  if(typeof client.currConfig.DESCSTRING != 'undefined')
			   {
 				    descString = client.currConfig.DESCSTRING;
			   }
			  else
			   {
			   	  descString = "<x style='font-size:12pt;'><img src='img/atajo_o.png' width='18' /> ATAJO<br /><x style='font-size:7pt;'>MOBILITY CORE</x></x>";
			   }

		     xml += "</ul></div>" +
		            "<div class='menuFooterLeft' style='height:40px;'><table style='height:40px; width:100%'><tr><td align='left' style='padding-left:10px;' valign='middle'>"+descString+"</td>" +
                "<td align='right' onclick='menu.showAppInfo()'><x class='fa fa-info-circle' style='font-size:18pt; padding-right:10px;'></x></td></tr></table></div>";

						//		         + " <td align='right'>"+_bootConfig.APPVERSION+"</td><td   style='padding-right:10px;' align='right'>"+client.currConfig.RELEASE+"<br /><x style='font-size:7pt;'>"+client.currConfig.baseHash.substring(0,12)+"</x></td></tr></table></div>";

				menu.xml = xml;


	},

	go : function(item, nam) {

		// alert("GO " + nam);
		 if(!layout.isBusy)
		 {
        menu.toggle();
        menu.currSelected = nam;
	   	  layout.show(nam);
		 }

	},

	lastLayoutId : false,
	setHighlight : function(nam) {

		menu.lastLayoutId = nam;

		//remove all highlights
		$('.menuTarget').each(function() {

				$(this).removeClass('menuItemSelected').addClass('menuItem');

		});

		$('.item_'+nam).removeClass('menuItem').addClass('menuItemSelected'); //css({background: 'blue'})


	},

	toggle : function(e) {

		if(typeof e != 'undefined') { e.preventDefault();  }

		if(menu.isBusy) { return; }

		menu.isBusy = true;


			$('#linkMenuWrapper').find(".icon").toggleClass('active');
			$('.tap').addClass('active');




				if(menu.open)
					{
						_log.d("MENU IS OPEN --> CLOSING");
					//	$('#linkMenu').removeClass('gui').addClass('gui-extra').html(menu.iconBuff);

 						 var elm = $('#leftMenuContent');
						 elm.css({transform : 'translate(0px,0)', transition: 'all 0.4s ease'});


						if(menu.transitionTime == '0.0s')
						{
							menu.isBusy = false;
							menu.open = false;
							elm.remove();
							$('body').prepend('<div id="leftMenuContent"></div>');



						}
						else
						{
						setTimeout(function() {

							menu.isBusy = false;
							menu.open = false;
							elm.remove();
							$('body').prepend('<div id="leftMenuContent"></div>');



							}, 500);
						}






						 $('#mainContainer').css({transform : 'translate(0px,0)', transition: 'all '+menu.transitionTime+' ease'});


					}
					else
					{


						_log.d("MENU IS CLOSED --> OPENING");



						//blur all inputs..
						$('input').blur();

						dX = 300;  if(dX > _screen.W - 45) { dX = _screen.W - 45; }

						menu.iconBuff = $('#linkMenu').html();

				//		$('#linkMenu').removeClass('gui-extra').addClass('gui').html('x');

						var elm = $('#leftMenuContent');


						 elm.css
						 ({
						 	 height: _screen.H,
						 	 maxWidth:dX,
						 	 width:dX,
						 	 zIndex:4,
						 	 opacity:1,
						 	 position: 'absolute',
						 	 left: -50,

						 	 top:0
						 })
						 .show()
						 .html(menu.xml)
						 .css({transform : 'translate(50px,0)', transition: 'all 0.4s ease'});


						  if(menu.lastLayoutId)
						   {
						   	 menu.setHighlight(menu.lastLayoutId);
						   }


						// $('#menuScroll').css({height:_screen.H - 45});

						if(menu.transitionTime == '0.0s')
						{
							menu.open   = true;
							menu.isBusy = false;

						}
						else
						{
						setTimeout(function() {

							menu.open   = true;
					   	menu.isBusy = false;


						 }, 500);
					  }

						 $('#mainContainer').css({transform : 'translate('+dX+'px,0)', transition: 'all '+menu.transitionTime+' ease'});






						 setTimeout(function() {

						 	var target = $('#menuScroll');

						 	scroll  =  _scroll.add(target[0]);


						}, 50);

				    }

	},


	showAppInfo : function() {

			_log.d("SHOW APP INFO");

			var coreHash   = window.localStorage.getItem('LAST_CORE_HASH');
			var baseHash   = window.localStorage.getItem('LAST_BASE_HASH');
			var appVersion = _bootConfig.APPVERSION;
			var appRelease = _bootConfig.RELEASE;

			var xml = "  <x style='font-size:8pt;'><u>DEVICE ID</u></x><br />"+atajo.client.UUID+"<br /><br />" +
								"  <x style='font-size:8pt;'><u>DEVICE MODEL</u></x><br />"+atajo.client.DEVICE.model+"<br /><br />" +
								"  <x style='font-size:8pt;'><u>DEVICE OS</u></x><br />"+atajo.client.DEVICE.platform+"<br /><br />" +
								"  <br /><br />" +
								"  <x style='font-size:8pt;'><u>APP VERSION</u></x><br />"+appVersion+"<br /><br />" +
								"  <x style='font-size:8pt;'><u>APP RELEASE</u></x><br />"+appRelease+"<br /><br />" +
								"  <br /><br />" +
								"  <x style='font-size:8pt;'><u>CORE HASH</u></x><br /><x style='font-family:courier'>"+coreHash+"</x><br /><br />" +
								"  <x style='font-size:8pt;'><u>BASE HASH</u></x><br /><x style='font-family:courier'>"+baseHash+"<br /><br />";


			var init =
			{
				icon      : 'fa-info-circle',
				title     : 'ABOUT APP',
				canCancel : false,
				onOk      : function() { atajo.modal.hide(); },
				content   : xml

			};


			atajo.modal.basic(init);


	},


}
;;
