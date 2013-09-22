﻿var maplet= null;   // 地图全局变量
var vehicleId ="";// 手机号
var car = new MyObject('0'); //
var carText = new MyObject('0'); //
var carHashMap = new HashMap();
function load(vehicle) {
	vehicleId = vehicle; // 接收页面传来的参数
	//ljy
//	alert("时时监控:"+vehicleId);
	$('#map').css("width", getMapWidth()+"px");
	$('#map').css("height",getMapHeight() + "px");
	maplet=new SE.Map("map");
	//定位中心点并显示地图的等级
	maplet.centerAndZoom(new SE.LngLat(116.39885,39.96571),4);
	// 添加标准控件，骨头棒
	maplet.addControl(new SE.MapControl());
	// 添加 卫图, 矢量 和 融合控件
	var switchControl=new SE.MapTypeControl();
    maplet.addControl(switchControl);
	maplet.removeMapType(SE.Traffic_MAP);
	switchControl.setRight(5);
	// 比例尺
	var scale = new SE.ScaleControl();
	scale.setLeft(20);
	scale.setBottom(30);
	maplet.addControl(scale);
	// 鼠标滚动
	maplet.handleMouseScroll(true);
	// 键盘事件
	maplet.handleKeyboard();
 
	//鹰眼
	var overmap = new SE.OverviewMapControl(4)   
	maplet.addControl(overmap); 
	
	var control=new SE.CopyrightControl();  
    control.setLeft(130);  
    control.setBottom(0);  
    maplet.addControl(control); 
	playTrack();
}


function getHead(head) {
	head=head;
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
	head=head;
	if ((head >= 0 && head < 22)||(head >= 336)){
		return "北"+"("+head+")";
	}else if(head >= 22 && head <66){
		return "东北"+"("+head+")";
	}else if(head>=66&&head<112){
		return "东"+"("+head+")";
	}else if(head>=112&&head<156){
		return "东南"+"("+head+")";
	}else if(head>=156&&head<202){
		return "南"+"("+head+")";
	}else if(head>=202&&head<246){
		return "西南"+"("+head+")";
	}else if(head>=246&&head<292){
		return "西"+"("+head+")";
	}else if(head>=292&&head<336){
		return "西北"+"("+head+")";
	}
	
		
}

function getMapWidth() {
	var width;
	if (window.innerWidth)
		width = window.innerWidth;
	else
		width = document.body.offsetWidth;

	return width;
}
function getMapHeight() {
	var height;
	height = document.body.clientHeight;
	return height;
}

function createInfoWindow(obCar) {
	var div = '<div><table width="400" border="0" cellspacing="2" cellpadding="0"><tr bgcolor="#e6eaea">';
	div += '<td colspan="2" height="30" id="info_gs">' + obCar.gs + '</td></tr>'
	+ '<tr><td colspan="2" height="20" id="info_alarmState">报警状态：'+obCar.alarmState+'</td></tr>'
	    + '<tr><td height="18">速度：' + obCar.sd + 'km/h</td>' + '<td >方向：' + getHeadDes(obCar.hd) + '</td></tr>'
	    + '<tr bgcolor="#e6eaea"><td height="18">经度：' + obCar.lon+ '</td>' + '<td >纬度：' + obCar.lat + '</td></tr>' 
	   + '<tr ><td height="18">所属行业：' + obCar.kindName+ '</td>' + '<td >所属业户：' + obCar.workunitName + '</td></tr>' 
	   + '<tr bgcolor="#e6eaea"><td height="18" colspan="2" >电子运单：' + obCar.bill+ '</td></tr>' 
	    +'<tr><td><a href="javascript:void(0)" onclick=getDriverMessage("'+obCar.vehicleId+ '")> 查看司机信息</a></td><td><a href="javascript:void(0)" onclick=getLocationInfo2("' + obCar.sim + '","' + obCar.lon + '","' + obCar.lat + '")>显示位置</a></td></tr>'
	   +'<tr bgcolor="#e6eaea"><td colspan="2"  height="50" id="message">&nbsp;</td></tr></table></div>';
			
	div = div
			+ "<table width='250px' height='12px' cellspacing='0' cellpadding='0'><tr><td><span style='color:#0000cc;cursor:pointer;text-decoration:underline;font-size:12px;' onclick='javascript:map.closeInfoWindow();'></span></td>";
	div = div + "<td style='font-size:12px;' align='right'>定位时间:" + obCar.gt + "</td></tr></table>";
	return div;
}

//弹出窗口,取中文地址
function getLocationInfo2(sim,lon,lat) {
	$("#locationInfo").html('<img src="imgs/load.gif" />正在加载数据......');
	  var url="monitorCenter/getAddressRepeat.action";
	   var param={
    		 date:new Date(),
             lnglat:lon+","+lat	 
             }
	  url = encodeURI(url); 
	 	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data: param,
		success:function(data){
		try{  
			   if(data.status=="ok"){
					$("#message").html(data.result.district_text);
				}else{
					$("#message").html(data.result.error);
				}
	     }catch(exception){
	    	 $("#message").html('服务器忙,请稍后再试!');
	   }
		
	} 
	 	,complete: function (XHR, TS) { XHR = null } 
	});
}
/**
 * 获取车辆最新驾驶员信息
 * @param {} vehicleId
 */
