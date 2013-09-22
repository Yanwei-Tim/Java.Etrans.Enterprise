﻿var tip=true;
var vehicleId='';//终端号
var gpsInfoArray=null; // 回放轨迹数据数组成部分
var posSize = 0; // 轨迹播放次数
var playTrackFlag = false; // 轨迹播放标识
var changeConditionFlag=true;
var timeOutFlag = true; // 循环播放标识
var getDataEndFlag=false;//获取轨迹数据结束标识
var getDataTime=1800000;//每次获取轨迹时间段，
var playRate = 300; // 播放频率
var car = new MyObject('0'); //
var carText = new MyObject('0'); //
var carHashMap = new HashMap();
var aynchronizedLngLatMap = new HashMap();
//西安偏移值
var XX=0.004792833;
var YY=-0.001412333;
function load(sim,registrationNo) {
	vehicleId=sim;
	$('#map').css("width", getMapWidth()+"px");
	$('#map').css("height",getMapHeight() -120+ "px");
	maplet=new SE.Map("map");
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
	var bb=new SE.LngLat(116.39885,39.96571);
	
	 
	var cc=maplet.getOverLayPosition(bb);
 
	$('#playback').attr({"disabled":"disabled"});
	
	/**
	 * 切换车辆时坐标回到初始位置
	 */
//	$("#registrationSelect").change(function(){
//		maplet.centerAndZoom(new SE.LngLat(116.39885,39.96571),4);   
//	});
	
	/**给车牌输入框赋值**/
	var inputField = document.getElementById("registrationVehicleId");//隐藏域组件
	var inputValueFieId = document.getElementById("registrationVhicleNo");//显示值组件
	inputField.value=vehicleId;
	inputValueFieId.value=registrationNo;
	
}

/****
 * 修改车牌号码后
 * @return
 */
function onchangeVehicleNo(){
	maplet.centerAndZoom(new SE.LngLat(116.39885,39.96571),4);
}

//////////////////////轨迹回放 Star-update by Pomelo(柚子.) 2013-05-15//////////////////////
var arrlistReplay = new Array();
var arrlist = new Array();
var isStop=false;
var currentStopIndex=0;
var paths;
var icon;
var carMk;
var playIndexI = 0;
var newMarker_point;
var southwest;
var northeast;
var isFirst=0;
var isEnd;
var firstPoint;
var lastPoint;
var goalPosPoint = new Array();
var goalSaveCar = new Array();
var vehicleOld=null;
var starTimeOld=null;
var endTimeOld=null;
var isMustQuery = true;
var playSpeed=100;


function resetVaris(){
	arrlistReplay = new Array();
	arrlist = new Array();
	isStop=false;
	currentStopIndex=0;
	playIndexI = 0;
 	isFirst=0;
	isEnd=false;
	goalPosPoint = new Array();
	goalSaveCar = new Array();
	countPlat=0;
	
	isStop=false;	//是否停车
	stopPos=null	//停车坐标
	sBeginTime=null;	//停车开始时间
	sEndTime=null;	//停车结束时间
	EndPoint=null; //分段数据的最后一点
}

