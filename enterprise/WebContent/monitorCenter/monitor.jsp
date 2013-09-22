<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@page import="com.etrans.common.util.web.IpUtils"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
			
			String ipType="";//ip类型
			ipType = (String)request.getSession().getAttribute(IpUtils.LOGIN_IP_TYPE);
%>

<html>
<head>
<base href="<%=basePath%>"></base>
<title>车辆监控</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<script type="text/javascript" src="<%=basePath %>js/jq/jquery-1.7.1.min.js"></script>
<style type="text/css">
*{margin:0px;}
</style>

<script type="text/javascript">
$(function() {
	
	/**设置宽度**/
	var width = $("#count").width();
	var rightDivWidth = parseFloat(width)-285-10;
	//alert("宽度："+rightDivWidth);
	$("#rightdiv").width(rightDivWidth+"px");
	
});
	
</script>
</head>
<%--左，中，右分--%>
<%--<frameset cols="285,10,*"  frameborder="NO" border="0" framespacing="0" id="frame">--%>
<%--	<frame src="<%=basePath%>monitorCenter/left.jsp" name="leftFrame" id="leftFrame"  noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" style="height:100%;width:100%" scrolling="no" />--%>
<%--	<frame name="Dycenter" src="<%=basePath%>monitorCenter/MidMenu.jsp"  scrolling="no" border="0" frameborder="NO"  noresize>--%>
<%--	if内网 反之是外网--%>
<%--	<% if(ipType.equals(IpUtils.INNERIP)){%>--%>
<%--		<frame src="<%=basePath%>monitorCenter/group.jsp?vehicleId=null&registrationNo=null&index=0" name="mapFrame" id="mapFrame"  noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" />--%>
<%--  	<%} else if(ipType.equals(IpUtils.OUTERIP)){%>--%>
<%--  		<frame src="<%=basePath%>monitorCenter/P_map.jsp" name="mapFrame" id="mapFrame"  noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" />--%>
<%--  	<%} %>--%>
<%--  </frameset>--%>
<body>
	<!-- div版本 -->
	<div id="count" style=" width: 100%; height:100%;">
		<div style=" width: 285px; height:100%; float:left;" id="leftdiv" >
			<iframe src="<%=basePath%>monitorCenter/left.jsp" id="leftFrame" name="leftFrame" width=100% style="border: 0px;" height="100%;" marginwidth="0" frameborder="0" scrolling="no" ></iframe>
		</div>
		<div style="width: 10px; height:100%; float:left;" id="countdiv">
			<iframe src="<%=basePath%>monitorCenter/MidMenu.jsp" name="Dycenter" width=100%; style="border: 0px;" height="100%;" marginwidth="0" frameborder="0" scrolling="no" ></iframe>
		</div>
		<div style="height:100%; float:left;" id="rightdiv">
<%--			if内网 反之是外网--%>
			<% if(ipType.equals(IpUtils.INNERIP)){%>
		  		<iframe src="<%=basePath%>monitorCenter/group.jsp?vehicleId=null&registrationNo=null&index=0" id="mapFrame" name="mapFrame" width=100% style="border: 0px;" height="100%;" marginwidth="0" frameborder="0" scrolling="no" ></iframe>
		  	<%} else if(ipType.equals(IpUtils.OUTERIP)){%>
		  		<iframe src="<%=basePath%>monitorCenter/P_map.jsp" id="mapFrame" name="mapFrame" width=100% style="border: 0px;" height="100%;" marginwidth="0" frameborder="0" scrolling="no" ></iframe>
		  	<%} %>
		</div>
	</div>
	

</body>
</html>
