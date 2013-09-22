var tip = true;
var maplet = null; // 地图全局变量
var carHashMap = new HashMap();
var control=null;
var showMarker;
var showRegistrationNo;
var showTextMarker;
var showAlarmTime;
var showAlarmName;
function load() {
	$('#map').css("width", getMapWidth() + "px");
	$('#map').css("height", getMapHeight() - 180 + "px");
	//maplet = new EzMap($('#map'));
	maplet= new EzMap(document.getElementById("map"));
	maplet.initialize();
	//显示地图左侧的比例尺
	maplet.showMapControl();
	maplet.showCopyright();//显示地图版权信息
	maplet.showMapScale();//显示地图的比例尺右下角
	//maplet.centerAndZoom(new Point(116.39885,39.96571),4);
	var overview=new OverView();//鹰眼
	overview.width=200;
	overview.height=200;
	maplet.addOverView(overview);
	//maplet.showOverView();

	var allScreen=$('#allScreen');
	allScreen.unbind("click");
	allScreen.bind("click",fullScreen);
	$.messager.defaults={ok:"确定",cancel:"取消"};
}

window.onresize = resizeListener;
function resizeListener() {

}


// 方向
function getHead(head) {
	if ((head >= 0 && head < 22) || (head >= 336)){
		return 3;
		}else if (head >=22 && head <66){
			return 7;
		}else if (head >=66 && head <112){
			return 1;
	    }else if (head >=112 && head <=156){
			return 8;
	    }else if (head >=156 && head <202){
			return 4;
	    }else if (head >=202 && head <= 246){
			return 5;
	    }else if (head >=246 && head <292){
			return 2;
	    }else if (head >=292 && head <336){
			return 6;
	    }
}

function getHeadDes(head) {
	if ((head >= 0 && head < 22)||(head >= 336)){
		return "北向";
	}else if(head >= 22 && head <66){
		return "东北向";
	}else if(head>=66&&head<112){
		return "东向";
	}else if(head>=112&&head<156){
		return "东南向";
	}else if(head>=156&&head<202){
		return "南向";
	}else if(head>=202&&head<246){
		return "西南向";
	}else if(head>=246&&head<292){
		return "西向";
	}else if(head>=292&&head<336){
		return "西北向";
	}
	
		
}
// 定位车辆
function MakerCar(obCar, tableFlag) {
	var state = 0;
	var head = getHead(obCar.hd);
	if (obCar.sd > 0) {
		state = 1;
	}
	car = new MyObject(obCar.vehicleId);
	var IconPath;
	var IconInfo;
	var icon;
	var w;
	var h;
	var src;

	var newMarker = "";
	var textMarker = "";
	try {
		if (!carHashMap.containsKey(car)) {
			if (tableFlag) {
				add_tables(obCar);
			}
		} else {
			oneCar(obCar.vehicleId);
			if (tableFlag) {
				updatetable(obCar);
			}
		}
		if (state == 0) {
			src = "imgs/car/carBlue" + head + ".gif";
		} else if (state == 1) {
			src = "imgs/car/car" + head + ".gif";
		} else if (state == 2) {
			src = "imgs/car/carYellow" + head + ".gif";
		} else {
			src = "imgs/car/red" + head + ".gif";
		}
		try {
			icon=new Icon();
			if (head == 1 || head == 2) {
				w = 20;
				h = 20; 	
			} else if (head == 3 || head == 4) {
				w = 20;
				h = 20;
			} else {
				w = 22;
				h = 22;;
			}
			icon.heigth=h;
			icon.width=w;
			icon.image=src;
		} catch (e) {

		}
		var point = new Point(obCar.sHlon, obCar.sHlat);
		var carNo = obCar.no;// 车牌号
		var newObCar = new Object();
		var infowindow = createInfoWindow(obCar);
		//newMarker = new Marker(point, icon,carNo);
		newMarker = new Marker(point,icon,new Title(carNo,12,7,"宋体",null,null,"red","2"));

		maplet.addOverlay(newMarker);
		//textMarker = new txtMaker(point, obCar.no);
		//maplet.addOverlay(textMarker);
		newMarker.addListener('click',function(){newMarker.openInfoWindowHtml(infowindow);});
	} catch (e) {
		newMarker = car;
	}

	carHashMap.put(car, newMarker);
	//carHashMap.put("text" + car, textMarker);
	// 清空
	point = null;
	car = null;
	carMarker = null;

}