/** 查询回放轨迹数据 */
function findPlayBackTrack() {
	//车辆id
	vehicleId = $("#registrationVehicleId").val();
	//alert("车辆id："+vehicleId);
	playSpeed=$("#playRate").val();
	/**
	 * 相同的查询条件不进行二次查询
	 */
	if(vehicleOld==null){
		vehicleOld = vehicleId;
		starTimeOld = $("#beginTime").val();
		endTimeOld = $("#endTime").val() ;
	}else{
		if(vehicleOld==vehicleId && starTimeOld==$("#beginTime").val() && endTimeOld==$("#endTime").val()){
			isMustQuery = false;
		}else{
			vehicleOld = vehicleId;
			starTimeOld = $("#beginTime").val();
			endTimeOld = $("#endTime").val() ;
			isMustQuery = true;
			resetVaris();
		}
	}
	 
	if (isMustQuery) {
		maplet.clearOverLays(true);
		$("#finish").html("");
		var xx = $("#beginTime").val().split(/[-\s:]/); // 开始时间
		var yy = $("#endTime").val().split(/[-\s:]/); // 结束时间
		if (xx == '' || yy == '') {
//			$("#finish").html("查询时间段不能为空");//正式
			alert("查询时间段不能为空");//过检
			return false;
		}
		var beginTime = (new Date(xx[0], xx[1] - 1, xx[2], xx[3], xx[4], xx[5])).valueOf(); // 把时间转换成毫秒数
		var endTime = (new Date(yy[0], yy[1] - 1, yy[2], yy[3], yy[4], yy[5])).valueOf(); // 把时间转换成毫秒数
		if (beginTime > endTime) {
			gpsInfoArray == null;
			//$("#finish").html("开始时间必须大于或等于结束时间"); //正式
			alert("开始时间必须大于或等于结束时间");//过检
			return false;
		}
		if ((endTime - beginTime) > 86400000) {// 过检
//		if ((endTime - beginTime) > 259200000) { //正式使用
			gpsInfoArray == null;   
			alert("请将查询时间段控制在24小时以内");// 过检
//			$("#finish").html("请将查询时间段控制在3天以内");// 正式使用
			return false;
		}
		var finshTime = beginTime;
		$("#back").css("display", "block");
		var countQuery = 0;
		for ( var bt = beginTime; bt <endTime; bt = (bt + getDataTime)) {
			var newbt = bt + getDataTime;
			var newEndTime = newbt >= endTime ? endTime : newbt;
			var jsonParams = {
				beginTime : bt,
				endTime : newEndTime,
				vehicleId : vehicleId,
				index:countQuery
			};
			countQuery++;
			// ljy地图类型
			var mapType = parent.parent.mapFrame.getMapType();
			$.ajax({
				url : "monitorCenter/findPlayBackTrack.action?mapType="+ mapType,
				type : "POST",
				async : true,
				data : jsonParams,
				success : function(data) {
					finshTime = finshTime + getDataTime;
					if (data != 'false') {
						var index=-1;
						try{
							arrlist = eval("(" + data + ")");
							index = eval("({" + arrlist[0] + "})");
						}
						catch(e){
							
						}
						if(aynchronizedLngLatMap==null)aynchronizedLngLatMap = new HashMap();
						if (arrlist.length>0){
							aynchronizedLngLatMap.put(index.index,arrlist);
						}
						if (finshTime >= endTime){							
							var mapKeys=aynchronizedLngLatMap.keys();//所有序号
							mapKeys.sort(function(a,b){return Number(a)>Number(b)?1:-1});//重新排序
							pageNumberKey = mapKeys;
							for(var j=0;j<mapKeys.length;j++){
								if(j==(mapKeys.length-1)){
									isEnd = true;
								}
								if(aynchronizedLngLatMap.get(mapKeys[j])!=null){
									lineDraw(aynchronizedLngLatMap.get(mapKeys[j]));								
								}
							}
							currentPage=1;
							resetParm();
							saveRowByPage();
							createTrackTable();
							aynchronizedLngLatMap = null;
						}
					}
					if (finshTime >= endTime && data == 'false') {// 获取轨迹数据结束
						$("#back").css("display", "none");
//						if (goalSaveCar == null || goalSaveCar.length == 0) {
//							goalSaveCar = null;
//							$("#back").css("display", "none"); // 正在......
//							isMustQuery = true;
//							$("#finish").html("本车辆在这时间段内没轨迹数，请换其它时间段");
//						}
						if (aynchronizedLngLatMap == null || aynchronizedLngLatMap.size() == 0) {
							$("#back").css("display", "none"); // 正在......
							$("#finish").html("本车辆在这时间段内没轨迹数，请换其它时间段");
						}
					}
				}
			})
		}
	}

}

