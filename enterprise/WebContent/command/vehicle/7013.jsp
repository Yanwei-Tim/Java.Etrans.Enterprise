<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://"
		+ request.getServerName() + ":" + request.getServerPort()
		+ path + "/";
%>
<html>
	<head>
	<base href="<%=basePath%>"></base>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>指令发送</title>
		<link href="<%=basePath%>css/command.css" type="text/css" rel="stylesheet" />
		 <script type="text/javascript">
		
			function getParam()
			{
				return {"paramMsg":""};
			}
		
		</script>
	</head>

	<body>
	
      <br/>
	 <table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr><td height="20">&nbsp;</td></tr>
			<tr>
			  <td width="100%" align="center">
				   <fieldset style="border-Color:#80CAEA;width: 98%;"><legend>取消交换指定车辆定位信息请求:指令参数</legend>
				  		<table width="100%" cellpadding="0" cellspacing="1">
				            
				            <tr>
				              <td >该指令无需参数</td>				      
		          		</table>
				  </fieldset>
			  </td>
			</tr>
				<tr>
	<td>
	<div id="tip"></div>
	</td>
		</tr>
		 <tr>
		 <td valign="top"><a href="javascript:void(0)" onClick="parent.sendMessage2(getParam());">&nbsp;&nbsp;&nbsp;<img src="imgs/command.gif"  border="0"></a>
	   </td>
		</table>
	</body>
</html>