// 文字标注
function txtMaker(LngLat, name) {
	 var title=new Title(name,12,5,"宋体","white","#015190");
	 title.setPoint(LngLat);
	return title;
}
// 表格开始
function add_tables(obCar) {
	var newLine="<tr id='gps"+obCar.vehicleId+"' ondblclick='reloadMapCenter("+obCar.vehicleId+");'><td><div id='cp" + obCar.vehicleId + "'><a href='monitorCenter/P_attention.jsp?vehicleId=" + obCar.vehicleId + "' style='cursor:hand;font-size:9pt;' target='_blank'>" + obCar.no + "</a></div></td>"
	+"<td><div id='noColor" + obCar.vehicleId + "'>" + obCar.noColor + "</div></td>"
	+"<td><div id='sd" + obCar.vehicleId + "'>" + obCar.sd + "</div></td>"
    +"<td><div id='sd2" + obCar.vehicleId + "'>" + obCar.sd2 + "</div></td>"
    +"<td><div id='dw" + obCar.vehicleId + "'>" + (obCar.st == 0 ? '盲区' : '准确') + "</div></td>"
    +"<td><div id='sh" + obCar.vehicleId + "'>" + obCar.sh + "</div></td>"
    +"<td><div id='gs" + obCar.vehicleId + "'>" + obCar.gs + "</div></td>"
    +'<td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="25" nowrap="nowrap"><div id="lo' + obCar.vehicleId + '"><div id="vehicleId' + obCar.vehicleId + '" lat="' + obCar.sHlat + '" lon="'
	   + obCar.sHlon + '"><a href="javascript:getLocation('+obCar.vehicleId+')">查看</a></div></div></td><td><div id="' + "Location" + obCar.vehicleId + '"></div></td></tr></table></td>'
	   +"<td><div id='gt" + obCar.vehicleId + "'>" + obCar.gt + "</div></td>"
	   +"<td><div id='de" + obCar.vehicleId + "'>" + "<a style='cursor:hand;font-size:9pt;' onclick=deleteCar('" + obCar.vehicleId + "');><img src='imgs/remove.gif' border='0'/></a></div></td>"
	   +"</tr>";
$('#mytable').append(newLine);
	setColor('mytable');
}

function updatetable(obCar) {
	var newLine="<td><div id='cp" + obCar.vehicleId + "'><a href='monitorCenter/P_attention.jsp?vehicleId=" + obCar.vehicleId + "' style='cursor:hand;font-size:9pt;' target='_blank'>" + obCar.no + "</a></div></td>"
	+"<td><div id='noColor" + obCar.vehicleId + "'>" + obCar.noColor + "</div></td>"
	+"<td><div id='sd" + obCar.vehicleId + "'>" + obCar.sd + "</div></td>"
    +"<td><div id='sd2" + obCar.vehicleId + "'>" + obCar.sd2 + "</div></td>"
    +"<td><div id='dw" + obCar.vehicleId + "'>" + (obCar.st == 0 ? '盲区' : '准确') + "</div></td>"
    +"<td><div id='sh" + obCar.vehicleId + "'>" + obCar.sh + "</div></td>"
    +"<td><div id='gs" + obCar.vehicleId + "'>" + obCar.gs + "</div></td>"
    +'<td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="25" nowrap="nowrap"><div id="lo' + obCar.vehicleId + '"><div id="vehicleId' + obCar.vehicleId + '" lat="' + obCar.sHlat + '" lon="'
	   + obCar.sHlon + '"><a href="javascript:getLocation('+obCar.vehicleId+')">查看</a></div></div></td><td><div id="' + "Location" + obCar.vehicleId + '"></div></td></tr></table></td>'
	   +"<td><div id='gt" + obCar.vehicleId + "'>" + obCar.gt + "</div></td>"
	   +"<td><div id='de" + obCar.vehicleId + "'>" + "<a style='cursor:hand;font-size:9pt;' onclick=deleteCar('" + obCar.vehicleId + "');><img src='imgs/remove.gif' border='0'/></a></div></td>";
	 $('#gps'+obCar.vehicleId).html(newLine);  
}
// 删除表格行