function getDriverMessage(vehicleId){
	//alert(vehicleId);
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
		    	var name=data.name;//司机姓名
		    	var driverIC=data.driverIC;//司机IC卡号
		    	var drivingLicence=data.drivingLicence;//驾驶证号码
		    	var zdDriverCode=data.zdDriverCode;//司机编号
		    	//var zdWhetherIC=data.zdWhetherIC;//终端是否插入IC卡
		    	
		    	var message="姓名:"+(!data.name?"":data.name);

		    	 if(drivingLicence!=''){         
				    	message+="&nbsp;驾驶证号:"+(!drivingLicence?"":drivingLicence);
				 }
		    	 
			    if(driverIC!=''){
			    	message+="&nbsp;IC卡号:"+(!driverIC?"":driverIC);
			    }
			   
			    if(zdDriverCode!=''){         
			    	message+="&nbsp;司机编号:"+(!zdDriverCode?"":zdDriverCode);
			    }
//			    if(zdWhetherIC!=''){
//				    message+="&nbsp;终端是否插入IC卡:"+zdWhetherIC;
//				}
		   $("#message").html(message);
		}else{
			$("#message").html("当前没有司机信息");
		  }
		}
	 	,complete: function (XHR, TS) { XHR = null } 
	});
	
} 
// 删车
function oneCar(carsim) {
	car = new MyObject(carsim);
	carText = new MyObject("text" + carsim);
	
	var newMarker = carHashMap.get(car);
	var txtMarker= carHashMap.get(carText);
	
	// 清空地图图标
	if(newMarker!=null){
		maplet.removeOverLay(newMarker);// 删除车
		maplet.removeOverLay(txtMarker);
	}
	// 清空HashMap
	carHashMap.remove(car); // 删除车
	carHashMap.remove(carText);
}

//文字标注
function txtMaker(LngLat,name){
var text = new SE.PointOverlay(LngLat);   
text.setLabel(name);    
return text;
}
// 定位车辆
function MakerCar(obCar) {

	var state = 0;
	var head=getHead(obCar.hd);
	if (obCar.sd > 0) {
		state = 1;
	}
	if(obCar.alarmState!='当前没有报警'){
		state=3;
	}
	if(!obCar.onLine){
		state=2;
	}
	car = new MyObject(obCar.sim);
	var IconPath;
	var IconInfo;
	var icon;
	var w;
	var h;
	var src;
	if (state == 0) {
		src = "imgs/car/carYellow" + head + ".gif";
	} else if (state == 1) {
		src = "imgs/car/car" + head + ".gif";
	} else if (state == 2) {
		src = "imgs/car/carBlue" + head + ".gif";
	} else {
		src = "imgs/car/red" + head + ".gif";
	}
	if (head == 1 || head == 2) {
		w = 20;
		h = 20;
		icon=new SE.Icon(src,new SE.Size(w,h),new SE.Point(16,16)); 
		icon.removeShadow();
	}else if (head == 3 || head == 4) {
		w = 20;
		h = 20;
		icon=new SE.Icon(src,new SE.Size(w,h),new SE.Point(16,16)); 
		icon.removeShadow();
	} else {
		w = 22;
		h = 22;
		icon=new SE.Icon(src,new SE.Size(w,h),new SE.Point(16,16)); 
		icon.removeShadow();
	}
	var point=new SE.LngLat(obCar.sHlon,obCar.sHlat);
	 var carNo=obCar.no;//车牌号
	 var infowindow=createInfoWindow(obCar);
     var newMarker = new SE.Marker(point,icon);
	 if (carHashMap.containsKey(car)) {
		oneCar(obCar.sim);
	}
	 maplet.addOverLay(newMarker);
	 var textMarker=new txtMaker(point,obCar.no);
     maplet.addOverLay(textMarker);
	 
     /***点击车辆弹出框***/
	 SE.Event.addListener(newMarker,"click",function(){
	 var infowin = newMarker.openInfoWinHtml(infowindow);
	 /**设置快捷标题**/
	 infowin.setTitle(getTitleDiv(obCar.no,obCar.vehicleId,2));
	  }); 
	 carHashMap.put(car, newMarker);
	   carHashMap.put("text"+car, textMarker);
	// 清空
	point = null;
	car = null;
	carMarker = null;
	
}

var lastPoint=null;
var firstPoint=true;
//播放轨迹
function playTrack() {
	var jsonParams = {
		vehicleIdStr:vehicleId,
		mapType:parent.parent.mapFrame.getMapType(),
		datetimes : new Date()
	};
	$.ajax({
		url:"monitorCenter/getGpsInfos.action",
		type:"POST",
		dataType:"json",
		data:jsonParams,
		success:function(msg){
			var pos = new Array(); // 轨迹点数组
	         var xy = msg[0];
	         if(!firstPoint){
		    	 pos.push(lastPoint);
		     }
	         MakerCar(xy);
	         var point=new SE.LngLat(xy.sHlon, xy.sHlat);
		     pos.push(point);
		     lastPoint=point;
		     
		     var mbounds = maplet.getLngLatBounds();   
		     var westSouth = mbounds.getSouthWest();//西南经纬度坐标   
		     var northEast = mbounds.getNorthEast();//东北经纬度坐标   
		     var mapbounds=new SE.LngLatBounds([westSouth,northEast]);
		     if (!mapbounds.containsLngLat(point))
		     {
		    	maplet.setCenter(point);
		     }
		  // 画轨迹线
				try{
					var pline = new SE.PolyLine(pos,"#330099",2);
					maplet.addOverLay(pline);
				}catch(e){}
				if (firstPoint) {
					maplet.centerAndZoom(pos[0],15);
				}
				firstPoint=false;
	   }
	,complete: function (XHR, TS) { XHR = null } 
	});
		setTimeout("playTrack()",5000);
}







/***
 *闭单车跟踪的弹出信息框【没有这个方法不行，所以不能删除】
 ***/
function closTitleWin(){
}





