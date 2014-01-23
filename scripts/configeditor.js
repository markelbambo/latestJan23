/*
 *
 *  FUNCTION NAME : clickIcon 
 *  AUTHOR        : Juvindle C Tina
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : click icon on sidebar
 *  PARAMETERS    : src
 *
 */
function clickIcon(src){
    var did =  $(src).attr('did');
	switch(did.toLowerCase()){
		case "device":
			createDevice(src);
		break;
		case "devicelist":
		break;
		case "serverlist":
		break;
		case "testtoollist":
		break;
		case "interface":
			createInterface(src);
        break;
	}
}
/*
 *
 *  FUNCTION NAME : checkValConfigText
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function checkValConfigText(event){

	var allowedChar = "abcdefghijklmnopqrstiuwxvyzABCDEFGHIJKLMNOPQRSTUVWXYZV1234567890-_";
    var keyCode = event.keyCode;
    var asciiCode = String.fromCharCode(keyCode);

    if (allowedChar.indexOf(asciiCode) == -1){
        alert('Special Characters and spaces  are not Allowed');
        return false;
    } else{
   		return true; 
    }

	
}
/*
 *
 *  FUNCTION NAME : PortTestToolTable 
 *  AUTHOR        : James Turingan
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
var checkPortsTTList = [];
function PortTestToolTable(){
	globalFlag = false;
	var checkType=[];
	checkLCArray=[];
	var opStr='';
	var url = "/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/getTestToolPorts.cgi"
	var query = "Ip="+HostName+"&user="+globalUserName;
	var url = "http://"+CURRENT_IP+url;
	var action = "gettesttoolports";
	$.ajax({
        url: url,
		data: {
			"action":action,
			"query":query,
		},
        dataType: 'html',
		method: 'POST',
		proccessData: false,
		async:false,
        success: function(data) {
			var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
            var row = xmlDoc.getElementsByTagName('PORT');
            var html =''
			var ttype='';
			var btns='';
			checkPortTestToolList(row,html,checkType,opStr);
			$(".trPortTestTool").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					for(var i = 0; i < testToolObj.length; i++){
						if(HostName == testToolObj[i].DeviceName){
							testToolObj[i].Ports.push($(this).attr('portname'));
							checkPortsTTList.push($(this).attr('portname'));
						}

					}
				}else{
        			$(this).removeClass('highlight');
					removeObj($(this).attr('portname'),'port');
					if(checkPortsTTList.indexOf($(this).attr('portname')) != -1){
						var indx = checkPortsTTList.indexOf($(this).attr('portname'));
						checkPortsTTList.splice(indx,1);	

					}
				}
			});
		}

	});
}
/*
 *
 *  FUNCTION NAME : checkPortTestToolList 
 *  AUTHOR        : James Turingan
 *  DATE          : December 28, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function checkPortTestToolList(row,html,checkType,opStr){
	var ttype='';
	for(var a =0; a< row.length; a++){
		ttype = row[a].getAttribute('ConnectivityType');
		if(checkType.indexOf(ttype) == -1){
			checkType.push(ttype);
			if(a == 0){
				opStr += "<option value='"+ttype+"' selected >"+ttype+"</option>";
			}else{
				opStr += "<option value='"+ttype+"'>"+ttype+"</option>";

			}
		}
		if(checkPortsTTList.indexOf(row[a].getAttribute('Ports')) == -1){
			html += "<tr class='trPortTestTool' ";
			html += "portname='"+row[a].getAttribute('Ports')+"' ";
			html+= ">";
			html += "<td>"+row[a].getAttribute('Ports')+"</td>";
   	   		html += "<td>"+row[a].getAttribute('Speed')+"</td>";
			html += "<td class='conntype'>"+row[a].getAttribute('ConnectivityType')+"</td>";
   		    html += "<td>"+row[a].getAttribute('PartnerPort')+"</td>";
			html += "<td>"+row[a].getAttribute('Status')+"</td>";
			html += "<td>"+row[a].getAttribute('User')+"</td>";
			html +="</tr>";
		}
		
	}
	$("#PortTestTool-table > tbody").empty().append(html);	
	$('#portTypeTT').empty().append(opStr);
	var myselect = $("#portTypeTT");
	myselect[0].selectedIndex =0;
	myselect.selectmenu("refresh");

	setTimeout(function(){
		connTypeFilter();
	},1000);
}



/*
 *
 *  FUNCTION NAME : TestToolListTable 
 *  AUTHOR        : James Turingan
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
var checkDevNameTT = [];
function TestToolListTable(load){
	globalFlag = false;
	checkLCArray=[];
	var url = "/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi"
	var query = "devtype=testtool^manufacturer=^user="+globalUserName+"^domainname="+ResourceDomain+"^zone=^imported=0^hostname=";
	var url = "http://"+CURRENT_IP+url;
	var action = "devicelist";
	$.ajax({
        url: url,
		data: {
			"action":action,
			"query":query,
		},
        dataType: 'html',
		method: 'POST',
		proccessData: false,
		async:false,
        success: function(data) {
			loading("hide");
			var mydata = data;
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString( mydata , "text/xml" );
			var root = xmlDoc.getElementsByTagName('root'); 
            var row = xmlDoc.getElementsByTagName('DEVICES');
            var html ='',startRes='',endRes='';
			var btns='';
            for(var a =0; a< row.length; a++){
				html += "<tr class='trManageTestTool' ";
				html += "devname='"+row[a].getAttribute('DeviceName')+"' ";
				html+= ">";

				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('DeviceName')+"</td>";
				html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
                html += "<td>"+row[a].getAttribute('ConsoleIp')+"</td>";
                html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
                html += "<td>"+row[a].getAttribute('Status')+"</td>";
				html += "<td>"+row[a].getAttribute('UserName')+"</td>";
				html += "<td>"+row[a].getAttribute('RemainingTime')+"</td>";	
				html += "<td>"+row[a].getAttribute('AvailablePort')+"</td>";
				html += "<td>"+row[a].getAttribute('PortType')+"</td>";
			
				html +="</tr>";
			}
			$("#manageTestToolTable > tbody").empty().append(html);
			$(".trManageTestTool").on("tap",function(){
				if($(this).hasClass('highlight') == false){
					$(this).addClass('highlight');
					loading("show");
				   	$.mobile.changePage("pages/ConfigEditor/PortTestTool.html", {
						transition: "flow",
						reverse: false,
						changeHash: true
					});
					HostName = $(this).attr('devname');
					if(checkDevNameTT.indexOf(HostName) == -1){	
						checkDevNameTT.push(HostName);
						testToolObj.push({
							DeviceName: HostName,
							Ports: [],
							Flag: 0
						});				
					}

				}else{
        			$(this).removeClass('highlight');
					removeObj($(this).attr('devname'));
					if(checkDevNameTT.indexOf(HostName) != -1){
						var i = checkDevNameTT.indexOf($(this).attr('devname'));
						checkDevNameTT.splice(i,1);
					}
				}
			});


        }
     });
	filterManageDevice('testTool');

}
/*
 *
 *  FUNCTION NAME : removeObj 
 *  AUTHOR        : James Turingan
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function removeObj(val,type){
	if(type != 'port'){
		for(var i = 0; i < testToolObj.length; i++){
			if(val == testToolObj[i].DeviceName){
				testToolObj.splice(i,1);	
			}

		}
	}else{
		for(var i = 0; i < testToolObj.length; i++){
			if(HostName == testToolObj[i].DeviceName){
				for(var x = 0 ; x < testToolObj[i].Ports.length; x++){
					testToolObj[i].Ports.splice(x,1);	
				}
			}

		}

	}

}
/*
 *
 *  FUNCTION NAME : removeObj 
 *  AUTHOR        : James Turingan
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function createTestToolObj(){
	var url = "/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/getTTPorts.fcgi"
	var query = '';
	for(var i = 0; i < testToolObj.length; i++){
		if(i == 0){
			query = 'Ip='+testToolObj[i].DeviceName;
			query += '^PortList='+testToolObj[i].Ports;
			query += '^Flag='+testToolObj[i].Flag;
		}else{
			query += '*Ip='+testToolObj[i].DeviceName;
			query += '^PortList='+testToolObj[i].Ports;
			query += '^Flag='+testToolObj[i].Flag;
		}

	}
	var url = "http://"+CURRENT_IP+url;
	var action = "getttports";
	loading('show');
	$.ajax({
        url: url,
		data: {
			"action":action,
			"query":query,
		},
        dataType: 'html',
		method: 'POST',
		proccessData: false,
		async:false,
        success: function(data) {
			data = $.trim(data);
			getDataFromXML(data);
			loading('hide');

		}
	});
}


/*
 *
 *  FUNCTION NAME : deviceListPopupTable 
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
var globalDeviceListLoad="";
function deviceListPopupTable(load,tab){
	globalDeviceListLoad = "";
	globalDeviceListLoad = load;
	globalFlag = false;
	checkLCArray=[]
	var res  = globalResourceDomain;
	if (globalResourceDomain==""){
		res = ResourceDomain;
	}
	var hasDevName = getHasDevNameOnArray();
	var url = "/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi"
	if (tab == "import"){
		
		var query = "user="+globalUserName+"^domainname="+ResourceDomain+"^zone=^imported=1^hostname="+hasDevName;
	}else{
		var query = "user="+globalUserName+"^domainname="+ResourceDomain+"^zone=^imported=0^hostname="+hasDevName;
	}
	var url = "http://"+CURRENT_IP+url;
	var action = "devicelist";
	$.ajax({
        url: url,
		data: {
			"action":action,
			"query":query,
		},
        dataType: 'html',
		method: 'POST',
		proccessData: false,
		async:false,
        success: function(data) {
			data = $.trim(data);
			if (data == "nodevice"){
				loading("hide");
				$.mobile.changePage($('#configEditorPage'),{
    		       	transition: "pop"
    		    });

				alert("No Available Device");
				return;
			}else if (data == "databasetimeout"){
				loading("hide");
				alert ("Database Timeout");
				$.mobile.changePage($('#configEditorPage'),{
    		       	transition: "pop"
    		    });
				return;
			}else if (data == ""){
				loading("hide");
				$.mobile.changePage($('#configEditorPage'),{
    		       	transition: "pop"
    		    });
				alert ("Database Timeout");
				return;
			}
			var condition = checkIfTabAvailable(data);
			loading("hide");
			appendToDeviceListTable(data,condition,load,tab);
		}
     });
	filterManageDevice()

}

/*
 *
 *  FUNCTION NAME : getHasDevNameOnArray
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 14, 2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get all device name to string
 *  PARAMETERS    : 
 *
 */
function getHasDevNameOnArray(){
	var str =[];
	for(var a=0; a<devicesArr.length; a++){
		if (devicesArr[a].DeviceName!=""){
			var name = devicesArr[a].DeviceName;
			str.push(name);
		}	
	}
	return str;
}
/*
 *
 *  FUNCTION NAME : appendToDeviceListTable
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 13, 2013
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : append xml to table on device list
 *  PARAMETERS    : 
 *
 */
globalSelectedDeviceList= [];
function appendToDeviceListTable(data,condition,load, tabSelected){
	var mydata = data;
    var parser = new DOMParser();
    var xmlDoc;
    xmlDoc = parser.parseFromString( mydata , "text/xml" );
    var row = xmlDoc.getElementsByTagName('DEVICES');
    var html ='',startRes='',endRes='';
	var btns='';
			loop:
            for(var a =0; a< row.length; a++){
				var devName = row[a].getAttribute('DeviceName');	
				var con = checkDeviceIfExist(devName);
				if (con== true){
					continue loop;				
				}
				html += "<tr class='trManageDevice' ";
           		html += "LoadType='"+load+"' ";
				html += "DeviceType='"+row[a].getAttribute('DeviceType')+"' ";
				html += "DeviceId='"+row[a].getAttribute('DeviceId')+"' ";
		        html += "DeviceName='"+row[a].getAttribute('DeviceName')+"' ";
				html += "PortType='"+row[a].getAttribute('PortType')+"' ";
				html+= ">";
	
				html += "<td>"+row[a].getAttribute('DeviceId')+"</td>";
		        html += "<td>"+row[a].getAttribute('DeviceName')+"</td>";
				html += "<td>"+row[a].getAttribute('ManagementIp')+"</td>";
                html += "<td>"+row[a].getAttribute('ConsoleIp')+"</td>";
                html += "<td>"+row[a].getAttribute('Manufacturer')+"</td>";
				html += "<td>"+row[a].getAttribute('Model')+"</td>";
				if (tabSelected == "import" || condition== 'import'){
                	html += "<td>"+row[a].getAttribute('AvailabilityDay')+"</td>";
                	html += "<td>"+row[a].getAttribute('AvailabilityDate')+"</td>";
                	html += "<td>"+row[a].getAttribute('AvailabilityTime')+"</td>";
				}
                html += "<td>"+row[a].getAttribute('Status')+"</td>";
				html += "<td>"+row[a].getAttribute('UserName')+"</td>";
				html += "<td>"+row[a].getAttribute('RemainingTime')+"</td>";	
				html += "<td>"+row[a].getAttribute('AvailablePort')+"</td>";
				html += "<td>"+row[a].getAttribute('PortType')+"</td>";
				html +="</tr>";
			}
			if (tabSelected == "import" || condition == 'import'){
				$("#manageConfigTableImport > tbody").empty().append(html);
			}else{
				$("#manageConfigTable > tbody").empty().append(html);
			}
			$(".trManageDevice").each(function(){
				var dName = $(this).attr('DeviceName');
				for(var q=0; q<globalSelectedDeviceList.length; q++){
					if(globalSelectedDeviceList[a] == dName){				
						$(this).addClass('highlight');
					}
				}
			});	
			$(".trManageDevice").on("tap",function(){
				if (load.toLowerCase()=="tooltipdevice" ){
					$('.trManageDevice').each(function(){
 		        		$(this).removeClass('highlight');
					});
					if($(this).hasClass('highlight') == false){
						$(this).addClass('highlight');
						var devName = $(this).attr('DeviceName');
						if ($.inArray(devName,globalSelectedDeviceList)== -1){
							globalSelectedDeviceList.push(devName);
						}
					}else{
 	        			$(this).removeClass('highlight');
						var devName1 = $(this).attr('DeviceName');
						for(var a=0; a<globalSelectedDeviceList.length; a++){
							if(globalSelectedDeviceList[a] == devName1){
								globalSelectedDeviceList.splice(a,1);
							}
						}
					}
				}else{                     		
					if($(this).hasClass('highlight') == false){
						$(this).addClass('highlight');
						var devName = $(this).attr('DeviceName');
						globalSelectedDeviceList.push(devName);

					}else{
 	        			$(this).removeClass('highlight');
						var devName1 = $(this).attr('DeviceName');
						for(var a=0; a<globalSelectedDeviceList.length; a++){
							if(globalSelectedDeviceList[a] == devName1){
								globalSelectedDeviceList.splice(a,1);
							}
						}

					}
				}
			});

}

/*
 *
 *  FUNCTION NAME : checkDeviceIfExist 
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : checks if the device wan on the canvass
 *  PARAMETERS    : devName
 *
 */
function checkDeviceIfExist(devName){
	var myReturn = false;
	for(var a=0; a<devicesArr.length;a++){
		if (devName == devicesArr[a].DeviceName){
			myReturn = true;
		}		
	}
	return myReturn;
}
/*
 *
 *  FUNCTION NAME : createDevice 
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : create device in canvas
 *  PARAMETERS    : src
 *
 */
function createDevice(src){
	var devPath = "Device_"+deviceCtr;
	if(idsArray.indexOf(devPath) == -1){
		var imageObj = new Image();
		var srcN =  ($(src).attr('src')).split("img");
		imageObj.src = dir+"/img"+srcN[1];
		var id =  $(src).attr('id');
		var model =  $(src).attr('model');
		imageObj.onload = function() {
			setDeviceInformation(devPath,model,imageObj);
			imgXPos+=50;
			if(devicesArr.length == 9){
				imgYPos+=50;
				imgXPos=490;
			}else if(devicesArr.length == 18){
				imgYPos+=50;
				imgXPos=490;
			}
			idsArray.push(devPath);
			deviceCtr++;
			drawImage();
		};
	}else{
		deviceCtr++;
		createDevice(src);
	}
}
/*
 *
 *  FUNCTION NAME : createInterface
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : create interface in canvas
 *  PARAMETERS    : src
 *
 */
function createInterface(src){
	var devPath = "Device_"+deviceCtr;
    if(idsArray.indexOf(devPath) == -1){
        var imageObj = new Image();
        var srcN =  ($(src).attr('src')).split("img");
        imageObj.src = dir+"/img"+srcN[1];
        var id =  $(src).attr('id');
        var model =  $(src).attr('model');
        imageObj.onload = function() {
            setDeviceInformation(devPath,model,imageObj);
            imgXPos+=50;
            if(devicesArr.length == 9){
                imgYPos+=50;
                imgXPos=490;
            }else if(devicesArr.length == 18){
                imgYPos+=50;
                imgXPos=490;
            }
            idsArray.push(devPath);
            deviceCtr++;
            drawImage();
        };
    }else{
        deviceCtr++;
        createInterface(src);
    }
}


/*
 *
 *  FUNCTION NAME : draw 
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : draw canvas
 *  PARAMETERS    : 
 *
 */
function draw() {
	trashW = ((window.innerWidth) -40)-40;
	trashH = ((window.innerHeight) - 100)-60;
	if($("#configCanvas").length != 0){
		var canvas = document.getElementById("configCanvas");
	    var context = canvas.getContext("2d");
	    gblCanvasWidth = (window.innerWidth) -40;
	    gblCanvasHeight = (window.innerHeight) - 100;
	    context.canvas.width  = (window.innerWidth) -40 ;
	    context.canvas.height = (window.innerHeight) - 100;
		if(stage == null || stage == undefined || stage == ""){
    		stage = new Kinetic.Stage({ // initialize the canvas
		    	container: "configContent",
	    	    width: gblCanvasWidth,
		   		height: gblCanvasHeight,
        		border : "4px solid gray"
    		});	
		   	layer = new Kinetic.Layer(); // initialize per layer of images or object in canvas
		   	tooltipLayer = new Kinetic.Layer(); // initialize per layer of images or object in canvas
		}
	}else{
		$(".kineticjs-content canvas").attr({
		  height: (window.innerHeight) - 100,
		  width: (window.innerWidth) -40
		});
		$(".kineticjs-content canvas").removeAttr("style");
		$(".kineticjs-content").css({
		  "height": (window.innerHeight) - 100,
		  "width": (window.innerWidth) -40
		});
		if(stage == null || stage == undefined || stage == ""){
    		stage = new Kinetic.Stage({ // initialize the canvas
		    	container: "configContent",
	    	    width: gblCanvasWidth,
		   		height: gblCanvasHeight,
        		border : "4px solid gray"
    		});	
		   	layer = new Kinetic.Layer(); // initialize per layer of images or object in canvas
		   	tooltipLayer = new Kinetic.Layer(); // initialize per layer of images or object in canvas
		}
	}
    $("#configContent").append('<img id="trashBin" src="img/Trashbin.png" style="position: absolute;bottom:40px;right: 20px;display:none;">');
	
}

/*
*
 *  FUNCTION NAME : showGrid 
 *  AUTHOR        : Reynil Val Sopot
 *  DATE          : December 21, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : draw/hide gridlines
 *  PARAMETERS    : 
 *
 */

var globalGridSize = 10;
var grid; 
function showGrid(){
		if(clearGrid == true && (grid != null || grid != undefined)){
//		grid.clear();
		grid.hide();
//		stage.clear();
		stage.add(grid);
		clearGrid = false;
}
/*		if(grid && clearGrid== false){
			grid.clear();
			grid.hide();
//			stage.clear();
			stage.add(grid);
		}*/
		var height_mm = gblCanvasHeight;
		var width_mm = gblCanvasWidth;
		selectedGroup = new Kinetic.Shape({name:'emptyNode'});
		grid = new Kinetic.Layer();
	//	var val = ($("#gridValue").val());
	//	var val2 = parseInt(val);
	//	globalGridSize = val2;
	
		var CELL_SIZE = ($('#configContent').width()/globalGridSize)*2,
	    w = width_mm,
	   	h = height_mm,
	   	W = w * CELL_SIZE,
	   	H = h * CELL_SIZE;
	
//		var make_grid = function() {   
    	var r = new Kinetic.Rect({
        	x: 0,
        	y: 0,
        	width: W,
        	height: H,
        	fill: 'transparent',
    	});
    	grid.add(r);
    	for (i = 0; i < (stage.getWidth()-20)/CELL_SIZE + 1; i++) {
        	var I = i * CELL_SIZE;
        	var l = new Kinetic.Line({
        	    stroke: "#999",
				strokeWidth: 1,
        	    points: [I, 0, I, stage.getHeight()]
        	});
        	grid.add(l);
    	}

    	for (j = 0; j < (stage.getHeight()-20)/CELL_SIZE + 1; j++) {
        	var J = j * CELL_SIZE;
        	var l2 = new Kinetic.Line({
            	stroke: "#999",
				strokeWidth: 1,
            	points: [0, J, stage.getWidth(), J]
        	});
        	grid.add(l2);
    	}
		//	grid.show();
    		stage.add(grid);      
//		};
			reDrawImage();	
//		stage.draw();
			
		$(document).on('click', '#hideGridline', function() {
      	$("#hideGridline").addClass('animated pulse');
    	  setTimeout(function(){
    	 	grid.hide();
			stage.draw();
			clearGrid = false;
      },1500);
  	});

}

function checkNum(num){
		if(num < 10){
			return true;
		}else if(num > 10){
			return false;
		}		
}

function reDrawImage(){
	var x = 0 ;
	layer = new Kinetic.Layer();
	createLine('canvasID');
    for(var i=0 ; i < devicesArr.length; i++){
   		var x2 =  parseInt(devicesArr[i].XLocation);
        var y2 =  parseInt(devicesArr[i].YLocation);
		var group = new Kinetic.Group({
            id: devicesArr[i].ObjectPath,
            x:x2,
            y:y2,
            draggable: true,
            dragBoundFunc: function(pos) {
                var newY = pos.y < 10 ? 10 : pos.y;
                return {
                   x: pos.x,
                   y: newY
                };
            }
        });
		group = drawOneImage(x2,y2,devicesArr[i],group);
		layer.add(group);
		initImages(group); // initialize the image in canvas
	}
    stage.add(layer);
	if(devicesArr.length > 0 || deviceArr.length > 0){
		$("#trashBin").show();
        $(".hideMenu1").show();
        $(".hideMenu").show();
    }else{
        $("#trashBin").hide();
        $(".hideMenu1").hide();
        $(".hideMenu").hide();
    }
}
/*
 *  FUNCTION NAME : drawImage 
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : draw image on canvas
 *  PARAMETERS    : 
 *
 */