function deleteCar(ObjectID) {

	try { // 删除表格
		var id = $("#sd" + ObjectID);
		id.parents("tr").remove();
	} catch (e) {
	}
	try {// 删除车
		oneCar(ObjectID.toString());
	} catch (e) {
	}
	try { // 删除复选框
		parent.leftFrame.deleteCheckBox(ObjectID.toString());
	} catch (e) {
	}
	setColor('mytable');// 删除行后重新设置交叉色
}

// 删车
function oneCar(carsim) {
	car = new MyObject(carsim);
	//carText = new MyObject("text" + carsim);
	var newMarker = carHashMap.get(car);
	//var txtMarker = carHashMap.get(carText);
	try {
		// 清空地图图标
		if (newMarker != null) {
			maplet.removeOverlay(newMarker);// 删除车
	//		maplet.removeOverlay(txtMarker);
		}

	} catch (e) {

	}

	// 清空HashMap
	carHashMap.remove(car); // 删除车
	//carHashMap.remove(carText);
}

function createInfoWindow(obCar) {
	var div = '<div><table width="260" border="0" cellspacing="2" cellpadding="0"><tr bgcolor="#e6eaea">';
	div += '<td colspan="2" height="30">' + obCar.gs + '</td></tr>' 
    + '<tr><td colspan="2" height="20">报警状态：'+obCar.alarmState+'</td></tr>'
    + '<tr bgcolor="#e6eaea"><td height="18">高度：' + obCar.gd + '米</td>' + '<td >sim卡：' +obCar.sim + '</td></tr>'
	    + '<tr><td height="18">速度：' + obCar.sd + '公里/小时</td>' + '<td >方向：' + getHeadDes(obCar.hd) + '</td></tr>'
	    + '<tr bgcolor="#e6eaea"><td height="18">经度：' + obCar.lon+ '</td>' + '<td >纬度：' + obCar.lat + '</td></tr>' 
	   + '<tr><td height="18">所属行业：' + obCar.kindName+ '</td>' + '<td >所属业户：' + obCar.workunitName + '</td></tr>' 
	   + '<tr bgcolor="#e6eaea"><td height="18" colspan="2" >电子运单：' + obCar.bill+ '</td></tr>' 
	    +'<tr><td><a href="javascript:void(0)" onclick=getDriverMessage("'+obCar.vehicleId+ '")> 查看司机信息</a></td><td><a href="javascript:void(0)" onclick=getLocationInfo2("' + obCar.vehicleId + '","' + obCar.lon + '","' + obCar.lat + '")>显示位置/a></td></tr>'
	   +'<tr bgcolor="#e6eaea"><td colspan="2"  height="50" id="message">&nbsp;</td></tr></table></div>';
			
	div = div
			+ "<table width='250px' height='12px' cellspacing='0' cellpadding='0'><tr><td><span style='color:#0000cc;cursor:pointer;text-decoration:underline;font-size:12px;' onclick='javascript:map.closeInfoWindow();'></span></td>";
	div = div + "<td style='font-size:12px;' align='right'>定位时间:" + obCar.gt + "</td></tr></table>";
	return div;
}