var pageNumberKey;
var tableDataArray;
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
function resetParm(){
	currentPage = 1;
	pageSize = 20;
	sumPageSize = 0;
	sumCurrentRowSize = 0;
}

var currentPage = 1;
var pageSize = 20;
var sumPageSize = 0;
var sumCurrentRowSize = 0;
/**
 * 上一页
 */
function prexPage(){
	if(currentPage>1){
		currentPage--;
		createTrackTable();
		$("#currentPageId").html("当前第"+currentPage+"页");
	}else{
		$("#lastInfo").html("已经是第一页");
		setTimeout(function(){
			$("#noPreInfo").html("&nbsp;&nbsp;");
		}, 3000);
	}
	if(sumPageSize==0){
		$("#noPreInfo").html("当前没有记录");
		setTimeout(function(){
			$("#noPreInfo").html("&nbsp;&nbsp;");
		}, 3000);
	}
}


/**
 * 下一页
 */
function nextPage(){
	if(sumPageSize>currentPage){
		currentPage++;
		createTrackTable();
		$("#currentPageId").html("当前第"+currentPage+"页");

	}else{
		$("#lastInfo").html("已经是最后一页");
		setTimeout(function(){
			$("#lastInfo").html("&nbsp;&nbsp;");
		}, 3000);
	}
	if(sumPageSize==0){
		$("#lastInfo").html("当前没有记录");
		setTimeout(function(){
			$("#lastInfo").html("&nbsp;&nbsp;");
		}, 3000);
	}	
}

/**
 * 统计总记录数
 */
function getSumRowSize(){
	for(var j=0;j<pageNumberKey.length;j++){
		sumCurrentRowSize+=aynchronizedLngLatMap.get(pageNumberKey[j]).length;
	}
}

var saveRowMap = new HashMap();
/**
 * 按分页的形式存储记录
 */
function saveRowByPage(){
	var rowData;
	var countAllRowSum=0;
	var rowAry = new Array();
	for(var i=0;i<pageNumberKey.length;i++){
		rowData = aynchronizedLngLatMap.get(pageNumberKey[i]);
		for(var j=1;j<rowData.length;j++){
			countAllRowSum++;
			if(countAllRowSum%pageSize==0){
				sumPageSize++;
				saveRowMap.put(sumPageSize,rowAry);
				rowAry = new Array();
			}else{
				rowAry.push(rowData[j]);
			}
		}
	}
	if(countAllRowSum%pageSize!=0){
		sumPageSize++;
		saveRowMap.put(sumPageSize,rowAry);
	}
	$("#currentPageId").html("当前第"+currentPage+"页");
	$("#sumPage").html("总共"+sumPageSize+"页");
}
/**
 * 轨迹数据表格
 */
function createTrackTable(){
	if(saveRowMap.size()>0){
		var xy;
		var idStr="";
		tableDataArray = saveRowMap.get(currentPage);
		// 当前页   每页记录数50
		var arrLen=tableDataArray.length;
		$('#mytable').html("");
		for ( var i = 1; i < arrLen; i++) {            
			xy = eval("({" + tableDataArray[i] + "})");
			idStr = xy.sim+i+i;
			var str="<tr><td style='border:0px solid;' align='center' width='9%'>"+xy.no+"</td>";// 车牌
			str+="<td style='border:0px solid;' align='center' width='10%'>"+xy.sHlat+"</td>";//经度
			str+="<td style='border:0px solid;' align='center' width='10%'>"+xy.sHlon+"</td>";//纬度
			str+="<td style='border:0px solid;' align='center' width='5%'>"+xy.oil+"</td>";// 油位
			str+="<td style='border:0px solid;' align='center' width='15%'><div title='"+xy.gs+"'>" + (!xy.gs?'':xy.gs.substr(0,10)+"……") + "</div></td>";// 状态
			str+="<td style='border:0px solid;' align='center' width='15%'><div id=" + idStr + " lat='" + xy.lat + "' lon='"+xy.lon + "'><a href='javascript:getLocationInfo2("+idStr+","+xy.sim+","+xy.lat+","+xy.lon+")'>查看</a></div></td>";//位置
			str+="<td style='border:0px solid;' align='center' width='5%'>"+xy.sd+"</td>";// 速度
			str+="<td style='border:0px solid;' align='center' width='5%'>"+getHeadDes(xy.hd)+"</td>";// 方向
			str+="<td style='border:0px solid;' align='center' width='8%'>"+xy.mileage+"</td>";//里程
			str+="<td style='border:0px solid;' align='center' width='18%'>"+xy.gt+"</td></tr>";// 时间
			$('#mytable').append(str);
		}
		setColor("mytable");
	}
}