function drawImage(){
    var x = 0 ;
	$('canvas').remove();
	stage.clear();
	layer = new Kinetic.Layer();
	createLine('canvasID');
    for(var i=0 ; i < devicesArr.length ; i++){
   		var x2 =  parseInt(devicesArr[i].XLocation);
        var y2 =  parseInt(devicesArr[i].YLocation);
		var group = new Kinetic.Group({
            id: devicesArr[i].ObjectPath,
            x:x2,
            y:y2,
            draggable: true,
            dragBoundFunc: function(pos) {
                var newY = pos.y < 10 ? 10 : pos.y;
                return {
                   x: pos.x,
                   y: newY
                };
            }
        });
		if (devicesArr[i].UpdateFlag !="delete"){
			group = drawOneImage(x2,y2,devicesArr[i],group);
			layer.add(group);
			initImages(group); // initialize the image in canvas
		}
	}
    stage.add(layer);
	if(devicesArr.length > 0 || deviceArr.length > 0){
		$("#trashBin").show();
		$(".hideMenu1").show();
		$(".hideMenu").show();
	}else{
		$("#trashBin").hide();
		$(".hideMenu1").hide();
        $(".hideMenu").hide();
	}

}
/*
 *
 *  FUNCTION NAME : drawOneImage
 *  AUTHOR        : Juvindle C Tina
 *  DATE          : December 11, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : draw image with label
 *  PARAMETERS    : 
 *
 */
function drawOneImage(x2,y2,devObject,group){
	if($("#checkConfigname") == true){
		viewconfigname = true;
	}
	if($("#checkhostname") == true){
		viewhostname = true;
	}
	if($("#checkmanagementip") == true){
		viewmanagementip = true;
	}
	if($("#checkconsoleip") == true){
		viewconsoleip = true;
	}
    if($("#checkloopbackadd") == true){
		viewloopbackadd = true;
    }
    if($("#checkosversion") == true){
		viewosversion = true;	
    }
    if($("#checksoftwarepack") == true){
		viewsoftwarepack = true;	
    }
    if($("#checkinterfaceip") == true){
		viewinterfaceip = true;
    }
    if($("#checkinterfacename") == true){
		viewinterfacename = true;
    }
	var devImg = new Kinetic.Image({ // initialize the image(s) in canvas
	   	image: devObject.Source,
        width: 50,
        height: 50,
	    id: devObject.ObjectPath,
    });
	var mytext = "";
	if(devObject.DeviceName != ""){
		mytext = devObject.DeviceName;
	}else{
		mytext = devObject.ObjectPath;
	}
	if(devObject.ManagementIp != ""){
		mytext += "\n" + devObject.ManagementIp;
	}
	if(devObject.ConsoleIp != ""){
		mytext += "\n" + devObject.ConsoleIp;
	}
	var y = -10;
	if(devObject.DeviceName != ""){
		y = -40;
	}
	var simpleLabel = new Kinetic.Label({
    	x: 0,
	    y: y,
    	opacity: 0.75
    });
	simpleLabel.add(new Kinetic.Text({
     	text: mytext,
	    fontFamily: 'Arial',
        fontSize: 10,
        padding: 5,
	    fill: 'black'
    }));
	group.add(simpleLabel);
	group.add(devImg);
	
	return group;
}
/*
 *
 *  FUNCTION NAME : initImages
 *  AUTHOR        : James Turingan
 *  DATE          : December 6, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : initialize the images in canvas
 *  PARAMETERS    : 
 *
 */
function initImages(devImg){

	var rect = new Kinetic.Rect({
        stroke: '#555',
        strokeWidth: 1,
        fill: '#DFEFF0',
        width: 150,
        cornerRadius: 5,
		opacity: 0.5
    });	
	var tooltip = new Kinetic.Text({
         text: "",
		 fontFamily: "Arial",
         fontSize: 10,
         padding: 5,
         textFill: "white",
         fill: '#66666',
		 width: 150,
         alpha: 1,
         visible: false
    });
	devImg.on('dblclick dbltap',function(){
		var yPost = this.getPosition().y;
		$("#deviceMenuPanel").css({"right":yPost,"top":"0px"});
		$("#deviceMenuPanel").popup("open");
		glblDevMenImg = this.getAttr('id');
		gblDevMenY = this.getPosition().y;
		gblDevMenX = this.getPosition().x;
	});
/*
	devImg.on('mousedown touchstart', function(){ // object/image has been touched
       	var imgId = this.getAttr('id');
        var imgXpos2 = this.getPosition().x;
        var imgYpos2 = this.getPosition().y;
	});
*/
    devImg.on('mouseup touchend', function(){
      	var imgId = this.getAttr('id');
        var imgXpos2 = this.getPosition().x;
        var imgYpos2 = this.getPosition().y;
		checkDevicesToCreateLink(imgId,imgXpos2,imgYpos2);
		tooltip.hide();
		rect.hide();
		tooltipLayer.add(rect).add(tooltip);
    	tooltipLayer.draw();
    });	

    devImg.on('mousedown touchstart', function() {
       	var imgId = this.getAttr('id');
             
		var imgXpos2 = this.getPosition().x;
        var imgYpos2 = this.getPosition().y;
		var text = createDeviceTooltip(imgId);
	//	ipv4PopUp();
        tooltip.setPosition(imgXpos2 + 40, imgYpos2 + 50);
		tooltip.setText(text);
        tooltip.show();
		rect.setHeight(tooltip.getHeight());
		rect.setPosition(imgXpos2 + 40, imgYpos2 + 50);
		rect.show()
		tooltipLayer.add(rect).moveToTop();
		tooltipLayer.add(tooltip).moveToTop();
    	tooltipLayer.draw();
    });
/*
   	devImg.on('mouseout', function() {
        document.body.style.cursor = 'default';
		tooltip.hide();
		rect.hide();
		tooltipLayer.add(rect).add(tooltip);
    	tooltipLayer.draw();
    });
*/
	stage.add(tooltipLayer);

}

/*
 *
 *  FUNCTION NAME : findClickLine
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : for tootltip
 *  PARAMETERS    : 
 *
 */
function findClickLine(redLine){
	tooltipLayer = new Kinetic.Layer();
	var rect1 = new Kinetic.Rect({
        stroke: '#555',
        strokeWidth: 1,
        fill: '#DFEFF0',
        width: 200,
        cornerRadius: 5,
		opacity: 0.5
      });	

	var tooltip1 = new Kinetic.Text({
         text: "",
		 fontFamily: "Arial",
         fontSize: 10,
         padding: 5,
         textFill: "white",
         fill: '#66666',
		 width: 200,
         alpha: 1,
         visible: false
    });

    redLine.on('mouseup touchend', function(){
		tooltipLayer.clear();
        document.body.style.cursor = 'default';
		tooltip1.hide();
		rect1.hide();
		tooltipLayer.add(rect1).add(tooltip1);
    	tooltipLayer.draw();
    });

    redLine.on('mousedown touchstart', function() {
		tooltipLayer.clear();
        document.body.style.cursor = 'pointer';
		var touchPos = stage.getPointerPosition();
		var imgXpos2 = touchPos.x+40;
        var imgYpos2 = touchPos.y+50;

  		var s = this.getId();
		var text = createLineTooltip(s);
			
        tooltip1.setPosition(imgXpos2, imgYpos2);
		tooltip1.setText(text);
        tooltip1.show();
		rect1.setHeight(tooltip1.getHeight());
		rect1.setPosition(imgXpos2, imgYpos2);
		rect1.show()
		tooltipLayer.add(rect1).moveToTop();
		tooltipLayer.add(tooltip1).moveToTop();
    	tooltipLayer.draw();

    });

	stage.add(tooltipLayer);
}
/*
 *
 *  FUNCTION NAME : dragtoTrash
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : deletes devices on the canvas
 *  PARAMETERS    : imgId,imgXpos2,imgYpos2
 *
 */
function dragtoTrash(imgId,imgXpos2,imgYpos2,devMenu){
	var trashW2 = imgXpos2 + 25;
	var trashH2 = imgYpos2 + 25; 
	if(devMenu == "true"){
		deleteDevSub();
        drawImage();
        return;
	}else{
		if(trashW2 >= trashW && trashH2 >= trashH){
			deleteDevSub();
			drawImage();
			return;
		}
	}
	function deleteDevSub(){
		for(var i = 0; i  < devicesArr.length; i++){
        	if(devicesArr[i].ObjectPath == imgId){
				devicesArr.splice(i,1);
				devPathArr.splice(i,1);
            }
    	}
        for(var i = 0; i  < deviceArr.length; i++){
        	if(deviceArr[i].DevName == imgId){
            	deviceArr.splice(i,1);
            }
        }
		for(var i = 0; i  < rackArr.length; i++){
            var objPath = rackArr[i].ObjectPath.split(".")[0];
            if(objPath == imgId){
               rackArr.splice(i,1);
            }
        }
		for(var i = 0; i  < slotArr.length; i++){
            var objPath = slotArr[i].ObjectPath.split(".")[0];
            if(objPath == imgId){
                slotArr.splice(i,1);
            }
        }
		for(var i = 0; i  < moduleArr.length; i++){
            var objPath = moduleArr[i].ObjectPath.split(".")[0];
            if(objPath == imgId){
                moduleArr.splice(i,1);
            }
        }
		for(var i = 0; i  < portArr.length; i++){
            var objPath = portArr[i].ObjectPath.split(".")[0];
            if(objPath == imgId){
                portArr.splice(i,1);
            }
        }
		for(var i = 0; i  < lineConnected.length; i++){
            var Dest = lineConnected[i].Destination.split(".")[0];
			var Sourc = lineConnected[i].Source.split(".")[0];
            if(Dest == imgId || Sourc == imgId){
                lineConnected.splice(i,1);
				for(var a = 0; a  < portArr.length; a++){
					var objPath = portArr[a].ObjectPath.split(".")[0];
			        if(objPath == Dest || objPath == Sourc){
       	    	    	portArr.splice(a,1);
            		}
        		}

            }
        }

	}
}


/*
 *
 *  FUNCTION NAME : dragtoTrashDeviceOnly
 *  AUTHOR        : Marlo Agapay
 *  DATE          : Jan 0, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : delete device in device map
 *  PARAMETERS    : imgId,imgXpos2,imgYpos2,devMenu
 *
 */
function dragtoTrashDeviceOnly(imgId,imgXpos2,imgYpos2,devMenu){
	var trashW2 = imgXpos2 + 25;
	var trashH2 = imgYpos2 + 25; 
	var devsArr = devicesArr;
	var devArr = deviceArr;
	if(devMenu == "true"){
		for(var i = 0; i  < devsArr.length; i++){
        	if(devsArr[i].ObjectPath == imgId){
				devicesArr[i].UpdateFlag = "delete";
    //        	devsArr.splice(i,1);
            }
    	}
        for(var i = 0; i  < devArr.length; i++){
        	if(devArr[i].DevName == imgId){
      //      	deviceArr.splice(i,1);
            }
        }
        drawImage();
        return;
	}else{
		if(trashW2 >= trashW && trashH2 >= trashH){
			for(var i = 0; i  < devsArr.length; i++){
				if(devsArr[i].ObjectPath == imgId){
					devicesArr[i].UpdateFlag = "delete";
//					devicesArr.splice(i,1);
				}
			}
			for(var i = 0; i  < deviceArr.length; i++){
            	if(devArr[i].DevName == imgId){
//                	deviceArr.splice(i,1);
	            }
    	    }
			drawImage();
			return;
		}
	}
}

/*
 *
 *  FUNCTION NAME : deleteLink
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 16, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : deletes link on the canvas
 *  PARAMETERS    : source,destination
 *
 */
function deleteLink(source,destination){
	for(var i = 0; i  < lineConnected.length; i++){
    	if(lineConnected[i].Destination  == destination && lineConnected[i].Source == source){
			if(lineConnected[i].Destination.DeviceName != "" || lineConnected[i].Source.DeviceName != ""){
				for(var a=0; a < portArr.length; a++){
					if(portArr[a].ObjectPath == destination || portArr[a].ObjectPath == source){
						if(portArr[a].Status == "Reserved"){
							portArr[a].UpdateFlag = "delete";
						}else{
							portArr.splice(a,1);
						}
					}
				}
				lineConnected.splice(i,1);
			}else{
				lineConnected.splice(i,1);
			}
        }
   	}
	drawImage();
}

/*
 *
 *  FUNCTION NAME : loadDeviceConfig
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the device configuration
 *  PARAMETERS    : 
 *
 */
function loadDeviceConfig(glblDevMenImg){
	for(var a=0; a < devicesArr.length; a++){
		if(devicesArr[a].ObjectPath == glblDevMenImg){
			var hName = devicesArr[a].HostName;
			if(devicesArr[a].HostName == ""){
				var hName = devicesArr[a].ObjectPath;
			}
			var OSVers = devicesArr[a].OSVersion;
			var ManagementIp = devicesArr[a].ManagementIp;
			var ConsoleIp = devicesArr[a].ConsoleIp;
			var Model = devicesArr[a].Model;
			var Manufacturer = devicesArr[a].Manufacturer;
			var Exclusivity = devicesArr[a].Exclusivity;
			var Statuss = devicesArr[a].Status;
			if(OSVers =="" || OSVers ==undefined){ 
				OSVers="N/A";
			}
			if(ManagementIp =="" || ManagementIp ==undefined){ 
				ManagementIp = "N/A";
			}
			if(ConsoleIp =="" || ConsoleIp ==undefined){ 
				ConsoleIp="N/A";
			}
			if(Statuss =="" || Statuss ==undefined){ 
				Statuss="N/A";
			}
			if(Manufacturer =="" || Manufacturer ==undefined){ 
				Manufacturer="N/A";
			}
			$("#hostnameDevConf").html(hName);
			$("#OSVerDevConf").html(OSVers);
			$("#mangmntIPDevConf").html(ManagementIp);
			$("#consoleIPDevConf").html(ConsoleIp);
			$("#modelDevConf").html(Model);
			$("#manufacturerDevConf").html(Manufacturer);
			if(Exclusivity == "Exclusive"){
				var exc = "<input type='checkbox' checked='checked' id='exclusivityChk'>";
			}else{
				var exc = "<input type='checkbox' id='exclusivityChk'>";
			}
			$("#exclusivityDevConf").html(exc);
			$("#statusDevConf").html(Statuss);
			$("#devNameDevConf").html(hName);
			return;
		}else if(devicesArr[a].ObjectPath == glblDevMenImg && a == (devicesArr.length - 1)){
			alert("There is no such device in the canvas.");
		}
	}
}

/*
 *
 *  FUNCTION NAME : checkCommitOptions
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : show/hide commits options
 *  PARAMETERS    : 
 *
 */
function checkCommitOptions(){
	for(var a=0; a < devicesArr.length;a++){
		if(devicesArr[a].DeviceType.toLowerCase() == "dut" && devicesArr[a].Status.toLowerCase() != "reserved"){
			$("#comOpDevSanityTr").removeAttr("style");
			$("#comOpAccSanityTr").removeAttr("style");
			$("#comOpStartResTr").removeAttr("style");
			$("#comOpEndResTr").removeAttr("style");
		}else{
			$("#comOpDevSanityTr").css({"display":"none"});
		    $("#comOpAccSanityTr").css({"display":"none"});
			$("#comOpStartResTr").css({"display":"none"});
		    $("#comOpEndResTr").css({"display":"none"});

		}
		if(devicesArr[a].Status.toLowerCase() != "reserved" && lineConnected.length > 0){
			if(devicesArr[a].DeviceName == ""){
				$("#comOpConnectivityTr").removeAttr("style");
			}else{
				$("#comOpConnectivityTr").css({"display":"none"});
				$("#comOpConnectivity").attr("checked",false);
				for(var b=0; b < portArr.length; b++){
					if(portArr[b].SwitchInfo != ""){
						$("#comOpConnectivityTr").removeAttr("style");
						break;
					}
				}
			}
		}
		if(devicesArr[a].Status.toLowerCase() != "reserved" && lineConnected.length > 0 && devicesArr[a].Model != "3750"){
			var dut= 0;var testool= 0;var others= 0;var all= 0;
			for(var c=0; c < devicesArr.length;c++){
				all++;
				if(devicesArr[c].DeviceType.toLowerCase() == "dut"){
					dut++;
				}else if(devicesArr[c].DeviceType.toLowerCase() == "testtool"){
					testool++;
				}else{
					others++;
				}
			}
			if((dut + testool) == all){
				$("#comOpLinkSanityTr").removeAttr("style");
			}else{
				$("#comOpLinkSanityTr").css({"display":"none"});
			}
		}
		if(devicesArr[a].Status.toLowerCase() != "reserved" && lineConnected.length > 0 && devicesArr[a].Model != "3750"){
			var dut= 0;var testool= 0;var others= 0;var all= 0;var vlanVar =0;var vlansArr="";
            for(var c=0; c < devicesArr.length;c++){
                all++;
                if(devicesArr[c].DeviceType.toLowerCase() == "dut"){
                    dut++;
				}else if(devicesArr[c].DeviceType.toLowerCase() == "vlan"){
					//vlansArr.push(devicesArr[c].ObjectPath);
					vlansArr = devicesArr[c].ObjectPath;
					vlanVar++;
                }else{
                    others++;
                }
            }
			
            if(dut == all || dut >1){
				if(vlanVar == 0){
					$("#comOpEnaInterfaceTr").removeAttr("style");
				}else{
					var vlanCtr=0;
					for(var d=0; d < lineConnected.length; d++){
/*						for(var f=0; f < vlansArr.length; f++){
							if(lineConnected[d].Destination.split(".")[0] == vlansArr[f]){
							}
						}*/
						if(lineConnected[d].Destination.split(".")[0] == vlansArr){
							if(lineConnected[d].SourceDevice.DeviceType.toLowerCase() == "dut"){
								vlanCtr++;
							}
						}else if(lineConnected[d].Source.split(".")[0] == vlansArr){
							if(lineConnected[d].DestinationDevice.DeviceType.toLowerCase() == "dut"){
                                vlanCtr++;
                            }
						}
					}
					if(vlanCtr > 1){
						$("#comOpEnaInterfaceTr").removeAttr("style");
					}
				}
            }else{
            	$("#comOpEnaInterfaceTr").css({"display":"none"});
			}
        }
	}	
}

/*
 *
 *  FUNCTION NAME : commitOptionsOk
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 3, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : modifies MAINCONFIG xml sanity flag
 *  PARAMETERS    : 
 *
 */
function commitOptionsOk(){
	var devSan = $("#comOpDevSanity").is(":checked");
	var accSan = $("#comOpAccSanity").is(":checked");
	var connec = $("#comOpConnectivity").is(":checked");
	var enaInt = $("#comOpEnaInterface").is(":checked");
	var lnkSan = $("#comOpLinkSanity").is(":checked");
	var startRes = $("#comOpStartRes").is(":checked");
	var endRes = $("#comOpEndRes").is(":checked");
	DeviceSanity = devSan;
	AccessSanity = accSan;
	Connectivity = connec;
	if($("#comOpConnectivity").parent().parent().parent().attr('style') == "display: none;"){
		Connectivity = false;
	}
	if(lnkSan == "true" || lnkSan == true){
		lnkSan = "yes";
	}else{
		lnkSan = "no";
	}
	for(var a=0;a < devicesArr.length; a++){
		devicesArr[a].ConnectivityFlag = lnkSan;
	}
	for(var b=0;b < lineConnected.length; b++){
		lineConnected[b].ConnectivityFlag = lnkSan;
	}
	ConnectivityFlag = lnkSan;
	enablePort = enaInt;
	if(ConnectivityFlag == "yes"){
		enablePort = true;
	}
}

/*
 *
 *  FUNCTION NAME : resetOptionsOk
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 3, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : resets checkboxs in the commit options
 *  PARAMETERS    : 
 *
 */
function resetCommitOptions(){
	$("#comOpDevSanity").attr("checked",true);
    $("#comOpAccSanity").attr("checked",true);
    $("#comOpConnectivity").attr("checked",true);
    $("#comOpConnectivity").parent().parent().parent().css({'display':'none'});
    $("#comOpEnaInterface").attr("checked",false);
    $("#comOpEnaInterface").parent().parent().parent().css({'display':'none'});
    $("#comOpLinkSanity").attr("checked",false);
    $("#comOpLinkSanity").parent().parent().parent().css({'display':'none'});
    $("#comOpStartRes").attr("checked",false);
    $("#comOpEndRes").attr("checked",false);
	DeviceSanity = false;
	AccessSanity = false;
	Connectivity = false;
	ConnectivityFlag = "no";
	enablePort = false;
}

/*
 *
 *  FUNCTION NAME : newDevice
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 26, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : sends query getalldevices
 *  PARAMETERS    : 
 *
 */
function newDevice(){
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
        data : {
            "action": "getalldevices",
            "query": "user="+globalUserName
        },
        method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
            var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString(data , "text/xml" );
            var MAINCONFIG = xmlDoc.getElementsByTagName('MAINCONFIG');
//			MAINCONFIG[0].getAttribute("Info");
//			MAINCONFIG[0].getAttribute("Model");
//			MAINCONFIG[0].getAttribute("Domain");
		}
	});	
}

/*
 *
 *  FUNCTION NAME : loadLoadConfigOk
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : change the exclusivity of the device
 *  PARAMETERS    : 
 *
 */
function loadDeviceConfigOk(glblDevMenImg,chk){
	for(var a=0; a < devicesArr.length; a++){
        if(devicesArr[a].ObjectPath == glblDevMenImg){
			if(chk == true){
				devicesArr[a].Exclusivity = "Exclusive";
			}else{
				devicesArr[a].Exclusivity = "Non-Exclusive";
			}
		}
	}
}
/*
 *
 *  FUNCTION NAME : loadLoadConfig
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the configuration saved by the user
 *  PARAMETERS    : 
 *
 */
function loadLoadConfig(){
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
		data : {
			"action": "fetch",
			"query": "UserName="+globalUserName+"&Id="+globalUserId
		},
		method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
			var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString(data , "text/xml" );
            var MAINCONFIG = xmlDoc.getElementsByTagName('MAINCONFIG');
			var CONFIGURATION = xmlDoc.getElementsByTagName('CONFIGURATION');
			var selOpt="<option>Select Configuration</option>";
            for (var x = 0; x < CONFIGURATION.length; x++){
				var typeFrmName = CONFIGURATION[x].getAttribute("TopologyName").split(".")[1];
				if(typeFrmName == "stat"){
					vw = "display:block";
				}else{
					vw = "display:none";
				}
				selOpt += "<option style='"+vw+"' value='"+CONFIGURATION[x].getAttribute('TopologyName')+"' type='"+typeFrmName+"' id='"+CONFIGURATION[x].getAttribute('Id')+"' filetype='"+CONFIGURATION[x].getAttribute("FileType")+"'>"+CONFIGURATION[x].getAttribute('TopologyName')+"</option>";
			}
			$("#loadConfSelect").html(selOpt);
		}
	});
} 

