<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.etrans.bubiao.sys.Constants"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://"
		+ request.getServerName() + ":" + request.getServerPort()
		+ path + "/";
String vehicleId=request.getParameter("vehicleId");
%>
<html>
<head>
<base href="<%=basePath%>"></base>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Expires" content="0">
<title>实时监控</title>
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/body.css">
<!-- <script type="text/javascript" language="javascript" src="<%=Constants.MAP_BASE_URL%>/SE_JSAPI?&uid=<%=Constants.MAP_UID %>"></script> -->
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.4"></script>
<script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/HashMap.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/convertor.js"></script>
	<script type="text/javascript" src="http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/battention.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/gisHelp.js"></script>
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
<body style="overflow-y: hidden;overflow-x: hidden;border:0px;" onload="load('<%=vehicleId%>');">

<div id="cont_box">
<div class="main2">
 <div class="mon_cont2">
<div id="map" style="width:100%;"></div>
</div></div></div>
</body>
</html>