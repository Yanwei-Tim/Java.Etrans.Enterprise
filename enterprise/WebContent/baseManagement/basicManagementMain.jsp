<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>

<base href="<%=basePath%>"></base>

<title>道路运输车辆卫星定位企业平台</title>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">

<script src="<%=basePath%>js/jq/jquery-1.7.1.min.js" type="text/javascript"></script>

<link href="<%=basePath%>css/body.css" rel="stylesheet" type="text/css"/>

<% String parentId=request.getParameter("parentId");
	request.setAttribute("parentId",parentId);
%>


</head>
  <frameset cols="250,*"  frameborder="NO" border="0" framespacing="0">
	<frame src="<%=basePath%>baseManagement/basicManagementLeftMenu.jsp?parentId=${parentId}" name="leftFrame" id="leftFrame"  noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" style="height:100%;width:100%" scrolling="no" />
	<frame src="" name="rightFrame" id="rightFrame"  noresize="noresize" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" />
  </frameset>
 <body>
 </body>
</html>
