/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadReserve
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 1
 *  #  DESCRIPTION   : load reservation reserve table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function loadReserve(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationReserve&query=limit=100`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`start=`status=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesReserved').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trReserved' rIds='"+row[a].getAttribute('ResourceId')+"' uId='"+row[a].getAttribute('DeviceReservationUserId')+"' rId='"+row[a].getAttribute('ResourceId')+ row[a].getAttribute('DeviceReservationUserId')+"'>";

				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
				html += "<td>"+row[a].getAttribute('QueueTime')+"</td>";
				html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				html += "<td>"+row[a].getAttribute('DomainName')+"</td>";
				html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
				html += "<td>"+row[a].getAttribute('ConsoleIp')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				var startRes = row[a].getAttribute('StartReservation').split(" ");

				html += "<td>"+startRes[0]+"</td>";
				html += "<td>"+startRes[1]+"</td>";
                html += "<td>"+row[a].getAttribute('DeviceReservationUserId')+"</td>";
				html += "<td>"+row[a].getAttribute('UserDomainName')+"</td>";
				html += "<td>"+row[a].getAttribute('ReservedFrom')+"</td>";
				html += "<td>"+row[a].getAttribute('TimeInterval')+"</td>";
                html += "<td>"+row[a].getAttribute('Recurrence')+"</td>";
				html += "<td>"+row[a].getAttribute('IterNumber')+"</td>";
				html += "<td>"+row[a].getAttribute('Exclusivity')+"</td>";
				var endRes = row[a].getAttribute('EndReservation').split(" ");
				html += "<td>"+endRes[0]+"</td>";
				html += "<td>"+endRes[1]+"</td>";
                html += "<td>"+row[a].getAttribute('Status')+"</td>";
				html +="</tr>";
				
			}
			$("#reservationRM-table > tbody").empty().append(html);
			$("#reservationRM-table").table("refresh");
			globalPageRM = "ReservationReserve";
			$('#resourceManagementPage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trReserved").on("tap",function(){
				globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				   	$('#ReserveButtons').show();
					var val = $(this).attr('rId');
					groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					var val = $(this).attr('rId');
					groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
				if(ctr == 0){
					$('#ReserveButtons').hide();
				}	
			});
			filterReservationReserve();	
		}
	});
	
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadReserveRelease
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 17,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 1
 *  #  DESCRIPTION   : loads the table of selected reservation to be release
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadReserveRelease(){
		
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getseldev&query=limit=10`page=1`resourceid='+globalResourceId;
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesRelease').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trReservedRelease' devId='"+row[a].getAttribute('DeviceId')+"' rId='"+row[a].getAttribute('ResourceId')+ row[a].getAttribute('DeviceReservationUserId')+"'>";
				html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				var startRes = row[a].getAttribute('StartReservation').split(" ");
				html += "<td>"+startRes[0]+"</td>";
				html += "<td>"+startRes[1]+"</td>";
                html += "<td>"+row[a].getAttribute('User')+"</td>";
				html += "<td>"+row[a].getAttribute('ReservedFrom')+"</td>";
				html += "<td>"+row[a].getAttribute('TimeInterval')+"</td>";
                html += "<td>"+row[a].getAttribute('Recurrence')+"</td>";
				html += "<td>"+row[a].getAttribute('IterNumber')+"</td>";
				var endRes = row[a].getAttribute('EndReservation').split(" ");
				html += "<td>"+endRes[0]+"</td>";
				html += "<td>"+endRes[1]+"</td>";
                html += "<td>"+row[a].getAttribute('Status')+"</td>";
				html +="</tr>";
				
			}
			$("#RMReleaseDevice-table > tbody").empty().append(html);
			$("#RMReleaseDevice-table").table("refresh");

			 $('#ReleaseDevice').trigger('create');
			 $(".trReservedRelease").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				}else{
 	        		$(this).removeClass('highlight');
				}
			});
		}
	});
}
function loadReserveEdit(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getseldev&query=limit=10`page=1`resourceid='+globalResourceId;
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
		
			$('#totalMatchesEditTable').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trReservedEditReservation' rId='"+row[a].getAttribute('ResourceId')+ row[a].getAttribute('DeviceReservationUserId')+"'>";
				
				html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				var startRes = row[a].getAttribute('StartReservation').split(" ");
				html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"calbox\"}' data-options='{\"dateFormat\": \"mm/dd/YYYY\"}' value='"+startRes[0]+"'/></td>";
				html += "<td><input class='picker' name='mydate' data-role='datebox' data-options='{\"mode\": \"timebox\"}' value='"+startRes[1]+"'/></td>";
				html += "<td><input  value='"+row[a].getAttribute('TimeInterval')+"'/></td>";
                html += "<td><input  value='"+row[a].getAttribute('Recurrence')+"'/></td>";
				html += "<td>"+row[a].getAttribute('IterNumber')+"</td>";
				var endRes = row[a].getAttribute('EndReservation').split(" ");
				html += "<td><input class='picker' id='endDate' name='mydate' data-role='datebox' data-options='{\"mode\": \"calbox\"}' data-options='{\"dateFormat\": \"mm/dd/YYYY\"}' value='"+endRes[0]+"'/></td>";
				html += "<td><input class='picker' id='endTime' name='mydate' data-role='datebox' data-options='{\"mode\": \"timebox\"}' value='"+endRes[1]+"'/></td>";
				html +="</tr>";
				
			}
			$("#editReservationTable> tbody").html(html);
			$("#editReservationTable").table("refresh");
			 $('#editDeviceTable').trigger('create');
/*
			 $('#ReleaseDevice').trigger('create');
			 $(".trReservedRelease").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				}else{
 	        		$(this).removeClass('highlight');
				}
			});*/
		}
	});
	}

