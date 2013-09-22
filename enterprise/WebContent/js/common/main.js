var  map;
var pointHashMap = new HashMap();
var lableHashMap = new HashMap();

var styleOptions = {
	    strokeColor: "red",    //边线颜色。
	    fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
	    strokeWeight: 3,       //边线的宽度，以像素为单位。
	    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
	    fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
	    strokeStyle: 'solid' //边线的样式，solid或dashed。
	};

$(function() {
	//获取用户设置数据
	getUserMenu();
	getUserSet(1,"setAlarm");
	getUserSet(2,"setTa");
	
	getTaCount();
	getAlarmCount();
	//initAlarmChart();
	 
	initAction();
	
	$('#mainMap').css("width", getMapWidth() -930+"px");
	$('#mainMap').css("height",getMapHeight()-295+ "px");
	map = new BMap.Map("mainMap");
	var point = new BMap.Point(116.39885,39.96571);    // 创建点坐标
	map.centerAndZoom(point,4);                     // 初始化地图,设置中心点坐标和地图级别。
	map.enableScrollWheelZoom();                            //启用滚轮放大缩小
	//map.addControl(new BMap.NavigationControl());
	map.addControl(new BMap.ScaleControl());  
	//map.addControl(new BMap.OverviewMapControl());   

	showPoint();
	
});

function initAction(){
	$(".box-title .icon.chevron").click(
			function() {
				$(this).toggleClass("icon-chevron-up").toggleClass(
						"icon-chevron-down");
				$(this).parents(".box:first").find(".box-content")
						.toggle('fast');
			});
	
	$("#setMenu").click(function(){
		$("#frModal").attr("src",basePath+"common/shortcutSet.jsp");
		$('#setMyMenu').modal();
	});
	
	$("#btnAlarmSet").click(function(){
		var alarmIds=[];
		var $chk=$("#setAlarm").find("input[type='checkbox']:checked");
		if ($chk.length>6){
			alert("只能选择六个选项！");
			return;
		}
		$chk.each(function(){
			alarmIds.push($(this).attr("alarmId"));
		});
		saveUserSet(alarmIds.toString(),1);
		$("#setAlarm").modal('hide');
		getAlarmCount();
	});
	
	$("#btnTaSet").click(function(){
		var ids=[];
		var $chTa=$("#setTa").find("input[type='checkbox']:checked");
		if ($chTa.length>6){
			alert("只能选择六个选项！");
			return;
		}
	    	$chTa.each(function(){
			if ($(this).attr("checked")){
				ids.push($(this).attr("taId"));
			}
		});
		saveUserSet(ids.toString(),2);
		$("#setTa").modal('hide');
		getTaCount();
	});
	
	//关闭后重设iframe的src为空
	$('#divWin').on('hidden', function () {
		$("#frWin").attr("src","");
	});
	
}

/**
 * 保存用户设置
 * @param selectIds
 * @param type
 */
function saveUserSet(selectIds,type){
	$.ajax({
		type : "POST",
		url : basePath+"sys/userMenu/saveUserSet.action",
		data : {
			selectIds : selectIds,
			type : type
		},
		dataType : "JSON",
		success : function(data) {
			
		}
	});
}

/**
 * 获取用户设置
 * @param typeCode
 */
function getUserSet(typeCode,divId){
	$.ajax({
		type : "POST",
		async: false,
		url : basePath+"sys/userMenu/getUserSet.action",
		data : {
			typeCode : typeCode
		},
		dataType : "JSON",
		success : function(data) {
			if (data){
				var len=data.length;
				if (len==0) return;
				$("#"+divId).find("input[type='checkbox']").each(function(){
					$(this).removeAttr("checked");
				});
				for(var i=0;i<len;i++){
					$("#ckb_"+typeCode+"_"+data[i].statisticsTypeId).attr("checked","checked");
				}
			}
		}
	});
}

/**
 * 初始化报警图表
 */
function initAlarmChart(categories,data){
	var  chart = new Highcharts.Chart({
         chart: {
             renderTo: 'chartAlarm',
             type: 'column',
             marginBottom: 50
         },
         title: {
             text: ''
         },
         xAxis: {
             categories: categories,
             labels:{
            	 rotation:-10,
            	 x:0,
            	 y:40
             }
         },
         legend:{
        	 layout: 'vertical',
        	 align: 'right',
             verticalAlign: 'top',
             y:-10,
             x:10,
             itemStyle: {
             	lineHeight: '14px'
             },
             floating: true        
        },
         tooltip: {
             formatter: function() {
                 var s;
                 if (this.point.name) { // the pie chart
                     s = ''+
                         this.point.name +': '+ this.y +' fruits';
                 } else {
                     s = ''+
                         this.x  +': '+ this.y;
                 }
                 return s;
             }
         },
         labels: {
             items: [{
                 html: '报警数目',
                 style: {
                     left: '40px',
                     top: '8px',
                     color: 'black'
                 }
             }]
         },
         series: data
     });
}