var Row_bgColor1 = "#d5f0f7";
var Row_bgColor2 = "#ffffff";
var ActiveRow_bgColor = "#F9F8CB";
var MouseOverRow_bgColor = "#93c3ff";
//设置交叉色和鼠标变色
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
function createImageForPoint() {
	for ( var i = 0; i < goalSaveCar.length; i++) {
		var xy = goalSaveCar[i];
		if (i == 0) {
			newMarker_point = createimg(new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY), 1,xy);
			maplet.addOverLay(newMarker_point);
		} else if (i == (goalSaveCar.length - 1)) {
			newMarker_point = createimg(new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY), 1,xy);
			maplet.addOverLay(newMarker_point);
		} else {
			if(xy.alarm!='当前没有报警'){
				newMarker_point = createimg(new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY), 3,xy);
			}else{
				if (i % 20 == 0) {
					newMarker_point = createimg(new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY), 1,xy);
				}
			}
			maplet.addOverLay(newMarker_point);
		}
	}
}
var countPlat=0;
function playBackTrack(){	
	playSpeed=$("#playRate").val();
	if(countPlat==0)maplet.centerAndZoom(goalPosPoint[0],12);
	countPlat++;
	if ($("#playback").val() == '暂停') {
		$("#playback").val("播放");
		isStop = true;
	} else {
		$("#playback").val("暂停");
		isStop = false;
		if(currentStopIndex==0){
			paths = goalPosPoint.length;  
			icon = carIconFactory_T.createCar(goalSaveCar[0]);
			carMk = new SE.Marker(goalPosPoint[0],icon);
			maplet.addOverLay(carMk);
		}
		function resetMkPoint(playIndexI) {
			if(playIndexI < paths){
				carIconFactory_T.updateCurrentCar(carMk,goalSaveCar[playIndexI]);
				currentStopIndex = playIndexI;
			   
				southwest = maplet.getLngLatBounds().getSouthWest();
				northeast = maplet.getLngLatBounds().getNorthEast();
				   
				if(goalPosPoint[playIndexI].lng>southwest.getLng() 
						|| goalPosPoint[playIndexI].lng<northeast.getLng()  
						|| goalPosPoint[playIndexI].lat<southwest.getLat() 
						|| goalPosPoint[playIndexI].lat>northeast.getLat()){
					maplet.panTo(goalPosPoint[playIndexI],12);//平滑
				}  
				if (playIndexI < paths && (!isStop)) {
					setTimeout(function() {
						playIndexI++;
						resetMkPoint(playIndexI);
					}, playSpeed);
				}
			}else{
				currentStopIndex=0;
				playIndexI=0;
				$("#finish").html("本次回放已结束");
				setTimeout(function() {
					$("#finish").html("");
					maplet.removeOverLay(carMk);
				}, 5000);
				$("#playback").val("播放");
			}
		}
		setTimeout(function() {
			resetMkPoint(currentStopIndex);
		}, 10);
	}
       
}