/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadConnectivity
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : load reservation connevtivity table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function loadConnectivity(){
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationConnectivity&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`start=`status=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesConnectivity').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trConnectivity' pId='"+row[a].getAttribute('PortReservationId')+"' >";
				html += "<td>"+row[a].getAttribute('QueueTime')+"</td>";
		        html += "<td>"+row[a].getAttribute('Device1HostName')+"</td>";
				html += "<td>"+row[a].getAttribute('Device2Description')+"</td>";
				if(row[a].getAttribute('Slot1Number') == undefined || row[a].getAttribute('Slot1Number') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Slot1Number')+"</td>";
			  	}	
				if(row[a].getAttribute('Module1Number') == undefined || row[a].getAttribute('Module1Number') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Module1Number')+"</td>";
			  	}
				if(row[a].getAttribute('Port1Number') == undefined || row[a].getAttribute('Port1Number') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Port1Number')+"</td>";
			  	}
				if(row[a].getAttribute('SwitchPort1Number') == undefined || row[a].getAttribute('SwitchPort1Number') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('SwitchPort1Number')+"</td>";
			  	}
				if(row[a].getAttribute('SwitchSlot1Name') == undefined || row[a].getAttribute('SwitchSlot1Name') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('SwitchSlot1Name')+"</td>";
			  	}
				html += "<td>"+row[a].getAttribute('SwitchHostName')+"</td>";
				html += "<td>"+row[a].getAttribute('SwitchDescription')+"</td>";
				if(row[a].getAttribute('SwitchSlot2Name') == undefined || row[a].getAttribute('SwitchSlot2Name') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('SwitchSlot2Name')+"</td>";
			  	}
				html += "<td>"+row[a].getAttribute('SwitchPort2Number')+"</td>";
				if(row[a].getAttribute('Port2Number') == undefined || row[a].getAttribute('Port2Number') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Port2Number')+"</td>";
			  	}
				if(row[a].getAttribute('Module2Number') == undefined || row[a].getAttribute('Module2Number') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Module2Number')+"</td>";
			  	}
				html += "<td>"+row[a].getAttribute('Slot2Number')+"</td>";
				html += "<td>"+row[a].getAttribute('Device2HostName')+"</td>";
				html += "<td>"+row[a].getAttribute('Device2Description')+"</td>";
				html += "<td>"+row[a].getAttribute('User')+"</td>";
				html += "<td>"+row[a].getAttribute('StartReservation')+"</td>";
				html += "<td>"+row[a].getAttribute('EndReservation')+"</td>";
                html += "<td>"+row[a].getAttribute('Status')+"</td>";
                html += "<td>"+row[a].getAttribute('ConnectivityStatus')+"</td>";
				html +="</tr>";
				
			}
			$("#RMConnectivity-table > tbody").append(html);
			$("#RMConnectivity-table").table("refresh");
			
			globalPageRM = "ReservationConnectivity";
				
			var ctr;
			ctr = 0;
			
			$('#RMConnectivity').trigger('create');
			 $(".trConnectivity").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				   	$('#ConnectivityButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					$('#ConnectivityButtons').hide();
					ctr--;
				}
				selectedRow();
			});
		filterReservationConnectivity();
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadPort
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : December 10,2013
 *  #  REVISION #    : 3
 *  #  DESCRIPTION   : load reservation port table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadPort(){
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationPort&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`start=`status=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesPort').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trPort' rpId='"+row[a].getAttribute('ReservedPortId')+"'>";
				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('ResvReqTime')+"</td>";
		        html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
                html += "<td>"+row[a].getAttribute('PortName')+"</td>";
				html += "<td>"+row[a].getAttribute('StartReservation')+"</td>";
				html += "<td>"+row[a].getAttribute('EndReservation')+"</td>";	
				html += "<td>"+row[a].getAttribute('User')+"</td>";
				html += "<td>"+row[a].getAttribute('ReservationState')+"</td>";
				html += "<td>"+row[a].getAttribute('Exclusivity')+"</td>";
				if(row[a].getAttribute('PhysicalPortType') == undefined || row[a].getAttribute('PhysicalPortType') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('PhysicalPortType')+"</td>";
			  	}
				if(row[a].getAttribute('PortSpeed') == undefined || row[a].getAttribute('PortSpeed') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('PortSpeed')+"</td>";
			  	}
				if(row[a].getAttribute('Bandwidth') == undefined || row[a].getAttribute('Bandwidth') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Bandwidth')+"</td>";
			  	}
				if(row[a].getAttribute('LineType') == undefined || row[a].getAttribute('LineType') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('LineType')+"</td>";
			  	}
				html +="</tr>";
				
			}
			$("#RMPort-table > tbody").append(html);
			$("#RMPort-table").table("refresh");
			
			globalPageRM = "ReservationPort";
			$('#RMPort').trigger('create');
			var ctr;
			ctr = 0;
			 $(".trPort").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					$('#PortButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					ctr--;
				}
				selectedRow();
				if(ctr == 0){
					$('#PortButtons').hide();
				}
			});
			filterReservationPort();
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadHistory
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : December 10,2013
 *  #  REVISION #    : 3
 *  #  DESCRIPTION   : load reservation history table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadHistory(){
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationHistory&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`start=`status=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesHistory').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trHistory' dhId='"+row[a].getAttribute('DeviceHistoryId')+"'>";
				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('Timestamp')+"</td>";
		        html += "<td>"+row[a].getAttribute('HostName')+"</td>";
		        html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
				html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
                html += "<td>"+row[a].getAttribute('User')+"</td>";
				html += "<td>"+row[a].getAttribute('StartReservation')+"</td>";
				html += "<td>"+row[a].getAttribute('TimeInterval')+"</td>";	
				html += "<td>"+row[a].getAttribute('Recurrence')+"</td>";
				html += "<td>"+row[a].getAttribute('IterNumber')+"</td>";
				html += "<td>"+row[a].getAttribute('EndReservation')+"</td>";
				html += "<td>"+row[a].getAttribute('Events')+"</td>";
				html +="</tr>";
				
			}
			$("#RMHistory-table > tbody").append(html);
			$("#RMHistory-table").table("refresh");
			
			globalPageRM = "ReservationHistory";
			var ctr;
			ctr = 0;
			$('#RMHistory').trigger('create');
			 $(".trHistory").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				//	$('#RHistoryButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					ctr--;
				}
				selectedRow();
			/*	if(ctr == 0){
					$('#RHistoryButtons').hide();
				}*/
			});
			filterReservationHistory();
		}
	});
}
function loadDevices(){
	var domain = $('#domainSelect').val();
	var zoneName = $('#zoneSelect').val();
	var groupName = $('#groupSelect').val();
	var time = convertTime();
	var dataArr  = time.split(":");
	var endTime = parseInt(dataArr[0])+2+":"+dataArr[1]+":"+dataArr[2];
	var date = new Date();
	var dateToday = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationDevice&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain='+domain+"`ZoneName="+zoneName+"`GroupName="+groupName;
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesDevices').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trDevices' devId = '"+row[a].getAttribute('DeviceId')+"' rId='"+row[a].getAttribute('ResourceId')+"'>";

		        html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				if(row[a].getAttribute('ManagementIp') == undefined || row[a].getAttribute('ManagementIp') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
			  	}
				if(row[a].getAttribute('ConsoleIp') == undefined || row[a].getAttribute('ConsoleIp') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('ConsoleIp')+"</td>";
			  	}
				if(row[a].getAttribute('Manufacturer') == undefined || row[a].getAttribute('Manufacturer') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
			  	}
				if(row[a].getAttribute('Model') == undefined || row[a].getAttribute('Model') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('Model')+"</td>";
			  	}
				if(row[a].getAttribute('AvailablePorts') == undefined || row[a].getAttribute('AvailablePorts') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('AvailablePorts')+"</td>";
			  	}
				if(row[a].getAttribute('DomainName') == undefined || row[a].getAttribute('DomainName') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('DomainName')+"</td>";
			  	}
				if(row[a].getAttribute('ZoneName') == undefined || row[a].getAttribute('ZoneName') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('ZoneName')+"</td>";
			  	}
				if(row[a].getAttribute('GroupName') == undefined || row[a].getAttribute('GroupName') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('GroupName')+"</td>";
			  	}
				html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"calbox\"}' data-options='{\"dateFormat\": \"mm/dd/YYYY\"}' value='"+dateToday+"'/></td>";
		        html += "<td><input class='picker' name='mydate' id='startTime' data-role='datebox' data-options='{\"mode\": \"timebox\"}' value='"+time+"'/></td>";
				html += "<td><input id='inter"+row[a].getAttribute('DeviceId')+"' type='text' class='Interval' value='0'/></td>";
		        html += "<td><input id='iter"+row[a].getAttribute('DeviceId')+"' type='text' class='Iteration'value='1'/></td>";
	
		        html += "<td><select class='DeviceType' id='deviceType"+row[a].getAttribute('DeviceId')+"'><option>Non-Exclusive</option><option>Exclusive</option></select></td>";
				html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"calbox\"}' data-options='{\"dateFormat\": \"mm/dd/YYYY\"}' value='"+dateToday+"'/></td>";
		        html += "<td><input class='picker' name='mydate' id='startTime' data-role='datebox' data-options='{\"mode\": \"timebox\"}'  value='"+endTime+"'/></td>";
	 
				html +="</tr>";
				
			}
			$("#RMDevices-table > tbody").append(html);
			$("#RMDevices-table").table("refresh");
			$( "#tabsDevices" ).tabs(); 	
			$("#RMDevices").trigger('create');
			globalPageRM = "ReservationDevices";
			disableColumn();
			var ctr;
			ctr = 0;
			 $(".trDevices").on("taphold",function(){
				var iter = $(this).attr('devId');	
				if($(this).hasClass('highlight') == false){
					getdevicetype($(this).attr('devId'));
					$('#iter'+iter).textinput('enable');
					$('#inter'+iter).textinput('enable');
	
					$(this).addClass('highlight');
					$('#DevicesButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					$('#DevicesButtons').hide();
					ctr--;
				}
				selectedRow();
	//	queryCreateXMLData();
			});
		filterReservationDevices();	
		}
	});
}
function loadImportedDevices(){
	var domain = $('#domainSelect').val();
	var zoneName = $('#zoneSelect').val();
	var groupName = $('#groupSelect').val();
	var time = convertTime();
	var dataArr  = time.split(":");
	var endTime = parseInt(dataArr[0])+2+":"+dataArr[1]+":"+dataArr[2];
	var date = new Date();
	var dateToday = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()
	
//		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationDevice&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain='+domain+"`ZoneName="+zone+"`GroupName="+group;
		
				var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ReservationDeviceAffiliated&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain='+domain+"`ZoneName="+zoneName+"`GroupName="+groupName;
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesImportedDevices').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
/*			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}*/
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trImportedDevices' devId = '"+row[a].getAttribute('DeviceId')+"' rId='"+row[a].getAttribute('ResourceId')+"'>";
		        html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
		        html += "<td>"+row[a].getAttribute('ConsoleIp')+"</td>";
		        html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
		        html += "<td>"+row[a].getAttribute('Model')+"</td>";
		        html += "<td>"+row[a].getAttribute('AvailablePorts')+"</td>";
		        html += "<td>"+row[a].getAttribute('DomainName')+"</td>";
		        html += "<td>"+row[a].getAttribute('ZoneName')+"</td>";
		        html += "<td>"+row[a].getAttribute('GroupName')+"</td>";
		
				if(row[a].getAttribute('AvailabilityDay') == undefined || row[a].getAttribute('AvailabilityDay') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('AvailabilityDay')+"</td>";
			  	}
				if(row[a].getAttribute('AvailabilityTime') == undefined || row[a].getAttribute('AvailabilityTime') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('AvailabilityTime')+"</td>";
			  	}
				if(row[a].getAttribute('AvailabilityDate') == undefined || row[a].getAttribute('AvailabilityDate') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('AvailabilityDate')+"</td>";
			  	}
				if(row[a].getAttribute('Availability') == undefined || row[a].getAttribute('Availability') ==""){
					html+="<td></td>";
				}else{
					html += "<td>"+row[a].getAttribute('Availability')+"</td>";
			  	}
				html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"calbox\"}' data-options='{\"dateFormat\": \"mm/dd/YYYY\"}' value='"+dateToday+"'/></td>";
		        html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"timebox\"}' value='"+time+"'/></td>";
		        html += "<td><input id='inter"+row[a].getAttribute('DeviceId')+"' type='text' class='Interval' value='0'/></td>";
		        html += "<td><input id='iter"+row[a].getAttribute('DeviceId')+"' type='text' class='Iteration'value='1'/></td>";
		        html += "<td><select class='DeviceType' id='deviceType'><option>Non-Exclusive</option><option>Exclusive</option></select></td>";
		        html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"calbox\"}' data-options='{\"dateFormat\": \"mm/dd/YYYY\"}' value='"+dateToday+"'/></td>";
		        html += "<td><input class='picker' name='mydate' id='startDate' data-role='datebox' data-options='{\"mode\": \"timebox\"}'  value='"+endTime+"'/></td>";
	      		html += "</tr>";
       		}
			$('#rmImportedDevices').empty().append(html);
			$("#RMImportedDevices-table").table("refresh");
			globalPageRM = "ReservationDevices";
			var ctr;
			ctr = 0;
			$('#RMDevices').trigger('create');
				disableColumn();
			 $(".trImportedDevices").on("taphold",function(){
				var iter = $(this).attr('devId');	
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					$('#iter'+iter).textinput('enable');
					$('#inter'+iter).textinput('enable');
					$('#DevicesButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					$('#iter'+iter).textinput('disable');
					$('#inter'+iter).textinput('disable');
					$('#DevicesButtons').hide();
	
					ctr--;
				}
					selectedRow();
					getdevicetype();
			});
			$('.ui-icon-grid').css({"position":"relative"});
			filterReservationDevices();
		}
	});
}
function loadTesttoolHeader(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getDeviceInformation&query='+DeviceId;
		$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var data = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
				btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
	
			
            for(var a =0; a < row.length; a++){
				
				var hostname = row[a].getAttribute('');
				var ipadd = row[a].getAttribute('');
				var model = row[a].getAttribute('');
				var version = row[a].getAttribute('');
				
			}
		//	configname = name;
			$('#TTHostName').empty().append(hostname);
			$('#TTIpAdd').empty().append(ipadd);
			$('#TTModel').empty().append(model);
			$('#TTVersion').empty().append(version);
		}
	});
}
function loadTesttoolTable(){
		
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=portinfos&query=id='+DeviceId;
		$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var data = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
//			$('#totalMatchesTesttool').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < data[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
	
			
            for(var a =0; a < row.length; a++){
				html += "<tr class='trTesttool' portId='"+row[a].getAttribute('PortId')+"'>";
				html += "<td>"+row[a].getAttribute('PortId')+"</td>";
				
				if(row[a].getAttribute('PortName') == undefined || row[a].getAttribute('PortName') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('PortName')+"</td>";
			  	}
				if(row[a].getAttribute('PortSpeed') == undefined || row[a].getAttribute('PortSpeed') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('PortSpeed')+"</td>";
			  	}
				html += "<td>"+row[a].getAttribute('Connectivity')+"</td>";
				html += "<td>"+row[a].getAttribute('HostName')+"</td>";
				html += "<td>"+row[a].getAttribute('PartnerPort')+"</td>";
			  	
				html +="</tr>";
				
			}
			$("#RMTesttool-table > tbody").append(html);
			$("#RMTesttool-table").table("refresh");
			loadTesttoolHeader();
			var ctr;
			ctr = 0;
			$(".trTesttool").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					$('#TesttoolButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					ctr--;
					$('#TesttoolButtons').hide();
				}
				
			selectedRow();	
			});
		}
		
	});
}