/**
 * 初始化TA统计图表
 */
function initTaChart(data){
	var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chartTa',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            spacingTop:30,
            margin:[25,0,25,0]
        },
        title: {
            text: ''
        },
        tooltip: {
    	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
        	percentageDecimals: 1
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(1) +' %';
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '报警率',
            data: data
        }]
    });
}

/**
 * 获取TA统计
 */
function getTaCount(){
	var names="";
	var taNames=[];
	$("#setTa").find("input[type='checkbox']").each(function(){
		if ($(this).attr("checked")){
			taNames.push($(this).attr("taName"));
		}
	});
	names=taNames.toString();
	$.ajax({
		type : "POST",
		url : basePath+"sys/userMenu/getTaCountList.action",
		success : function(data) {
			if (data) {
				var arrs=[];
				var len=data.length;
				var sum=0;
				for(var j=0;j<len;j++){
					sum+=Number(data[j].Number);
				}
				for(var i=0;i<len;i++){
					if (names.indexOf(data[i].Code)<0) continue;
					var item=[];
					item.push(data[i].Type);
					if (data[i].Number=="0"){
						item.push(0);
					}
					else{
						item.push(Math.round(Number(data[i].Number)/sum*1000)/10); //精确到一位小数点
					}
					
					arrs.push(item);
				}
				initTaChart(arrs);
			}
		},
		error:function(data){
			alert(data);
		}
	});
}

/**
 * 获取报警统计
 */
function getAlarmCount(){
	var alarmIdList="";
	var alarmIds=[];
	$("#setAlarm").find("input[type='checkbox']").each(function(){
		if ($(this).attr("checked")){
			alarmIds.push($(this).attr("alarmId"));
		}
	});
	alarmIdList=alarmIds.toString();

	$.ajax({
		type : "POST",
		url : basePath+"sys/userMenu/getAlarmCount.action",
		data : {
			alarmIdList : alarmIdList
		},
		dataType : "JSON",
		success : function(data) {
			if (data) {
				var arrs=[];
				var alarmData=[];	//报警数据数组
				var handleData=[];	//已处理数组
				var alarmObj={};
				alarmObj.name="未处理";
				var handleObj={};
				handleObj.name="已处理";
				var categories=[];
				var len=data.length;
				for(var i=0;i<len;i++){
					categories.push(data[i].Name);
					alarmData.push(data[i].AlarmSum);
					handleData.push(data[i].HandleSum);
				}
				alarmObj.data=alarmData;
				handleObj.data=handleData;
				arrs.push(alarmObj);
				arrs.push(handleObj);
				
				initAlarmChart(categories,arrs);
			}
		}
	});
}

/*
 * 打开快捷菜单
 */
var openWin=function(src,name){
	//$("#frWin").attr("src",src);
	//$('#divWin').modal();
	parent.parent.openDialog(src, 1200, 530,name);
};
/**
 * 关闭窗口
 */
var closeWin = function() {
	$("#setMyMenu").modal('hide');
};

/**
 * 获取用户所有的菜单设置
 */
function getUserMenu() {
	var $boxContent = $("#myMenu");
	$.ajax({
				type : "POST",
				url : basePath+"sys/userMenu/getUserMenu.action",
				success : function(data) {
					if (data) {
						var len = data.length;
						if (len == 0) { //默认菜单
							$boxContent.empty();
							$boxContent.append($("#defaultMenu").html());
							return;
						}
						var htmlStr = "";
						for ( var i = 0; i < len; i++) {
							if (i == 0 || i % 4 == 0) {
								htmlStr += "<div class='row-fluid'>";
							}
							var path=data[i].url.indexOf(".aspx")>0 ? data[i].url:basePath+data[i].url;
							htmlStr += "<a href='javascript:void(0)' onClick=\"javascript:openWin('"+path+"','"+data[i].functionName
								+"')\" class='span3'><img src='"
									+basePath+data[i].imageURL+"' alt='"+ data[i].functionName  + "'><p>"
									+ data[i].name + "</p></a>";
							if ((i + 1) % 4 == 0) {
								htmlStr += "</div>";
							}
						}

						$boxContent.empty();
						$boxContent.append(htmlStr);
					} else {
						alert("Fail:" + data);
					}
				}
			});
}



