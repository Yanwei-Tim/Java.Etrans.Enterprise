<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.etrans.bubiao.sys.Constants"%>
<%@page import="com.etrans.bubiao.auth.SessionUser"%>
<%
	SessionUser user = new SessionUser(); //用户
	user = (SessionUser)request.getSession().getAttribute(Constants.LOGIN_USER);
	//用户过期了，跳转到登陆页面
	if(user == null)
	{
		response.sendRedirect("../");
	}

	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	
	/**接收参数**/
	//默认为1【由monitor.jsp传过来的，为空控制初始化页面不报错】
	String vehicleId=request.getParameter("vehicleId");
	//默认为1【由monitor.jsp传过来的，为空控制初始化页面不报错】
	String registrationNo = new String(request.getParameter("registrationNo").getBytes("ISO-8859-1"),"utf-8");
	//功能索引【0标示监控页面，1标示轨迹回放，2标示重点监控】
	String index=request.getParameter("index");
%>
<html>
<head>
<base href="<%=basePath%>"></base>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>车辆监控</title>
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/body.css">
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/group.css">

<script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>mapgis/TileAjax/js/Prototype.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/group.js"></script>
</head>


<body>

<div id="cont_box">
<div style="position:absolute;clear:both; width:40%;folat:right;margin-left:60%;">    
    
    	<div id="title" class="tab-hd">
			<div style="width:80px;">主监控</div>
			<div style="width:80px;">轨迹回放</div>
			<div style="width:80px;">单车跟踪</div>	
		
			
			
				<select id="mapselect" style="padding-top: 20px;" onchange="changeForm(this.value)">
					<!--实用开放-->
<!-- 					<option value="1">默认地图</option> -->
<!-- 					<option value="2">泰瑞地图</option> -->
					
					<!--过检开放-->
					<option value="2">默认地图</option>
					<option value="1">百度地图</option>
			</select>
    	</div>

</div>

<div id="count" class="tab2">
<div class="mon_cont">

<div  class="tab-bd">
	<div id="monitor" style="border: 0px;"></div>
	<div id="contrail"></div>
	<div id="scout"></div>
</div>

</div>
<%--用作测试【还有用】begin--%>
<%--<input onClick="a();"  type="button" value="中文转换" style="width:130px; height:30px;"/>--%>
<%--<input onClick="showTab('.tab-hd',0,'.tab-bd','active','monitor')"  type="button" value="主监控" style="width:130px; height:30px;"/>--%>
<%--<input onClick="showTab('.tab-hd',1,'.tab-bd','active','contrail')"  type="button" value="轨迹回放" style="width:130px; height:30px;"/>--%>
<%--<!--<input onClick="deleteTab(0,1,'active','.tab-bd','.tab-hd');"  type="button" value="删除第二个标签" style="width:130px; height:30px;"/> -->--%>
<%--<input onClick="showTab('.tab-hd',2,'.tab-bd','active','scout')" type="button" value="重点跟踪" style="width:130px; height:30px;"/>--%>
<%--<input onClick="deleteTab(0,1,'active','.tab-hd','.tab-bd')"  type="button" value="删除轨迹回放" style="width:130px; height:30px;"/>--%>
<%--<input onClick="deleteTab(0,2,'active','.tab-hd','.tab-bd')"  type="button" value="删除重点跟踪" style="width:130px; height:30px;"/>--%>
<%--用作测试【还有用】end--%>
</div>
</div>
</body> 
</html>