/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : disable Column
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 16,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE :  
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : function to disable textbox and dropdown menu
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function disableColumn(){
//Reservation Devices New Reservation Table
	$('.Interval').textinput('disable');
	$('.Iteration').textinput('disable');
//Reservation Devices Load and Save Image Table
	$('.typeLoadImage').textinput('disable');
	$('.protocolLoadImage').textinput('disable');
	$('.serverLoadImage').textinput('disable');
	$('.pathLoadImage').textinput('disable');
	$('.filenameLoadImage').textinput('disable');
	$('.typeLoadConfig').textinput('disable');
	$('.protocolLoadConfig').textinput('disable');
	$('.serverLoadConfig').textinput('disable');
	$('.pathLoadConfig').textinput('disable');
	$('.filenameLoadConfig').textinput('disable');
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadEventScheduler
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : December 10,2013 
 *  #  REVISION #    : 3
 *  #  DESCRIPTION   : load event scheuler table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadEventSched(){
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=EventScheduler&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSchedEve').html(root[0].getAttribute('total'));
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
		//			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
		//			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			//btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
		//	$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trSchedEve' erId='"+row[a].getAttribute('EventId')+"'>";
				html += "<td>"+row[a].getAttribute('timeStamp')+"</td>";
		        html += "<td>"+row[a].getAttribute('EventId')+"</td>";
		        html += "<td><a sId='"+row[a].getAttribute('Status')+"' mId='"+row[a].getAttribute('MainId')+"' eId='"+row[a].getAttribute('EventId')+"' style='text-decoration:none; color:#000000;' class='sched' href='RMHistoryScheduler2.html'>"+row[a].getAttribute('Name')+"</a></td>";
		        html += "<td>"+row[a].getAttribute('UserId')+"</td>";
				html += "<td>"+row[a].getAttribute('User')+"</td>";
				html += "<td>"+row[a].getAttribute('StartTime')+"</td>";
                html += "<td>"+row[a].getAttribute('EndTime')+"</td>";
				html += "<td>"+row[a].getAttribute('NoofDevice')+"</td>";
				html += "<td>"+row[a].getAttribute('Event')+"</td>";	
				html += "<td>"+row[a].getAttribute('Status')+"</td>";
				html += "<td>"+row[a].getAttribute('RtmId')+"</td>";
				html +="</tr>";
				
			}
			$("#RMEventSched-table > tbody").append(html);
			$("#RMEventSched-table").table("refresh");
			
			globalPageRM = "SchedulerEvent";
			var ctr;
			ctr = 0;
			 $(".trSchedEve").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					$('#EventButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					ctr--;
				}
				selectedRow();
				if(ctr == 0){
					$('#EventButtons').hide();
				}
			});
			filterEventSched();
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadHistorySched
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : load scheduler history table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadHistorySched(){
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=HistoryScheduler&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`start=`status=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSchedHist').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trSchedHist' mcId='"+row[a].getAttribute('MainConfigHistoryId')+"'>";
				html += "<td>"+row[a].getAttribute('timeStamp')+"</td>";
		        html += "<td>"+row[a].getAttribute('EventId')+"</td>";
		        html += "<td><a configname='"+row[a].getAttribute('ConfigName')+"' sId='"+row[a].getAttribute('Status')+"' mId='"+row[a].getAttribute('MainId')+"' eId='"+row[a].getAttribute('EventId')+"' style='text-decoration:none; color:#000000;' class='sched' href='RMHistoryScheduler2.html'>"+row[a].getAttribute('ConfigName')+"</a></td>";
		        html += "<td>"+row[a].getAttribute('EventDescription')+"</td>";
				html += "<td>"+row[a].getAttribute('User')+"</td>";
				html += "<td>"+row[a].getAttribute('StartTime')+"</td>";
                html += "<td>"+row[a].getAttribute('EndTime')+"</td>";
				html += "<td>"+row[a].getAttribute('Status')+"</td>";
				html += "<td>"+row[a].getAttribute('RtmId')+"</td>";
				html +="</tr>";
				
			}
			$("#RMHistorySched-table > tbody").append(html);
			$("#RMHistorySched-table").table("refresh");
			globalPageRM = "SchedulerHistory";
			var ctr;
			ctr = 0;
			$('#RMHistorySched').trigger('create');
			 $(".trSchedHist").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				//	$('#SHistoryButtons').show();
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					ctr--;
				}
				selectedRow();