//显示标注
function showPoint(){
		 var jsonParams = {
					datetimes : new Date()
		 };
		 $.post("customMapPoint/getEntCustomMapByUserList.action", jsonParams, function(data) {
			 if (data != 'false') {
					var arrlist = data ;
					for ( var a = 0; a < arrlist.length; a++) {
						var id =arrlist[a].id;
						var name =arrlist[a].name;
						var LonLat =arrlist[a].LonLat;
						var CustomType =arrlist[a].CustomType;
						var Radius =arrlist[a].Radius;
						var imageURL =arrlist[a].imageURL;
						var nameType=arrlist[a].nameType;
						if(CustomType=="1"){
					    	var LonLats=LonLat.split(",");
							var lng=LonLats[0];
							var lat=LonLats[1];
							addMarkerList(lng,lat,imageURL,id,name,nameType);
					    }else{
					    	showAreaList(id,name,LonLat,CustomType,Radius);
					    }
					}
			  }
		 });
	 }	


function addMarkerList(lng,lat,imageURL,id,name){  // 创建图标对象    
	var point = new BMap.Point(lng,lat); 
	
	var basePath = getRootPath();
	var url= basePath+imageURL;
	var myIcon = new BMap.Icon(url, new BMap.Size(32, 42), {     
		// 指定定位位置。    
		// 当标注显示在地图上时，其所指向的地理位置距离图标左上     
		// 角各偏移10像素和25像素。您可以看到在本例中该位置即是    
	   // 图标中央下端的尖角位置。     
	   offset: new BMap.Size(10, 25),     
	   // 设置图片偏移。    
	   // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您    
	   // 需要指定大图的偏移位置，此做法与css sprites技术类似。     
	   imageOffset: new BMap.Size(0, 0 * 25)   // 设置图片偏移     
	 });  
	
	// 创建标注对象并添加到地图    
	 var marker = new BMap.Marker(point, {icon: myIcon});     
	 map.addOverlay(marker); 
	 
	 var label = new BMap.Label(name,{offset:new BMap.Size(10,-10)});
		label.setStyle({
         borderColor:"#808080",
         color:"#333",
         cursor:"pointer"
		});
	 marker.setLabel(label);
    
	pointHashMap.put(id,marker);

}

function showAreaList(id,name,LonLat,CustomType,Radius){
	 var pointList = LonLat.split(',');
    var pointArray = [];
    var i = 0;
    while (i < pointList.length) {
        pointArray.push(new BMap.Point(pointList[i], pointList[i + 1]));
        i += 2;
    }
	var overLay;
	switch (CustomType) {
   case 2:
   	overLay = new BMap.Circle(pointArray[0], Radius, styleOptions);
	    addLabelList(pointArray[0],id,name);
       break;
   case 4:
   	overLay = new BMap.Polygon(pointArray, styleOptions);
   	addLabelList(pointArray[0],id,name);
       break;
   case 5:
   	overLay = new BMap.Polygon(pointArray, styleOptions);
   	addLabelList(pointArray[0],id,name);
       break;
   }
	 map.addOverlay(overLay);
	 pointHashMap.put(id,overLay);
}

function addLabelList(point,id,name){
	var opts = {
			  position : point,    // 指定文本标注所在的地理位置
			  offset   : new BMap.Size(8, 8)    //设置文本偏移量
			};
	var label = new BMap.Label(name, opts);  // 创建文本标注对象
	label.setStyle({
		 borderColor:"#808080",
		 color:"#333",
		 fontSize : "12px",
		 height : "20px",
		 lineHeight : "20px",
		 fontFamily:"微软雅黑"
	 });
   map.addOverlay(label); 
   
   lableHashMap.put(id,label);
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


function getRootPath(){    
	//获取当前网址，如： http://192.168.2.133:8080/bubiaoQdn/sys/vehicle/vehicleModifyHistory.jsp    
	var curWwwPath=window.document.location.href;    
	//获取主机地址之后的目录，如：bubiaoQdn/sys/vehicle/vehicleModifyHistory.jsp
	var pathName=window.document.location.pathname;   
	var pos=curWwwPath.indexOf(pathName);    
	//获取主机地址，如：http://192.168.2.133:8080 
	var localhostPaht=curWwwPath.substring(0,pos);    
	//获取带"/"的项目名，如：/bubiaoQdn    
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);    
	return(localhostPaht+projectName);
	
}