var isStop=false;	//是否停车
var stopPos;	//停车坐标
var sBeginTime;	//停车开始时间
var sEndTime;	//停车结束时间
var EndPoint; //分段数据的最后一点

function lineDraw(gpsInfoArrayTemp) {
	gpsInfoArray = gpsInfoArrayTemp;
	var pos = new Array(); // 轨迹点数组
	if (EndPoint!=null){
		pos.push(EndPoint);
		EndPoint=null;
	}
	var arrLen=gpsInfoArray.length;
	for ( var i = 1; i < arrLen; i++) {
		var xy = eval("({" + gpsInfoArray[i] + "})");
		if (i==arrLen-1){//分段的最后节点
			EndPoint = new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY);
		}
		if (isEnd && (i == (arrLen - 1))){//轨迹的最后节点
			lastPoint =new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY);
		}
		var speed=Number(xy.sd);
		if (speed<=10 && isStop && !isEnd){//速度小于10，视为停车
			continue;
		}
		pos.push(new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY));
		goalPosPoint.push(new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY));
		goalSaveCar.push(xy);
		if (isFirst == 0 && i == 1)
			firstPoint = new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY);
		if (speed<=10){//速度小于10，视为停车
			isStop=true;
			stopPos=new SE.LngLat(parseFloat(xy.sHlon)+XX, parseFloat(xy.sHlat)+YY);
			sBeginTime=xy.gt;
		}
		else{
			if (isStop){
				sEndTime=xy.gt;
				if (timeDiff(sBeginTime,sEndTime)<=180){
					continue; //停车时间大于60秒才算
				}
				var beginTime=sBeginTime;
				var endTime=sEndTime;
				crateStopIcon(xy,stopPos,beginTime,endTime);
			}
			isStop=false;
		}
	}
	if (pos.length > 0) {
		var pline = new SE.PolyLine(pos, "#330099", 5);
		maplet.centerAndZoom(pos[0], 12);
		if (isFirst == 0) {
			markerUtils_T.setParamValue(21,27,"imgs/star.gif",true);
			maplet.addOverLay(markerUtils_T.crateIconMarker(firstPoint, 0));
			markerUtils_T.isParamValueReset();
		}
		maplet.addOverLay(pline);
		if (isEnd) {
			try {
				markerUtils_T.setParamValue(21,27,"imgs/end.gif",true);
				maplet.addOverLay(markerUtils_T.crateIconMarker(lastPoint, 0));
				markerUtils_T.isParamValueReset();
				createImageForPoint();
				//maplet.setViewport(goalPosPoint);
				maplet.setZoom(8);
				maplet.checkResize();
				$("#back").css("display", "none");
				$("#playback").val("播放");			
				$('#playback').removeAttr("disabled"); 
			} catch (e) {
				alert("lastPoint为空");
				$("#back").css("display", "none");
			}			
		}
	}
	isFirst++;
}

function crateStopIcon(xy,stopPos,beginTime,endTime){
	markerUtils_T.setParamValue(21,27,"imgs/car/point2.gif",true);
	var newMarker=markerUtils_T.crateIconMarker(stopPos, 0);
	maplet.addOverLay(newMarker);
	markerUtils_T.isParamValueReset();
	SE.Event.addListener(newMarker, "click", function() {
		var infowin = newMarker.openInfoWinHtml(createInfoWindow(xy,beginTime,endTime));
		infowin.setTitle(xy.no);
		infowin.setHeight(195);
	});
}

/***
 * 时间差
 * @param beginTime
 * @param endTime
 * @returns {Number}
 */
function timeDiff(beginTime,endTime){
	var sTime=new Date(Date.parse(beginTime.replace(/\-/g, "/")));
	var eTime=new Date(Date.parse(endTime.replace(/\-/g, "/")));
	//if (eTime<sTime) alert("ldflo");
	return (eTime.getTime() - sTime.getTime())/1000; //返回秒
}