/*				if(ctr == 0){
					$('#SHistoryButtons').hide();
				}*/
			});
			filterSchedHistory();
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadManageDevice
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 5,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : load manage device table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadManageDevice(){
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=ManageDevice&query=limit=10`page=1`sort=`orderby=`user='+globalUserName+'`filter=`domain=`start=`status=`timezone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
		
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesManageDevice').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trManDev' devId='"+row[a].getAttribute('DeviceId')+"'>";
				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('DateAdded')+"</td>";
		        html += "<td>"+row[a].getAttribute('HostName')+"</td>";
		        html += "<td>"+row[a].getAttribute('ZoneName')+"</td>";
				html += "<td>"+row[a].getAttribute('DomainName')+"</td>";
				html += "<td>"+row[a].getAttribute('GroupName')+"</td>";
				if(row[a].getAttribute('ManagementIp') == undefined || row[a].getAttribute('ManagementIp') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
			  	}
				if(row[a].getAttribute('ManagementInterface') == undefined || row[a].getAttribute('ManagementInterface') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('ManagementInterface')+"</td>";
			  	}
				if(row[a].getAttribute('ConsoleIP') == undefined || row[a].getAttribute('ConsoleIp') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('ConsoleIp')+"</td>";
			  	}	
				html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				if(row[a].getAttribute('SerialNumber') == undefined || row[a].getAttribute('SerialNumber') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('SerialNumber')+"</td>";
			  	}
				html += "<td>"+row[a].getAttribute('Connectivity')+"</td>";
				if(row[a].getAttribute('TechnicalSupport') == undefined || row[a].getAttribute('TechnicalSupport') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('TechnicalSupport')+"</td>";
			  	}
				if(row[a].getAttribute('Discovery') == undefined || row[a].getAttribute('Discovery') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('Discovery')+"</td>";
			  	}
				if(row[a].getAttribute('CPUSpeed') == undefined || row[a].getAttribute('CPUSpeed') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('CPUSpeed')+"</td>";
			  	}
				html +="</tr>";
				
			}
			$("#RMManageDevice-table > tbody").append(html);
			$("#RMManageDevice-table").table("refresh");
			$( "#tabsDevInfo" ).tabs(); 	
			var ctr;
			ctr = 0;		
			globalPageRM = "ManageDevice";
				$(".trManDev").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					$('#ManageButtons').show();
					ctr++;	
				}else{
 	        		$(this).removeClass('highlight');
					ctr--;
				}
				selectedRow();
				if(ctr == 0){
					$('#ManageButtons').hide();
				}
			});
			filterManageDevices();
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadHistoryScheduler2
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 10,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : load history scheduler table for connectivity and device logs
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadHistoryScheduler2(){
	
		var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=geteventdevices&query=limit=10`page=1`mainid='+devdev1+'`status='+statsstats+'`eventid='+eventid1;
		
		$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var data = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSchedHist2').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < data[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
	
			
            for(var a =0; a < row.length; a++){
				html += "<tr class='trSchedHist2'>";
				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
				
		        html += "<td id='RMDeviceLogs'><a href='RMDeviceLogs.html' class='showLogs' deviceId='"+row[a].getAttribute('DeviceId')+"' hostname='"+row[a].getAttribute('HostName')+"' data-rel='dialog' style='text-decoration:none; color:#000000;'>"+row[a].getAttribute('HostName')+"</a></td>";
				if(row[a].getAttribute('ManagementIP') == undefined || row[a].getAttribute('ManagementIP') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('ManagementIP')+"</td>";
			  	}
				if(row[a].getAttribute('ConsoleIP') == undefined || row[a].getAttribute('ConsoleIP') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('ConsoleIP')+"</td>";
			  	}
				html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				
				if(row[a].getAttribute('OSVersion') == undefined || row[a].getAttribute('OSVersion') ==""){
					html+="<td>N/A</td>";
				}else{
					html += "<td>"+row[a].getAttribute('OSVersion')+"</td>";
			  	}
				html +="</tr>";
				
			}
			$("#RMHistorySched2-table > tbody").append(html);
			$("#RMHistorySched2-table").table("refresh");
			loadHistoryScheduler3();
			$(".trSchedHist2").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				}else{
 	        		$(this).removeClass('highlight');
				}
			});
	
		}
		
	});
}
function loadHistoryScheduler3(){
		
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=geteventinfo&query=eventid='+eventid1+"`status="+statsstats+"`mainid="+devdev1;
		$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var data = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			//$('#totalMatchesSchedHist3').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
	/*		for(z = 1; z < data[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}*/
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
	
			
            for(var a =0; a < row.length; a++){
				
				var id = row[a].getAttribute('ResourceId');
				var jobtype = row[a].getAttribute('JobType');
				var main = row[a].getAttribute('MainId');
				var name = row[a].getAttribute('Name');
				var user = row[a].getAttribute('User');
				
			}
			configname = name;
			$('#configMainConfigurationId').empty().append(main);
			$('#config_name').empty().append(name);
			$('#configMainConfigId').empty().append(user);
			$('#configJob').empty().append(jobtype);
			$('#configResourceId').empty().append(id);

			
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadImage
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 15,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : function to load image on reservation devices
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function loadImage(){
	//var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getLoadImage&query=deviceid='+DeviceId;	
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?action=getLoadImage&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			//$('#totalMatchesLoadImage').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trloadImage' deviceId='"+row[a].getAttribute('DeviceId')+"'>";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
                html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select class=typeSaveImage'' id='TypeImage'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage"+row[a].getAttribute('DeviceId')+"' class='protocolLoadImage'/></td>";
				}else{
					html += "<td><input type='text' class='protocolLoadImage' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' class='serverLoadImage' id='ServerImage'"+row[a].getAttribute('DeviceId')+"/></td>";
				}else{
					html += "<td><input type='text' class='serverLoadImage' id='ServerImage' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' class='pathLoadImage' id='PathImage"+row[a].getAttribute('DeviceId')+"'/></td>";
				}else{
					html += "<td><input type='text' class='pathLoadImage' id='PathImage' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' class='filenameLoadImage' id='FilenameImage"+row[a].getAttribute('DeviceId')+"'/></td>";
				}else{
					html += "<td><input class='filenameLoadImage' id='FilenameImage' value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
                html += "<td><select><option>boot-image</option><option>bootflash</option><option>bootflash0</option><option>bootflash1</option><option>flash</option><option>flash1</option><option>flash2</option><option>disk0</option><option>disk1</option><option>disk1</option><option>disk2</option><option>slot0</option><option>slot1</option><option>slot2</option></select></td>";
				html +="</tr>";
				
			}
			$("#loadImage-table1 > tbody").empty().append(html);
			$("#loadImage-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMLoadImage').trigger('create');
			disableColumn();
			var ctr;
			ctr = 0;	
			$(".trloadImage").on("tap",function(){
				var iter = $(this).attr('deviceId');	
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					$('.typeLoadImage'+iter).selectmenu('enable');
					$('.protocolLoadImage'+iter).textinput('enable');
					$('.serverLoadImage'+iter).textinput('enable');
					$('.pathLoadImage'+iter).textinput('enable');
					$('.filenameLoadImage'+iter).textinput('enable');
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					$('.typeLoadImage'+iter).selectmenu('disable');
					$('.protocolLoadImage'+iter).textinput('disable');
					$('.serverLoadImage'+iter).textinput('disable');
					$('.pathLoadImage'+iter).textinput('disable');
					$('.filenameLoadImage'+iter).textinput('disable');
					ctr--;	
				}
				selectedRow();
			//	if(ctr == 0){
			//		$('#ReserveButtons').hide();
			//	}	
			});
		}
	});
	
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadImageDetail
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 15,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : function to load image detail on reservation devices
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadImageDetail(){
//	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getLoadImageDetail&query=deviceid='+DeviceId;	
//
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?action=getLoadImageDetail&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			//$('#totalMatchesLoadImage').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trloadConfig' >";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select id='TypeImage'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input type='text' id='FilenameImage' value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
                html += "<td><select><option>boot-image</option><option>bootflash</option><option>bootflash0</option><option>bootflash1</option><option>flash</option><option>flash1</option><option>flash2</option><option>disk0</option><option>disk1</option><option>disk1</option><option>disk2</option><option>slot0</option><option>slot1</option><option>slot2</option></select></td>";
				html +="</tr>";
				
			}
			$("#loadImage-table1 > tbody").empty().append(html);
			$("#loadImage-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMLoadImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trloadConfig").on("tap",function(){
			//	globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
			//	   	$('#ReserveButtons').show();
			//		var val = $(this).attr('rId');
			//		groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
			//		var val = $(this).attr('rId');
			//		groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
			//	if(ctr == 0){
			//		$('#ReserveButtons').hide();
			//	}	
			});
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadConfigDetail
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 15,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : function to load configuration detail on reservation devices
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */

function loadConfigDetail(){
//	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getLoadConfigDetail&query=deviceid='+DeviceId;	

	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?action=getLoadConfigDetail&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			//$('#totalMatchesLoadConfig').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trloadConfig' deviceId='"+row[a].getAttribute('DeviceId')+"'>";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select id='TypeConfig' class='typeLoadConfig'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage' class='protocolLoadConfig'/></td>";
				}else{
					html += "<td><input type='text' id='ProtocolImage' class='protocolLoadConfig' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{
					html+="<td><input type='text' id='PathImage'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input id='FilenameImage' value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
                html += "<td><select><option>running-config</option></select></td>";
				html +="</tr>";
				
			}
			$("#loadConfig-table1 > tbody").empty().append(html);
			$("#loadConfig-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMLoadImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trloadConfig").on("tap",function(){
				//globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
				  // 	$('#ReserveButtons').show();
				//	var val = $(this).attr('rId');
				//	groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
				//	var val = $(this).attr('rId');
				//	groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
			//	if(ctr == 0){
			//		$('#ReserveButtons').hide();
			//	}	
			});
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : loadConfig
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 15,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : function to load configuration option on reservation devices
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function loadConfig(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?action=getLoadConfig&query=deviceid='+DeviceId;	
//	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getLoadConfig&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			//$('#totalMatchesLoadConfig').html(data[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trloadConfig' deviceId='"+row[a].getAttribute('DeviceId')+"'>";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' class='protocolLoadConfig' id='ProtocolConfig"+row[a].getAttribute('DeviceId')+"'/></td>";
				}else{
					html += "<td><input type='text' id='ProtocolConfig"+row[a].getAttribute('DeviceId')+"' class='protocolLoadConfig' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerConfig"+row[a].getAttribute('DeviceId')+"' class='serverLoadConfig'/></td>";
				}else{
					html += "<td><input type='text' id='ServerConfig"+row[a].getAttribute('DeviceId')+"' class='serverLoadConfig'value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathConfig"+row[a].getAttribute('DeviceId')+"' class='pathLoadConfig'/></td>";
				}else{
					html += "<td><input type='text' id='PathConfig"+row[a].getAttribute('Deviceid')+"' class='pathLoadConfig' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}

/*				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameConfig"+row[a].getAttribute('DeviceId')+"' class='filenameLoadConfig'/></td>";
				}else{
					html += "<td><input id='FilenameConfig"+row[a].getAttribute('Deviceid')+"' class='filenameLoadConfig'value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}*/
                html += "<td><select><option>running-config</option></select></td>";
				html +="</tr>";
				
			}
			$("#loadConfig-table1 > tbody").empty().append(html);
			$("#loadConfig-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMLoadImage').trigger('create');
			disableColumn();
			var ctr;
			ctr = 0;	
			$(".trloadConfig").on("tap",function(){
				var iter = $(this).attr('deviceId');	
		//		globalResourceId = [];
				if($(this).hasClass('highlight') == false){

					$(this).addClass('highlight');
					$('.typeLoadConfig'+iter).selectmenu('enable');
					$('.protocolLoadConfig'+iter).textinput('enable');
					$('.serverLoadConfig'+iter).textinput('enable');
					$('.pathLoadConfig'+iter).textinput('enable');
					$('.filenameLoadConfig'+iter).textinput('enable');
			
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					$('.typeLoadConfig'+iter).selectmenu('disable');
					$('.protocolLoadConfig'+iter).textinput('disable');
					$('.serverLoadConfig'+iter).textinput('disable');
					$('.pathLoadConfig'+iter).textinput('disable');
					$('.filenameLoadConfig'+iter).textinput('disable');
					ctr--;	
				}
				selectedRow();
		//		if(ctr == 0){
		//			$('#ReserveButtons').hide();
		//		}	
			});
		}
	});
	
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : saveImage
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 15,2014
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    :
 #  DESCRIPTION   : loads save image option on reservation devices 
 #  PARAMETERS    :
 #
 #######################################################################
*/
function saveImage(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getSaveImage&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSaveImage').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trsaveImage' >";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
                html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select id='TypeImage'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
				html +="</tr>";
				
			}
			$("#saveImage-table1 > tbody").empty().append(html);
			$("#saveImage-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMSaveImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trsaveImage").on("tap",function(){
			//	globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
			//	   	$('#ReserveButtons').show();
			//		var val = $(this).attr('rId');
			//		groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
			//		var val = $(this).attr('rId');
			//		groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
			//	if(ctr == 0){
			//		$('#ReserveButtons').hide();
			//	}	
			});
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : saveConfig
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 15,2014
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    :
 #  DESCRIPTION   : loads save configuration option on reservation devices 
 #  PARAMETERS    :
 #
 #######################################################################
*/
function saveConfig(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getSaveConfig&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSaveConfig').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trsaveConfig' >";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input id='FilenameImage' value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
				html +="</tr>";
				
			}
			$("#saveConfig-table1 > tbody").empty().append(html);
			$("#saveConfig-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMSaveImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trsaveConfig").on("tap",function(){
			//	globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
			//	   	$('#ReserveButtons').show();
			//		var val = $(this).attr('rId');
			//		groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
			//		var val = $(this).attr('rId');
			//		groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
			//	if(ctr == 0){
			//		$('#ReserveButtons').hide();
			//	}	
			});
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : saveImageDetail
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 15,2014
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    :
 #  DESCRIPTION   : loads save image details on reservation devices 
 #  PARAMETERS    :
 #
 #######################################################################
*/
function saveImageDetail(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getSaveImageDetail&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSaveImage').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trsaveImage'>";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select id='TypeImage'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{

					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{

					html += "<td><input value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input type='text' id='FilenameImage' value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
				html +="</tr>";
				
			}
			$("#saveImage-table1 > tbody").empty().append(html);
			$("#saveImage-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMSaveImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trSaveImage").on("tap",function(){
		//		globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
		//		   	$('#ReserveButtons').show();
		//			var val = $(this).attr('rId');
		//			groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
		//			var val = $(this).attr('rId');
		//			groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
		//		if(ctr == 0){
		//			$('#ReserveButtons').hide();
		//		}	
			});
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : saveConfigDetail
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 15,2014
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    :
 #  DESCRIPTION   : loads save configuraton on reservation devices 
 #  PARAMETERS    :
 #
 #######################################################################
*/
function saveConfigDetail(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getSaveConfigDetail&query=deviceid='+DeviceId;	
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesSaveConfig').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trsaveConfig' >";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select id='TypeImage'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage'/></td>";
				}else{

					html += "<td><input type='text' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{

					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{

					html += "<td><input type='text' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input id='FilenameImage' value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
				html +="</tr>";
				
			}
			$("#saveConfig-table1 > tbody").empty().append(html);
			$("#saveConfig-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMSaveImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trReserved").on("tap",function(){
		//		globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
		//		   	$('#ReserveButtons').show();
		//			var val = $(this).attr('rId');
		//			groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
		//			var val = $(this).attr('rId');
		//			groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
		//		if(ctr == 0){
		//			$('#ReserveButtons').hide();
		//		}	
			});
		}
	});

}
function changeType(){
	var url ='http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getImageConfigInfo&query=option'+op2+'&deviceid='+DeviceId+'&location='+val;
	$.ajax({
        url: url,
		dataType: 'html',
        success: function(data) {
            var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('data'); 
            var row = xmlDoc.getElementsByTagName('row');
            var html ='',startRes='',endRes='';
			$('#totalMatchesLoadImage').html(root[0].getAttribute('total'));
			var btns='';
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-left-corner"><< Prev.</a>';			
			for(z = 1; z < root[0].getAttribute('pages'); z++){
				if(z ==1){
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="ui-btn-down-b btn0marg">'+root[0].getAttribute('page')+'</a>';
				}else{
					btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg">'+z+'</a>';
				}
			}
			btns += '<a href="#" data-corners="false" data-role="button" data-mini="true" data-inline="true" class="btn0marg ui-btn-right-corner">Next >></a>';	
			$('#paginations').html(btns).trigger('create');
            for(var a =0; a< row.length; a++){
				html += "<tr class='trloadImage'>";
				html += "<td>"+row[a].getAttribute('Hostname')+"</td>";
                html += "<td>"+row[a].getAttribute('Model')+"</td>";
				html += "<td><select id='TypeImage'><option>Custom</option><option>Primary</option><option>Secondary</option></select></td>";
				if(row[a].getAttribute('Protocol') == undefined || row[a].getAttribute('Protocol') ==""){
					html+="<td><input type='text' id='ProtocolImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Protocol')+"'/></td>";
			  	}
				if(row[a].getAttribute('Server') == undefined || row[a].getAttribute('Server') ==""){
					html+="<td><input type='text' id='ServerImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Server')+"'/></td>";
			  	}
				if(row[a].getAttribute('Path') == undefined || row[a].getAttribute('Path') ==""){
					html+="<td><input type='text' id='PathImage'/></td>";
				}else{
					html += "<td><input type='text' value='"+row[a].getAttribute('Path')+"'/></td>";
			  	}
				if(row[a].getAttribute('SystemImageFile') == undefined || row[a].getAttribute('SystemImageFile') ==""){
					html+="<td><input type='text' id='FilenameImage'/></td>";
				}else{
					html += "<td><input value='"+row[a].getAttribute('SystemImageFile')+"'/></td>";
			  	}
                html += "<td><select><option>boot-image</option><option>bootflash</option><option>bootflash0</option><option>bootflash1</option><option>flash</option><option>flash1</option><option>flash2</option><option>disk0</option><option>disk1</option><option>disk1</option><option>disk2</option><option>slot0</option><option>slot1</option><option>slot2</option></select></td>";
				html +="</tr>";
				
			}
			$("#loadImage-table1 > tbody").empty().append(html);
			$("#loadImage-table1").table("refresh");
		//	globalPageRM = "ReservationReserve";
			$('#RMLoadImage').trigger('create');
			var ctr;
			ctr = 0;	
			$(".trloadImage").on("tap",function(){
			//	globalResourceId = [];
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
			//	   	$('#ReserveButtons').show();
			//		var val = $(this).attr('rId');
					groupHighlight(val);	
					ctr++;
				}else{
 	        		$(this).removeClass('highlight');
					var val = $(this).attr('rId');
			//		groupRemoveHighlight(val);	
					ctr--;	
				}
				selectedRow();
			//	if(ctr == 0){
			//		$('#ReserveButtons').hide();
			//	}	
			});
		}
	});
	

}
/*
 #######################################################################
 #
 #  FUNCTION NAME : groupHighlight
 #  AUTHOR        : Angeline Bringas
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : December 17, 2013 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : highlights all common reservation
 #  PARAMETERS    :
 #
 #######################################################################
*/
function groupHighlight(val){
	$('.trReserved').each(function(){
		if (val == $(this).attr('rId')){
			$(this).addClass('highlight');
		}
		if($(this).hasClass('highlight')){
			globalResourceId.push($(this).attr('rIds'));
			
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : groupRemoveHighlight
 #  AUTHOR        : Angeline Bringas
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : December 17, 2013 PST
 #  REVISION #    : 1
 #  DESCRIPTION   : 
 #  PARAMETERS    :
 #
 #######################################################################
*/
function groupRemoveHighlight(val){
	console.log(val);
	$('.trReserved').each(function(){
		if (val == $(this).attr('rId')){
			$(this).removeClass('highlight');
		}
		if($(this).hasClass('highlight')){
			globalResourceId.push($(this).attr('rIds'));
		}	
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : showDeviceConnections
 #  AUTHOR        : Angeline Bringas
 #  DATE          : December 13,2013
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 1
 #  DESCRIPTION   : shows device sanity
 #  PARAMETERS    :
 #
 #######################################################################
*/
var prevDev = "";
function showDeviceConnections() {
/*	if (GetDeviceType(did) == 'TestTool' && GetDeviceModel(did) != 'Avalanche' || GetDeviceType(did) == 'Server'){
		//alerts("No logs available for "+hostname,'$(".ui-dialog-titlebar-close").show();');
		$('input[name="EventScheduler2Sel"]').each(function() {
	        if ($(this).is(':checked')) {
    	        $(this).attr('checked',true);
                $(this).parent().parent().addClass('highlight');
            }
			else {
				$("eveschedcheck").removeClass('checked');	
				$(this).parent().parent().removeClass('highlight');
			}
		//displayWarning("<b>No logs available for "+hostname+"</b>");

        });
						$(this).removeClass('checked');
						$(this).parent().parent().removeClass('highlight');
	}
*/
	prevDev = "";
	var h= "";
//	var dev = getSelectedArr('EventScheduler2');
	var dev = globalDeviceId ;
	var hostname = globalHostName;
	var name = configname;
	setTimeout(function() {
		if (dev == undefined) {
			return;
		} else if (prevDev == "" || dev != prevDev) {
			prevDev = dev;
			if (/^\d+$/i.test(dev)) {
				h = prevDev;
			} else {
				h = did;
			  }
			clearInterval(devLog);
			devLog = null;
			firstrun = 0;
		  }
		if ( statsstats == 'provisioning' || statsstats == 'configured' || statsstats == 'provisioned' ) {
			var name = $('#config_name').text();
			EventDeviceLogs(name,h+"_1_"+eventid1,false,0,hostname);
		} else if (statsstats != "scheduled" ) {
			var name = $('#config_name').text();
			EventDeviceLogs(name,h+"_0_"+eventid1,false,0,hostname);
	  	} else if (statsstats == "scheduled") {
			alert("Please wait for reservation to be active to view logs");
			return;
		 }
	},100);

}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : checkConnectivityLogs
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 13,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 1
 *  #  DESCRIPTION   : checks if the text file exists.
 *  #  PARAMETERS    : ConfigName, MappingId
 *  #
 *  #######################################################################
 *  */

function checkConnectivityLogs(ConfigName,MappingId) {
	var path = configname+"/Mapping_"+MappingId+".txt";
	var ret = "";
	$.ajax({
		url : 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkconlogs&query=path='+path,
		async: false,
		success : function (data) {
			ret = $.trim(data);
		}
	});

	return ret;

}

/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : getDeviceLogs
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 13,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 1
 *  #  DESCRIPTION   : opens the text file containing the device logs
 *  #  PARAMETERS    : ConfigName, DeviceId, HostName
 *  
 *  #######################################################################
 *  */

function getDeviceLogs(ConfigName,DeviceId,HostName) {
	currLogs = "Device";
	$('#eventNewDevicelogstext').empty().append("Config Name: "+configname+"\n");
	$('#eventNewDevicelogstext').append("Device Name: "+HostName+"\n\n");
	$('#eventNewDevicelogstext').append("==================START LOGS===============\n\n");
	$.ajax({
		
		url : 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=logs&query=path='+configname+'/device_'+DeviceId+'.txt',
		dataType:'html',
		success : function (data) {
			console.log(data);
			$("#loading-container").dialog("close");
			$(".ui-dialog-buttonpane button:contains('Refresh')").button().attr('disabled',false);
			var reg = /\</gi;
			var myDiv = $('#eventNewDevicelogstext');
			var newdata = data.replace( reg , "" );
			data = newdata;
			if (/End of Device Check/i.test(data)) {
				if (/Start of Enable Interface/i.test(data)) {
					firstrun++;
					if (/End of Enable Interface/i.test(data)) {
						$("#eventNewDevicelogstext").append(data);
						myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
				    	clearInterval(devLog);
					} else {
						$("#eventNewDevicelogstext").append(data);
					myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
					  }
				} else if (/Start of Terminal/i.test(data)) {
					firstrun++;
					if (/End of Terminal|End of Config/i.test(data)) {
						$("#eventNewDevicelogstext").append(data);
						myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
				    	clearInterval(devLog);
					} else {
						$("#eventNewDevicelogstext").append(data);
						myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
					  }
	  			  } else if (firstrun != 0) {
						$("#eventNewDevicelogstext").append(data);
						myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
			    		clearInterval(devLog);
				    } else {
						$("#eventNewDevicelogstext").append(data);
						myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
						firstrun++;
				      }
			} else if (/End of Disable Interface/i.test(data)) {
				$("#eventNewDevicelogstext").append(data);
				myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
			    clearInterval(devLog);
			} else if (/End of Terminal|End of Config/i.test(data)) {
				$("#eventNewDevicelogstext").append(data);
				myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
			    clearInterval(devLog);
			} else {
				$("#eventNewDevicelogstext").append(data);
				myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
		    }
			$("#eventNewDevicelogstext").css({'height':'500px'});
				
		}
	});
}
function EventDeviceLogs(ConfigName, DeviceId, Mapping, MappingId, HostName) {
	if ( Mapping == true || Mapping == "true") {
		var conexists = checkConnectivityLogs(ConfigName,MappingId);
		conexists = $.trim(conexists);
		if (conexists == "0" || conexists == 0) {
			alert("No connectivity log available");
			return;
		}
	}	
	$('#eventNewDevicelogstext').empty();

	if ( Mapping ) {
		
		getConnectivityLogs(ConfigName,MappingId);
	} else {
		var conexists = checkDeviceLogs(ConfigName,DeviceId);
		conexists = $.trim(conexists);
		if (conexists != "0" || conexists != 0) {
			getDeviceLogs(ConfigName,DeviceId,HostName);

			devLog = setInterval(function() {
				getDeviceLogs(ConfigName,DeviceId,HostName);
			},5000);
		} else {
			alert("No Device Log available.");
			return;
		}
	}

}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : GetDeviceType
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 13,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : checks the device type
 *  #  PARAMETERS    : devId
 *  #
 *  #######################################################################
 *  */

function GetDeviceType(){
	var devType = '';
	var URL = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=devtype&query=did='+DeviceId;
	$.ajax({
		url: URL,
		async: false,
		dataType: 'html',
		success: function(data) {
			devType = $.trim(data);

		}
	});
	return devType;
}

function GetDeviceModel(devId){
	var devType = '';
	var URL = "http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getdevicemodel&query=did="+devId;
	$.ajax({
		url: URL,
		async: false,
		dataType: 'text/xml',
		success: function(data) {
			devType = $.trim(data);

		}
	});
	return devType;
}
function getConnectivityLogs(ConfigName,MappingId) {

	currLogs = "Connectivity";
	$('#eventNewDevicelogstext').empty().append("Config Name: "+ConfigName+"\n\n");
	$('#eventNewDevicelogstext').append("==================START LOGS===============\n\n");
	$.ajax({
		
		url : 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=logs&query=path='+configname+'/Mapping_'+MappingId+'.txt',
		success : function (data) {
			var reg = /\</gi;
			var newdata = data.replace( reg , "" );
			data = newdata;
			var myDiv = $('#eventNewDevicelogstext');
			$("#eventNewDevicelogstext").append(data);
		//	myDiv.scrollTop(myDiv.attr("scrollHeight") - myDiv.height());
		}
	});
}


function checkDeviceLogs(ConfigName,DeviceId) {

	var path = configname+"/device_"+DeviceId+".txt";
	var ret = "";
	
	$.ajax({
		
		url : 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkconlogs&query=path='+path,
//		url : "../php/functions_receiver.php?action=checkconlogs&path="+path,
		async: false,
		success : function (data) {
			ret = $.trim(data);
		}
	});

	return ret;

}
/*
#######################################################################
#
#  FUNCTION NAME : showAllConnections
#  AUTHOR        : Angeline Bringas
#  DATE          : December 13,2013
#  MODIFIED BY   :
#  REVISION DATE :
#  REVISION #    : 
#  DESCRIPTION   : shows all connectivity logs in event and scheduler history
#  PARAMETERS    :
#
#######################################################################
*/


function showAllConnections() {
   console.log(config_name,'hello world');
   //$('#DeviceLogsButton').attr('style','display:none');
   if ( statsstats == 'provisioning' || statsstats == 'configured' || statsstats == 'provisioned' || statsstats == "unprovisioning") {
	   var name = $('#config_name').text();
	   EventDeviceLogs(name,1,true,1);
   } else if (statsstats != "scheduled") {
	   var name = $('#config_name').text();
	   EventDeviceLogs(name,1,true,0);
	 } else if (statsstats == "scheduled") {
		   //alerts("Please wait for reservation to be active to view logs");
		   alert("Please wait for reservation to be active to view logs");
		   return;
	   }

}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : RMGenerateReport 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 18,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : Generate Report
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function RMGenerateReport(){
	if(globalPageRM == "ReservationReserve"){// Generate Report for Reservation Reserved
       var a =window.location.href = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=generatereportforreserve&query=resourceid="+globalResourceId;
	globalResourceId = [];
	$('#ReserveButtons').hide();
	}else if(globalPageRM == "ReservationPort"){// Generate Report for Reservation Port
		var a =window.location.href = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=generatereportforport&query=ReservedPortId="+genIds;
	genIds = [];
	$('#PortButtons').hide();
	}else if(globalPageRM == "ReservationConnectivity"){// Generate Report for Reservation Connectivity
		var a =window.location.href = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=generatereportforconnectivity&query=PortReservationId="+genIds;
	genIds = [];
	$('#ConnectivityButtons').hide();
	}else if(globalPageRM == "ManageDevice"){// Generate Report for Manage Devices
		var a =window.location.href = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=generatereportformanagedevices&query=deviceid="+genIds;
	genIds = [];
	$('#ManageButtons').hide();
	}
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : getActiveReservationIteration 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 9,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : get active iteration of reservation
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function getActiveReservationIteration() {
console.log('data');
	var ret = "";
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getiterleft&query=resid='+ResId;
	// alerts(q);
	$.ajax({
	url:url,	
		dataType: 'html',
		async: false,
		success:function(data) {
			ret = $.trim(data);
		}
	});

	return ret;
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : toggleIterationOptions 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 9,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : dropdown that shows active iteration of reservation
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function toggleIterationOptions(val) {
    if (val != "all") {
		$('#specificIterTable').removeAttr('style');
	    var tabHt = $('#specificIterTable').height();
       	var origHt = $('#manualAlert').height();
        var newHt = parseInt(tabHt) + parseInt(origHt);
		$('#manualAlert').height(newHt);	
		$('input[value="same"]').attr('disabled',true);
		$('input[value="extend"]').attr('checked',true);
    } else {
       	var tabHt = $('#specificIterTable').height();
        var origHt = $('#manualAlert').height();
   	    var newHt = parseInt(origHt) - parseInt(tabHt);
		$('#manualAlert').height(newHt);
        $('#specificIterTable').attr('style','display:none');
		$('input[value="same"]').attr('disabled',false);
      }

}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : toggleDevicesOptions
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 9,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : dropdown that shows devices of reservations
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function toggleDevicesOptions(val) {
    if (val != "all") {
		$('#specificTable').removeAttr('style');
	    var tabHt = $('#specificTable').height();
       	var origHt = $('#manualAlert').height();
        var newHt = parseInt(tabHt) + parseInt(origHt);
		$('#manualAlert').height(newHt);
    } else {
       	var tabHt = $('#specificTable').height();
        var origHt = $('#manualAlert').height();
   	    var newHt = parseInt(origHt) - parseInt(tabHt);
		$('#manualAlert').height(newHt);
        $('#specificTable').attr('style','display:none');
      }

}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : getDevicesFromSelectedReservation 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 9,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : gets device of selected reservation
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function getDevicesFromSelectedReservation() {
	var url = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getseldev2&query=selected="+ResId;

	$.ajax({
		url: url,
		dataType: 'html',
		async: false,
		success: function(data) {
			var dataArr = $.trim(data).split("*");
			var cnt = 0;
            var str = "<div class='header 'style='padding-top:10px'>DEVICES</div><div style='padding-top:10px'><table class='noborders' style='width:100%'><tr>";
            for (var x = 0; x < dataArr.length; x++) {
	            if (cnt == 3) {
     	    		str += "</tr><tr>";
        	        cnt = 0;
                }
                var dataInfo = dataArr[x].split("^");
                str += "<td style='border: 1px solid #FFFBFF'><input type='checkbox' name='specDevSel' value='"+dataInfo[0]+"' />&nbsp;"+dataInfo[1]+"</td>";
                cnt++;
            }
            str += "</tr></table></div>";
			$('#specificTable').empty().append(str);				
		}
	});

}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : selectedRow 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 18,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : selected row on the table 
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function selectedRow(){
	genIds = [];
	$('.trConnectivity').each(function(){
		if($(this).hasClass('highlight')){
			genIds.push($(this).attr('pId'));
		}
	});
	$('.trPort').each(function(){
		if($(this).hasClass('highlight')){
			genIds.push($(this).attr('rpId'));
		}
	});

	$('.trManDev').each(function(){
		if($(this).hasClass('highlight')){
			genIds.push($(this).attr('devId'));
		}
	});
	scheventid = [];
	$('.trSchedEve').each(function(){
		if($(this).hasClass('highlight')){
			scheventid.push($(this).attr('erId'));	
		}
	});
	globalResourceId =[];
	$('.trReserved').each(function(){
		if($(this).hasClass('highlight')){
			globalResourceId.push($(this).attr('rIds'));	
			ResId = $(this).attr('rIds');
		}
	});
	DeviceId = [];
	$('.trReservedRelease').each(function(){
		if($(this).hasClass('highlight')){
			globalResourceId.push($(this).attr('rId'));	
		}
	});
	
	DeviceId = [];
	$('.trImportedDevices').each(function(){
		if($(this).hasClass('highlight')){
		//	globalResourceId.push($(this).attr('rId'));	
			DeviceId.push($(this).attr('devId'));
			StartDate.push($.trim($(this).parent().find('td').eq(14).find('input').val()));
			TimeInterval.push($.trim($(this).parent().find('td').eq(16).find('input').val()));
			Recurrence.push($.trim($(this).parent().find('td').eq(17).find('input').val()));
			StartTime.push($.trim($(this).parent().find('td').eq(15).find('input').val()));
			EndDate.push($.trim($(this).parent().find('td').eq(19).find('input').val()));
			EndTime.push($.trim($(this).parent().find('td').eq(20).find('input').val()));
		

		}
	});
	$('.trDevices').each(function(){
		if($(this).hasClass('highlight')){
		//	globalResourceId.push($(this).attr('rId'));
			DeviceId.push($(this).attr('devId'));
			StartDate.push($.trim($(this).parent().find('td').eq(10).find('input').val()));
			TimeInterval.push($.trim($(this).parent().find('td').eq(12).find('input').val()));
			Recurrence.push($.trim($(this).parent().find('td').eq(13).find('input').val()));
			StartTime.push($.trim($(this).parent().find('td').eq(11).find('input').val()));
			EndDate.push($.trim($(this).parent().find('td').eq(15).find('input').val()));
			EndTime.push($.trim($(this).parent().find('td').eq(16).find('input').val()));
			DeviceReservation.push($.trim($(this).parent().find('td').eq(14).find('select').val()));
		}
	});
	$('.trHistory').each(function(){
		if($(this).hasClass('highlight')){
			deviceHistoryId.push($(this).attr('dhId'));	
		}
	});
	$('.trSchedHist').each(function(){
		if($(this).hasClass('highlight')){
			mainConfigHistoryId.push($(this).attr('mcId'));	
		}
	});
	$('.trManDev').each(function(){
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('devId'));	
		}
	});
	$('.trTesttool').each(function(){
		if($(this).hasClass('highlight')){
			PortId.push($(this).attr('portId'));	
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : selectedAllRow 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 3,2014
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 1
 *  #  DESCRIPTION   : selects all data in the table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */


function selectedAllRow(){
	$('.trReserved').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmReserveSelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#ReserveButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmReserveSelectAll').text('Deselect All');
			$('#ReserveButtons').show();
		}
		if($(this).hasClass('highlight')){
			globalResourceId.push($(this).attr('rIds'));
		}
	});
	$('.trReservedRelease').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmReleaseSelectAll').text('Select All');
			$(this).removeClass('highlight');
		}else{
			$(this).addClass('highlight');
			$('#rmReleaseSelectAll').text('Deselect All');
		}
		if($(this).hasClass('highlight')){
			globalResourceId.push($(this).attr('rIds'));
		}
	});
	$('.trConnectivity').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmConnectivitySelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#ConnectivityButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmConnectivitySelectAll').text('Deselect All');
			$('#ConnectivityButtons').show();
		}
		if($(this).hasClass('highlight')){
			genIds.push($(this).attr('pId'));
		}

	});
	$('.trPort').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmPortSelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#PortButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmPortSelectAll').text('Deselect All');
			$('#PortButtons').show();
		}
		if($(this).hasClass('highlight')){
			genIds.push($(this).attr('rpId'));
		}
	});
	$('.trHistory').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmHistorySelectAll').text('Select All');
			$(this).removeClass('highlight');
			//$('#RHistoryButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmHistorySelectAll').text('Deselect All');
		//	$('#RHistoryButtons').show();
		}
		if($(this).hasClass('highlight')){
			deviceHistoryId.push($(this).attr('dhId'));	
		}
	});
	$('.trDevices').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmDevicesSelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#DevicesButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmDevicesSelectAll').text('Deselect All');
			$('#DevicesButtons').show();
		}
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('devId'));
		}
	});
	$('.trImportedDevices').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmImportedDevicesSelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#DevicesButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmImportedDevicesSelectAll').text('Deselect All');
			$('#DevicesButtons').show();
		}
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('devId'));	
		}
	});
	$('.trSchedEve').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmEventSchedulerSelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#EventButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmEventSchedulerSelectAll').text('Deselect All');
			$('#EventButtons').show();
		}
		if($(this).hasClass('highlight')){
			scheventid.push($(this).attr('erId'));	
		}
	});
	$('.trSchedHist').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmHistorySchedulerSelectAll').text('Select All');
			$(this).removeClass('highlight');
			//$('#SHistoryButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmHistorySchedulerSelectAll').text('Deselect All');
			//$('#SHistoryButtons').show();
		}
		if($(this).hasClass('highlight')){
			mainConfigHistoryId.push($(this).attr('mcId'));	
		}
	});
	$('.trManDev').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmManageSelectAll').text('Select All');
			$(this).removeClass('highlight');
			$('#ManageButtons').hide();	
		}else{
			$(this).addClass('highlight');
			$('#rmManageSelectAll').text('Deselect All');
			$('#ManageButtons').show();
		}
		if($(this).hasClass('highlight')){
			genIds.push($(this).attr('devId'));
		}
	});
	$('.trLoadImage').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmLoadImageSelectAll').text('Select All');
			$(this).removeClass('highlight');
		}else{
			$(this).addClass('highlight');
			$('#rmLoadImageSelectAll').text('Deselect All');
		}
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('deviceId'));
		}
	});
	$('.trLoadConfig').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmLoadConfigSelectAll').text('Select All');
			$(this).removeClass('highlight');
		}else{
			$(this).addClass('highlight');
			$('#rmLoadConfigSelectAll').text('Deselect All');
		}
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('deviceId'));
		}
	});
	$('.trSaveImage').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmSaveImageSelectAll').text('Select All');
			$(this).removeClass('highlight');
		}else{
			$(this).addClass('highlight');
			$('#rmSaveImageSelectAll').text('Deselect All');
		}
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('deviceId'));
		}
	});
	$('.trSaveConfig').each(function(){
		if($(this).hasClass('highlight')){
			$('#rmSaveConfigSelectAll').text('Select All');
			$(this).removeClass('highlight');
		}else{
			$(this).addClass('highlight');
			$('#rmSaveConfigSelectAll').text('Deselect All');
		}
		if($(this).hasClass('highlight')){
			DeviceId.push($(this).attr('deviceId'));
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : SchedCancel 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 19,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : Cancel events in scheduler event 
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function SchedCancel(){
	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/RM/RM.py?action=cancelevents&query=resourceid='+scheventid;
	
	$.ajax({
	
		url: cgiUrl,
		dataType: '',
		timeout: 60000,
		success:function(data) {
			data = $.trim(data);
			if(data == 1){
				alert('Cancellation Success!');	
			}
			logCheck(globalUserName,"Resource Management", "Cancelled an Event");
		},
		error: function() {
		
			alert("Cancellation Failed.");
		
		}
		
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : clearRHistory
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : December 20,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : clears history in reservation history table
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function clearRHistory(){

	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=dsrh&query=id='+deviceHistoryId;
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			data = $.trim(data);
			console.log(data);
			if(data == 1){
				alert('Delete Success!');
				deviceHistoryId = [];
				logCheck(globalUserName,"Resource Management", "Cleared A Single Reservation History Entry");
			}
		}
	});
}
/*
 *  #######################################################################
 *  #
 *  #  FUNCTION NAME : clearSHistory 
 *  #  AUTHOR        : Angeline Bringas
 *  #  DATE          : January 3,2013
 *  #  MODIFIED BY   : 
 *  #  REVISION DATE : 
 *  #  REVISION #    : 
 *  #  DESCRIPTION   : clears history in scheduler history table 
 *  #  PARAMETERS    :
 *  #
 *  #######################################################################
 *  */
function clearSHistory(){

	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=dssh&query=id='+mainConfigHistoryId;
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			data = $.trim(data);
			console.log(data);
			if(data == 1){
				alert('Delete Success!');
				mainConfigHistoryId = [];
				logCheck(globalUserName,"Resource Management", "Cleared A Single Reservation History Entry");
			}
		}
	});
}
/*#########################################################################
 *
 *  FUNCTION NAME : clearAllHistory 
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 6,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : clears all information in reservation history table
 *  PARAMETERS    : 
 *
 *#########################################################################
 */
function clearAllHistory(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=darh&query=user='+globalUserName;
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			data = $.trim(data);
			console.log(data);
			if(data == 1){
				alert('Delete Success!');
				mainConfigHistoryId = [];
				logCheck(globalUserName,"Resource Management", "Cleared All Reservation History Entry");
			}
		}
	});

}
/*#########################################################################
 *
 *  FUNCTION NAME : clearAllSchedHistory 
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 7,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : clears all information in scheduler history table
 *  PARAMETERS    : 
 *
 *#########################################################################
 */
function clearAllSchedHistory(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=deleteschedulerhistory&query=user='+globalUserName;
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			data = $.trim(data);
			console.log(data);
			if(data == 1){
				alert('Delete Success!');
				logCheck(globalUserName,"Resource Management", "Cleared All Scheduler History Entry");
			}
		}
	});


}
/*#########################################################################
 *
 *  FUNCTION NAME : checkIfTheresAnotherUser
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 7,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : checks if there are reservation that doesn't belong to user's account.
 *  PARAMETERS    : 
 *
 *#########################################################################
 */
function checkIfTheresAnotherUser(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkresusers&query=ids='+globalResourceId+'&user='+globalUserName;
	var ret = "";
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			ret = $.trim(data);
			if(data == 1){
				$('#divreleaseOtherUsersDevice').show();	
			}else{
				$('#divreleaseAllDevice').show();
			}
		}
	});
	return ret;
}
/*#########################################################################
 *
 *  FUNCTION NAME : releaseAllDevices
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 7,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 *#########################################################################
 */
function releaseAllDevices(){
	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/RM/RM.py?action=cancel&query=ResourceId='+globalResourceId;
	$.ajax({
	
		url: cgiUrl,
		dataType: 'html',
		timeout: 300000,
		success:function(data) {
			data = $.trim(data);	
			if(data == 1){
				alert('Release Successful!');
			}
			logCheck(globalUserName,"Resource Management", "Released All Devices");
		},
		error: function() {
		
			alert("Release failed.");
		
		}
		
	});
}
/*#########################################################################
 *
 *  FUNCTION NAME : ReleaseSpecific 
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 6,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : release specific device
 *  PARAMETERS    : 
 *
 *#########################################################################
 */
function ReleaseSpecific(){
	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/RM/RM.py?action=manualmatrixrelease&query=r='+ResId+'*d='+DeviceId;
	$.ajax({
	
		url: cgiUrl,
		dataType: 'html',
		timeout: 300000,
		success:function(data) {
		
			refreshAvailability = true;
			if (data == 1) {
				alert('Release Successful!');
			}
			
		},
		error: function() {
			alerts("Release failed.");
		}
	});
}
/*#########################################################################
 *
 *  FUNCTION NAME : checkExtensionLimit
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 8,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : checks if user exceeds his/her reservation extension limit 
 *  PARAMETERS    : 
 *
 *#########################################################################
 */

function checkExtensionLimit() {
	var ret = "";
	var url='http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkextensionlimit&query=user='+globalUserName+'&resourceid='+globalResourceId;
	$.ajax({
		url: url,	
		dataType: 'html',
		async: false,
		success:function(data) {
			ret = $.trim(data);
		}
	});

	return ret;

}
/*#########################################################################
 *
 *  FUNCTION NAME : deleteManageDevice
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 15,2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 *#########################################################################
 */

function checkUnprovisioningStatus() {
	var retcerd = "";
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkunprovisioningstatus&query=user='+globalUserName+'&resourceid='+globalResourceId;
	$.ajax({
		url: url,
		dataType: 'html',
		async: false,
		success: function(data){
			retcerd = $.trim(data);
		}
	});

	return retcerd;
}
/*#########################################################################
 *
 *  FUNCTION NAME : deleteManageDevice
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 3,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : delete device in Manage devices table
 *  PARAMETERS    : 
 *
 *#########################################################################
 */
function deleteManageDevice(){
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=deletedevice&query=DeviceId='+DeviceId;
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			data = $.trim(data);
			console.log(data);
			if(data == 1){
				alert('Delete Success!');
				DeviceId = [];
				logCheck(globalUserName,"Resource Management", "Deleted a Device in Manage Devices table.");
			}
			
		}
	});

}
function addManageDevice() {
	
        var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getuser&query=status=Off`user='+globalUserName+'`act=click';
    $.ajax({
		url: url,
        dataType: 'html',
         success: function(data) {
            
         }
    });
}


/*#########################################################################
 *
 *  FUNCTION NAME : logCheck
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 3,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : tracks all action done by the user in each page
 *  PARAMETERS    : none
 *
 *#########################################################################
 */

function logCheck(UserName,Page,Action) {

    var qstr = "action=Logs&UserName="+UserName+"&Page="+Page+"&Action="+Action+"&ipAdd="+CURRENT_IP;
    var cgiURL= "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteAdmin/FQueryCgiAdminLogs.fcgi?";

   $.ajax({
        url: cgiURL+qstr,
        dataType: 'html',
        success: function(data) {

		}
	});

}
/*#########################################################################
 *
 *  FUNCTION NAME : getZoneForResDev
 *  AUTHOR        : Angeline Bringas
 *  DATE          : January 3,2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get all the zone binded for the domain selected 
 *  PARAMETERS    : none
 *
 *#########################################################################
 */
function getZoneForResDev() {

	var domain = $('#domainSelect').val();
	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getZone&query=domain='+domain+"`user="+globalUserName;
	$.ajax({
		url: cgiUrl,	
		dataType: 'html',
		async: false,
		success:function(data) {
			var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
            var row = xmlDoc.getElementsByTagName('row');
			var opT='';
			for(var a =0; a< row.length; a++){
                var zoneId = row[a].getAttribute('ZoneId');
				var zoneName = row[a].getAttribute('ZoneName');
				if (domain == "" && zoneId != "") {
					var domName = row[a].getAttribute('DomainName');
					opT += '<option value="'+zoneId+'" did="'+zoneName+'" title="Domain: '+domName+'">'+zoneName+'</option>';
				} else {
					opT += '<option value="'+zoneId+'" did="'+zoneName+'">'+zoneName+'</option>';
				  }
			}
			$('#zoneSelect').empty().append(opT);
			if ($('#domainSelect').val() != "") {
				if (row.length == 1) {
    	            $('#zoneSelect').hide();
        	        $('#tdZone').empty().append("<b>Resource Zone: </b>"+row[0].getAttribute('ZoneName'));
            	    $('#tdZone').removeAttr('style');
	            } else {
    	            $('#tdZone').empty().append("<b>Resource Zone: </b>").removeAttr('style');
        	        $('#tdZone').next().removeAttr('style');
            	    $('#zoneSelect').removeAttr('style').attr('style','width:auto;max-width:auto');
              	  }
			} else {
				$('#tdZone').attr('style','display:none');
				$('#zoneSelect').hide();
			  }

			getGroupForResDev();

		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : getGroupForResDev
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 13,2014
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : get all the group binded for the selected zone and domain
 #  PARAMETERS    : 
 #
 #######################################################################
*/


function getGroupForResDev() {

	var zid = $('#zoneSelect').val();
	var did = $('#domainSelect').val();
	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getGroup&query=ZoneId='+zid+"`user="+globalUserName+"`domain="+did;
	$.ajax({
		url: cgiUrl,	
		dataType: 'html',
		async: false,
		success:function(data) {
			var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
            var row = xmlDoc.getElementsByTagName('row');
			var opT='';
			for(var a =0; a< row.length; a++){
                var groupId = row[a].getAttribute('GroupId');
				var groupName = row[a].getAttribute('GroupName');
				if (zid == "" && groupId != "") {	
					var zonename = row[a].getAttribute("ZoneName");		
					var domainname = row[a].getAttribute("DomainName");		
					opT += '<option value="'+groupId+'" title="Domain: '+domainname+'\nZone: '+zonename+'">'+groupName+'</option>';
				} else {
					opT += '<option value="'+groupId+'">'+groupName+'</option>';
				  }
			}
			$('#groupSelect').empty().append(opT);
			if ($('#zoneSelect').val() != "") {
				if (row.length == 1) {
    	            $('#groupSelect').hide();
        	        $('#tdGroup').empty().append("<b>Group: </b>"+row[0].getAttribute('GroupName'));
            	    $('#tdGroup').removeAttr('style');
	            } else {
    	            $('#tdGroup').empty().append("<b>Group: </b>").removeAttr('style');
        	        $('#tdGroup').next().removeAttr('style');
            	    $('#groupSelect').removeAttr('style').attr('style','width:auto;max-width:auto');
              	  }
			} else {
				$('#tdGroup').attr('style','display:none');
				$('#groupSelect').hide();
			  }
	
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : getDomainsForResDev
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 13,2014
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : get all the domain binded for the user log-in
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function getDomainsForResDev() {

	var ret = "";
	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getDomain&query=username='+globalUserName;
	$.ajax({
		url: cgiUrl,	
//		url:'../php/functions_receiver.php?action=getdomforresdev&user='+globalUser,
		dataType: 'html',
		async: false,
		success:function(data) {
			var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
            var row = xmlDoc.getElementsByTagName('row');
			var opT='';
			for(var a =0; a< row.length; a++){
                var domId = row[a].getAttribute('DomainId');
				var domName = row[a].getAttribute('DomainName');
				opT += '<option value="'+domId+'">'+domName+'</option>';
			}

			$('#domainSelect').empty().append(opT);
			if ($('#domainSelect').val() != "") {
				if (row.length == 1) {
    	            $('#domainSelect').hide();
        	        $('#tdDomain').empty().append(row[0].getAttribute('DomainName'));
                	$('#tdDomain').removeAttr('style');
            	} else {
	                $('#tdDomain').empty();
    	            $('#domainSelect').removeAttr('style').attr('style','width:auto;max-width:auto');
        	      }
			}
			var dom = $('#domainSelect').val();
			getDeviceAccess(dom);
			getZoneForResDev();
		}

	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : getDeviceAccess
 #  AUTHOR        : Angeline Bringas
 #  DATE          : Janury 13,2014 PST
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : checks if domain has external devices binded
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function getDeviceAccess(id) {

	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkdeviceaccess&query=domain='+id+'`user='+globalUserName;
	$.ajax({
		url: cgiUrl,	
		dataType: 'html',
		async: false,
		success:function(data) {
			var mydata = $.trim(data);
			if (mydata == 1) {
				console.log('show');
				$('#liFTab2').show();
			} else {
				$('#liFTab2').hide();
			}
		}
		
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : getServerTime 
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 13,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : fetches server time 
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function getServerTime() {

	var cgiUrl = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=localtime&query=tZone='+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3];
    var currData;
    $.ajax({
        url: cgiUrl,
        dataType: 'html',
		async: false,
        success: function(data) {
			currData = data;
		}
    });

	return currData;
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : converttoServertime
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 21,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : fetches reservation startdate,start time, enddate and endtime
 #  PARAMETERS    : startDate,startTime,endDate,endTime
 #
 #######################################################################
*/
function converttoServertime(startDate,startTime,endDate,endTime){
	
	var newtime = "";
	var url1 = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=convertoservertime&query=startdate="+startDate+"`starttime="+startTime+"`enddate="+endDate+"`endtime="+endTime+"`tZone="+timezone[0]+timezone[1]+timezone[2]+'^'+timezone[3]+timezone[4];

    $.ajax({
        url: url1,
        dataType: 'html',
        async: false,
        success: function(data) {
			newtime = $.trim(data);
		}
	});
	console.log(newtime,'dasdasdasda');
	return newtime;


}
/*
 #######################################################################
 #
 #  FUNCTION NAME : getdevicetype 
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 17,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : checks the device type if Dut, Server or Testtool
 #  PARAMETERS    : 
 #
 #######################################################################
*/

function getdevicetype(id){
		console.log('123456678');
	var devType = '';
	var URL = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getdevicetype&query=ids='+id;
	$.ajax({
		url: URL,
		async: false,
		dataType: 'html',
		success: function(data) {
			devType = $.trim(data);
			if(devType.toLowerCase() == "testtool"){
				$.mobile.changePage("../RM/RMTesttool.html",{
					transition: "flow",
					reverse: false,
					changeHash:true
				});
			}		
		}
	});
	return devType;
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : checkIfDutExists
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 17,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : checks if Dut exists
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function checkIfDutExists() {
	var url= 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=checkifdutexists&query=ids='+DeviceId;
	
	var ret = "";
	$.ajax({
	
		url: url,	
		dataType: 'html',
		async: false,
		success:function(data) {
			ret = $.trim(data);
		}
	});

	return ret;

}

function createXMLdata(qstr){
	console.log('<<<<<<<<<<<<<<<<<<<!!!!');
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/RM/RM.py?action=createxml&query='+qstr;
	
	$.ajax({
		url: url,
		dataType: 'html',
		success:function(data){
			console.log(qstr,data,'pasok');
			data = data.replace(/(\r\n|\n|\r)/gm,"");
			var confirm1 = data.split(" ");
			var confirmation = confirm1[0].split("^");
			var spdata = data.split( "=" );
			if(spdata[0] == "resourceId"){
				alert('Device Successfully Reserved!');
			}
		}
	});
}

var ctrDev = 0;
function queryCreateXMLData(){
	console.log('>>>>>>>>>>>>>>>>>>');
	var qstr = "";
	var qstr1 = ""; 	
	var devIds2 = new Array();

	var ctrflag = 0;

			console.log(ctrDev,'=============');
	for (var i = 0; i < DeviceId.length; i++) {
		var devType = getdevicetype(DeviceId[i]);
		if (devType == "TestTool"){
			var newstartinfo = converttoServertime(StartDate[i],StartTime[i],EndDate[i],EndTime[i]);
			var newstartdate = "";
			var newstarttime = "";
			var newenddate = "";
			var newendtime = "";
			var datainfo = newstartinfo.split(",");
			var startinfo = datainfo[0].split(" ");
			newstartdate = startinfo[0];
	        newstarttime = startinfo[1];
			var endinfo = datainfo[1].split(" ");
	        newenddate = endinfo[0];
			newendtime = endinfo[1];

			if (ctrflag == 0){
                ctrflag = 1;
            } else {
                qstr = qstr + "^";
              }

			devIds2.push(DeviceId[i]);
			/*			
			qstr1 = qstr1 +"deviceid=" + DeviceID[i]; 
			qstr1 = qstr1 + "*" + "start=" + newstartdate + " " + newstarttime;
			qstr1 = qstr1 + "*" + "end=" + newenddate + " " + newendtime;

			qstr1 = qstr1 + "*" + "Interval=" + TimeInterval[i];
			qstr1 = qstr1 + "*" + "Recurrence=" + Recurrence[i];
			qstr1 = qstr1 + "*" + "Exclusivity=" + DeviceReservation[i];
			qstr1 = qstr1 + "*" + "PortId="+ globalTTPorts[DeviceID[i]];
			*/

			qstr = qstr + Recurrence[i];
			qstr = qstr + "|" + TimeInterval[i];
			qstr = qstr + "|" + DeviceId[i]; 
			qstr = qstr + "^" + DeviceReservation[i]; 
			qstr = qstr + "^" + newstartdate + "," + newstarttime + "," + newenddate + "," + newendtime;

		} else {
			
			var newstartinfo =converttoServertime(StartDate[i],StartTime[i],EndDate[i],EndTime[i]);
			var newstartdate = "";
			var newstarttime = "";
			var newenddate = "";
			var newendtime = "";
			var datainfo = newstartinfo.split(",");
			var startinfo = datainfo[0].split(" ");
			newstartdate = startinfo[0];
	        newstarttime = startinfo[1];
			var endinfo = datainfo[1].split(" ");
	        newenddate = endinfo[0];
			newendtime = endinfo[1];

			if (ctrflag == 0) {
                ctrflag = 1;
            } else {
                qstr = qstr + "`";
              }

			devIds2.push(DeviceId[i]);
			qstr = qstr + Recurrence[i];
			qstr = qstr + "|" + TimeInterval[i];
			qstr = qstr + "|" + DeviceId[i]; 
			qstr = qstr + "^" + DeviceReservation[i]; 
			qstr = qstr + "^" + newstartdate + "," + newstarttime + "," + newenddate + "," + newendtime + "*";
		}
	}
	qstr = globalUserName+"`"+qstr+qstr1;
	createXMLdata(qstr);
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : setManufacturer
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 17,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : dropdown for choosing manufaturer
 #  PARAMETERS    : value
 #
 #######################################################################
*/
function setManufacturer(value){
		if ( value == "networkingdevice" ) {
					$('#devicetype').empty();
					$('#devicetype').append('<option></option>');
					$('#devicetype').append('<option value="cisco">Cisco</option>');
					$('#devicetype').append('<option value="juniper">Juniper</option>');
					$("#hasPartnerDevice").attr('disabled',false);
					$('#hostname').val('');
					$('#hostname').hide();
					$('#hostnamelabel').hide();
				} else if ( value == "testtool" ) {
					$('#devicetype').empty();
					$('#devicetype').append('<option></option>');
					$('#devicetype').append('<option value="n2x">Agilent</option>');
					$('#devicetype').append('<option value="ixia">Ixia</option>');
					$('#devicetype').append('<option value="spirent">Spirent</option>');
					$("#hasPartnerDevice").attr('disabled',false);
					$('#hostname').show();
					$('#hostnamelabel').show();
				} else if ( value == "l1switch" ) {
					$('#devicetype').empty();
					$('#devicetype').append('<option></option>');
					$('#devicetype').append('<option value="glx">Curtiss-Wright</option>');
					$('#devicetype').append('<option value="mrv">MRV</option>');
					$('#devicetype').append('<option value="onpath">OnPath</option>');
					$("#hasPartnerDevice").attr('checked',false);
					$("#hasPartnerDevice").attr('disabled',true);
					$('#partnerDevice').hide();
					$('#SlotTable').attr('style','display:none');
					addNew = false;
					$('#hostname').show();
					$('#hostnamelabel').show();
				} else if ( value == "l2switch" ) {
					$('#devicetype').empty();
					$('#devicetype').append('<option></option>');
					$('#devicetype').append('<option value="ciscoswitch">Cisco</option>');
					$("#hasPartnerDevice").attr('checked',false);
					$("#hasPartnerDevice").attr('disabled',true);
					$('#partnerDevice').hide();
					$('#SlotTable').attr('style','display:none');
					addNew = false;
					$('#hostname').val('');
					$('#hostname').hide();
					$('#hostnamelabel').hide();
				} else if ( value == "terminalserver" ) {
					$('#devicetype').empty();
					$('#devicetype').append('<option></option>');
					$('#devicetype').append('<option value="terminalserver">Cisco</option>');
					$("#hasPartnerDevice").attr('checked',false);
					$("#hasPartnerDevice").attr('disabled',true);
					$('#partnerDevice').hide();
					$('#SlotTable').attr('style','display:none');
					addNew = false;
					$('#hostname').val('');
					$('#hostname').hide();
					$('#hostnamelabel').hide();
				} else if ( value == "empty" ) {
					$('#devicetype').empty();
					$("#hasPartnerDevice").attr('checked',false);
					$("#hasPartnerDevice").attr('disabled',true);
					$('#partnerDevice').hide();
					$('#SlotTable').attr('style','display:none');
					addNew = false;
					$('#hostname').val('');
					$('#hostname').hide();
					$('#hostnamelabel').hide();
				}


}
/*
 #######################################################################
 #
 #  FUNCTION NAME : changeButton 
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 20,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : checks the ip if it's existing
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function changeButton(){
console.log('yehey!');
	var ipchk = $('#chassisIp').val();
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?action=verifyip&query=ip='+ipchk;
	$.ajax({
		url: url,
		dataType : 'html',
		success: function(data){
			var dt = data.split(':');
			if(dt[0] == "true"){
			}
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : getHostValid 
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 20,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : checks the hostname if it's existing or not
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function getHostValid(){ 

	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?action=gethostvalid&query=host='+globalHostName;
	$.ajax({
		url: url,
		dataType: 'html',
		success: function(data){
			if(data == "true"){
			}
		}
	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : filterReservationReserve 
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 22,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : filter for Reservation Reserve table
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function filterReservationReserve(){
	var $rows = $('#reservationRM-table tr:gt(0)');
	$('.ReservedFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterReserved option:selected').text();
		var colval = $('#filterReserved').val();
		var colnum = '';
		if(colval == "hostName"){
			colnum = 2
		}else if(colval == "user"){
			colnum = 9
		}else if(colval == "domainname"){
			colnum = 3
		}else if(colval == "managementip"){
			colnum = 4
		}else if(colval == "consoleip"){
			colnum = 5
		}else if(colval == "model"){
			colnum = 6 
		}else if(colval == "type"){
			colnum = 15
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
/*
 #######################################################################
 #
 #  FUNCTION NAME : filterReservationConnectivity
 #  AUTHOR        : Angeline Bringas
 #  DATE          : January 22,2014
 #  MODIFIED BY   : 
 #  REVISION DATE :
 #  REVISION #    : 
 #  DESCRIPTION   : filter for Reservation Connectivity table
 #  PARAMETERS    : 
 #
 #######################################################################
*/
function filterReservationConnectivity(){
	var $rows = $('#RMConnectivity-table tr:gt(0)');
	$('.ConnectivityFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterConnectivity option:selected').text();
		var colval = $('#filterConnectivity').val();
		var colnum = '';
		if(colval == "hostName"){
			colnum = 1
		}else if(colval == "description"){
			colnum = 2
		}else if(colval == "switchhostname"){
			colnum = 8
		}else if(colval == "switchdescription"){
			colnum = 9
		}else if(colval == "devicehostname"){
			colnum = 15
		}else if(colval == "devicedescription"){
			colnum = 16
		}else if(colval == "user"){
			colnum = 17
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
function filterReservationPort(){
	var $rows = $('#RMPort-table tr:gt(0)');
	$('.PortFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterPort option:selected').text();
		var colval = $('#filterPort').val();
		var colnum = '';
		if(colval == "hostName"){
			colnum = 2
		}else if(colval == "managementip"){
			colnum = 3
		}else if(colval == "model"){
			colnum = 4
		}else if(colval == "portname"){
			colnum = 5
		}else if(colval == "user"){
			colnum = 8
		}else if(colval == "type"){
			colnum = 10
		}else if(colval == "physicalporttype"){
			colnum = 11
		}else if(colval == "portspeed"){
			colnum = 12
		}else if(colval == "bandwidth"){
			colnum = 13
		}else if(colval == "linetype"){
			colnum = 14
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
function filterReservationDevices(){
	var $rows = $('#RMDevices-table tr:gt(0)');
	$('.DevicesFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterDevices option:selected').text();
		var colval = $('#filterDevices').val();
		var colnum = '';
		if(colval == "hostName"){
			colnum = 1
		}else if(colval == "managementip"){
			colnum = 2
		}else if(colval == "consoleip"){
			colnum = 3
		}else if(colval == "manufacturer"){
			colnum = 4
		}else if(colval == "model"){
			colnum = 5
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
function filterReservationHistory(){
	var $rows = $('#RMHistory-table tr:gt(0)');
	$('.HistoryFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterHistory option:selected').text();
		var colval = $('#filterHistory').val();
		var colnum = '';
		if(colval == "hostName"){
			colnum = 2
		}else if(colval == "managementip"){
			colnum = 3
		}else if(colval == "manufacturer"){
			colnum = 4
		}else if(colval == "model"){
			colnum = 5
		}else if(colval == "user"){
			colnum = 6
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
function filterSchedHistory(){
	var $rows = $('#RMHistorySched-table tr:gt(0)');
	$('.SchedHistFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterSchedHist option:selected').text();
		var colval = $('#filterSchedHist').val();
		var colnum = '';
		if(colval == "eventid"){
			colnum = 1
		}else if(colval == "configname"){
			colnum = 2
		}else if(colval == "eventdesc"){
			colnum = 3
		}else if(colval == "username"){
			colnum = 4
		}else if(colval == "status"){
			colnum = 7
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
function filterEventSched(){
	var $rows = $('#RMEventSched-table tr:gt(0)');
	$('.SchedEventFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterSchedEvent option:selected').text();
		var colval = $('#filterSchedEvent').val();
		var colnum = '';
		if(colval == "eventid"){
			colnum = 1
		}else if(colval == "configname"){
			colnum = 2
		}else if(colval == "userid"){
			colnum = 3
		}else if(colval == "username"){
			colnum = 4
		}else if(colval == "device"){
			colnum = 7
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
function filterManageDevices(){
	var $rows = $('#RMManageDevice-table tr:gt(0)');
	$('.ManageFilter').keyup(function(){
		var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#filterManage option:selected').text();
		var colval = $('#filterManage').val();
		var colnum = '';
		if(colval == "hostname"){
			colnum = 2
		}else if(colval == "zone"){
			colnum = 4
		}else if(colval == "domain"){
			colnum = 3
		}else if(colval == "managementip"){
			colnum = 6
		}else if(colval == "managementinterface"){
			colnum = 7
		}else if(colval == "macaddress"){
			colnum = 8
		}else if(colval == "consoleip"){
			colnum = 9
		}else if(colval == "manufacturer"){
			colnum = 10
		}else if(colval == "model"){
			colnum = 11
		}else if(colval == "serialno"){
			colnum = 12
		}else if(colval == "techsupport"){
			colnum = 13
		}else if(colval == "discovery"){
			colnum = 14
		}else if(colval == "cpuspeed"){
			colnum = 15
		}else if(colval == "systemmemory"){
			colnum = 16
		}else if(colval == "nvram"){
			colnum = 17
		}else if(colval == "osversion"){
			colnum = 18
		}
    	$rows.show().filter(function() {
			if(colnum != ''){
        		text = $(this).find("td").eq(colnum).text().replace(/\s+/g, ' ');
			}else{
        		text = $(this).text().replace(/\s+/g, ' ');
			}
        	return !reg.test(text);
    	}).hide();

	});
}