/*
 *
 *  FUNCTION NAME : loadLoadConfigOk
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the configuration saved by the user
 *  PARAMETERS    : 
 *
 */
function loadLoadConfigOk(confName,mainid,fileType){
	loading('show');
	var val = $('#loadConfTypeSelect').val();
	if(val == "file"){
		uploadXML();
		return;
	}
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
		data : {
			"action": "load",
			"query": "ConfigName="+confName+"&MainId="+mainid+"&FileType="+fileType
		},
		method: 'POST',
        proccessData: false,
   //     async:false,
        dataType: 'html',
        success: function(data) {
			loading('hide');
			$("#loadConfig").dialog("close");
			getDataFromXML(data);
		}
	});
}

/*
 *
 *  FUNCTION NAME : uploadXML
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 20, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the xml configuration uploaded by the user
 *  PARAMETERS    : 
 *
 */
function uploadXML(){
	var fileInput = document.getElementById('fileInput');
	var file = fileInput.files[0];
	var textType = /xml.*/;

	if (file.type.match(textType)) {
		var reader = new FileReader();
		reader.onload = function(e) {
			getDataFromXML(reader.result);
			loading('hide');
	        $("#loadConfig").dialog("close");
		}

		reader.readAsText(file);	
	} else {
		alert("File not supported!");
		loading('hide');
		$("#loadConfig").dialog("close");
	}
}

/*
 *
 *  FUNCTION NAME : loadDeleteConfig
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the configuration saved by the user
 *  PARAMETERS    : 
 *
 */
function loadDeleteConfig(){
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
		data : {
			"action": "del",
			"query": "UserName="+globalUserName+"&Id="+globalUserId
		},
		method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
			var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString(data , "text/xml" );
            var MAINCONFIG = xmlDoc.getElementsByTagName('MAINCONFIG');
			var CONFIGURATION = xmlDoc.getElementsByTagName('CONFIGURATION');
			var selOpt="<option>Select Configuration</option>";
			selOpt += "<option value='all'>All</option>";
            for (var x = 0; x < CONFIGURATION.length; x++){
				globalConfgName.push(CONFIGURATION[x].getAttribute("TopologyName"));
				globalConfgId.push(CONFIGURATION[x].getAttribute('Id'));
				var typeFrmName = CONFIGURATION[x].getAttribute("TopologyName").split(".")[1];
				if(typeFrmName == "stat"){
					vw = "display:block";
				}else{
					vw = "display:none";
				}
				selOpt += "<option style='"+vw+"' value='"+CONFIGURATION[x].getAttribute('TopologyName')+"' type='"+typeFrmName+"' id='"+CONFIGURATION[x].getAttribute('Id')+"' filetype='"+CONFIGURATION[x].getAttribute("FileType")+"'>"+CONFIGURATION[x].getAttribute('TopologyName')+"</option>";
			}
			$("#deleteConfSelect").html(selOpt);
			$("#deleteConfSelect").selectmenu();
			$("#deleteConfSelect").selectmenu( "refresh" );
		}
	});
} 

/*
 *
 *  FUNCTION NAME : loadDeleteConfigOk
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : deletes configuration
 *  PARAMETERS    : 
 *
 */
function loadDeleteConfigOk(confName,mainid,fileType,all){
	loading('show');
	if(all == true){
		var qry = "ConfigName="+confName+"&MainId="+mainid;
	}else{
		var qry = "ConfigName="+confName+"&MainId="+mainid+"&FileType="+fileType;
	}
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
		data : {
			"action": "delete",
			"query": qry
		},
		method: 'POST',
        proccessData: false,
        dataType: 'html',
        success: function(data) {
			if(data){
                alert("Configuration successfully deleted.");
            }else{
				alert("Something went wrong, config deletion failed.");
			}
			loading('hide');
			$("#deleteConfig").dialog("close");
		}
	});
}

/*
 *
 *  FUNCTION NAME : loadSaveConfig
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : save the configuration
 *  PARAMETERS    : 
 *
 */
function loadSaveConfig(){
	loading('show');
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
		data : {
			"action": "getfilenames",
			"query": "userid="+globalUserId
		},
		method: 'POST',
        proccessData: false,
//        async:false,
        dataType: 'html',
        success: function(data) {
			var parser = new DOMParser();
            var xmlDoc;
            xmlDoc = parser.parseFromString(data , "text/xml" );
            var MAINCONFIG = xmlDoc.getElementsByTagName('MAINCONFIG');
			var topo = MAINCONFIG[0].getAttribute("TopologyNames");
			var names = MAINCONFIG[0].getAttribute("Names");
			for(var a=0; a < topo.length; a++){
				if(Name == ""){
					createConfigName();
				}else{
					if(topo[a] == Name){
						createConfigName();
					}
				}
			}
			for(var b=0; b < names.length; b++){
				if(Name == ""){
					createConfigName();
				}else{
	                if(names[b] == Name){
    	                createConfigName();
        	        }
				}
            }
			loading('hide');
			$("#saveConfFileName").val(Name);
      	}
	});
//	createConfigName();
//	$("#saveConfFileName").val(Name);
} 

/*
 *
 *  FUNCTION NAME : createTopo
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 2, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : sends xml file to create topo file
 *  PARAMETERS    : 
 *
 */
function createTopo(){
	loading("show");
	var qry = getXmlData();
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/RM_CGI_AutoComplete/AutoCompleteCgiQuerryjayson/FindResource2.cgi",
        data : {
            "action": "savetopomap",
            "query": qry
        },
        method: 'POST',
        proccessData: false,
        dataType: 'html',
        success: function(data) {
            if(data){
                alert("Configuration successfully converted to topo file and is now ready to be downloaded.");
				topoMapVar = data;
//				convertTopoToXml(Name);
            }else{
                alert("Something went wrong, config convertion failed.");
            }
            loading('hide');
        }
    });
}


/*
 *
 *  FUNCTION NAME : createTitan
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : sends xml file to create titan file
 *  PARAMETERS    : 
 *
 */
function createTitan(){
	loading("show");
	var fname = $("#saveConfFileName").val();
	var qry = "filename="+fname+"`data="+getXmlData();
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/RM_CGI_AutoComplete/AutoCompleteCgiQuerryjayson/FindResource2.cgi",
        data : {
            "action": "xmltotitan",
            "query": qry
        },
        method: 'POST',
        proccessData: false,
        dataType: 'html',
        success: function(data) {
            if(data){
                alert("Configuration successfully converted to titan file and is now ready to be downloaded.");
				titanVar = data;
				saveTitanToHome(fname,"save");
            }else{
                alert("Something went wrong, config convertion failed.");
            }
        }
    });
}

/*
 *
 *  FUNCTION NAME : loadTitanFromLocDir
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the local copy of titan file to be save in home dir
 *  PARAMETERS    : 
 *
 */
function loadTitanFromLocDir(fname){
	var url = "/cgi-bin/Final/RM_CGI_AutoComplete/AutoCompleteCgiQuerryjayson/FindResource2.cgi?action=gettitanfile&query=filename="+fname+"^user="+globalUserName;
    $.ajax({
        url: "http://"+CURRENT_IP+url,
        proccessData: false,
        dataType: 'html',
		success: function(data){
			if(data){
				getDataFromXML(data);
			}else{
				alert('Something went wrong, CGI did not return anything.');
			}
			$("#loadConfig").dialog("close");
		},
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status+" : "+thrownError);
        }
	});
}

/*
 *
 *  FUNCTION NAME : saveTitanToHome
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : sends titan to be saved in home
 *  PARAMETERS    : 
 *
 */
function saveTitanToHome(fname,type){
//	var titanSplt = titanVar.split("\n").join("^");
	var qry = "filename="+fname+"^user="+globalUserName+"^titan="+titanVar;
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py",
        data : {
            "action": "loadtitanmobile",
            "query": qry
        },
        method: 'POST',
        proccessData: false,
        dataType: 'html'
/*        success: function(data) {
            if(data){
                alert("Configuration successfully converted to titan file and is now ready to be downloaded.");
				downloadFile(fName,titanVar,"titan")
            }else{
                alert("Something went wrong, config convertion failed.");
            }
            loading('hide');
        },
	    error: function (xhr, ajaxOptions, thrownError) {
        	alert(xhr.status+" : "+thrownError);
      	}*/
    });
	setTimeout(function(){
		if(type=="save"){
			downloadFile(fName,titanVar,"titan");
		}else if(type=="load"){
			loadTitanFromLocDir(fname);
		}
		loading('hide');
	},500);
}
/*
 *
 *  FUNCTION NAME : downloadFile
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 30, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : download configuration as xml/topo file
 *  PARAMETERS    : confName,content,ext
 *
 */
function downloadFile(confName,cont,ext){
	if(ext == "xml"){
		var content = getXmlData();
	}else if(ext == "topo"){
		var content = topoMapVar;
	}else if(ext == "titan"){
		var content = titanVar;
	}else{
		var content = cont;
	}
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    function gotFS(fileSystem) {
        fileSystem.root.getFile(confName+"."+ext, {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
			$("#saveConfig").dialog("close");
        };
        writer.write(content);
		
    }

    function fail(error) {
        alert(error.code);
    }
}

/*
 *
 *  FUNCTION NAME : showDirectory
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 31, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : shows the files saved in the directory
 *  PARAMETERS    : 
 *
 */
function showDirectory(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
//    	alert("Root = " + fs.root.fullPath);
        var directoryReader = fs.root.createReader();
		directoryReader.readEntries(success,failDir);
	}, function (error) {
    	alert(error.code);
	});
    function success(entries) {
		var ent="<option>Select File</option>";
    	for (var i=0; i<entries.length; i++) {
			ent += "<option value="+entries[i].name+">"+entries[i].name+"</option>";
    	}
		$("#loadConfSelect").html(ent);		
//		alert("pasok sa success?"+ent);
    }
    function failDir(error) {
    	alert("Failed to list directory contents: " + error.code);
    }
}

/*
 *
 *  FUNCTION NAME : showFile
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 31, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : upload configuration as file
 *  PARAMETERS    : confName
 *
 */
function showFile(confName){
	var ext = confName.split(".")[1];
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSRead, failRead);
    function gotFSRead(fileSystem) {
    	//alert("Pasok sa gotFSRead?"+fileSystem);
        fileSystem.root.getFile(confName, null, gotFileEntryRead, failRead);
    }

    function gotFileEntryRead(fileEntry) {
    	//alert("Pasok sa gotFileEntryRead?"+fileEntry);
        fileEntry.file(gotFileRead, failRead);
    }

    function gotFileRead(file){
    	//alert("Pasok sa gotFileRead?"+file);
        readAsText(file);
    }

    function readAsText(file) {
    	//alert("Pasok sa readAsText?"+file);
    	var reader = new FileReader();
        reader.onload = function(e) {
			if(ext == "xml"){
	            getDataFromXML(reader.result);
			}else if(ext =="topo"){
				convertTopoToXml(confName);
			}else if(ext == "titan"){
				saveTitanToHome(confName,"load");
				titanVar = reader.result;
			}
            //loading('hide');
            $("#loadConfig").dialog("close");
        }

/*        var reader = new FileReader();
        reader.onloadend = function(evt) {
//            alert("Read as text");
            alert(evt.target.result);
        };*/
        reader.readAsText(file);
    }

    function failRead(evt) {
    	//alert("Pasok sa readAsTextRead?"+evt);
        alert(evt.target.error.code);
    }
}

/*
 *
 *  FUNCTION NAME : convertTopoToXml
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 2, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : convert topo to xml
 *  PARAMETERS    : fName
 *
 */
function convertTopoToXml(fname){
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/RM_CGI_AutoComplete/AutoCompleteCgiQuerryjayson/FindResource2.cgi",
        data : {
            "action": "gettopofile",
            "query": "filename="+fname+"^username="+globalUserName
        },
        method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
		}
	});
}

/*
 *
 *  FUNCTION NAME : saveConfigtoDB
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : saves configuration to DB
 *  PARAMETERS    : confName
 *
 */
function saveConfigtoDB(confName,ftype){
	MainFlag = 0;
	FileType = ftype;
	var qry = getXmlData();
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
        data : {
            "query": qry,			
            "action": "insert"
        },
        method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
//			if(data == 1){
				alert("Configuration saved to the database.");
				MainFlag =1;
				FileType ="";
				$("#saveConfig").dialog("close");
/*			}else{
				alert("Something went wrong, configuration could not be save.");
			}*/
		}
	});
}

/*
 *
 *  FUNCTION NAME : saveConfigtoDBTestbed
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 29, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : saves testbed configuration to DB
 *  PARAMETERS    : confName
 *
 */
function saveConfigtoDBTestbed(confName){
	loading("show");
	MainFlag = 0;
	FileType = "Dynamic";
	var qry = getXmlData();
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
        data : {
            "action": "savetopology",
            "query": qry
        },
        method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
//			if(data == 1){
				loading("hide");
				alert("Configuration saved to the database.");
				MainFlag =1;
				FileType ="";
				$("#saveConfig").dialog("close");
/*			}else{
				alert("Something went wrong, configuration could not be save.");
			}*/
		}
	});
}

/*
 *
 *  FUNCTION NAME : loading
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 17, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : show/hide loader
 *  PARAMETERS    : showOrHide
 *
 */
function loading(showOrHide,text) {
	if(text){
		var textVis = true;
	}else{
		var textVis = false;
	}
    setTimeout(function(){
		if(showOrHide == "show"){
			$("body").addClass('ui-disabled');
		}else{
			$("body").removeClass('ui-disabled');
		}
//        $.mobile.loading(showOrHide);
		$.mobile.loading(showOrHide, {
			text: text,
			textVisible: textVis,
			theme: "z",
			html: ""
		});
    }, 1); 
}

/*
 *
 *  FUNCTION NAME : checkDevicesToCreateLink 
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : create line in devices
 *  PARAMETERS    : imgId 
 *
 */
function checkDevicesToCreateLink(imgId,imgXpos2,imgYpos2){
	dragtoTrash(imgId,imgXpos2,imgYpos2);
	var obj;
	for(var i = 0; i  < devicesArr.length; i++){ // checks if the hitted object is equal to the array
		if(devicesArr[i].ObjectPath == imgId){ // change the X and Y Position of object
	        devicesArr[i].XLocation = imgXpos2;
    	    devicesArr[i].YLocation = imgYpos2;
			obj = devicesArr[i];
			break;
    	}
	}
	if(globalFlagCommitted == false){
		for(var i = 0; i  < devicesArrBC.length; i++){ // checks if the hitted object is equal to the array
			if(devicesArrBC[i].ObjectPath == imgId){ // change the X and Y Position of object
	        	devicesArrBC[i].XLocation = imgXpos2;
	    	    devicesArrBC[i].YLocation = imgYpos2;
				break;
    		}
		}
	}
	lineConnectorVar(obj); // this function is to hold the variable for connecting devices 
	if(lineConnected.length == 0){
		return
	}
	for(var i = 0; i  < lineConnected.length; i++){
        if(lineConnected[i].SourceDevice.ObjectPath == imgId){
			lineConnected[i].SourceDevice.XLocation = imgXpos2;
			lineConnected[i].SourceDevice.YLocation = imgYpos2;
		}else if(lineConnected[i].DestinationDevice.ObjectPath == imgId){
			lineConnected[i].DestinationDevice.XLocation = imgXpos2;
			lineConnected[i].DestinationDevice.YLocation = imgYpos2;
		}
	}
	if(globalFlagCommitted == false){
		for(var i = 0; i  < lineConnected2.length; i++){
        	if(lineConnected2[i].SourceDevice.ObjectPath == imgId){
				lineConnected2[i].SourceDevice.XLocation = imgXpos2;
				lineConnected2[i].SourceDevice.YLocation = imgYpos2;
			}else if(lineConnected2[i].DestinationDevice.ObjectPath == imgId){
				lineConnected2[i].DestinationDevice.XLocation = imgXpos2;
				lineConnected2[i].DestinationDevice.YLocation = imgYpos2;
			}
		}
	}
	drawImage();
}
/*
 *
 *  FUNCTION NAME : createLine 
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : create line in devices
 *  PARAMETERS    : 
 *
 */
function createLine(id){
	for(var i = 0 ; i < lineConnected.length; i++){
		var pointX = lineConnected[i].SourceDevice.XLocation+17;	
		var pointY = lineConnected[i].SourceDevice.YLocation+17;	
		var pointX2 = lineConnected[i].DestinationDevice.XLocation+17;	
		var pointY2 = lineConnected[i].DestinationDevice.YLocation+17;	
		var myId = lineConnected[i].Destination+"||"+lineConnected[i].Source+"||"+lineConnected[i].Name;
		var redLine = new Kinetic.Line({
 	    	points: [pointX, pointY, pointX2, pointY2],
    	    stroke: 'black',
        	strokeWidth: 5,
	        lineCap: 'round',
    	    lineJoin: 'round',
			id : myId,
			Destination : lineConnected[i].Destination,
			Source : lineConnected[i].Source
	    });
		var tooltip = new Kinetic.Label({
            x: pointX2 - 60,
            y: pointY2,
        	opacity: 0.75
	    });

//		var tp1 = lineConnected[i].Destination.split(".")[1];
		var tp1 = checkLineCount(lineConnected[i],"destination");
      	tooltip.add(new Kinetic.Text({
        	text: tp1,
        	fontFamily: 'Arial',
	        fontSize: 10,
    	    padding: 5,
        	fill: 'black'
      	}));
		var tooltip2 = new Kinetic.Label({
	        x: pointX + 35,
    	    y: pointY,
            opacity: 0.75
        });

//		var tp2 = lineConnected[i].Source.split(".")[1];
		var tp2 = checkLineCount(lineConnected[i],"source");					
        tooltip2.add(new Kinetic.Text({
            text: tp2,
        	fontFamily: 'Arial',
	        fontSize: 10,
    	    padding: 5,
	        fill: 'black'
        }));
		layer.add(redLine);
		var tooltip3 = new Kinetic.Text({
        	text: "",
         	fontFamily: "Arial",
         	fontSize: 10,
         	padding: 5,
        	textFill: "white",
         	fill: '#66666',
         	width: 150,
         	alpha: 1,
         	visible: false
	    });
		var rect = new Kinetic.Rect({
        	stroke: '#555',
	        strokeWidth: 1,
    	    fill: '#DFEFF0',
        	width: 150,
    	    cornerRadius: 5,
	        opacity: 0.5
      	});
		layer.add(tooltip);
		for(var a=0; a < portArr.length; a++){
			if(lineConnected[i].Destination == portArr[a].ObjectPath){
				var portLabel2 = "Portname: "+tp2+"\n";
                portLabel2 += "Speed: "+portArr[a].Speed;

			}else if(lineConnected[i].Source == portArr[a].ObjectPath){
				var portLabel = "Portname: "+tp1+"\n";
				portLabel += "Speed: "+portArr[a].Speed;

			}
		}
		tooltip.on('click tap',function(){
			var imgXpos2 = this.getPosition().x;
    	    var imgYpos2 = this.getPosition().y;
			var text = portLabel;			
	        tooltip3.setPosition(imgXpos2 + 40, imgYpos2 + 50);
			tooltip3.setText(text);
        	tooltip3.show();
			rect.setHeight(tooltip3.getHeight());
			rect.setPosition(imgXpos2 + 40, imgYpos2 + 50);
			rect.show()
			tooltipLayer.add(rect).moveToTop();
			tooltipLayer.add(tooltip3).moveToTop();
    		tooltipLayer.draw();
		});
		layer.add(tooltip2);
		tooltip2.on('click tap',function(){
            var imgXpos2 = this.getPosition().x;
            var imgYpos2 = this.getPosition().y;
            var text = portLabel2;
            tooltip3.setPosition(imgXpos2 + 40, imgYpos2 + 50);
            tooltip3.setText(text);
            tooltip3.show();
            rect.setHeight(tooltip3.getHeight());
            rect.setPosition(imgXpos2 + 40, imgYpos2 + 50);
            rect.show()
            tooltipLayer.add(rect).moveToTop();
            tooltipLayer.add(tooltip3).moveToTop();
            tooltipLayer.draw();
        });
		findClickLine(redLine);
		redLine.on('click tap',function(){
         var lineId = this.getId();
            var condition = checkLineIfCommited(lineId);
            if (condition == true){
                $('#linkConnect').show();
                $('#linkDisconnect').show();
                $('#linkFlap').show()
            }else if (condition==false){
                $('#linkConnect').hide();
                $('#linkDisconnect').hide();
                $('#linkFlap').hide()
            }
            $("#linkMenuPanel").popup("open");
            $( "#linkMenuPanel" ).trigger('create');
            gblLinkDestination = this.getAttr('Destination');
            gblLinkSource = this.getAttr('Source');
            $(document).on("click","#linkConnect", function(){
                showLineTable("connect",lineId);
				$("#linkMenuPanel").popup("close");
            });

            $(document).on("click","#linkDisconnect", function(){
                showLineTable("disconnect",lineId);
				$("#linkMenuPanel").popup("close");
            });
            $(document).on("click","#linkFlap", function(){
                showLineTable("flap",lineId);
				$("#linkMenuPanel").popup("close");
            });
			$(document).on("click","#alinkMap", function(){
				fetchPortForManageConnectivity(lineId);
				$("#linkMenuPanel").popup("close");
            });


/*
	        $("#linkMenuPanel").popup("open");
			gblLinkDestination = this.getAttr('Destination');
			gblLinkSource = this.getAttr('Source');
*/
	    });
	}
}

/*
 *  
 * FUNCTION NAME : checkLineCount
 * AUTHOR        : Marlo Agapay
 * DATE          : January 10, 2013
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */
function checkLineCount(line,portlocation){
	var lineCon = lineConnected;
	var count = 0;

	var str ="";
	for(var a=0; a<lineCon.length; a++){
		if (line.DestinationDevice.ObjectPath == lineCon[a].DestinationDevice.ObjectPath && line.SourceDevice.ObjectPath == lineCon[a].SourceDevice.ObjectPath){
			count +=1;	
		}
	}
	if (count>1){
			str = count+" ports";
	}else{
		if (portlocation =="source")
			str = line.Source.split(".")[1];
		else if (portlocation == "destination")
			str = line.Destination.split(".")[1];
	}
	return str;
}

/*
 *  
 * FUNCTION NAME : showLineTable
 * AUTHOR        : Marlo Agapay
 * DATE          : December 26, 2013
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : show table to select
 * PARAMETERS    :
 * 
 */
function showLineTable(action,lineId){
    setTimeout(function(){
        $.mobile.changePage($("#lineTableDiv"),{
            transition: "pop",
            changeHash : false
       });

        var headi ="";
        if (action=="connect"){
            headi = "Connect Line";
        }else if(action =="disconnect"){
            headi = "Disconnect Line";
        }else if (action =="flap"){
            headi = "Flap Line";
        }

        $("#lineHeader").empty().append(headi);
        $("#lineTableDiv").trigger('create');
        createLineTable(action,lineId)
    },1500);
}