// 放大
function mZoom(switchid) {
	if (switchid == 0) {
		  // maplet.zoomInExt();
		  maplet.zoomInExt();
	}else if (switchid == 1) {
		 maplet.zoomOutExt();
	}

}
// 打印
function printMap() {
	maplet.print();
	//print_Map(maplet);
}
function print_Map(maplet) {
	var html = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n";
	html += (document.all) ? "<html xmlns:v=\"urn:schemeas-microsoft-com:vml\">" : "<html>";
	html += "\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=gb2312\">\n<title>Print Maps<\/title>\n";
	html += "<style type=\"text\/css\">\nbody {margin: 0px;}\n";
	html += (document.all) ? "v\\:*{ Behavior:url(#default#VML);}" : "";
	html += "\n</style>\n";
	html += "<\/head>\n";
	html += "<body><center>\n";
	html += "<a href='#' onclick='javascript:window.print()'>打印</a>\n";

	html += maplet.getMapContent(0);
	html += "\n<\/center><\/body>\n<\/html>";
	var win = document.open("about:blank", "win", "menubar=1,width=" + maplet.container.offsetWidth + ",height=" + (maplet.container.offsetHeight + 20));
	win.document.writeln(html);
	win.document.close();
}
// 测面、线工具0、为面1为线
function measure(switchid) {
   //maplet.changeDragMode("measure");
	//maplet.measureLength();
	maplet.changeDragMode('measure',null,null,function(mapLength){
			alert("量测的距离为：" + mapLength);
		});

}
// 全国
function AllMap() {
	maplet.fullExtent();
	maplet.zoomInExt();
}
// 删除所有
function mapClearAll() {
	maplet.clear();
}
// 定位车辆的地图中心点
function toMapCenter(lng, lat) {
	maplet.centerAndZoom(new Point(lng, lat), 14);
}

//重新定位地图中心点
function reloadMapCenter(o) {

	var d = $('#vehicleId' + o);
	maplet.centerAndZoom(new Point(d.attr("lon"), d.attr("lat")), 14);
}

function manyou() {
	maplet.changeDragMode("pan");
}

//车辆列表中,取中文地址
function getLocation(o) {
	$("#Location" + o).html('<img src="imgs/load.gif" />正在加载数据......');
	var d = $('#vehicleId' + o);
	var url = "monitorCenter/getAddressRepeat_P.action";
	var param = {
		date : new Date(),
		lnglat : d.attr("lon") + "," + d.attr("lat")
	}
	url = encodeURI(url);
////////////////////方式2/////////////////////
	$.post(url,param,function (data){
		if(data!=null){
//			alert(data);
			$("#Location" + o).html(data);
		}
	},"json");
	
////////////////////方式1/////////////////////
//	$.ajax( {
//		url : url,
//		type : "POST",
//		dataType : "json",
//		data : param,
//		success : function(data) {
//			try {
////				if(data.status=="ok"){
////					$("#Location" + o).html(data.result.address);
////				}else{
////					$("#Location" + o).html(data.result.error);
////				}
//				if(data!=null){
//					$("#Location" + o).html(data);
//				}
//			} catch (exception) {
//				$("#Location" + o).html('因网络不畅，数据加载未完成,请稍后再试！');
//			}
//
//		},
//		error:function(){
//			$("#message").html("因网络不畅，数据加载未完成,请稍后再试！");
//		}
//
//	});

}
//弹出窗口,取中文地址
function getLocationInfoForAlarm(vehicleId, lon, lat) {
	$("#message").html('<img src="imgs/load.gif" />正在加载数据......');
	var url = "monitorCenter/getAddressRepeatSH.action";
	var param = {
		date : new Date(),
		lnglat : lon + "," + lat
	}
	url = encodeURI(url);
	$.ajax( {
		url : url,
		type : "POST",
		dataType : "json",
		data : param,
		success : function(data) {
			try {
				if(data.status=="ok"){
					$("#message").html(data.result.address);
				}else{
					$("#message").html(data.result.error);
				}
			} catch (exception) {
				$("#message").html('因网络不畅，数据加载未完成,请稍后再试！');
			}

		},
		error:function(){
			$("#message").html("因网络不畅，数据加载未完成,请稍后再试！");
		}

	});
}

//弹出窗口,取中文地址
function getLocationInfo2(vehicleId, lon, lat) {
	$("#message").html('<img src="imgs/load.gif" />正在加载数据......');
	var url = "monitorCenter/getAddressRepeat.action";
	var param = {
		date : new Date(),
		lnglat : lon + "," + lat
	}
	url = encodeURI(url);
	$.ajax( {
		url : url,
		type : "POST",
		dataType : "json",
		data : param,
		success : function(data) {
			try {
				if(data.status=="ok"){
					$("#message").html(data.result.address);
				}else{
					$("#message").html(data.result.error);
				}
			} catch (exception) {
				$("#message").html('因网络不畅，数据加载未完成,请稍后再试！');
			}

		},
		error:function(){
			$("#message").html("因网络不畅，数据加载未完成,请稍后再试！");
		}

	});
}