/**
 * 秒转换为HH：mm：ss格式
 * @param seconds
 * @returns {String}
 */
function toTime(seconds){
	   var hh;
	   var mm;
	   var ss;
	   //传入的时间为空或小于0
	   if(seconds==null||seconds<0){
	       return;
	   }
	   //得到小时
	   hh=seconds/3600|0;
	   seconds=parseInt(seconds)-hh*3600;
	   if(parseInt(hh)<10){
	          hh="0"+hh;
	   }
	   //得到分
	   mm=seconds/60|0;
	   //得到秒
	   ss=parseInt(seconds)-mm*60;
	   if(parseInt(mm)<10){
	         mm="0"+mm;    
	   }
	   if(ss<10){
	       ss="0"+ss;      
	   }
	   return hh+":"+mm+":"+ss;
	   
	}

function createimg(latlng, no,obCar) {
	var  newMarker= markerUtils_T.crateIconMarker(latlng, no,obCar);
	SE.Event.addListener(newMarker, "click", function() {
		var infowin = newMarker.openInfoWinHtml(createInfoWindow(obCar));
		infowin.setTitle(obCar.no);
		infowin.setHeight(195);
	});
	return newMarker;
}
//////////////////////轨迹回放 End-update by Pomelo(柚子.) 2013-05-15//////////////////////
//lujunyong 注释的
//window.onresize = resizeListener;
function resizeListener() {
	alert(1);
	var maparea = $('map');
	alert(maparea.style);
	var bar = $('bar');
	bar.style.width = getMapWidth() + "px";
	alert(getMapWidth());
	maparea.style.width = getMapWidth() + "px";
	maparea.style.height = getMapHeight() - 27 + "px";
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
function createInfoWindow(obCar,beginTime,endTime) {
	// lat,lon ,sd,gs,gd,gt,st,m,o
	// 经度,纬度,速度,状态,司机信息,时间,停车时长|停车时长毫秒,里程,油位
	var time=obCar.gt;
	 time=time.replace(" ","@")
	 var div ='<div><table width="290" border="0" cellspacing="2" cellpadding="0" style="font-size: 12px;">';
	 div+=	(beginTime==undefined ? '':'<tr><td height="18"  colspan="2">停车时间：'+toTime(timeDiff(beginTime,endTime))+'('+beginTime+ '---'+endTime+')</td></tr>'  );
	div+='<tr bgcolor="#e6eaea"><td colspan="2" height="30">'+obCar.gs+'</td></tr>'
	   +'<tr><td height="18">速度：'+obCar.sd+'公里/小时</td></tr>'
	   + '<tr bgcolor="#e6eaea"><td height="18">经度：' + obCar.lon+ '</td>' + '<td >纬度：' + obCar.lat + '</td></tr>' 
	   + '<tr ><td height="18">所属行业：' + obCar.kindName+ '</td>' + '<td >所属业户：' + obCar.workunitName + '</td></tr>' 
	    +'<tr bgcolor="#e6eaea"><td><a href="javascript:void(0)" onclick=getDriverMessage("' +time+ '","' + obCar.sim+ '")> 查看司机信息</a></td><td><a href="javascript:void(0)" onclick=getLocationInfo("' + obCar.sim + '","' + obCar.lat + '","' + obCar.lon + '")> 显示位置</a></td></tr>'
	   +'<tr><td colspan="2" id="message" height="50">&nbsp;</td></tr></table></div>';
	div = div
			+ "<table width='260px' height='12px' cellspacing='0' cellpadding='0'><tr><td><span style='color:#0000cc;cursor:pointer;text-decoration:underline;font-size:12px;' onclick='javascript:map.closeInfoWindow();'></span></td>";
	div = div + "<td style='font-size:12px;background:#e6eaea;' align='right'>定位时间:" + obCar.gt + "</td></tr></table>"
	try {
		return div;
	} finally {
		div = null;
	}
}
 

/**
 * 获取车辆驾驶员信息
 * @param {} vehicleId
 */
function getDriverMessage(gpsTime,vehicleId){
		document.getElementById("message").innerHTML = '<img src="imgs/load.gif" />正在加载数据......';
  	gpsTime=gpsTime.replace("@"," ");
   var jsonParams = {
		gpsTime : gpsTime,
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
		    	//var workCertificate=data.workCertificate;//从业资格证号
		    	
		    	var message="姓名:"+(!data.name?"":data.name);
		    	if(drivingLicence!=''){
				    	message+="&nbsp;驾驶证号码:"+(!drivingLicence?"":drivingLicence);
				}
		    	
			    if(driverIC!=''){
			    	message+="&nbsp;IC卡号:"+(!driverIC?"":driverIC);
			    }
			   
			    if(zdDriverCode!=''){
			    	message+="&nbsp;司机编号:"+(!zdDriverCode?"":zdDriverCode);
			    }
		    	
//			    if(workCertificate!=''){
//			    message+="&nbsp;从业资格证号:"+workCertificate;
//			    }
		   $("#message").html(message);
		}else{
			$("#message").html("当前没有司机信息");
		  }
		}
		
	});
	
} 