/*
 *
 *  FUNCTION NAME : createLineTable
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : append information on the line table
 *  PARAMETERS    : action, lineId
 *
 */
function createLineTable(action,lineId){
	var dv = lineId.split("||");
	var dev1 = dv[0].split(".");
	var dev2 = dv[1].split(".");
	var deviceDestination = dev1[0];
	var deviceSource = dev2[0];
	var portDestination = dev1[1];
	var portSource = dev2[1];
	var html ="";
	for (var a=0;a<lineConnected.length; a++){
		var destinationObj1 = lineConnected[a].DestinationDevice.ObjectPath;
		var sourceObj1 = lineConnected[a].SourceDevice.ObjectPath;
		var destinationObj = lineConnected[a].Destination;
		var sourceObj = lineConnected[a].Source;
		var portDes = "";
		var portSor = "";
		var portDesRes = "";
		var portSorRes = "";
		if(destinationObj1 == deviceDestination &&  sourceObj1 == deviceSource){
			for (var q=0; q<portArr.length; q++){
				var portObj = portArr[q].ObjectPath;

				if (destinationObj == portObj){
					portDes = portArr[q].PortName;
					portDesRes = portArr[q].PortResId;
				}else if(sourceObj == portObj){
					portSor = portArr[q].PortName;
					portSorRes = portArr[q].PortResId;
				}
			}
		}
 		html += "<tr class='trLineList' ";
		html +="portResDestination="+portDesRes+" portResSource="+portSorRes+ ">";
		html +="<td>"+portDes+" --> "+portSor+"</td>";
		html+="</tr>";
	}
	$("#tablineTable > tbody").empty().append(html);

	$(".trLineList").on("tap",function(){
		if($(this).hasClass('highlight') == false){
			$(this).addClass('highlight');
		}else{
    		$(this).removeClass('highlight');
		}
	});

	$(document).on("click","#okLine", function(){
		var resArr = [];
		$(".trLineList").each(function(){
			if ($(this).hasClass('highlight') == true){
				var dRes = $(this).attr('portResDestination');
				var sRes = $(this).attr('portResSource');
				resArr.push({pDestination : dRes, pSource : sRes });
			}
		});
		if (action=="flap"){
			showPopupFlap(action,resArr);
		}else{
			lineConnectionQuery(action,resArr);
		}
	});

}

/*
 *
 *  FUNCTION NAME : showPopupFlap
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : show popup for flap (inut count and delay)
 *  PARAMETERS    : action, resArr
 *
 */
function showPopupFlap(action,resArr){
	setTimeout(function(){
	    $.mobile.changePage($("#flapPopupDiv"),{
    	    transition: "pop",
			changeHash : false
        });
		$('.numbersOnly').keyup(function () { 
    		this.value = this.value.replace(/[^0-9\.]/g,'');
		});

   	},1500);

	$(document).on("click","#okFlap", function(){
		var count = $("#flapCount").val();
		var delay = $("#flapDelay").val();
		lineConnectionQuery(action,resArr,count,delay);
	});


}

/*
 *
 *  FUNCTION NAME : lineConnectionQuery
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   :create query to cgi
 *  PARAMETERS    : action, resArr,count, delay
 *
 */
function lineConnectionQuery(action,resArr,count,delay){
	if(count==null || count=="" || count == undefined)
		count =1;
	if(delay == null || delay == undefined || delay == "")
		delay = 0;

	var url = "/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/Connectivity3.cgi"
	var query = "Port1="+resArr[0].pDestination+"^Port2="+resArr[0].pSource+"^Count="+count+"^Delay="+delay+"^ResourceId="+ResourceId+"^ConfigName="+Name;
	var url = "http://"+CURRENT_IP+url;
	$.ajax({
        url: url,
		data:{
			"action":action,
			"query":query,
		},
        dataType: 'html',
		method: 'POST',
		proccessData: false,
		async:false,
        success: function(data) {
			data = $.trim(data);
			if (data=="1"){
				alert(action+" Successful");
			}else{
				alert("Failed to "+action);
			}
			setTimeout(function(){
    		   	$.mobile.changePage($('#configEditorPage'),{
    		       	transition: "pop"
    		    });
    		},1000);

		}
	});		
}
/*
 *
 *  FUNCTION NAME : checkLineIfCommited
 *  AUTHOR        : Marlo Agapay
 *  DATE          : December 26, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : checks if line is already committed
 *  PARAMETERS    : 
 *
 */
function checkLineIfCommited(id){
	var dv = id.split("||");
	var dev1 = dv[0].split(".");
	var dev2 = dv[1].split(".");
	var device1 = dev1[0];
	var device2 = dev2[0];
	var dev1Condition = false;
	var dev2Condition  = false;

	for (var a=0; a<devicesArr.length; a++){
		if (devicesArr[a].ObjectPath== device1 && devicesArr[a].ConsoleIp !=""){
			dev1Condition = true;
		}
		if (devicesArr[a].ObjectPath== device2 && devicesArr[a].ConsoleIp !=""){
			dev2Condition = true;
		}
	}
	if (dev1Condition == true && dev2Condition == true){
		return true;
	}else{
		return false;
	}
}


/*
 *
 *  FUNCTION NAME : lineConnectorVar
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : create line in devices
 *  PARAMETERS    : 
 *
 */

function lineConnectorVar(obj){
	if(checkLCArray.length == 0 && globalFlag == true && !checkObjectArray(obj.ObjectPath,checkLCArray)){
		var checkPort = checkAvaiablePortOfEveryDevice(obj);
		if(checkPort != "" && obj.DeviceName != ""){
			$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
	        $("#OkPopUpInfo").html(checkPort);
    	    okPopupFunc();
		}else{
			checkLCArray.push(obj);
		}
	}else if(checkLCArray.length == 1 && globalFlag == true && !checkObjectArray(obj.ObjectPath,checkLCArray)){
		var checkPort = checkAvaiablePortOfEveryDevice(obj);
		if(checkPort != "" && obj.DeviceName != ""){
			$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
	        $("#OkPopUpInfo").html(checkPort);
    	    okPopupFunc();
			return;
		}
		sourcePath = "";
		dstPath = "";
		portflag = false;
		portflag2 = false;
		portspeedflag = false;
		portspeedflag2 = false;
		connectedSwitch = false;
		checkLCArray.push(obj);
		linkcounter++;
		var name = lineName+"_"+linkcounter;
		if(!checkLinkNameExist(name,lineConnected)){
			if(checkLCArray[0].DeviceName == "" && checkLCArray[1].DeviceName == ""){	
				setPortForDragandDrop(checkLCArray[0],"source");
				setPortForDragandDrop(checkLCArray[1],"destination");
				portflag = true;
				portflag2 = true;
			}else{
				createLinkForDevicelist(checkLCArray[0],checkLCArray[1]);
				if(portflag && portflag2){
					if(checkLCArray[0].DeviceName == ""){
						setPortForDragandDrop(checkLCArray[0],"source");
					}else if(checkLCArray[1].DeviceName == ""){
						setPortForDragandDrop(checkLCArray[1],"destination");
					}
				}
			}
			if(portflag && portflag2){
				storeLinkInformation(name,checkLCArray[0],checkLCArray[1],"","","","","","","",dstPath,sourcePath,"","","","","","","","",ConnectivityFlag);
    	    	drawImage();
				createLine('canvasID');
			}else{
				validationinCreatingLink(checkLCArray[0],checkLCArray[1]);
			}
			checkLCArray=[];
			globalFlag = false;
		}
	}
}
/*
 *
 *  FUNCTION NAME : checkAvaiablePortOfEveryDevice
 *  AUTHOR        : Juvindle C. Tina
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : check available port for every device
 *  PARAMETERS    : device
 *
 */
function checkAvaiablePortOfEveryDevice(device){
	var message = "";
	var available = false;
	var SwitchFlag = false;
	for(var t=0; t<portArr.length; t++){
		var port = portArr[t];
		if(port.PortFlag != "true"){
			available = true;
			if(port.PortType == lineType){
				SwitchFlag = true;
			}
		}
	}
	if(available == false){
		message = device.DeviceName + " has no available ports.";
	}else if(SwitchFlag == false){
		message = device.DeviceName + " has no ports connected to " + lineType.toUpperCase() + " switch.";
		
	}
	return message;
}
/*
 *
 *  FUNCTION NAME : setPortForDragandDrop
 *  AUTHOR        : Juvindle C. Tina
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : set port for drag and drop
 *  PARAMETERS    : device
 *
 */
function setPortForDragandDrop(device,action){
	var cnt = 0;
	cnt = getPortNumber(device.PortArr,cnt);
	var portpath = device.ObjectPath+ "." + "Port_"+cnt;
	if(action == "source"){
		sourcePath = portpath;
	}else{
		dstPath = portpath;
	}
	var portname = "Port_" + cnt;
	storePortInformation("","","","","","","","","",portname,"new","true",portpath,"","","","","",lineSpeed,enablePort,"Exclusive","","",lineType,"false","","","","","","","","","","","","","","","",device.ObjectPath);
}
/*
 *
 *  FUNCTION NAME : validationinCreatingLink
 *  AUTHOR        : Juvindle C. Tina
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : validation in creating links
 *  PARAMETERS    : device,device2
 *
 */
function validationinCreatingLink(device,device2){
	var message = "";
	if(connectedSwitch == true){
		message = device.DeviceName + " and " + device2.DeviceName + " have no port connected on same switch.";	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}else if(portspeedflag == false && portspeedflag2 == false){
		message = device.DeviceName + " and " + device2.DeviceName + " have no available port with speed of " + lineSpeed;	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}else if(portspeedflag == false){
		message = device.DeviceName + " has no available speed of " + lineSpeed;	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}else if(portspeedflag2 == false){
		message = device2.DeviceName + " has no available speed of " + lineSpeed;	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}else if(portflag == false && portflag2){
		message = device.DeviceName + " and " + device2.DeviceName + " have no available ports.";	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}else if(portflag == false){
		message = device.DeviceName + " has no available ports.";	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}else if(portflag2){
		message = device2.DeviceName + " has no available ports.";	
		$("#OkPopUpHeader").html("<center><h4>Notification</h4></center>");
        $("#OkPopUpInfo").html(message);
        okPopupFunc();
	}
}
/*
 *
 *  FUNCTION NAME : createLinkForDevicelist
 *  AUTHOR        : Juvindle C. Tina
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : check available device
 *  PARAMETERS    : device,device2
 *
 */
function createLinkForDevicelist(device,device2){
	if(device.DeviceName != "" && device2.DeviceName != ""){
		checkPortOfDeviceList(device.ObjectPath,"source");
		checkPortOfDeviceList(device2.ObjectPath,"destination");
		if(sourceSwitch != "" && destSwitch != "" && destSwitch.toLowerCase() != sourceSwitch.toLowerCase()){
			portflag = false;
			portflag2 = false;
			connectedSwitch = true;
		}
	}else if(device.DeviceName != "" || device2.DeviceName != ""){
		if(device.DeviceName != ""){
			checkPortOfDeviceList(device.ObjectPath,"source");
			portflag2 = true;
		}else if(device2.DeviceName != ""){
			checkPortOfDeviceList(device2.ObjectPath,"destination");
			portflag = true;
		}
	}
}
/*
 *
 *  FUNCTION NAME : checkPortOfDeviceList
 *  AUTHOR        : Juvindle C. Tina
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : check available port
 *  PARAMETERS    : devPath,action
 *
 */
function checkPortOfDeviceList(devPath,action){
	if(lineName != "" && lineName != null && lineName != undefined && lineName.toLowerCase() == "ethernet"){
		getPort(devPath,action,"1000");
		if(!portflag){
			getPort(devPath,action,"10-100");
		}else if(!portflag){
			getPort(devPath,action,"10000");
		}else if(!portflag){
			getPort(devPath,action,"40000");
		}else if(!portflag){
			getPort(devPath,action,"100000");
		}
	}else{
		getPort(devPath,action,lineSpeed);
	}
}
/*
 *
 *  FUNCTION NAME : getPort
 *  AUTHOR        : Juvindle C. Tina
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get available port
 *  PARAMETERS    : devPath,action,speed
 *
 */
function getPort(devPath,action,speed){
	for(var t=0; t<portArr.length; t++){
		var port = portArr[t];
		var portPathArr = port.ObjectPath.split(".");
		if(devPath == portPathArr[0] && port.PortFlag != "true" && speed == "10-100" && (port.Speed == "10" || port.Speed == "100") && lineType == port.PortType){
			if(action == "source"){
				portspeedflag = true;
				portflag = true;
				sourcePath = port.ObjectPath;
				sourceport = port;
				if(port.SwitchInfo != ""){
					var switchArr2 = port.SwitchInfo.split("^");
					sourceSwitch = switchArr2[0];
				}
			}else{
				portspeedflag2 = true;
				portflag2 = true;
				dstPath = port.ObjectPath;
				if(port.SwitchInfo != ""){
					var switchArr2 = port.SwitchInfo.split("^");
					destSwitch = switchArr2[0];
				}
			}
			t = portArr.length;
		}else if(devPath == portPathArr[0] && port.PortFlag != "true" && speed == port.Speed && lineType == port.PortType){
			if(action == "source"){
				portspeedflag = true;
				portflag = true;
				sourcePath = port.ObjectPath;
				if(port.SwitchInfo != ""){
					var switchArr2 = port.SwitchInfo.split("^");
					sourceSwitch = switchArr2[0];
				}
			}else{
				portspeedflag2 = true;
				portflag2 = true;
				dstPath = port.ObjectPath;
				if(port.SwitchInfo != ""){
					var switchArr2 = port.SwitchInfo.split("^");
					destSwitch = switchArr2[0];
				}
			}
			t = portArr.length;
		}
	}
}
/*
 *
 *  FUNCTION NAME : checkObjectArray
 *  AUTHOR        : James Turingan
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : check if the device is already exist in the array
 *  PARAMETERS    : path,myArray 
 *
 */
function checkObjectArray(path,myArray){
	var flag = false;
	for(var t=0; t<myArray.length; t++){
		if(myArray[t].ObjectPath == path){
			flag = true;
			break;
		}
	}
	return flag;
}
/*
 *
 *  FUNCTION NAME : setDeviceInformation 
 *  AUTHOR        : Juvindle Tina
 *  DATE          : December 6, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : store device information
 *  PARAMETERS    : devPath
 *
 */
function setDeviceInformation(devPath,model,src){
	var devtype = getDeviceType(model);
	var manu = getManufacturer(model);
	var myPortDev = [];
	storeDeviceInformation("",devtype,devPath,model,model,"","","","","","","","","new","","","","","","","Exclusive",imgXPos,imgYPos,"","","","","","","","","","","","","","","","","","",manu,"","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",ResourceDomain,"","","","",src,myPortDev,"",ConnectivityFlag);
	storeChildDevicesInformation("","","","","","",devPath,"","",devPath,"","",model,model,manu,"","","","","new","","","","","","","","","","","","","","","","","","","");
}

/*
 *
 *  FUNCTION NAME : getDomainInfo 
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : January 07, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : gets the info of the Active Resource Domain
 *  PARAMETERS    : 
 *
 */
function getDomainInfo(){
	var url = "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py";
    $.ajax({
		url: url,
		data : {
            "action": "domaininfo",
            "query": "user="+globalUserName,
        },
        method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
			data = $.trim(data);
            var parser = new DOMParser();
            var domainArray = [];
            var zoneArray = [];
            var groupArrat = [];
            var xmlDoc = parser.parseFromString(data , "text/xml" );
            var mainconfig = xmlDoc.getElementsByTagName('MAINCONFIG');
            var domain = xmlDoc.getElementsByTagName('DOMAIN');
			var selVal="";
            for(var a=0; a < domain.length; a++){
                selVal += "<option value='"+domain[a].getAttribute('DomainName')+"'>"+domain[a].getAttribute('DomainName')+"</option>";
				if(domain[a].getAttribute('Flag') == "1"){
					ActiveResourceDomain = domain[a].getAttribute('DomainName');
				}
            }
            $("#resDomSelect").html(selVal).selectmenu( "refresh" );
		}
	});
}


/*
 *
 *  FUNCTION NAME : userInformation2 
 *  AUTHOR        : Angeline Bringas
 *  DATE          : December 6, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : gets all domain,zone and group that was binded from user
 *  PARAMETERS    : 
 *
 **/
function userInformation2(){
	getDomainInfo();
	var urls = "http://"+CURRENT_IP+"/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=getuser2mobile&query="+globalUserName;
	$.ajax({
		url: urls,
		timeout: 120000,
		dataType: 'html',
		success: function(data) {
			data = $.trim(data);
			var parser = new DOMParser();
            var xmlDoc;
			var domainArray = [];
			var zoneArray = [];
			var groupArrat = [];
            xmlDoc = parser.parseFromString(data , "text/xml" );
			var mainconfig = xmlDoc.getElementsByTagName('MAINCONFIG'); 
            var domain = xmlDoc.getElementsByTagName('DOMAIN');
            var zone = xmlDoc.getElementsByTagName('ZONE'); 
			var group = xmlDoc.getElementsByTagName('GROUP'); 
		    for (var x = 0; x < domain.length; x++){
				domainArray.push(domain[x].getAttribute('DomainName'));
//				if(x == 0){	
//					ResourceDomain = domain[x].getAttribute('DomainName');
//				}
			}
			globalDomainArray = domainArray;
			globalUserId = mainconfig[0].getAttribute('UserId');
			userInformation.push({
				userId:mainconfig[0].getAttribute('UserId'),
				userLevel:mainconfig[0].getAttribute('UserLevel'),
				resourceDomain:domainArray
			});
					
		}
	});

}

/*
 *
 *  FUNCTION NAME : loadGridMenu
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 6, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the content of grid menu
 *  PARAMETERS    : 
 *
 */
function loadGridMenu(){
	$.ajax({
        url: "pages/ConfigEditor/gridPopup.html",
        dataType: 'html',
        success: function(data) {
			$("#gridPanel").append(data);
//			$( "#configEditorPage" ).trigger('create');
		    loadBarsMenu();

		}
	});
}
/*
 *
 *  FUNCTION NAME : loadBarsMenu
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 6, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the content of bars menu
 *  PARAMETERS    : 
 *
 */
function loadBarsMenu(){
    $.ajax({
        url: "pages/ConfigEditor/barsPopup.html",
        dataType: 'html',
        success: function(data) {
            $("#barsPanel").append(data);
            $( "#configEditorPage" ).trigger('create');
        }
    });
}
/*
 *
 *  FUNCTION NAME : loadConfigEditor
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the content of config page
 *  PARAMETERS    : 
 *
 */
function loadConfigEditor(){
	$.ajax({
        url: "pages/ConfigEditor/ConfigEditor.html",
        dataType: 'html',
        success: function(data) {
			$("#configEditorPage").append(data);
			loadGridMenu();
		}
	});
}
/*
 *
 *  FUNCTION NAME : getPortNumber
 *  AUTHOR        : Juvindle Tina
 *  DATE          : December 9, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : getPortNumber
 *  PARAMETERS    : portArr,cnt
 *
 */
function getPortNumber(portArr,cnt){
	if(ForNumberExist(portArr,cnt)){
		cnt++;
		cnt = getPortNumber(portArr,cnt);
	}
	return cnt;
}

/*
 *
 *  FUNCTION NAME : ForNumberExist
 *  AUTHOR        : Juvindle Tina
 *  DATE          : December 9, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : getPortNumber
 *  PARAMETERS    : portArr,cnt
 *
 */
function ForNumberExist(portArr,cnt){
	var flag = false;
	for(var t=0; t<portArr.length; t++){
		if(portArr[t].Number != "" && portArr[t].Number == cnt){
			flag = true;	
			t = portArr.length;
		}else if(portArr[t].ObjectPath != ""){
			var path = portArr[t].ObjectPath.split(".");
			var portnum = path[path.length -1].split("_");
			var num = parseInt(portnum[1]);
			if(num == cnt){
				flag = true;
				t = portArr.length;
			}
		}
	}
	return flag;
}
/*
 *
 *  FUNCTION NAME : checkLinkNameExist
 *  AUTHOR        : Juvindle Tina
 *  DATE          : December 9, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : check link name is already exist
 *  PARAMETERS    : name,myArray
 *
 */
function checkLinkNameExist(name,myArray){
	var flag = false;
	for(var t=0; t<myArray.length; t++){
		var linkName = myArray[t].Name;
		if(name == linkName){
			flag = true;
			t = myArray.length;
		}
	}
	return flag;
}

/*
 *
 *  FUNCTION NAME : loadGridMenuContent
 *  AUTHOR        : Mark Anthony Elbambo
 *  DATE          : December 6, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : loads the content of bars menu
 *  PARAMETERS    : 
 *
 */