/**
 * 获取车辆最新驾驶员信息
 * @param {} vehicleId
 */
function getDriverMessage(vehicleId){
		$("#message").html('<img src="imgs/load.gif" />正在加载数据......');
   var jsonParams = {
		vehicleId : vehicleId,
		de : new Date()
	};
	
	 	$.ajax({
		url:"monitorCenter/getNewestDriverMessage.action",
		type:"POST",
		data: jsonParams,
		success: function(data){
		    if (data != ''&&data!='null'&& data!=null) {
		    	var name=data.name;
		    	var identityCard=data.identityCard;
		    	var drivingLicence=data.drivingLicence;
		    	var workCertificate=data.workCertificate;
			    var message="姓名:"+data.name;
			    if(identityCard!=''){
			     message+="&nbsp;身份证:"+identityCard;
			    }
			    if(drivingLicence!=''){
			    message+="&nbsp;驾驶证号码:"+drivingLicence;
			    	
			    }
			     if(workCertificate!=''){
			    message+="&nbsp;从业资格证号:"+workCertificate;
			    }
		   $("#message").html(message);
		}else{
			$("#message").html("当前没有司机信息");
		  }
		}
		
	});
	
} 
var Row_bgColor1 = "#d5f0f7";
var Row_bgColor2 = "#ffffff";
var ActiveRow_bgColor = "#F9F8CB"
var MouseOverRow_bgColor = "#93c3ff";

// 设置交叉色和鼠标变色
function setColor(tableID) {
	var objTable = document.getElementById(tableID);
	for ( var i = 1; i < objTable.rows.length; i++) {
		if (i % 2 == 0) {
			objTable.rows[i].bgColor = Row_bgColor1;// 设置背景色
			// 设置鼠标变色
			objTable.rows[i].onmouseover = function() {
				this.bgColor = MouseOverRow_bgColor;
			}
			objTable.rows[i].onmouseout = function() {
				this.bgColor = Row_bgColor1;
			}
		} else {
			objTable.rows[i].bgColor = Row_bgColor2;// 设置背景色
			// 设置鼠标变色
			objTable.rows[i].onmouseover = function() {
				this.bgColor = MouseOverRow_bgColor;
			}
			objTable.rows[i].onmouseout = function() {
				this.bgColor = Row_bgColor2;
			}
		}

	}
}

// 报警处理动画开始
function gifPoint(latlng) {
	var icon;
	var w;
	var h;
	var src = "imgs/car/red1.gif";

	w = 20;
	h = 20;
	icon=new Icon();
	icon.heigth=h;
	icon.width=w;
	icon.image=src;
	var newMarker = new Marker(latlng, icon);
	maplet.centerAndZoom(latlng, 13);
	return newMarker;
}

function AlertGif(x, y,registrationNo,alarmTime,alarmName) {
	showRegistrationNo=registrationNo;
	showAlarmTime=alarmTime;
	showAlarmName=alarmName;
	var latlng = new Point(x, y);
	var newMarker = gifPoint(latlng);
	maplet.addOverlay(newMarker);
	var infowindow = createAlarmInfoWindow(x,y,showAlarmTime,showAlarmName);
	newMarker.addListener("click", function() {
		newMarker.openInfoWindowHtml(infowindow);
	});
	showMarker = newMarker;
	var textMarker = new txtMaker(latlng,showRegistrationNo);
	maplet.addOverlay(textMarker);
	showTextMarker=textMarker;
	setTimeout("moveone()", 50000);
}

