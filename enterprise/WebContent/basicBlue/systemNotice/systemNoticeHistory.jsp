<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/common/validateHead.jsp"%>
<%@taglib prefix="auth"  uri="/auth-tags"  %>

<link href="<%=basePath%>css/jq/jquery-ui.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/body.css">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<style type="text/css">
body{overflow:hidden;}
.titilefont{font:16px/180% Arial, Helvetica, sans-serif, "新宋体"; font-weight: bold; color:#e5fefe;}
.tess{ font:12px/180% Arial, Helvetica, sans-serif, "新宋体";}
.box01 {
background-color: transparent;
border-bottom: none;
border-right-width: 0px;
border-left-width: 0px;
border-top-width: 0px;
border-top-style: none;
border-right-style: none;
border-left-style: none;
padding: 0px;
margin: 0;
font:12px/180% Arial, Helvetica, sans-serif, "新宋体";
color:#e5fefe;
}
.divlable{white-space:nowrap; overflow:hidden;}




</style>

	<head>
		<title>系统公告设置</title>
		<script type="text/javascript" src="${basePath}js/sys/systemNotice/systemNoticeHistory.js"></script>
		
	</head>
	<body style="width: 550px; height:490px; background-color: #fff; overflow-x:hidden;overflow-y:hidden;">
	   <div id="historyPage" style="width: 560px; height:460px; overflow-x:hidden; overflow-y:auto;">
        </div>
        <div style="height: 30px; width: 550px; text-align: " align="center" id="moreNotice"></div>
	</body>
</html>