function loadGridMenuContent(){
	loading("show");
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/instantiateDevices-mobile.cgi",
		data : {
			"action": "getalldevmodels",
			"query": "user="+globalUserName+"&domainname="+ResourceDomain+"&zone=",
		},
		method: 'POST',
        proccessData: false,
//        async:false,
        dataType: 'html',
        success: function(data) {
			loading("hide");
			var parser = new DOMParser();
            var xmlDoc;
            var domainArray = [];
            var zoneArray = [];
            var groupArrat = [];
            xmlDoc = parser.parseFromString(data , "text/xml" );
            var root = xmlDoc.getElementsByTagName('root');
			var info = xmlDoc.getElementsByTagName('info');
			var conn = xmlDoc.getElementsByTagName('conn');
			var dut='',ixia='';
			var devFlag=false, testTlFlag=false, serverFlag=false;
            for (var x = 0; x < info.length; x++){
				var model = info[x].getAttribute("Model");
				var manu = info[x].getAttribute("Manufacturer");
				var type = info[x].getAttribute("Type");
				var OStype = info[x].getAttribute("OSType");
				var ProductFamily = info[x].getAttribute("ProductFamily");
				type = type.toLowerCase();
				if(type == "dut"){
					devFlag = true;
					if(manu == "cisco"){
						var mtch = model.match(/asr/g);
						if(mtch =="" || mtch != "asr"){
							dut += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img class="icon" did="device" model='+model+' src="img/device/cisco_vivid_blue_55.png" id="device'+model+'"><p>'+model+'</p></div>';
						}else{							
							dut += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img class="icon" did="device" model='+model+' src="img/device/asr-1k-55px.png" id="device'+model+'"><p>'+model+'</p></div>';
						}
					}else if(manu == "ixia"){
						mod1 = model.split("_")[0];
						mod2 = model.split("_")[1];
						ixia += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img class="icon" did="device" model='+mod1+' src="img/testtool/ixia.png" id="device'+mod+'"><p>'+mod1+'</p></div>';
					}
				}else if(type == "testtool"){
					testTlFlag = true;
					if(manu == "ixia"){
                        mod1 = model.split("_")[0];
                        mod2 = model.split("_")[1];
                        ixia += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img class="icon" did="device" model='+mod1+' src="img/testtool/ixia.png" id="device'+model+'"><p>'+mod1+'</p></div>';
                    }
				}else if(type == "server"){
					serverFlag = true;
				}
            }
			$("#devicePaletteSubTrCisco").html(dut);
			$("#testToolPaletteSubTrIxia").html(ixia);
			var conVal = conn[0].getAttribute("Connectivity");
			var con ="";
			conVal = conVal.split(",");
			for(var a =0; a< conVal.length; a++){
				var convalval = conVal[a].toLowerCase();
				if(convalval == "open"){
					con += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img style="width: 45px;" model="direct" did="connectivity" speed="" linktype="Open" id="connectivitySubDirect" src="img/connectivity/dc.png" /><p>Direct Connect</p></div>';
				}else if(convalval == "l1"){
					con += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img style="width: 45px;" model="ethernet" did="connectivity" speed="1000" linktype="L1" id="connectivitySubL1" src="img/connectivity/L1.png" /><p>L1</p></div>';
				}else if(convalval == "l2"){
					con += '<div style="float: left;text-align: center;margin: 0px 8px 0px 8px;"><img style="width: 45px;" model="ethernetl2" did="connectivity" speed="1000" linktype="L2" id="connectivitySubL2" src="img/connectivity/L2.png" /><p>L2</p></div>';
				}
			}
			$("#connectivityPaletteSubTrMain").html(con);
			setTimeout(function(){
	            $( "#configEditorPage" ).trigger('create');
				$('#domainText').empty().append(ResourceDomain);

				if((devFlag == false && userInformation[0].userLevel == "Administrator") || (devFlag ==true)){
					$("#deviceIcoDiv").show();
				}else{
					$("#deviceIcoDiv").hide();
				}
				if((testTlFlag == false && userInformation[0].userLevel == "Administrator") || (testTlFlag == true)){
					$("#testToolIcoDiv").show();
				}else{
					$("#testToolIcoDiv").hide();
				}
				if((serverFlag == false && userInformation[0].userLevel == "Administrator") || (serverFlag == true)){
					$("#serverIcoDiv").show();
				}else{
					$("#serverIcoDiv").hide();
				}
			},100);
        }
    });
}
/*
 *
 *  FUNCTION NAME : populateCombo
 *  AUTHOR        : 
 *  DATE          :  
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : December 09, 2013
 *  REVISION #    : 
 *  DESCRIPTION   : populates the value of combo box of days,hours and minutes
 *  PARAMETERS    : 
 *
 */

function populateCombo() {
    var strDay = '';
    for (var a=0; a<365; a++) {
        if (!a) {
            strDay += "<option value='dd'>dd</option>";
        } else {
            strDay += "<option value='"+a+"'>"+a+"</option>";
        }
    }
    $('#durationD').empty().append(strDay);

    var strHour = '';
    for (var a=0; a<24; a++) {
        if (!a) {
            strHour += "<option value='hh'>hh</option>";
        }else if(a == 2){
            strHour += "<option value='"+a+"' selected>"+a+"</option>";

		} else {
            strHour += "<option value='"+a+"'>"+a+"</option>";
        }
    }
    $('#durationH').empty().append(strHour);

    var strMin = '';
    for (var a=0; a<60; a++) {
        if (!a) {
            strMin += "<option value='mm'>mm</option>";
        } else {
            strMin += "<option value='"+a+"'>"+a+"</option>";
        }
    }
    $('#durationM').empty().append(strMin);

}
/*
 *
 *  FUNCTION NAME : outOfFocus
 *  AUTHOR        : 
 *  DATE          :  
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : December 09, 2013
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function outOfFocus(){
	
	var testVal = $('#FlashDurationSel').val();
	if ($('#FlashDurationSel').val() == 'datetime'){
		//var d1 = $('#confirm_test').val().split('/');
    	var startDate   = $("#confirm_test").val().split("-");
		var sdate;
		if (startDate.length == 1) {
			sdate = startDate[0];
		} else {
			sdate = startDate[1]+"/"+startDate[2]+"/"+startDate[0];
		  }
		$("#confirm_test").val(sdate);

		var sDate = $("#confirm_test").val();
		var sTime = $("#confirm_test1").val();
		var eTime = $("#confirm_test3").val();

		var sDateArr = sDate.split(/\//);
		if (sDateArr.length != 3) {
			displayWarning3("<b>Please enter valid Start Date.</b>");
			$('#confirm_test').focus();
			return;
		}
		var smonth = sDateArr[0];
		var sday = sDateArr[1];
		var syear = sDateArr[2];
		if (syear.length < 4) {
//			displayWarning3("<b>Please enter valid year for Start Date.</b>");
			$('#confirm_test').focus();
			return;
		}
		var sTimeArr = sTime.split(":");
		if(sTimeArr.length == 2){
			var val = $('#confirm_test1').val();
			$('#confirm_test1').val(val+':'+'00');
			sTime = $('#confirm_test1').val();
			sTimeArr = sTime.split(":");

		}

		if (sTimeArr.length != 3) {
//			displayWarning3("<b>Please enter valid Start Time.</b>");
			$('#confirm_test1').focus();
			return;
		}
		var shour = sTimeArr[0];
		var smin = sTimeArr[1];
		var ssec = sTimeArr[2];
		var eDateArr = $('#confirm_test2').val().split(/\//);
		if (eDateArr.length != 3) {
//			displayWarning3("<b>Please enter valid Start Date.</b>");
			$('#confirm_test2').focus();
			return;
		}
		var emonth = eDateArr[0];
		var eday = eDateArr[1];
		var eyear = eDateArr[2];
		if (eyear.length < 4) {
//			displayWarning3("<b>Please enter valid year for End Date.</b>");
			$('#confirm_test2').focus();
			return;
		}

		var eTimeArr = eTime.split(":");

		if(eTimeArr.length == 2){
			var val = $('#confirm_test3').val();
			$('#confirm_test3').val(val+':'+'00');
			eTime = $('#confirm_test3').val();
			eTimeArr = eTime.split(":");

		}

		if (eTimeArr.length != 3) {
//			displayWarning3("<b>Please enter valid End Time.</b>");
			$('#confirm_test3').focus();
			return;
		}
		var ehour = eTimeArr[0];
		var emin = eTimeArr[1];
		var esec = eTimeArr[2];
			emonth = parseInt(emonth,10);
			smonth = parseInt(smonth,10);
		var enddate = new Date(eyear,emonth,eday,ehour,emin,esec);
		var startdate = new Date(syear,smonth,sday,shour,smin,ssec);
		var diff = enddate.getTime() - startdate.getTime();
		var daysDiff = Math.floor(diff/1000/60/60/24);
		diff -= daysDiff*1000*60*60*24
		var hoursDiff = Math.floor(diff/1000/60/60);
		diff -= hoursDiff*1000*60*60
		var minsDiff = Math.floor(diff/1000/60);
		if (daysDiff >= 0) {
			if (daysDiff) {
				$('#durationD').val(daysDiff);
			}
			if (hoursDiff) {
				$('#durationH').val(hoursDiff);
			}
			if (minsDiff) {
				$('#durationM').val(minsDiff);
			}
		} else {
			$('#durationD').val('dd');
			$('#durationH').val('hh');
			$('#durationM').val('mm');
		}
	} else {
    	var startDate   = $("#confirm_test").val().split("-");
		var sdate;
		if (startDate.length == 1) {
			sdate = startDate[0];
		} else {
			sdate = startDate[1]+"/"+startDate[2]+"/"+startDate[0];
		  }
		$("#confirm_test").val(sdate);
		var sDate = $("#confirm_test").val();
		var sTime = $("#confirm_test1").val();
		var sDateArr = sDate.split(/\//);
		if (sDateArr.length != 3) {
		//	displayWarning3("<b>Please enter valid Start Date.</b>");
			$('#confirm_test').focus();
			return;
		}
		var smonth = sDateArr[0];
		var sday = sDateArr[1];
		var syear = sDateArr[2];
		if (smonth > 12 || smonth == 0) {
		//	displayWarning3("<b>Please enter valid month for Start Date.</b>");
			$('#confirm_test').focus();
			return;
		}
		if (sday > 31 || sday == 0) {
		//	displayWarning3("<b>Please enter valid day for Start Date.</b>");
			$('#confirm_test').focus();
			return;
			return;
		}
		if (syear.length < 4) {
		//	displayWarning3("<b>Please enter valid year for Start Date.</b>");
			$('#confirm_test').focus();
			return;
		}
		var sTimeArr = sTime.split(":");
		if(sTimeArr.length == 2){
			var val = $('#confirm_test1').val();
			$('#confirm_test1').val(val+':'+'00');
			sTime = $('#confirm_test1').val();
			sTimeArr = sTime.split(":");
		}
		if (sTimeArr.length != 3) {
		//	displayWarning3("<b>Please enter valid Start Time.</b>");
			$('#confirm_test1').focus();
			return;
		}
		calculateEndDate();
	}
//	validateDate();
}
/*
 *
 *  FUNCTION NAME : calculateDate
 *  AUTHOR        : 
 *  DATE          :  
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : December 09, 2013
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */



function calculateDate(ndate,d,h,m){
	var date1 = ndate;
	if (!isNaN(m)){
		date1.setMinutes(date1.getMinutes()+m);
	}
	if (!isNaN(h)){
		date1.setHours(date1.getHours()+h);
	}
	if (!isNaN(d)){
		date1.setDate(date1.getDate()+d);
	}
	return date1;
}


/*
 *
 *  FUNCTION NAME : calculateEndDate
 *  AUTHOR        : 
 *  DATE          :  
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : December 09, 2013
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function calculateEndDate(){

	var d1 = new Array();
	d1 = $('#confirm_test').val().split('/');
	var t1 = $('#confirm_test1').val();

	var d1str = "";
	if ( d1.length != 3 ) {
		d1 = $('#confirm_test').val().split('-');
		if ( d1.length != 3 ) {
			displayWarning("<b>Invalid Date Provided</b>");
			$('#confirm_test').val('');
			return;
		} else {
			var eyear = d1[0];
			if (eyear.length < 4) {
				displayWarning("<b>Please enter valid year for Start Date.</b>");
				$('#confirm_test').focus();
				return;
			}
			d1str = new Date(d1[0]+'/'+d1[1]+'/'+d1[2]+' '+t1); 
			var newDate = d1[1]+'/'+d1[2]+'/'+d1[0];
			$('#confirm_test').val(newDate);
		}
	} else {
		var eyear = d1[2];
		if (eyear.length < 4) {
			displayWarning("<b>Please enter valid year for Start Date.</b>");
			$('#confirm_test').focus();
			return;
		}
		d1str = new Date(d1[2]+'/'+d1[0]+'/'+d1[1]+' '+t1); 
	}

	var day = $('#durationD').val();
	var hour = $('#durationH').val();
	var min = $('#durationM').val();

	if (day == "dd" && hour == "hh" && min=="mm") {
		$('#confirm_test2').val($('#confirm_test').val());
		$('#confirm_test3').val($('#confirm_test1').val());
	} else {
		var newdt = calculateDate(d1str,parseInt(day),parseInt(hour),parseInt(min));
		var dstring = (newdt.getMonth()+1)+'/'+newdt.getDate()+'/'+newdt.getFullYear();
		$('#confirm_test2').val(dstring);
		$('#confirm_test3').val(newdt.toString().split(' ')[4]);
	}

}
/*
 *
 *  FUNCTION NAME : calculateDHM
 *  AUTHOR        : 
 *  DATE          :  
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : December 09, 2013
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function calculateDHM(milisec){
	//DHM = Day, Hour, Minutes
	var newMili = parseInt(milisec);
	var DHMconv = [86400000,3600000,60000];
	var DHM = ['dd','hh','mm'];
	if (isNaN(newMili)){
		return DHM;
	}
	for (var i=0;i<DHMconv.length;i++){
		if (newMili < DHMconv[i]){
			continue;
		}
		DHM[i]= (newMili/DHMconv[i]).toString().split('.')[0];
		newMili = newMili % DHMconv[i];	
	}	
	return DHM;
}
/*
 *
 *  FUNCTION NAME : durationOnChange
 *  AUTHOR        : 
 *  DATE          :  
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : December 09, 2013
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function durationOnChange (val) {
	if (val.toLowerCase() == "duration") {
		$('#durationD').selectmenu('enable');
		$('#durationM').selectmenu('enable');
		$('#durationH').selectmenu('enable');
		$('#confirm_test2').textinput('disable');
		$('#confirm_test3').textinput('disable');
	} else {
		$('#durationD').selectmenu('disable');
		$('#durationM').selectmenu('disable');
		$('#durationH').selectmenu('disable');
		$('#confirm_test2').textinput('enable');
		$('#confirm_test3').textinput('enable');
	}
}
/*
 *
 *  FUNCTION NAME : rebuilCanvas 
 *  AUTHOR        : Juvindle C Tina
 *  DATE          : December 5, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : rebuild canvas for new topology
 *  PARAMETERS    : 
 *
 */
function rebuilCanvas(){
	drawImage();
}
/*
 *
 *  FUNCTION NAME : initDate
 *  AUTHOR        : James Turingan
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : initialize the date picker in commit popUp 
 *  PARAMETERS    : 
 *
 */
function initDate(){
	var date = new Date();
	var dateToday = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()
	var dateToday = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear()
	var timeH = date.getHours();
	var timeM = date.getMinutes();
	var timeS = date.getSeconds();
	if(timeH == 0){
		timeH = '00';
	}
	if(timeM == 0){
		timeM = '00';
	}
	if(timeS == 0){
		timeD = '00';
	}
	var time = timeH+':'+timeM+':'+timeS;
	var ntime = convertTime(time);
	$('#confirm_test').val(dateToday);
	$('#confirm_test1').val(ntime);
	outOfFocus();
}
/*
 *
 *  FUNCTION NAME : validateDate
 *  AUTHOR        : 
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function validateDate(){
	var startDate	= $("#confirm_test").val();
	var startTime	= $("#confirm_test1").val();
	var endTime		= $("#confirm_test3").val();
	var endDate		= $("#confirm_test2").val();
	var sDate = new Array();
		sDate = startDate.split("/");
	var sTime = new Array();
		sTime = startTime.split(":");
	var eDate = new Array();
		eDate = endDate.split("/");
	var eTime = new Array();
		eTime = endTime.split(":");



	var EndStart = DateChecker( eDate[2] , eDate[0] , eDate[1] , eTime[0] , eTime[1] , eTime[2] , sDate[2] , sDate[0] , sDate[1] , sTime[0] , sTime[1] , sTime[2], 1 );
	if ( EndStart == 0 ) {
		alert( "Reservation end time cannot be less than reservation start time." );
//		outOfFocus();	
		return 1;
	} else if ( EndStart == 2 ) {
		alert( "Reservation end time cannot be equal to reservation start time." );
//		outOfFocus();	
		return 1;
	} else if ( EndStart == 3 ) {
		alert( "Minimum reservation time is 10 minutes. Please adjust time of reservation." );
//		outOfFocus();	
		return 1;
	} 

/*	else {
			
		var StartServer = DateChecker( sDate[2] , sDate[0] , sDate[1] , sTime[0] , sTime[1] , sTime[2] ,  serverYear , serverMonth , serverDay , serverHour , serverMinute , serverSecond, 0 );
		if ( StartServer != 1 && StartServer != 5 ) {
			var todo1 =  '';
				todo1 += 'refreshStartTime("'+eDate[2]+'","'+eDate[0]+'","'+eDate[1]+'","'+eTime[0]+'","'+eTime[1]+'","'+eTime[2]+'","'+fromWhere+'");';

			//alerts( "Reservation time has already lapsed. Do you want to use the current time as the start time?", todo1, "prompt" );
			displayWarning2( "Reservation time has already lapsed. Do you want to use the current time as the start time?", todo1);
			return 1;
		} else if ( StartServer == 5) {
			//refreshStartTime(eDate[2],eDate[0],eDate[1],eTime[0],eTime[1],eTime[2],fromWhere);
			//return 1;
		  }

	}

*/


}

/*
 *
 *  FUNCTION NAME : DateChecker
 *  AUTHOR        : 
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function DateChecker ( gYear , gMonth , gDay , gHour , gMin , gSec,  lYear , lMonth , lDay , lHour , lMin , lSec , intervalFlag ) {

	gMonth = appendZero( gMonth );
	gDay = appendZero( gDay );
	gHour = appendZero ( gHour );
	gMin = appendZero ( gMin );
	gSec = appendZero ( gSec );
	lMonth = appendZero( lMonth );
	lDay = appendZero( lDay );
	lHour = appendZero ( lHour );
	lMin = appendZero ( lMin );
	lSec = appendZero ( lSec );	

	var greaterDate = gYear + gMonth + gDay + gHour + gMin + gSec;
		greaterDate = parseInt( greaterDate );
	var lesserDate = lYear + lMonth + lDay + lHour + lMin + lSec;
		lesserDate = parseInt( lesserDate );

	var gDate = formatDate( gYear , gMonth , gDay , gHour , gMin , gSec );
	var lDate = formatDate( lYear , lMonth , lDay , lHour , lMin , lSec );

	var retVal;
	if ( greaterDate == lesserDate ) {
		retVal = 2;
	} else if ( greaterDate > lesserDate ) {
		if ( intervalFlag == 1 ) {
			retVal = checkInterval( gDate , lDate, 1 );
		} else {
			//retVal = checkInterval( gDate , lDate, 0 );
			retVal = 1;
		}
	} else {
		if (intervalFlag == 1) {
			retVal = 0;
		} else {
			retVal = checkInterval( gDate , lDate, 0 );
		}
	}

	return retVal;

}

/*
 *
 *  FUNCTION NAME : appendZero
 *  AUTHOR        : 
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function appendZero( dateValue ) {

	if ( dateValue.length == 1 ) {
		retVal = "0" + dateValue;
	} else {
		retVal = dateValue;
	}

	return retVal;

}
/*
 *
 *  FUNCTION NAME : formatDate
 *  AUTHOR        : 
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */


function formatDate ( year , month , day , hour , minute , second ) {

//	var myDate = new Date("July 1, 1978 02:30:00"); // Your timezone!
//	var myEpoch = myDate.getTime()/1000.0;

	// CONVERT MONTH VALUE TO WORD
	var newMonth;
	if ( month == 1 ) {
		newMonth = "January";
	} else if ( month == 2 ) {
		newMonth = "February";
	} else if ( month == 3 ) {
		newMonth = "March";
	} else if ( month == 4 ) {
		newMonth = "April";
	} else if ( month == 5 ) {
		newMonth = "May";
	} else if ( month == 6 ) {
		newMonth = "June";
	} else if ( month == 7 ) {
		newMonth = "July";
	} else if ( month == 8 ) {
		newMonth = "August";
	} else if ( month == 9 ) {
		newMonth = "September";
	} else if ( month == 10 ) {
		newMonth = "October";
	} else if ( month == 11 ) {
		newMonth = "November";
	} else if ( month == 12 ) {
		newMonth = "December";
	}

	var newDate = newMonth+" "+day+", "+year+" "+hour+":"+minute+":"+second;

	return newDate;

}
/*
 *
 *  FUNCTION NAME : checkInterval
 *  AUTHOR        : 
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : James Turingan
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */



function checkInterval( gDate , lDate, flag ) {

//	var myDate = new Date("July 1, 1978 02:30:00"); // Your timezone!
//	var myEpoch = myDate.getTime()/1000.0;

	var greaterDate = new Date( gDate );
	var greaterEpoch = greaterDate.getTime()/1000.0;
		greaterEpoch = parseInt( greaterEpoch );
	var lesserDate = new Date( lDate );
	var lesserEpoch = lesserDate.getTime()/1000.0;
		lesserEpoch = parseInt( lesserEpoch );


	var retVal = 1;
	if ( flag == 1 ) {
		var deltaTime = greaterEpoch - lesserEpoch;
			deltaTime = parseInt( deltaTime );
		if ( deltaTime < 600 ) {
			retVal = 3;
		}
	} else {
		var deltaTime = lesserEpoch - greaterEpoch;
			deltaTime = parseInt( deltaTime );
		if ( deltaTime >= 60 ) {
			retVal = 3;
		} else {
			retVal = 5;
		  }
    }
	return retVal;

}
/*
 *
 *  FUNCTION NAME : createDeviceTooltip 
 *  AUTHOR        : Apple Kem E. Eguia
 *  DATE          : December 10, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : creates tooltip on tap and hold on device
 *  PARAMETERS    : imgId, imgXpos2, imgYpos2, action 
 *
 */
//function createDeviceTooltip(imgId,imgXpos2,imgYpos2,act){
function createDeviceTooltip(imgId){
    //var layer = new Kinetic.Layer(); // initialize per layer of images or object in canvas
	var myText = "";	
	for(var i = 0; i  < devicesArr.length; i++){ // checks if the hitted object is equal to the array
		if(devicesArr[i].ObjectPath == imgId){ // get the device name and model
			if (devicesArr[i].Status == 'Reserved'){
				if (devicesArr[i].HostName != ""){
					myText = "Host Name: " + devicesArr[i].HostName;
				}
				if (devicesArr[i].Model != ""){
					myText += "\nModel: " + devicesArr[i].Model;
				}
				if (devicesArr[i].OSVersion != ""){
					myText += "\nOS Version: " + devicesArr[i].OSVersion;
				}
				if (devicesArr[i].ManagementIp != ""){
					myText += "\nManagement IP: " + devicesArr[i].ManagementIp;
				}
				if (devicesArr[i].ConsoleIp != ""){
					myText += "\nConsole IP: " + devicesArr[i].ConsoleIp;
				}
				if (devicesArr[i].Status != "" && devicesArr[i].Status != undefined){
					myText += "\nReservation Status: " + devicesArr[i].Status;
				}
/*				if (devicesArr[i].Portname != ""){
					myText += "\nAvailable Ports: " + devicesArr[i].Portname;
				}
				if (devicesArr[i].Model != ""){
					myText += "\nModel: " + devicesArr[i].Model;
				}*/
			} else if(devicesArr[i].Status == "" || devicesArr[i].Status == undefined || devicesArr[i].Status == null )  {
				if (devicesArr[i].DeviceName != ""){
					myText = devicesArr[i].DeviceName;
				}else{
					myText = devicesArr[i].ObjectPath;
				}
				if (devicesArr[i].Model != ""){
					myText += "\nModel: " + devicesArr[i].Model;
				}
				if (devicesArr[i].OSVersion != ""){
					myText += "\nOS Version: " + devicesArr[i].OSVersion;
				}
				if (devicesArr[i].ManagementIp != ""){
					myText += "\nManagement IP: " + devicesArr[i].ManagementIp;
				}
				if (devicesArr[i].ConsoleIp != ""){
					myText += "\nConsole IP: " + devicesArr[i].ConsoleIp;
				}
				if (devicesArr[i].Status != "" && devicesArr[i].Status != undefined){
					myText += "\nReservation Status: " + devicesArr[i].Status;
				}

			}
		}
	}
	/*var tooltip = new Kinetic.Label({
        x: imgXpos2+5,
        y: imgYpos2+5
    });
	tooltip.add(new Kinetic.Tag({
        fill: 'rgb(123, 150, 189)',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5
    }));
      
    tooltip.add(new Kinetic.Text({
        text: myText,
        fontFamily: 'Arial',
        fontSize: 12,
        padding: 5,
        fill: 'white'
    }));	

	layer.add(tooltip);
	if(stage != "" || stage != null || stage != undefined){	
		stage.add(layer);
	}*/
	return myText;
    
}	