function createAlarmInfoWindow(lng,lat,alarmTime,alarmName) {
	var div = '<div><table width="260" border="0" cellspacing="2" cellpadding="0">';
	div += '<tr><td colspan="2" height="30">报警类型：' +alarmName + '</td></tr>' 
	    + '<tr bgcolor="#e6eaea"><td height="18" >经度：' +lng+ '</td>' + '<td >纬度：' + lat + '</td></tr>' 
	    +'<tr><td><a href="javascript:void(0)" onclick=getLocationInfoForAlarm("' + lng + '","' + lng + '","' + lat+ '")>查看报警地址</a></td></tr>'
	   +'<tr bgcolor="#e6eaea"><td colspan="2"  height="50" id="message">&nbsp;</td></tr></table></div>';
			
	div = div
			+ "<table width='250px' height='12px' cellspacing='0' cellpadding='0'><tr><td><span style='color:#0000cc;cursor:pointer;text-decoration:underline;font-size:12px;' onclick='javascript:map.closeInfoWindow();'></span></td>";
	div = div + "<td style='font-size:12px;' align='right'>报警时间:" + alarmTime+ "</td></tr></table>";
	return div;
}

function moveone() {
	maplet.removeOverlay(showMarker);
	maplet.removeOverlay(showTextMarker);
	showRegistrationNo="";
    showAlarmTime="";
	showAlarmName="";
}
// 报警处理动画结束
//区域查车
function findRectangleAreaCar(){
		 var zoom=maplet.getZoomLevel();
	 if(zoom<11){
         var center=maplet.getCenterLatLng();
		  maplet.centerAndZoom(center,11);
		 }
	var leftlat="";
	var rightlat="";
	maplet.changeDragMode("drawRect",null,null,function(point){
		     var pointArray=point.split(",");
			 leftlat = pointArray[0]+ "|" +pointArray[1];//西南(左下角)经度|纬度
	     rightlat = pointArray[2]+ "|" + pointArray[3];//东北（右上角）经度|纬度
			 control.close();
			 	var jsonParams = {
		leftLatLon : leftlat,
		rightLatLon : rightlat
	};
	 	$.ajax({
		url:"monitorCenter/findRectangleAreaCar.action",
		type:"POST",
		dataType:"json",
		data: jsonParams,
		success:function(data){
	 	if(data=="false"||data==false){
	 		$.messager.alert('提示信息','该区域没有车辆！','info');
	 	}else{
			$(data).each(function(i,n){
				var vehicleId=n;
				addCallGps(vehicleId);
			});
	 	}
	   }
		
	});
	
	});   
	
 	control.open();    
}

function addCallGps(vehicleId){
	parent.leftFrame.addVehicle(vehicleId);
	parent.leftFrame.vehicleCallTrack(vehicleId);//订阅
	parent.leftFrame.addCheckBox(vehicleId);
}

function getMapWidth() {
	var width;
	width =document.body.clientWidth;
	return width;
}
function getMapHeight() {
	var height;
	height = document.body.clientHeight;
	return height;
}
//全屏
function fullScreen(){
	var parentparentFrame=$("#frame", window.parent.parent.document);
	parentparentFrame.attr("rows","0,*,0");
	var parentFrame=$("#frame", window.parent.document)
	parentFrame.attr("cols","0,*");
    $('.mon_cont').css("height","100%");
    $('#map').css("width", getMapWidth() + "px");
	$('#map').css("height", getMapHeight()-45+"px");
	var allScreen=$('#allScreen');
	allScreen.removeClass().addClass("map_g_10");
	allScreen.attr("title","缩小");
	allScreen.unbind("click");
	allScreen.bind("click",smallScreen);
	allScreen.html("缩小");
}

//小屏
function smallScreen(){
	var parentparentFrame=$("#frame", window.parent.parent.document);
	parentparentFrame.attr("rows","100,*,30");
	var parentFrame=$("#frame", window.parent.document);
	parentFrame.attr("cols","250,*");
	$('.mon_cont').css("height","96%");
	$('#map').css("width", getMapWidth() + "px");
	$('#map').css("height", getMapHeight() - 180 + "px");
	var allScreen=$('#allScreen');
	allScreen.removeClass().addClass("map_g_09");
	allScreen.attr("title","全屏");	
	allScreen.unbind("click");
	allScreen.bind("click",fullScreen);
	allScreen.html("全屏");
}