<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.etrans.bubiao.sys.Constants"%>
<%@ page import="com.etrans.bubiao.sys.UserContext" %>
<%@ page import="com.etrans.bubiao.auth.SessionUser"%>
<%@page import="java.net.URLEncoder"%>

<%

	SessionUser user = new SessionUser(); //用户
	user = (SessionUser)request.getSession().getAttribute(Constants.LOGIN_USER);
	if(user == null)
	{
		response.sendRedirect("../");
	}
	
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
			
	String username = user.getUserName();
	String pwd = user.getPassword();
	//编码
	URLEncoder.encode(username,"utf-8");
	//src="http://www.hao123.com?'<%=URLEncoder.encode(username,"utf-8")
%>

<html>
<head>
<base href="<%=basePath%>"></base>
<title>报警设置系统</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">

</head>
<%--net 报警设置系统http://116.254.206.2:8099/Index.aspx?user=admin&pwd=admin--%>
<%--<iframe src="http://192.168.2.16:8080/Index.aspx?user=admin&pwd=admin" id="netMain" width=100% height=100% marginwidth=0></iframe>--%>
<div style="height: 100%; width: 100%">
<% 
	String parentId=request.getParameter("parentId");
	boolean isAdmin = (UserContext.isBsRootUser()|| UserContext.getLoginUser().isWorkUnitSuperAdmin() );
	int isAdminFlag =0;
	if(UserContext.isBsRootUser()){
		isAdminFlag=2;
	}else if(UserContext.getLoginUser().isWorkUnitSuperAdmin()){
		isAdminFlag=1;
	}else{
		isAdminFlag =0;
	}
%>
<style>
*{
margin:0px;
}
</style>
<iframe src="http://116.254.206.2:8016/NewIndex.aspx?user=<%=username%>&pwd=<%=pwd%>&isAdmin=<%=isAdminFlag %>&parentId=<%=parentId %>&userId=<%=UserContext.getLoginUserID() %>"  id="netMain" width=100% height=100% frameborder=no marginwidth=0></iframe>
</div>
<body style="overflow:hidden">
</body>
</html>