function createLineTooltip(id){
	var t = id.split('||');
	var destination = t[0];
	var source = t[1];
	var type = t[2].split("_");
	var s = t[0].split(".");
	var d = t[1].split(".");
	var t = type[0];
	var text = "";
	text +="Device : "+s[0]+" -- "+ d[0];
	text +="";
		text +="\nType :  "+t.toLowerCase();		
	for (var a=0;a<portArr.length; a++){
		var objpath = portArr[a].ObjectPath;
		var sp = objpath.split(",");
		var dev = sp[0];
		var port = sp[1];
		if (portArr[a].ObjectPath == source || portArr[a].ObjectPath == destination){
			text +="\n\nPortInfo : "+portArr[a].PortDevName+" --> "+portArr[a].PortName;
			text +="\nSpeed : "+portArr[a].Speed;
		}
		
	}
	return text;
}
/*
function confirmDomain(domain) {

	ResourceDomain = domain	
	globalResourceDomain = domain
	loadGridMenuContent()
}
*/
/*
 *
 *  FUNCTION NAME : filterManageDevice
 *  AUTHOR        : Jvsantiago
 *  DATE          : December 11, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : filter devicelist tables
 *  PARAMETERS    : 
 *
 */
function filterManageDevice(type){
	if(type == 'testTool'){
		var $rows = $('#manageTestToolTable tr:gt(0)');
	}else{
		var $rows = $('#manageConfigTable tr:gt(0)');
	}
	$('.dFilter').keyup(function() {
    	var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        	reg = RegExp(val, 'i'),
        	text;
	
		var colval = $('#dlistddown option:selected').text();
		var colval = $('#dlistddown').val();
		var colnum = '';
		if(colval == "hostname"){
			colnum = 1
		}else if(colval == "model"){
			colnum = 5
		}else if(colval == "managementip"){
			colnum = 2
		}else if(colval == "manufacturer"){
			colnum = 4
		}else if(colval == "consoleip"){
			colnum = 3
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
 *
 *  FUNCTION NAME : createQueryMapLink
 *  AUTHOR        : marlo agapay
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : filter devicelist tables
 *  PARAMETERS    : 
 *
 */
function createQueryMapLink(deviceArrDev){
	var str = deviceArrDev.join(',');
	var url = "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi?action=getmaplink&query=hostname="+str;
	$.ajax({
		url: url,
		dataType: 'html',
		method 	: 'GET',
		processData : false,
		async : false,
		success : function(data){
			var mydata = data;
			getDataForDeviceList(mydata);
		}	
	});	
	setTimeout(function(){
		if (globalManageDeviceShow.toLowerCase()=="tooltipdevice"){
			updateLineConnectionIfExist();
		}	
		drawImage();
	},3000);
}

/*
 *
 *  FUNCTION NAME : updateLineConnectionIfExist
 *  AUTHOR        : marlo agapay
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get coresponding line connected object
 *  PARAMETERS    : 
 *
 */
function updateLineConnectionIfExist(){
	var lineSrc = "";
	var lineDes = "";
	if (lineConnected.length!=0){
//		glblDevMenImg
		for (var a=0; a<lineConnected.length; a++){
			var desDev = lineConnected[a].DestinationDevice.ObjectPath;
			var sourceDev = lineConnected[a].SourceDevice.ObjectPath;						
			var srcObj = lineConnected[a].Source;
			var devObj = lineConnected[a].Destination;
			var dev
			if (glblDevMenImg == desDev){
				setLineConnectedAttributes(lineConnected,desDev,"destination",srcObj,devObj);
			}else if (glblDevMenImg == sourceDev){
				setLineConnectedAttributes(lineConnected[a],sourceDev,"source",srcObj,devObj);
			}
		}
	}else{
		return;
	}	
}

/*
 *
 *  FUNCTION NAME : setLineConnectedAttributes
 *  AUTHOR        : marlo agapay
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function setLineConnectedAttributes(lineConnected, devObjPath,lineLocation,srcObj,devObj){
	if (lineLocation =="destination"){
		checkAvPortForConnect(lineConnected.SourceDevice.ObjectPath,devObjPath,lineLocation,srcObj,devObj);
	}else if (lineLocation == "source"){
		checkAvPortForConnect(lineConnected.DestinationDevice.ObjectPath,devObjPath,lineLocation,srcObj,devObj);
	}	
}
/*
 *
 *  FUNCTION NAME : checkAvPortForConnect
 *  AUTHOR        : marlo agapay
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function checkAvPortForConnect(lineConnectedDevice, toConnectDevice,lineLocation,srcObj,devObj){
	var portTempArr = portArr;
	var foundMatch = false;
	for(var a=0; a<portArr.length; a++){
		var dev = portArr[a].ObjectPath.split(".");
		var portDev=dev[0];
		if(portDev == lineConnectedDevice){
			var LCPortName = portArr[a].PortName;
			var LCPortFlag = portArr[a].PortFlag;
			var LCSpeed = portArr[a].Speed;
			var LCPortType = portArr[a].PortType;
			for (var q=0; q<portTempArr.length; q++){
				var TCPortName = portTempArr[q].PortName;
				var TCPortFlag = portTempArr[q].PortFlag;
				var TCSpeed = portTempArr[q].Speed;
				var TCPortType = portTempArr[q].PortType;
				var TCPortFlag = portTempArr[q].PortFlag;
				var portDevName = portTempArr[q].PortDevName.split(".");
				if(LCSpeed == TCSpeed && TCPortType == LCPortType && TCPortFlag ==""){
					UpdateLineConnection(TCPortName,portDevName,lineLocation);
					foundMatch = true;
				}				
			}
		}
	}
	if (foundMatch==false){
		deleteLink(srcObj,devObj);
	}
	
}

/*
 *
 *  FUNCTION NAME : drawOneImage
 *  AUTHOR        : Juvindle C Tina
 *  DATE          : December 11, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : draw image with label
 *  PARAMETERS    : 
 *
 */
function UpdateLineConnection(toInsertPort,portDevName,lineLocation){
	var device = getDeviceObject();
	var devObj = glblDevMenImg+"."+toInsertPort;
	for (var a=0; a<lineConnected.length; a++){
		if(lineConnected[a].SourceDevice.ObjectPath == glblDevMenImg){
			lineConnected[a].Source = devObj;
			lineConnected[a].SourceDevice = device;
		} else if ( lineConnected[a].DestinationDevice == glglDevMenImg){
			lineConnected[a].Destination = devObj;
			lineConnected[a].DestinationDevice = device;
		}
	}
}

/*
 *
 *  FUNCTION NAME : getDeviceObject
 *  AUTHOR        : marlo agapay
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get corresponfding image src
 *  PARAMETERS    : type,manu,model
 *
 */
function getDeviceObject(){
	for(var a=0; a<devicesArr.length; a++){
		if (devicesArr[a].ObjectPath == glblDevMenImg){
			return devicesArr[a];
		}
	}
}
/*
 *
 *  FUNCTION NAME : findImageDevice
 *  AUTHOR        : marlo agapay
 *  DATE          : December 13, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get corresponfding image src
 *  PARAMETERS    : type,manu,model
 *
 */

function findImageDevice(type,manu,model){
	var st = "";
	type = type.toLowerCase();
	manu = manu.toLowerCase();
	model = model.toLowerCase();
	if(type.toLowerCase() == "dut"){
		if(manu == "cisco"){
			var mtch = model.match(/asr/g);
			if(mtch =="" || mtch != "asr"){
				st = '/device/cisco_vivid_blue_40.png';
			}else{							
				st= '/device/asr-1k-40px.png';
			}
		}else if(manu == "ixia"){
			st= '/testtool/ixia-40px.png';
		}
	}else if(type == "testtool"){
		if(manu == "ixia"){
            st= '/testtool/ixia-40px.png';
        }
	}
	return st;
		
}
/*
 *
 *  FUNCTION NAME : deviceMenuPopup
 *  AUTHOR        : Clarice Salanda
 *  DATE          : December 16, 2013 
 *  MODIFIED BY   : Penn G. Ducao
 *  REVISION DATE :	January 8, 2014
 *  REVISION #    : 1
 *  DESCRIPTION   : Update for query function 
 *  PARAMETERS    : 
 *
 */
function deviceMenuPopup(){
	setTimeout(function(){
       	$.mobile.changePage($('#deviceMenuPop'),{
           	transition: "pop",
			changeHash: false
        });
    },1500);
}
/*
 *
 *  FUNCTION NAME : loadFilterDevices()
 *  AUTHOR        : James Turingan
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function loadFilterDevices(){
	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
		data : {
			"action": "getdeviceinfo",
			"query": "user="+globalUserName+"&domainname="+ResourceDomain+"&zone=Default",
		},
		method: 'POST',
        proccessData: false,
        dataType: 'html',
        success: function(data) {
			getDevInfoFilter(data);		
		
		}
	});
}
/*
 *
 *  FUNCTION NAME : getDevInfoFilter()
 *  AUTHOR        : James Turingan
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : xml parsing and stores the data into json
 *  PARAMETERS    : data
 *
 */
var checkLineCard = [];
var checkPort = [];
var checkRoute = [];
function getDevInfoFilter(data){
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(data,'text/xml');
	var DEV = xmlDoc.getElementsByTagName('DEVICE');
	for(var i = 0; i < DEV.length; i++){
		devicesFilter.push({
			Hostname: DEV[i].getAttribute('HostName'),
			OSType: DEV[i].getAttribute('OSType'),		
			OSVersion: DEV[i].getAttribute('OSVersion'),
			SWPackage: DEV[i].getAttribute('SoftwarePackage'),

			SystemName: DEV[i].getAttribute('Model'),
			ProductId: DEV[i].getAttribute('ProductIdentifier'),
			VersionId: DEV[i].getAttribute('VersionId'),
			LineCard:[],		
			Module:[],
			Route:[],
			Embedded:[],
			Port:[]
		});
		setChildDevice(DEV[i],DEV[i].getAttribute('HostName'),parseInt(i)); // Port and LineCard
		setChildDevice2(DEV[i],DEV[i].getAttribute('HostName'),parseInt(i)); // Embedded, Route and Module
	}

}
/*
 *
 *  FUNCTION NAME : setChildDevice()
 *  AUTHOR        : James Turingan
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : stores the data from cgi to json => devicesFilter
 *  PARAMETERS    : DEV,hostname,ctr
 *
 */

function setChildDevice(DEV,hostname,ctr){
	var hname = hostname;
	var device = DEV.childNodes;
	for(var i = 0; i < device.length; i++){
		if(device[i].nodeName == "LINECARD" ){
			var newLC = device[i];
			var LineCardVid = newLC.getAttribute('LineCardVid');
			var ProductId = newLC.getAttribute('ProductIdentifier');
			var name = newLC.getAttribute('Name');
			var num = newLC.getAttribute('Number');
			if(hname = devicesFilter[ctr].Hostname ){
				devicesFilter[ctr].LineCard.push({
					LineCardVid:LineCardVid,
					ProductId: ProductId,
					Name: name,
					Number: num 
				})				
			}
		}
		if(device[i].nodeName == "PORT"){
			var newPort = device[i];
			var band = newPort.getAttribute('Bandwidth');
			var speed = newPort.getAttribute('Speed');
			var name = newPort.getAttribute('PortName');
			var media = newPort.getAttribute('MediaType');
			if(hname = devicesFilter[ctr].Hostname ){
				devicesFilter[ctr].Port.push({
					BandWidth: band,
					Speed: speed,
					PortName: name,
					MediaType: media 
				})				
			}
		}
	}
}
/*
 *
 *  FUNCTION NAME : setChildDevice2()
 *  AUTHOR        : James Turingan
 *  DATE          : December 18, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : stores the data from cgi to json => devicesFilter
 *  PARAMETERS    : DEV,hostname,ctr
 *
 */

function setChildDevice2(DEV,hostname,ctr){
	var hname = hostname;
	var device = DEV.childNodes;
	for(var i = 0; i < device.length; i++){
		if(device[i].nodeName == "MODULE"){
			var newModule = device[i];
			var vId = newModule.getAttribute('ModuleVid');
			var name = newModule.getAttribute('Module');
			var pId = newModule.getAttribute('ModulePid');
			if(hname = devicesFilter[ctr].Hostname ){
				devicesFilter[ctr].Module.push({
					VersionId: vId,
					ProductId: pId,
					ModuleName: name
				})				
			}
		}
		if(device[i].nodeName == "ROUTEPROCESSOR"){
			var newRoute = device[i];
			var versionId = newRoute.getAttribute('RouteProcessorVid');
			var memory = newRoute.getAttribute('TotalMemory');
			var name = newRoute.getAttribute('RouteProcessorName');
			var productId = newRoute.getAttribute('RouteProcessorPid');
			if(hname = devicesFilter[ctr].Hostname){
				devicesFilter[ctr].Route.push({
					VersionId: versionId,
					Memory: memory,
					RouteName: name,
					ProductId: productId 
				})				
			}
		}
		if(device[i].nodeName == "EMBEDDEDPROCESSOR"){
			var newProcessor = device[i];
			var versionId = newProcessor.getAttribute('EmbeddedProcessorVid');
			var name = newProcessor.getAttribute('EmbeddedProcessorName');
			var productId = newProcessor.getAttribute('EmbeddedProcessorVid');
			var nitrox = newProcessor.getAttribute('Nitrox');
			var octeon = newProcessor.getAttribute('Octeon');
			if(hname = devicesFilter[ctr].Hostname ){
				devicesFilter[ctr].Route.push({
					VersionId: versionId,
					Nitrox: nitrox,
					Octeon: octeon,
					EmbeddedName: name,
					ProductId: productId 
				})	
			}
		}

	}
}

/*
 *
 *  FUNCTION NAME : connTypeFilter()
 *  AUTHOR        : James Turingan
 *  DATE          : December 27, 2013 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function connTypeFilter(){
    var val = $('#portTypeTT').val();
	$('tr').show();

    $('tr td.conntype').each(function() {
	    if ($(this).text() != val)
    	{
	    	$(this).parent().hide();
    	}
	});
}
/*
 *
 *  FUNCTION NAME : validationTTList()
 *  AUTHOR        : James Turingan
 *  DATE          : January 2, 2014 
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : validates for the test tool that has no selected ports 
 *  PARAMETERS    : 
 *  First function for this YEAR!! :)
 *
 */

function validationTTList(){
	var msgStr = '';
	var ctr = 0;
	for(var x = 0; x < testToolObj.length; x++){
		if(testToolObj[x].Ports.length == 0){
			ctr++;
			if(ctr == 1){
				msgStr = testToolObj[x].DeviceName;
			}else if(ctr == 2 && x == testToolObj.length){
				msgStr += 'and' + testToolObj[x].DeviceName;
			}else if(ctr > 2){
				if(x == testToolObj.length){
					msgStr += 'and' + testToolObj[x].DeviceName;
				}else{
					msgStr += ',' + testToolObj[x].DeviceName;
				}
			}
		}	
	}
	if(msgStr != ''){
		var msg = msgStr + " has no selected port(s). Do you want to select port(s)?";
		$('#msgAlert').empty().append(msg);
	   	$.mobile.changePage("#warning", {
			transition: "flow",
			reverse: false,
			changeHash: true
		});
	}else{	
		$("#testToolPaletteSubTrList").hide();
		createTestToolObj();
	   	$.mobile.changePage("#configEditorPage", {
			transition: "flow",
			reverse: false,
			changeHash: true
		});
	}

}
function DMdeviceLogs(){
	var url = 'https://'+CURRENT_IP+'/GUI_FinalTheme/php/functions_receiver.php?action=checkresstat&resourceid='

	$.ajax({
		url: url,
		dataType: 'html',
		success: function(data){
		}
	})
}
/*
 *  
 * FUNCTION NAME : showSelectPartnerDevice
 * AUTHOR        : Marlo Agapay
 * DATE          : January 2, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */
function showSelectPartnerDevice(condition){
	var action="";
	var query ="";
	
	var conType = $("#connectType").val();
	if ((conType == null || conType=="" || conType == undefined)&& condition == "connecttype"){
		conType = "Open";
			
	}
	if (condition == "connecttype"){
		query = "type="+conType;
		action = "getpartnerdevices";
	}else if (condition == "showtype"){
		query = "resourceid="+ResourceId;
		action = "getaddpartnerport";
	}else if (condition=="manageconnectivity"){
		var host = $('#partnerHostname').val();
		var slot = $('#slotDropDown').val();
		var conType = $('#connectType').val(); 
		query = "getswitchports";
		action = "hostname="+host+"^"+slot+"^"+conType;
	}

	$.ajax({
        url: "http://"+CURRENT_IP+"/cgi-bin/Final/AutoCompleteCgiQuerry_withDb/querYCgi.fcgi",
        data : {
            "action": action,
            "query": query
        },
        method: 'POST',
        proccessData: false,
        async:false,
        dataType: 'html',
        success: function(data) {
			var aler =	data.match(/Alert:/g);           
			if (aler!= null || aler != undefined){
				alert(data);
			}else{
				if(condition=="connecttype"){
					pushToArrayPartnerDevice(data);
//					changePopUpPartnerDevice(data);				
				}else if (condition == "showtype"){
					addPartnerPort(data);
				}else if (condition == "manageconnectivity"){
					manageConnectivityTable(data);
				}
			}
		}
	});	

}
/*
 *  
 * FUNCTION NAME : pushToArrayPartnerDevice
 * AUTHOR        : Marlo Agapay
 * DATE          : January 2, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */
var globalPartnerArr =[];
function pushToArrayPartnerDevice(data){
	var partnerArr = [];
	var globalPartnerArr = [];
	var parser = new DOMParser();
    var xmlDoc;
    xmlDoc = parser.parseFromString(data , "text/xml" );
    var mConfig = xmlDoc.getElementsByTagName('DEVICES');
	for (var a=0; a<mConfig.length; a++){
		var hostname = mConfig[a].getAttribute("HostName");
		var ipaddress = mConfig[a].getAttribute("IpAddress");
		var slots = mConfig[a].getAttribute("Slots");
		partnerArr.push({HostName: hostname, IpAddress: ipaddress, Slots: slots});
	}
	globalPartnerArr = partnerArr;
	changePopUpPartnerDevice(partnerArr);
}
/*
 *  
 * FUNCTION NAME : changePopUpPartnerDevice
 * AUTHOR        : Marlo Agapay
 * DATE          : January 2, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */

function changePopUpPartnerDevice(partnerArr){
	setTimeout(function(){
		$.mobile.changePage($("#selectPartnerDevDiv"), {
        	transition: "flow",
        	reverse: false,
        	changeHash: false
        });
		var strIp = "<select id='selectIp' onchange='changeSlot()'>";
		var ahost = "";
		var strSlot = "";
		for (var a=0; a<partnerArr.length; a++){
			if (ahost==""){
				ahost = partnerArr[a].HostName;
				strSlot += getListSlot(partnerArr[a].Slots);
			}
			strIp+="";
			strIp+="<option value='"+partnerArr[a].IpAddress+"'>"+partnerArr[a].IpAddress+"</option>";
		}
		strIp+="</select>";
		$('#partnerIpAddress').empty().append(strIp);
		$('#partnerHostname').empty().append(ahost);
		$('#slotDropDown').empty().append(strSlot);
		$("#selectPartnerDevDiv").trigger("create");
	},1500);
}
/*
 *  
 * FUNCTION NAME : getListSlot
 * AUTHOR        : Marlo Agapay
 * DATE          : January 2, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */

function getListSlot(slt){
	var slot = slt.split(",");
	var str = "<select id='selectSlot' >";
	for(var a=0; a<slot.length; a++){
		str += "<option value='"+slot[a]+"'>"+slot[a]+"</option";
	}		
	str +="</select>";
	return str;
}
/*
 *  
 * FUNCTION NAME : addPartnerPort
 * AUTHOR        : Marlo Agapay
 * DATE          : January 2, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */

function addPartnerPort(data){
	setTimeout(function(){
		$.mobile.changePage($("#connectTypeDiv"), {
        	transition: "flow",
        	reverse: false,
        	changeHash: false
        });

		var parser = new DOMParser();
	    var xmlDoc;
	    xmlDoc = parser.parseFromString(data , "text/xml" );
   		var mConfig = xmlDoc.getElementsByTagName('DEVICE');
		var str = "<SELECT id='connectType' >";
		for(var a=0; a<mConfig.length; a++){
			var type = mConfig[a].getAttribute("Type");			
			str +="<option value='"+type+"'>"+type+"</option>";
		}
		str+="</SELECT>";
		$("#appendConnectype").empty().append(str);
		$("#connectTypeDiv").trigger("create");
	},1500);
}

/*
 *  
 * FUNCTION NAME : changeSlot
 * AUTHOR        : Marlo Agapay
 * DATE          : January 3, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */
function changeSlot(){
	var ip=$('#selectIp').val();	
//	var strIp = "<select id='selectIp' onchange='changeSlot()'>";
	var ahost = "";
	var strSlot = "";
	for (var a=0; a<globalPartnerArr.length; a++){
		if (globalPartnerArr[a].IpAddress == ip){
			ahost = globalPartnerArr[a].HostName;
			strSlot += getListSlot(globalPartnerArr[a].Slots);
		}
	}
	$('#partnerHostname').empty().append(ahost);
	$('#slotDropDown').empty().append(strSlot);
	$("#selectPartnerDevDiv").trigger("create");
}

/*
 *  
 * FUNCTION NAME : pushToArrayPartnerDevice
 * AUTHOR        : Marlo Agapay
 * DATE          : January 2, 2014
 * MODIFIED BY   :
 * REVISION DATE :
 * REVISION #    :
 * DESCRIPTION   : 
 * PARAMETERS    :
 * 
 */
function manageConnectivityTable(data){
/*
    setTimeout(function(){
    	$.mobile.changePage($('#manageConnectionDiv'),{
    		transition: "pop"
    	});
		$('#deviceLeft').append('<li><a href="#">sada</a></li> ');
		$('#deviceLeft').listview('refresh');	
		$('#deviceRight').append('<li>sada</li><li>2</li><li>2</li> ');
		$('#deviceRight').listview('refresh');	
//$(document).ready(function() {	
	$('li').removeClass('ui-corner-bottom');
    $('ul')
        .addClass('ui-corner-top')
        .removeClass('ui-corner-all')
        .sortable({
            'containment': 'parent',
            'opacity': 0.6,
            update: function(event, ui) {
                alert("dropped");
            }
        });
//});
    },1500);
*/	


	var parser = new DOMParser();
    var xmlDoc;
    xmlDoc = parser.parseFromString(data , "text/xml" );
    var mConfig = xmlDoc.getElementsByTagName('PORT');
	var managePortArr = [];
	for (var a=0; a<mConfig.length; a++){
		var portid  = mConfig[a].getAttribute("PortId");
		var number = mConfig[a].getAttribute("Number");
		var portname = mConfig[a].getAttribute("PortName");
		var porttype = mConfig[a].getAttribute("PortType");
		var partnerport = mConfig[a].getAttribute("PartnerPort");
		var tunnel = mConfig[a].getAttribute("TunnelServicePIC");
	}
}
/*
 *
 *  FUNCTION NAME : ipv4PopUp
 *  AUTHOR        : James Turingan
 *  DATE          : January 2, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function ipv4PopUp(){
	if((globalIPV4Flag == false && globalApplyAll == "deactive") || globalApplyAll == "deactive" ){
		return false
	}
    $.mobile.changePage($("#applyAllPop"),{
	    transition: "pop",
        changeHash : false
    });

}
/*
 *
 *  FUNCTION NAME : sanityQuery
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function sanityQuery(type){
	loading("show","Processing information...");
	var ctr = 0;
	var url2= "/cgi-bin/Final/AutoCompletePythonCGI/FastQueryCgi.py?";
	var query = "action=checkdevicestatus&query=resourceid="+ResourceId+"^user="+globalUserName+"^feature="+type+"^result=true";
	var url = "http://"+CURRENT_IP+url2+query;
	$.ajax({
        url: url,
        dataType: 'html',
		proccessData: false,
        success: function(data) {
			data = $.trim(data);
			if(type == 'connectivity' && SanityFlag == true){
				connSanityData(data);
			}else if(type == 'accessSanity' && SanityFlag == true){
				accSanityData(data);
			}else if(type == 'linksanity' && SanityFlag == true){
				linkSanityData(data);
			}else if(type == 'enableint' && SanityFlag == true){
				enableSanityData(data);
			}else if(type == 'deviceSanity' && SanityFlag == true){
				devSanityData(data);
			}			

			if(data != ""){
	            loading("hide");
			}else if(data == "Alert: Reservation time is not active. Please try again later."){
				$("#OkPopUpHeader2").html("<center><h4>Notification</h4></center>");
				$("#OkPopUpInfo2").html(data);
				TimeOut = setTimeout(function(){
					okPopupFunc('dialog');
				},3000);

			}
			

		}
	});

}
/*
 *
 *  FUNCTION NAME : devSanityData
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function devSanityData(data){
	var mydata = data;
	var parser = new DOMParser();
    var xmlDoc;
	xmlDoc = parser.parseFromString( mydata , "text/xml" );
    var row = xmlDoc.getElementsByTagName('MAINCONFIG');
    var uptable = xmlDoc.getElementsByTagName('DEVICE');
    var lowtable = xmlDoc.getElementsByTagName('STATUS');
	var devStat='';
	var devSanityStat='';
	if(row.length != 0){
		devSanXML(uptable,lowtable);
		return
	}
	for(var i = 0; i < devicesArr.length; i++){
		devStat+="<tr>";
		devStat+="<td>"+devicesArr[i].HostName+"</td>";
		devStat+="<td>"+devicesArr[i].ManagementIp+"</td>";
		devStat+="<td>"+devicesArr[i].ConsoleIp+"</td>";
		devStat+="<td>"+devicesArr[i].Manufacturer+"</td>";
		devStat+="<td>"+devicesArr[i].Model+"</td>";
		devStat+="<td>Init</td>";
		devStat+="<td>Waiting..</td>";
		devStat+="<td>Waiting..</td>";
		devStat+="<td>Waiting..</td>";
		devStat+="</tr>";
//2nd Table of Device Sanity
		devSanityStat+="<tr>";
		devSanityStat+="<td></td>";
		devSanityStat+="<td>"+devicesArr[i].HostName+"</td>";
		devSanityStat+="<td>"+devicesArr[i].ManagementIp+"</td>";
		devSanityStat+="<td>"+devicesArr[i].ConsoleIp+"</td>";
		devSanityStat+="<td>"+devicesArr[i].Manufacturer+"</td>";
		devSanityStat+="<td>Init</td>";
		devSanityStat+="<td>Waiting..</td>";
		devSanityStat+="</tr>";

	}
	$("#devSanTableStat > tbody").empty().append(devSanityStat);
	$("#devSanTableStat").table("refresh");
	$("#devSanTable > tbody").empty().append(devStat);
	$("#devSanTable").table("refresh");
	$('#devTotalNo').empty().append(devicesArr.length);
	setTimeout(function(){
		sanityQuery('deviceSanity');
	},6000);
}
/*
 *
 *  FUNCTION NAME : devSanXML
 *  AUTHOR        : James Turingan
 *  DATE          : January 4, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function devSanXML(uptable,lowtable){
	var devStat='';
	var devSanityStat='';
	var counter = 0;
	counter = 0;
	for(var i = 0; i < uptable.length; i++){
		devStat+="<tr>";
		devStat+="<td>"+uptable[i].getAttribute('HostName')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('ManagementIP')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('ConsoleIP')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('Manufacturer')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('Model')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('Login')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('HostNameVerification')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('ManagementIPVerification')+"</td>";
		devStat+="<td>"+uptable[i].getAttribute('ShowCommands')+"</td>";
		devStat+="</tr>";
		if(uptable[i].getAttribute('ShowCommands').toLowerCase() == 'waiting'){
			SanityFlag = true;
			counter++;
		}else if(AccessSanity == "true" && uptable[i].getAttribute('ShowCommands').toLowerCase() != 'waiting'){
		}

	}
	if(counter > 0){
		$('#liDevSan a').trigger('click');	
	}else if(counter == 0 && AccessSanity == "true" && accSanFlag == false){
		$('#liAccSan a').trigger('click');	
		accSanFlag = true;
	}else if(counter == 0 && Connectivity == "true" && connSanFlag == false){
		$('#liConn a').trigger('click');	
		connSanFlag = true;
	}else if(counter == 0 && ConnectivityFlag == "yes" && linkSanFlag == false){
		$('#liLinkSan a').trigger('click');	
		linkSanFlag = true;
	}else if(counter == 0 && enablePort == true && enableSanFlag == false){
		$('#liEnaInt a').trigger('click');	
	}

//2nd Table of Device Sanity
	for(var i = 0; i < lowtable.length; i++){
		devSanityStat+="<tr>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('TimeStamp')+"</td>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('HostName')+"</td>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('ManagementIP')+"</td>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('ManagementInterface')+"</td>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('OSVersion')+"</td>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('State')+"</td>";
		devSanityStat+="<td>"+lowtable[i].getAttribute('Status')+"</td>";
		devSanityStat+="</tr>";
	}
	$("#devSanTableStat > tbody").empty().append(devSanityStat);
	$("#devSanTableStat").table("refresh");
	$("#devSanTable > tbody").empty().append(devStat);
	$("#devSanTable").table("refresh");
	$('#devTotalNo').empty().append(devicesArr.length);

}

/*
 *
 *  FUNCTION NAME : accSanityData
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function accSanityData(data){
	var accStat='';
	var accSanityStat='';
	var mydata = data;
	var parser = new DOMParser();
    var xmlDoc;
	xmlDoc = parser.parseFromString( mydata , "text/xml" );
    var row = xmlDoc.getElementsByTagName('MAINCONFIG');
    var uptable = xmlDoc.getElementsByTagName('DEVICE');
    var lowtable = xmlDoc.getElementsByTagName('STATUS');
	var devStat='';
	var devSanityStat='';
	if(row.length != 0){
		clearTimeout(TimeOut);	
		accSanXML(uptable,lowtable);
		return
	}

	for(var i = 0; i < devicesArr.length; i++){
		accStat+="<tr>";
		accStat+="<td>"+devicesArr[i].HostName+"</td>";
		accStat+="<td></td>";
		accStat+="<td>"+devicesArr[i].ConsoleIp+"</td>";
		accStat+="<td>"+devicesArr[i].ManagementIp+"</td>";
		accStat+="<td></td>";
		accStat+="</tr>";
//2nd Table of Device Sanity
		accSanityStat+="<tr>";
		accSanityStat+="<td></td>";
		accSanityStat+="<td>"+devicesArr[i].HostName+"</td>";
		accSanityStat+="<td>Console IP</td>";
		accSanityStat+="<td>"+devicesArr[i].IpAddress+"</td>";
		accSanityStat+="<td></td>";
		accSanityStat+="<td></td>";
		accSanityStat+="<td></td>";
		accSanityStat+="</tr>";

	}
	$("#accSanTableStat > tbody").empty().append(accSanityStat);
	$("#accSanTableStat").table("refresh");
	$("#accSanTable > tbody").empty().append(accStat);
	$("#accSanTable").table("refresh");
	$('#accTotalNo').empty().append(devicesArr.length);
	
	TimeOut = setTimeout(function(){
		sanityQuery('accessSanity');
	},6000);
}
/*
 *
 *  FUNCTION NAME : accSanXML
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function accSanXML(uptable,lowtable){
	var accStat='';
	var accSanityStat='';
	var counter = 0;
	counter =0;
	for(var i = 0; i < uptable.length; i++){
		accStat+="<tr>";
		accStat+="<td>"+uptable[i].getAttribute('HostName')+"</td>";
		accStat+="<td>"+uptable[i].getAttribute('ConsoleIp1')+"</td>";
		accStat+="<td>"+uptable[i].getAttribute('ConsoleIp2')+"</td>";
		accStat+="<td>"+uptable[i].getAttribute('ManagementIp')+"</td>";
		accStat+="<td>"+uptable[i].getAttribute('Login')+"</td>";
		accStat+="</tr>";
		if(uptable[i].getAttribute('Login') != 'Ongoing' && Connectivity == "false" && ConnectivityFlag == "no" && enablePort == false){
			clearTimeout(TimeOut);	
			SanityFlag = false;
		}else if(uptable[i].getAttribute('Login') == 'Ongoing'){
			counter++;
			SanityFlag = true;

		}
	}
	if(counter > 0){
		$('#liAccSan a').trigger('click');	
	}else if(Connectivity == "true" && counter == 0 && connSanFlag == false){
		$('#liConn a').trigger('click');	
		connSanFlag = true;
	}else if(ConnectivityFlag == "yes" && counter == 0 && linkSanFlag == false){
		linkSanFlag = true;
		$('#liLinkSan a').trigger('click');	
	}else if(enablePort== true && counter == 0 && enableFlagSan == false){
		$('#liEnaInt a').trigger('click');	
	}
	for(var i = 0; i < lowtable.length; i++){
//2nd Table of Device Sanity
		accSanityStat+="<tr>";	
		accSanityStat+="<td>"+lowtable[i].getAttribute('TimeStamp')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('HostName')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('AccessType')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('IpAddress')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('Status1')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('Status2')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('Status3')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('State')+"</td>";
		accSanityStat+="<td>"+lowtable[i].getAttribute('Status')+"</td>";
		accSanityStat+="</tr>";

	}

	$("#accSanTableStat > tbody").empty().append(accSanityStat);
	$("#accSanTableStat").table("refresh");
	$("#accSanTable > tbody").empty().append(accStat);
	$("#accSanTable").table("refresh");
	$('#accTotalNo').empty().append(devicesArr.length);


}
/*
 *
 *  FUNCTION NAME : connSanityData
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function connSanityData(data){
	var connStat='';
	var connSanityStat='';	
	var mydata = data;
	var parser = new DOMParser();
    var xmlDoc;
	xmlDoc = parser.parseFromString( mydata , "text/xml" );
    var row = xmlDoc.getElementsByTagName('MAINCONFIG');
    var uptable = xmlDoc.getElementsByTagName('DEVICE');
    var lowtable = xmlDoc.getElementsByTagName('STATUS');	 
	if(row.length != 0){
		clearTimeout(TimeOut);	
		connSanXML(uptable,lowtable);
		return 0;
	}


	for(var i = 0; i < devicesArr.length; i++){
		connStat+="<tr>";
		connStat+="<td>"+devicesArr[i].HostName+"</td>";
		connStat+="<td>"+devicesArr[i].ManagementIp+"</td>";
		connStat+="<td>"+devicesArr[i].ConsoleIp+"</td>";
		connStat+="<td>"+devicesArr[i].Manufacturer+"</td>";
		connStat+="<td>"+devicesArr[i].Model+"</td>";
		connStat+="<td>Init</td>";
		connStat+="</tr>";
	}
//2nd Table of Device Sanity
	for(var y = 0; y < lineConnected.length; y++){
		for(var x = 0 ; x < portArr.length; x++){
			if(lineConnected[y].Source == portArr[x].ObjectPath && portArr[x].SwitchInfo != ""){
				connSanityStat+="<tr>";
				connSanityStat+="<td>"+lineConnected[y].SourceDevice.DeviceName+"</td>";
				connSanityStat+="<td>"+portArr[x].PortName+"</td>";
				var dataArr2 = portArr[x].SwitchInfo.split('^');
				if(dataArr2.length == 5){
					var ind2 = dataArr2.length - 2;
					connSanityStat+="<td>"+dataArr2[ind2]+"</td>";
				}else{
					var ind2 = dataArr2.length - 1;
					connSanityStat+="<td>"+dataArr2[ind2]+"</td>";
				}
				connSanityStat+="<td></td>";
				
			}
			if(lineConnected[y].Destination == portArr[x].ObjectPath && portArr[x].SwitchInfo != ""){
				connSanityStat+="<td>"+lineConnected[y].DestinationDevice.DeviceName+"</td>";
				connSanityStat+="<td>"+portArr[x].PortName+"</td>";
				var dataArr = portArr[x].SwitchInfo.split('^');
				if(dataArr.length == 5){
					var ind = dataArr.length - 2;
					connSanityStat+="<td>"+dataArr[ind]+"</td>";
				}else{
					var ind = dataArr.length - 1;
					connSanityStat+="<td>"+dataArr[ind]+"</td>";
				}
				connSanityStat+="<td></td>";
				
				connSanityStat+="</tr>";
			}

		}

	}
	$("#connSanityTableStat > tbody").empty().append(connSanityStat);
	$("#connSanityTableStat").table("refresh");
	$("#connSanityTable > tbody").empty().append(connStat);
	$("#connSanityTable").table("refresh");
	$('#connTotalNo').empty().append(devicesArr.length);

	TimeOut = setTimeout(function(){
		sanityQuery('connectivity');
	},6000);
}
/*
 *
 *  FUNCTION NAME : connSanXML
 *  AUTHOR        : James Turingan
 *  DATE          : January 7, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function connSanXML(uptable,lowtable){
	var connStat='';
	var connSanityStat='';
	var counter = 0;
	counter = 0;
	for(var i = 0; i < uptable.length; i++){
		connStat+="<tr>";
		connStat+="<td>"+uptable[i].getAttribute('HostName')+"</td>";
		connStat+="<td>"+uptable[i].getAttribute('ManagementIp')+"</td>";
		connStat+="<td>"+uptable[i].getAttribute('ConsoleIp')+"</td>";
		connStat+="<td>"+uptable[i].getAttribute('Manufacturer')+"</td>";
		connStat+="<td>"+uptable[i].getAttribute('Model')+"</td>";
		connStat+="<td>"+uptable[i].getAttribute('PortMapping')+"</td>";
		connStat+="</tr>";
		if(uptable[i].getAttribute('PortMapping') != '' && ConnectivityFlag == "no" && enablePort == false){
			clearTimeout(TimeOut);	
			SanityFlag = false;
		}else if(uptable[i].getAttribute('PortMapping') == 'Init' || uptable[i].getAttribute('PortMapping') == "Waiting"){
			clearTimeout(TimeOut);	
			SanityFlag = true;
			counter++;	
		}

	}
	if(counter > 0){
		$('#liConn a').trigger('click');	
	}else if(counter == 0 && ConnectivityFlag == "yes" && linkSanFlag == false){
		$('#liLinkSan a').trigger('click');	
		linkSanFlag = true;
	}else if(counter == 0 && enablePort == true && enableSanFlag == false){
		$('#liEnaInt a').trigger('click');	
//		enableSanFlag = true;
	}
	for(var i = 0; i < lowtable.length; i++){
//2nd Table of Device Sanity
		connSanityStat+="<tr>";	
		connSanityStat+="<td>"+lowtable[i].getAttribute('TimeStamp')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('SrcDevName')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortName')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('SrcSwitchPort')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortStatus')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('DstDevName')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('DstPortName')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('DstSwitchPort')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('DstPortStatus')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('SwitchHostName')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('ConnectivityType')+"</td>";
		connSanityStat+="<td>"+lowtable[i].getAttribute('Status')+"</td>";
		connSanityStat+="</tr>";

	}

	$("#connSanityTableStat > tbody").empty().append(connSanityStat);
	$("#connSanityTableStat").table("refresh");
	$("#connSanityTable > tbody").empty().append(connStat);
	$("#connSanityTable").table("refresh");
	$('#connTotalNo').empty().append(devicesArr.length);


}
/*
 *
 *  FUNCTION NAME : linkSanityData
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function linkSanityData(data){
	var linkStat='';
	var linkSanityStat='';	
	var mydata = data;
	var parser = new DOMParser();
    var xmlDoc;
	xmlDoc = parser.parseFromString( mydata , "text/xml" );
    var row = xmlDoc.getElementsByTagName('MAINCONFIG');
    var uptable = xmlDoc.getElementsByTagName('DEVICE');
    var lowtable = xmlDoc.getElementsByTagName('STATUS');	 
	if(row.length != 0){
		clearTimeout(TimeOut);	
		linkSanXML(uptable,lowtable);
		return
	}

	for(var i = 0; i < devicesArr.length; i++){
		linkStat+="<tr>";
		linkStat+="<td>"+devicesArr[i].HostName+"</td>";
		linkStat+="<td>"+devicesArr[i].ManagementIp+"</td>";
		linkStat+="<td>"+devicesArr[i].ConsoleIp+"</td>";
		linkStat+="<td>"+devicesArr[i].Manufacturer+"</td>";
		linkStat+="<td>"+devicesArr[i].Model+"</td>";
		linkStat+="<td>Init</td>";
		linkStat+="<td>Init</td>";
		linkStat+="<td>Init</td>";
		linkStat+="</tr>";
	}
//2nd Table of Device Sanity
	for(var y = 0; y < lineConnected.length; y++){
		for(var x = 0 ; x < portArr.length; x++){
			if(lineConnected[y].Source == portArr[x].ObjectPath && portArr[x].SwitchInfo != ""){
				linkSanityStat+="<tr>";
				linkSanityStat+="<td></td>";
				linkSanityStat+="<td>"+lineConnected[y].SourceDevice.DeviceName+"</td>";
				linkSanityStat+="<td>"+portArr[x].PortName+"</td>";
				linkSanityStat+="<td>IP</td>";
				var dataArr2 = portArr[x].SwitchInfo.split('^');
				if(dataArr2.length == 5){
					var ind2 = dataArr2.length - 2;
					linkSanityStat+="<td>"+dataArr2[ind2]+"</td>";
				}else{
					var ind2 = dataArr2.length - 1;
					linkSanityStat+="<td>"+dataArr2[ind2]+"</td>";
				}
				linkSanityStat+="<td></td>";
			}
			if(lineConnected[y].Destination == portArr[x].ObjectPath && portArr[x].SwitchInfo != ""){
				linkSanityStat+="<td>"+lineConnected[y].SourceDevice.DeviceName+"</td>";
				linkSanityStat+="<td>"+lineConnected[y].DestinationDevice.DeviceName+"</td>";
				linkSanityStat+="<td>"+portArr[x].PortName+"</td>";
				linkSanityStat+="<td>IP</td>";
				var dataArr = portArr[x].SwitchInfo.split('^');
				if(dataArr.length == 5){
					var ind = dataArr.length - 2;
					linkSanityStat+="<td>"+dataArr[ind]+"</td>";
				}else{
					var ind = dataArr.length - 1;
					linkSanityStat+="<td>"+dataArr[ind]+"</td>";
				}
				linkSanityStat+="<td></td>";
				linkSanityStat+="<td></td>";
				linkSanityStat+="<td></td>";
				linkSanityStat+="<td></td>";
				linkSanityStat+="<td></td>";
				
				linkSanityStat+="</tr>";
			}

		}

	}
	$("#linkSanityTableStat > tbody").empty().append(linkSanityStat);
	$("#linkSanityTableStat").table("refresh");
	$("#linkSanityTable > tbody").empty().append(linkStat);
	$("#linkSanityTable").table("refresh");
	$('#linkTotalNo').empty().append(devicesArr.length);

	TimeOut = setTimeout(function(){
		sanityQuery('linksanity');
	},6000);
}
/*
 *
 *  FUNCTION NAME : linkSanXML
 *  AUTHOR        : James Turingan
 *  DATE          : January 7, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function linkSanXML(uptable,lowtable){
	var linkStat='';
	var linkSanityStat='';
	var counter = 0;
	counter = 0;

	for(var i = 0; i < uptable.length; i++){
		linkStat+="<tr>";
		linkStat+="<td>"+uptable[i].getAttribute('HostName')+"</td>";
		linkStat+="<td>"+uptable[i].getAttribute('ManagementIp')+"</td>";
		for(var x = 0; x < devicesArr.length; x++){
			if(uptable[i].getAttribute('HostName') == devicesArr[x].HostName){
				linkStat+="<td>"+devicesArr[x].ConsoleIp+"</td>";
				linkStat+="<td>"+devicesArr[x].Manufacturer+"</td>";
				linkStat+="<td>"+devicesArr[x].Model+"</td>";
			}
		}
		//linkStat+="<td>"+uptable[i].getAttribute('ConsoleIp')+"</td>";
		//linkStat+="<td>"+uptable[i].getAttribute('Manufacturer')+"</td>";
		//linkStat+="<td>"+uptable[i].getAttribute('Model')+"</td>";
		linkStat+="<td>"+uptable[i].getAttribute('Configuration')+"</td>";
		linkStat+="<td>"+uptable[i].getAttribute('LearningPackets')+"</td>";
		linkStat+="<td>"+uptable[i].getAttribute('ForwardingTest')+"</td>";
		linkStat+="</tr>";
		if(uptable[i].getAttribute('ForwardingTest') != 'Waiting' && ConnectivityFlag == "no" && enablePort == false){
			clearTimeout(TimeOut);	
			SanityFlag = false;
		}else if(uptable[i].getAttribute('ForwardingTest') == 'Waiting'){
			clearTimeout(TimeOut);	
			SanityFlag = true;
			counter++;
		}
	}
	if(counter > 0){
		 $('#liLinkSan a').trigger('click');
	}else if(counter == 0 && enablePort == true && enableSanFlag == false){
//		enableSanFlag = true;
		$('#liEnaInt a').trigger('click');	

	}
	for(var i = 0; i < lowtable.length; i++){
//2nd Table of Device Sanity
		linkSanityStat+="<tr>";	
		linkSanityStat+="<td>"+lowtable[i].getAttribute('TimeStamp')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('SrcDevName')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortName')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortIpAdress')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortStatus')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('DstDevName')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('DstPortName')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('DstPortIpAdress')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('DstPortStatus')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('State')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('Receive')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('Transmit')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('MinAveMax')+"</td>";
		linkSanityStat+="<td>"+lowtable[i].getAttribute('Status')+"</td>";
		linkSanityStat+="</tr>";
	}
	$("#linkSanityTableStat > tbody").empty().append(linkSanityStat);
	$("#linkSanityTableStat").table("refresh");
	$("#linkSanityTable > tbody").empty().append(linkStat);
	$("#linkSanityTable").table("refresh");
	$('#linkTotalNo').empty().append(devicesArr.length);
}
/*
 *
 *  FUNCTION NAME : enableSanityData
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function enableSanityData(data){
	var enableStat='';
	var enableSanityStat='';	
	var mydata = data;
	var parser = new DOMParser();
    var xmlDoc;
	xmlDoc = parser.parseFromString( mydata , "text/xml" );
    var row = xmlDoc.getElementsByTagName('MAINCONFIG');
    var uptable = xmlDoc.getElementsByTagName('DEVICE');
    var lowtable = xmlDoc.getElementsByTagName('STATUS');	 
	if(row.length != 0){
		clearTimeout(TimeOut);	
		enableSanXML(uptable,lowtable);
		return
	}


	for(var i = 0; i < devicesArr.length; i++){
		enableStat+="<tr>";
		enableStat+="<td>"+devicesArr[i].HostName+"</td>";
		enableStat+="<td>"+devicesArr[i].ManagementIp+"</td>";
		enableStat+="<td>"+devicesArr[i].ConsoleIp+"</td>";
		enableStat+="<td>"+devicesArr[i].Manufacturer+"</td>";
		enableStat+="<td>"+devicesArr[i].Model+"</td>";
		enableStat+="<td>Init</td>";
		enableStat+="<td>Init</td>";
		enableStat+="<td>Init</td>";
		enableStat+="</tr>";
	}
//2nd Table of Device Sanity
	for(var y = 0; y < lineConnected.length; y++){
		for(var x = 0 ; x < portArr.length; x++){
			if(lineConnected[y].Source == portArr[x].ObjectPath && portArr[x].SwitchInfo != ""){
				enableSanityStat+="<tr>";
				enableSanityStat+="";
				enableSanityStat+="<td>"+lineConnected[y].SourceDevice.DeviceName+"</td>";
				enableSanityStat+="<td>"+portArr[x].PortName+"</td>";
				enableSanityStat+="<td>IP</td>";
				var dataArr2 = portArr[x].SwitchInfo.split('^');
				if(dataArr2.length == 5){
					var ind2 = dataArr2.length - 2;
					enableSanityStat+="<td>"+dataArr2[ind2]+"</td>";
				}else{
					var ind2 = dataArr2.length - 1;
					enableSanityStat+="<td>"+dataArr2[ind2]+"</td>";
				}
				enableSanityStat+="<td></td>";
				enableSanityStat+="</tr>";

				
			}
			if(lineConnected[y].Destination == portArr[x].ObjectPath && portArr[x].SwitchInfo != ""){
				enableSanityStat+="<tr>";
				enableSanityStat+="";
				enableSanityStat+="<td>"+lineConnected[y].DestinationDevice.DeviceName+"</td>";
				enableSanityStat+="<td>"+portArr[x].PortName+"</td>";
				enableSanityStat+="<td>IP</td>";
				var dataArr = portArr[x].SwitchInfo.split('^');
				if(dataArr.length == 5){
					var ind = dataArr.length - 2;
					enableSanityStat+="<td>"+dataArr[ind]+"</td>";
				}else{
					var ind = dataArr.length - 1;
					enableSanityStat+="<td>"+dataArr[ind]+"</td>";
				}
				enableSanityStat+="<td></td>";
				enableSanityStat+="<td></td>";
				enableSanityStat+="<td></td>";
				enableSanityStat+="<td></td>";
				enableSanityStat+="<td></td>";
				
				enableSanityStat+="</tr>";
			}

		}

	}
	$("#enaSanityTableStat > tbody").empty().append(enableSanityStat);
	$("#enaSanityTableStat").table("refresh");
	$("#enaSanityTable > tbody").empty().append(enableStat);
	$("#enaSanityTable").table("refresh");
	$('#enableTotalNo').empty().append(devicesArr.length);
	TimeOut = setTimeout(function(){
		sanityQuery('enableint');
	},6000);
}
/*
 *
 *  FUNCTION NAME : enableSanXML
 *  AUTHOR        : James Turingan
 *  DATE          : January 7, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function enableSanXML(uptable,lowtable){
	var enableStat='';
	var enableSanityStat='';
	var counter = 0;
	counter = 0;

	for(var i = 0; i < uptable.length; i++){
		enableStat+="<tr>";
		enableStat+="<td>"+uptable[i].getAttribute('HostName')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('ManagementIP')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('ConsoleIP')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('Manufacturer')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('Model')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('Login')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('EnableInterface')+"</td>";
		enableStat+="<td>"+uptable[i].getAttribute('Verification')+"</td>";
		enableStat+="</tr>";
		if(uptable[i].getAttribute('Verification') == 'Waiting'){
			clearTimeout(TimeOut);	
			SanityFlag =true;
			counter++;	
		}
	}
	if(counter > 0){
		sanityQuery('enableint');
	}else if(counter == 0 && enableSanFlag == false){
		enableSanFlag = true;
		$('#liDevSan a').trigger('click');	

	}
	for(var i = 0; i < lowtable.length; i++){
//2nd Table of Device Sanity
		enableSanityStat+="<tr>";	
		enableSanityStat+="<td>"+lowtable[i].getAttribute('TimeStamp')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('SrcDevName')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortName')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('SrcAdminStatus')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('SrcPortStatus')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('SrcSpeed')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('SrcMediaType')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('DstDevName')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('DstPortName')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('DstAdminStatus')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('DstPortStatus')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('DstSpeed')+"</td>";
		enableSanityStat+="<td>"+lowtable[i].getAttribute('DstMediaType')+"</td>";
		enableSanityStat+="</tr>";

	}
	$("#enaSanityTableStat > tbody").empty().append(enableSanityStat);
	$("#enaSanityTableStat").table("refresh");
	$("#enaSanityTable > tbody").empty().append(enableStat);
	$("#enaSanityTable").table("refresh");
	$('#enableTotalNo').empty().append(devicesArr.length);
}


/*
 *
 *  FUNCTION NAME : fetchPortForManageConnectivity
 *  AUTHOR        : marlo agapay
 *  DATE          : January 6, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : get all available ports connected and available on the on the line 
 *  PARAMETERS    : lineId
 *
 */
var managePortArr = [];
function fetchPortForManageConnectivity(lineId){
	managePortArr = [];
	var line = lineId.split("||");
	var des = line[0];
	var destSplit = des.split(".");
	var sor = line[1];
	var sorSplit = sor.split(".");
	var destinationDevice = destSplit[0];
	var sourceDevice = sorSplit[0];
	for (var a=0; a<portArr.length; a++){
		var ob = portArr[a].ObjectPath;		
		var portObj = ob.split(".");
		var portDev = portObj[0];
		if (portDev == destinationDevice || portDev==sourceDevice){
			var position = "";
			if (portDev == destinationDevice)
				position = "right";
			if (portDev == sourceDevice)
				position = "left";

			managePortArr.push({DevicePortObject : portDev, ObjectPath: portArr[a].ObjectPath, PortName: portArr[a].PortName, Description: portArr[a].Description, PortType : portArr[a].PortType, Position: position});
		}	
	}
	if (managePortArr.length != 0){
		appendListToTable(managePortArr,lineId,destinationDevice,sourceDevice);
	}
}


/*
 *
 *  FUNCTION NAME : appendListToTable
 *  AUTHOR        : marlo agapay
 *  DATE          : January 6, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : append dynamic list to table
 *  PARAMETERS    : mPortArr
 *
 */
function  appendListToTable(mPortArr,lineId,destinationDevice,sourceDevice){	
	setTimeout(function(){
		$(document).on('pagebeforeshow', '#manageConnectionDiv', function (e, ui) {
    	    $('#manageConnectionDiv div[role="dialog"]').css({"max-width":"60%"});
    	    $('ul').css({"max-width":"350px"});
    	});
    	$.mobile.changePage($('#manageConnectionDiv'),{
    		transition: "pop"
    	});
		gstrLeft = "";
		gstrRight = "";
		gstrCenter ="";
		var listTypeLeft = [];
		var listTypeRight = [];
		for(var a =0; a < mPortArr.length; a++){
			if(destinationDevice == mPortArr[a].DevicePortObject){
				gstrRight+= "<li data-name='"+mPortArr[a].ObjectPath+"' portType='"+mPortArr[a].PortType+"' >"+mPortArr[a].PortType+"-"+mPortArr[a].PortName+"("+mPortArr[a].Description+")</li>";
				if($.inArray(mPortArr[a].PortType,listTypeRight) == -1){
					listTypeRight.push(mPortArr[a].PortType);
				}
			}
			else if (sourceDevice == mPortArr[a].DevicePortObject){
				gstrCenter +="<li>&#8594; &#x2192;</li>";
				gstrLeft += "<li data-name='"+mPortArr[a].ObjectPath+"' portType='"+mPortArr[a].PortType+"'> <a href='#'>"+mPortArr[a].PortType+"-"+mPortArr[a].PortName+"("+mPortArr[a].Description+")</a></li>";	

				if($.inArray(mPortArr[a].PortType,listTypeLeft) == -1){
					listTypeLeft.push(mPortArr[a].PortType);
				}
			}
		}
		$('#deviceCenter').empty().append(gstrCenter);
		$('#deviceCenter').listview('refresh');	
		$('#deviceLeft').empty().append(gstrLeft);
		$('#deviceLeft').listview('refresh');	
		$('#deviceRight').empty().append(gstrRight);
		$('#deviceRight').listview('refresh');	
		$('#spanDeviceLeft').empty().append(sourceDevice);
		$('#spanDeviceRight').empty().append(destinationDevice);
		/* FOR DYNAMIC LIST SELECTION OF DEVICE TYPE */ 
		var strlistL = "<select id='selectLeftType'><option value='all'>all</option>";
		var strlistR = "<select id='selectRightType'><option value='all'>all</option>";	
		for(var q=0; q<listTypeLeft.length; q++){
			strlistL += "<option value='"+listTypeLeft[q]+"' >"+listTypeLeft[q]+"</option>";			
		}
		strlistL +="</select>";
		for (var z=0; z<listTypeRight.length; z++){
			strlistR += "<option value='"+listTypeRight[z]+"'>"+listTypeRight[z]+"</option>";
		}
		strlistR +="</select>";
		$("#leftSelection").empty().append(strlistL);
		$("#rightSelection").empty().append(strlistR);
		$("#manageConnectionDiv").trigger('create');
		dragAndHighlight();	
    },1500);
}
	$(document).on('click', '#doneManageConnectivity', function() {
			getAllSelectedManageConnectivity();	
			setTimeout(function(){
				$.mobile.changePage($('#configEditorPage'),{
    				transition: "pop",
					changeHash : true
   			 	});
			},2000);
    	    drawImage();
			createLine('canvasID');
	    });

/*
 *
 *  FUNCTION NAME : dragAngHighlight
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 9, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 * p
 *
 */
function dragAndHighlight(){
		$('li').removeClass('ui-corner-bottom');
    	$('#deviceRight')
        	.addClass('ui-corner-top')
        	.removeClass('ui-corner-all')
        	.sortable({
            	'containment': 'parent',
            	'opacity': 0.6,
            	update: function(event, ui) {
					$('#deviceLeft').children('li').each(function () {
   						var selected_index = $(this).index();
						if ($('#deviceLeft li a').eq(selected_index).hasClass('highlight') && !$('#deviceRight li').eq(selected_index).hasClass('highlight') ){
							$('#deviceLeft li a').eq(selected_index).removeClass('highlight');
							$('#deviceCenter li').eq(selected_index).removeClass('highlight');
						}
					});
					$('#deviceRight').children('li').each(function(){
						var sIndex = $(this).index();
						if (!$('#deviceLeft li a').eq(sIndex).hasClass('highlight')){
							$('#deviceRight li').eq(sIndex).removeClass('highlight');
							$('#deviceCenter li').eq(sIndex).removeClass('highlight');
						}
					});	
            	}
        	});
/* HTHIS FUNCTION GETS THE SELECTED INDEX ON THE LIST */
		$('#deviceLeft').children('li').on('click', function () {
    		var selected_index = $(this).index();
			if ($('#deviceLeft li a').eq(selected_index).hasClass('highlight')){
				$('#deviceLeft li a').eq(selected_index).removeClass('highlight');
				$('#deviceRight li').eq(selected_index).removeClass('highlight');
				$('#deviceCenter li').eq(selected_index).removeClass('highlight');	
			}
			else{
				$('#deviceCenter li').eq(selected_index).addClass('highlight');
				$('#deviceRight li').eq(selected_index).addClass('highlight');	
				$('#deviceLeft li a').eq(selected_index).addClass('highlight');	
			}
		});	

}
/*
 *
 *  FUNCTION NAME : getAllSelectedManageConnectivity
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 8, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function getAllSelectedManageConnectivity(){
	$('#deviceLeft').children('li').each(function () {
   		var selected_index = $(this).index();
		var type = $('#deviceLeft li').eq(selected_index).attr('portType');
		var pLeftObjPath = $('#deviceLeft li').eq(selected_index).attr('data-name');
		var pRightObjPath = $('#deviceRight li').eq(selected_index).attr('data-name');
		/* to get the sourceDEvice */
		if (pRightObjPath == undefined || pRightObjPath == null || pRightObjPath == ""){
			return;
		}
		var rObj = pRightObjPath.split(".");
		var destinationDevice = rObj[0];
		/* to get the destinationDEvice */
		var lObj = pLeftObjPath.split(".");
		var sourceDevice = lObj[0];
		var condition = checkPortTypeMatch(selected_index, type, pLeftObjPath)
		if (condition == true && $('#deviceLeft li a').eq(selected_index).hasClass('highlight'))
			pushToLineConnect(selected_index,type,pLeftObjPath,destinationDevice,sourceDevice);
	});	

}
/*
 *
 *  FUNCTION NAME : checkPortTypeMatch(selIndex,leftDevType, lefObjPath)
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 8, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function checkPortTypeMatch(selIndex,leftDevType, leftObjPath){
	var conReturn =  false;
	var	pRightObjPath = $('#deviceRight li').eq(selIndex).attr('data-name');
	var devRightType = $('#deviceRight li').eq(selIndex).attr('portType');
	if (leftDevType.toLowerCase() == "l2"){
		conReturn = true;
	}
	if (leftDevType.toLowerCase() == "l1" && devRightType.toLowerCase() == "l1"){
		conReturn = checkPortSpeedIfMatch(leftObjPath,pRightObjPath)	
	}	
	if ((leftDevType.toLowerCase() == "open" && devRightType.toLowerCase() == "l1") ||(leftDevType.toLowerCase() == "l1" && devRightType.toLowerCase() == "open")) {
		$.mobile.changePage("#YesNoPopUp", {
            transition: "flow",
            reverse: false,
            changeHash: false
        });
		$(document).on('click', '#yesButton', function() {
			conReturn = true;	
console.log(">>>>>>>ASDasdasd>>>>>");
	    });
		var str = "Are you sure you want to connect "+leftDevType+" port to "+devRightType+"?";	
		$("#YesNoPopUpInfo").empty().append(str);
		$("#YesNoPopUp").trigger('create');
			
	}	

	return conReturn;
}

/*
 *
 *  FUNCTION NAME : checkPortSpeedIfMatch
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 8, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function checkPortSpeedIfMatch(leftObjPath,rightObjPath){
	var d = rightObjPat.split(".");
	var rightDevicePath = d[0];
	var leftSpeed = "";
	var rightSpeed ="";
	var rightDeviceName = "";
	var condition = true;
	for(var a=0; a<portArr.length; a++){
		if (portArr[a].ObjectPath == leftObjPath){
			leftSpeed = portArr[a].Speed;
		}else if (portArr[a].ObjectPath	== rightObjPath){
			rightSpeed = portArr[a].Speed;
		}
	}	
	for (var q=0; q<devicesArr.length; q++){
		if (devicesArr[q].ObjectPath == rightObjectPath){
			rightDeviceName = devicesArr[q].DeviceName;
		}
	}
	if (leftSpeed != rightSpeed){
		alert("Device "+rightDeviceName+" have no speed of "+leftSpeed);
		condition = false;
	}
	return condition;
}
/*
 *
 *  FUNCTION NAME : pushToLineConnect
 *  AUTHOR        : Marlo Agapay
 *  DATE          : January 7, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function pushToLineConnect (selIndex, devLeftType, pLeftObjPath,destinationDevice,sourceDevice){
	var	pRightObjPath = $('#deviceRight li').eq(selIndex).attr('data-name');
	var devRightType = $('#deviceRight li').eq(selIndex).attr('portType');
		var tempLineArr = [];
		loop:
		for (var q=0; q<lineConnected.length; q++){
			if (lineConnected[q].DestinationDevice.ObjectPath == destinationDevice&& lineConnected[q].SourceDevice.ObjectPath == sourceDevice){
				pushPortToLineConnected(lineConnected[q], pLeftObjPath,pRightObjPath);
				break loop;	
			}
		}

}
/*
 *
 *  FUNCTION NAME : pushPortToLineConnected
 *  AUTHOR        : marlo agapay
 *  DATE          : January 8, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function pushPortToLineConnected(lineConnectedArr,pLeftObjPath,pRightObjPath){
	var hasIt = false;
	var destinationDeviceObj = lineConnectedArr.DestinationDevice;
	var sourceDeviceObj = 	lineConnectedArr.SourceDevice;	
	$.each(lineConnectedArr, function(index,object){
		if (object.Destination == pRightObjPath && object.Source == pLeftObjPath){
			hasIt = true;
			return false;
		}
	});
	if (hasIt == false)
		var portId1 = getPortIdforManageConnectivity(pLeftObjPath);
		var portId2 = getPortIdforManageConnectivity(pRightObjPath);
		var lineName = getPortIdforManageConnectivity(pLeftObjPath,"lineName");
		storeLinkInformation(lineName,sourceDeviceObj,destinationDeviceObj,pLeftObjPath,pRightObjPath,"","","",portId1,portId2,pLeftObjPath,pRightObjPath,"","","","","","","","","false");
}
/*
 *
 *  FUNCTION NAME : convertTime
 *  AUTHOR        : James Turingan
 *  DATE          : January 3, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function convertTime(time){
	var mydate = new Date();
	var myDateArr = mydate.toString().split(" ");
	var mytimezone = myDateArr[5];
	var timeVal='';
	var url = 'http://'+CURRENT_IP+'/cgi-bin/Final/NFast_RM/NFastRMCGI.py?action=converttime&query=TimeZone='+mytimezone;
	$.ajax({
        url: url,
/*		data: {
			"action":action,
			"query":query,
		},*/
        dataType: 'html',
		method: 'POST',
		proccessData: false,
		async:false,
        success: function(data) {
			data = $.trim(data);
			timeVal = data;	
		}
	});
	return timeVal;
}
/*
 *
 *  FUNCTION NAME : toggle1
 *  AUTHOR        : Rose Anne Dominguez
 *  DATE          : January 7, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : Hide and show of the Configuration Name panel. 
 *  PARAMETERS    : 
 *
 */