//弹出窗口,取中文地址
function getLocationInfo2(id,sim,lat,lon) {
	$("#"+id).html('<img src="imgs/load.gif" />正在加载数据......');
	
	 var param={
    		 date:new Date(),
             lnglat:lon+","+lat	 
             }
	 
	  var url="monitorCenter/getAddressRepeat.action";
	  	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data: param,
		success:function(data){
		try{
			if(data.status=="ok"){
				$("#"+id).html(data.result.district_text);
			}else{
				$("#"+id).html(data.result.error);
			}
		   }catch(exception){
			   $("#"+id).html("因网络不畅，数据加载未完成,请稍后再试！");
		 }
		
	} ,
	error:function(){
		$("#"+id).html("因网络不畅，数据加载未完成,请稍后再试！");
	}

		
	});
}	  	
//弹出窗口,取中文地址
function getLocationInfo(sim,lat,lon) {
	$("#message").html('<img src="imgs/load.gif" />正在加载数据......');
	
	 var param={
    		 date:new Date(),
             lnglat:lon+","+lat	 
             }
	 
	  var url="monitorCenter/getAddressRepeat.action";
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
			   $("#message").html("因网络不畅，数据加载未完成,请稍后再试！");
		 }
		
	} ,
	error:function(){
		$("#message").html("因网络不畅，数据加载未完成,请稍后再试！");
	}

		
	});
}
function exportTrack(basePath){
	var xx = $("#beginTime").val().split(/[-\s:]/); // 开始时间
	var yy = $("#endTime").val().split(/[-\s:]/); // 结束时间
	
	if (xx == '' || yy == '') {
		alert('查询时间段不能为空');
		return false;
	}
	var beginTime = (new Date(xx[0], xx[1] - 1, xx[2], xx[3], xx[4], xx[5])).valueOf(); // 把时间转换成毫秒数
	var endTime = (new Date(yy[0], yy[1] - 1, yy[2], yy[3], yy[4], yy[5])).valueOf(); // 把时间转换成毫秒数
	if(beginTime>endTime){
		alert('开始时间必须大于或等于结束时间!');
		return false;
	}
		if((endTime - beginTime) > 259200000){
		alert('请将查询时间段控制在3天以内!');
		return false;
	}
    
     document.location.href=basePath+'monitorCenter/exportTrack.action?vehicleId=' +vehicleId+'&beginTime='+beginTime + '&endTime='+ endTime;
	
}

//返回车辆监控ljy
function backMonitor(basePath){
//	parent.mapFrame.location.href=basePath+"monitorCenter/map.jsp";
	parent.parent.mapFrame.location.href=basePath+"monitorCenter/group.jsp?vehicleId=null&registrationNo=null&index=0";
	}