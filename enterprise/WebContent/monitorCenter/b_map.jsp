<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.etrans.bubiao.sys.Constants"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
<head>
<base href="<%=basePath%>"></base>
<title>企业中心</title>
<meta http-equiv=Content-Type content=text/html;charset=utf-8>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="企业中心">	
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/body.css">
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.4"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/RectangleZoom/1.2/src/RectangleZoom_min.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
<link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
<script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/HashMap.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/bTRGis.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/gisHelp.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/convertor.js"></script>
<script type="text/javascript" src="<%=basePath%>js/easyui/jquery.easyui.min.js"></script>
<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/default/easyui.css">
<style type="text/css">
a:link {color:#FF0000;} /* 没访问过的链接样式 */
a:visited {color:#00FF00;} /* 访问过的链接样式 */
a:hover {color:#FF00FF;} /* 鼠标进入链接区域的链接样式 */
a:active {color:#0000FF;} /* 点击链接时的链接样式 */ 
<!--
body{overflow:hidden;}
.anchorBL{
display:none;
}
-->
</style>
</head>
<body onResize="resizeMap()">
<div id="cont_box">
<div class="main">
 <div class="mon_cont2">
            <div class="map_list">
            	<ul>
                	<li class="map_g_01"  title="放大" onclick="mZoom(0)">放大</li>
                    <li class="map_g_02"  title="缩小" onclick="mZoom(1)">缩小</li>
                    <li class="map_g_03"  title="打印" onclick="printMap()">打印</li>
                    <li class="map_g_04" title="测量"  onclick="measure()">测量</li>
                    <li class="map_g_05" title="清除"  onclick="mapClearAll()">清除</li>
                    <li class="map_g_06" title="查看全图" onclick="AllMap()">全图</li>
                    <li class="map_g_07" title="区域查车" onclick="findRectangleAreaCar()">查车</li>
                    <li class="map_g_08" onclick="manyou()">漫游</li>
                    <li class="map_g_09" title="全屏" id="allScreen">全屏</li>
                </ul>
            </div>
           <div id="map" style="width:100%;height: 500px;border: 0px;"></div>
           
<%--     ljy      --%>
        <div><table width="100%" border="0" cellspacing="0" cellpadding="0" class="mon_t_infor">
              <tr class="mon_t_01">
                <td class="m_t" nowrap="nowrap" width="8%">车牌</td>
                <td class="m_t" nowrap="nowrap" width="5%">车牌颜色</td>
                <td class="m_t" nowrap="nowrap" title="GPS速度(km/h)" width="5%">GPS速度</td>
                <td class="m_t" nowrap="nowrap" title="电子速度(km/h)" width="5%">电子速度</td>
                <td class="m_t" nowrap="nowrap" width="5%">精度</td>
                 <td class="m_t" nowrap="nowrap" title="(km)" width="5%">里程</td>
                <td class="m_t" nowrap="nowrap" width="15%">详细信息</td>
                <td class="m_t" nowrap="nowrap" width="15%">区域信息</td>
                <%--附加信息--%>
                <td class="m_t" nowrap="nowrap" width="15%">附加信息</td>
                <td class="m_t" nowrap="nowrap" width="12%">地址</td>
                <td class="m_t" nowrap="nowrap" width="8%">定位时间</td>
                <td nowrap="nowrap" width="5%">操作</td>
              </tr>
            </table>
           <div style="overflow-x: scroll; overflow-y: scroll; height: 138px; width: 100%;">
<%--           <div style="overflow:auto; height: 143px; width: 100%;">--%>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" id="mytable" class="mon_t_infor">
            </table>
            </div></div> 
  </div>
 </div>
 </div>
 <script type="text/javascript">
 	
   // $('#map').css("width", getMapWidth() + "px");
	$('#map').css("height", getMapHeight() - 180 + "px");

	maplet = new BMap.Map("map");            // 创建Map实例
	var point = new BMap.Point(116.39885,39.96571);    // 创建点坐标
	maplet.centerAndZoom(point,12);                     // 初始化地图,设置中心点坐标和地图级别。
	var myCity = new BMap.LocalCity();
	myCity.get(myFun);
	maplet.enableScrollWheelZoom();                            // 启用滚轮放大缩小
	maplet.addControl(new BMap.NavigationControl());
	maplet.addControl(new BMap.ScaleControl());  
	maplet.addControl(new BMap.OverviewMapControl()); 
	maplet.enableContinuousZoom();
	maplet.enableAutoResize();
	control = new BMapLib.RectangleZoom(maplet);
	maplet.addControl(new BMap.MapTypeControl({
		mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
		}));
	resizeMap();

	maplet.checkResize();    //通知地图容器尺寸发生变化
	maplet.enableAutoResize();//启用自动适应容器尺寸变化，默认启用。
	
	var allScreen=$('#allScreen');
	allScreen.unbind("click");
	allScreen.bind("click",fullScreen);
	$.messager.defaults={ok:"确定",cancel:"取消"};
	
	
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
    };
    var drawingManager = new BMapLib.DrawingManager(maplet, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale: 0.8 //工具栏缩放比例
        },
        rectangleOptions: styleOptions //矩形的样式
    });
    //使用地图工具事件

    drawingManager.addEventListener('overlaycomplete', function(e){
        var params = "";
        for(var i = 0; i < e.overlay.getPath().length; i++){
               params = params
                           + ";"
                           + e.overlay.getPath()[i].lng
                           + "|"
                           + e.overlay.getPath()[i].lat;
        }
    maplet.removeOverlay(e.overlay);
	var lnglat=params.substring(1,params.length);
	var temp=new Array();
	temp=lnglat.split(";");
	leftlat = temp[3];//西南(左下角)经度|纬度【temp里面的值分别排列是（左上，右上，右下，左下）】
	rightlat = temp[1];//东北（右上角）经度|纬度
			var jsonParams = {
				leftLatLon : leftlat,
				rightLatLon : rightlat,
				mapType:1
			};
			$.ajax( {
				url : "monitorCenter/findRectangleAreaCar.action",
				type : "POST",
				dataType : "json",
				data : jsonParams,
				success : function(data) {
					if (data == "false" || data == false) {
						$.messager.alert('提示信息', '该区域没有车辆！', 'info');
					} else {
						$(data).each(function(i, n) {
							var vehicleId = n;
							addCallGps(vehicleId);
						});
					}
				}

			});

			drawingManager.close();
		});
	
    function myFun(result){
	    var cityName = result.name;
	    maplet.setCenter(cityName);
	}
	//画矩形
	function PaintingMap() {
		try {
			//   drag.close();
			drawingManager.open();
			drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
		} catch (e) {
		}
	}

	function addCallGps(vehicleId){
		parent.parent.leftFrame.addVehicle(vehicleId);
		parent.parent.leftFrame.vehicleCallTrack(vehicleId);//订阅
		parent.parent.leftFrame.addCheckBox(vehicleId);
	}


	//显示标注
	showPoint();
</script>
</body>
</html>