function toggle1(id) {
    var el = document.getElementById(id);
    var img = document.getElementById("arrow1");
    var box = el.getAttribute("class");
    if(box == "hideMenu1"){
        el.setAttribute("class", "showMenu1");
        delay(img, "img/arrowright1.png", 400);
    }
    else{
        el.setAttribute("class", "hideMenu1");
        delay(img, "img/arrowleft1.png", 400);
    }
}
/*
 *
 *  FUNCTION NAME : delay
 *  AUTHOR        : Rose Anne Dominguez
 *  DATE          : January 8, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : animation of hide and show in the side panel.
 *  PARAMETERS    : 
 *
 */


function delay(elem, src, delayTime){
    window.setTimeout(function() {elem.setAttribute("src", src);}, delayTime);
}


/*
 *
 *  FUNCTION NAME : toggle
 *  AUTHOR        : Rose Anne Dominguez
 *  DATE          : January 8, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : Hide and show of the History panel.
 *  PARAMETERS    : 
 *
 */


function toggle(id) {
    var el = document.getElementById(id);
    var img = document.getElementById("arrow");
    var box = el.getAttribute("class");
    if(box == "hideMenu"){
        el.setAttribute("class", "showMenu");
        delay(img, "img/arrowright1.png", 400);
    }
    else{
        el.setAttribute("class", "hideMenu");
        delay(img, "img/arrowleft1.png", 400);
    }
}


/*
 *
 *  FUNCTION NAME : getPortIdforManageConnectivity
 *  AUTHOR        : marlo agapay
 *  DATE          : January 10, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */

function getPortIdforManageConnectivity(portObj,action){
	var port ="";
	for (var a=0; a<portArr.length; a++){
		if (portArr[a].ObjectPath == portObj){

			if (action == "lineName"){
				port = "t"+portArr[a].Speed+"_"+lineConnected.length+1;				
			}else{
				port = portArr[a].PortId;
			}
		}
	}
	return port;
}

/*
 *
 *  FUNCTION NAME : checkIfTabAvailable
 *  AUTHOR        : marlo agapay
 *  DATE          : January 13, 2014
 *  MODIFIED BY   : 
 *  REVISION DATE : 
 *  REVISION #    : 
 *  DESCRIPTION   : 
 *  PARAMETERS    : 
 *
 */
function checkIfTabAvailable(data){
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(data, "text/xml");
	var mConfig =xmlDoc.getElementsByTagName('MAINCONFIG');
	var localFlag = mConfig[0].getAttribute('LocalFlag');
	var importFlag = mConfig[0].getAttribute('ImportedFlag');
	var myReturn = '';
	if (localFlag == '1' && importFlag == '0'){
		myReturn ='local';
		$("#ulDevListTabs").hide();
		$('#tabImport').hide();
		$('#tabLocal').show();
	}else if (localFlag == '0' && importFlag =='1'){
		myReturn = 'import';
		$("#ulDevListTabs").hide();
		$('#tabImport').show();
		$('#tabLocal').hide();
	}else if (localFlag == '1' && importFlag == '1'){
		myReturn = 'both';
	}


	return myReturn;	
}
