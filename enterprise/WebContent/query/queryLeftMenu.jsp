<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<head>
<title>道路运输车辆卫星定位企业平台</title>

<base href="<%=basePath%>"></base>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">

<script src="<%=basePath%>js/jq/jquery-1.7.1.min.js"
	type="text/javascript"></script>

<link href="<%=basePath%>css/body.css" rel="stylesheet" type="text/css" />
<!--[if IE 6]>
<link rel="stylesheet" type="text/css" href="Css/ie6_hack.css">
<![endif]-->
<script>
	$(document).ready(function() {
		$("dd:not(:first)").hide();
		$("dt").click(function() {
			$("dd:visible").slideUp("slow");
			$(this).next().slideDown("slow");
			var dtNodes = $("dt");
			$.each(dtNodes, function(i) {
<%--				if ($(this).attr("style") == "BACKGROUND:#D8D8D8")--%>
<%--					$(this).attr("style", "BACKGROUND:#bfd5fd");--%>
					$(this).attr("style", "BACKGROUND:#D8D8D8");
			});

			$(this).attr("style", "BACKGROUND:#bfd5fd");
			return false;
		});

		$("a").click(function() {
			var checkedNodes = $("a");
			$.each(checkedNodes, function(i) {
				$(this).attr("style", "");
			});
			$(this).attr("style", "background:#bfd5fd");
		});		
		//$('#menu').css("height", getHeight()+ "px");
	});
</script>
<script type="text/javascript">
	var twoLevelStaVal = "-1";
	var threeLevelStaVal = "-1";
</script>
<%
	String parentId = request.getParameter("parentId");
	request.setAttribute("parentId", parentId);
%>

</head>
<body>
	<div id="cont_box">
	<div class="main">
    	<div class="left mon_meun">
        	<div class="E_Tit">历史查询</div>
          	<dl id=navigation class="nav" style="margin-top: 2px;">
		 <!-- 查询统计 -->  
		  <s:action id="twoLevelMenu" name="getUserTwoMenus" namespace="/sys" >
		  	<s:param value="parentId" name="parentId"/>
		  </s:action>
			  <s:action id="threeLevelMenu" name="getUserThreeMenus" namespace="/sys" >
			  	<s:param value="parentId" name="parentId"/>
			  </s:action>
			  <div style="overflow:auto;height:420px" id="menu">
			  <s:iterator value="#twoLevelMenu.userTwoLevelList" id="menu" status="twoLevelSta">
			  
					<script language="javascript">		
						if(twoLevelStaVal == "-1"){
							twoLevelStaVal = "${twoLevelSta.index}";
						}
					</script>
				 	 <dt>${menu.functionName }</dt>
				 	 <dd><ul>
						<s:iterator value="#threeLevelMenu.userThreeLevelList2" id="cm" status="threeLevelSta">
							<s:if test="#menu.functionId == #cm.parentFuncId">
								<li style="padding-top: 0px;"><a href="${pageContext.request.contextPath}${cm.assemblyName}" target="rightFrame">${cm.functionName }</a></li>
								<script language="javascript">
									if(threeLevelStaVal == "-1"){
										threeLevelStaVal = "${threeLevelSta.index}";
									}
									
									var currentTwoLevelSta = "${twoLevelSta.index}";
									var currentThreeLevelSta = "${threeLevelSta.index}";
									
									if(currentTwoLevelSta == twoLevelStaVal && currentThreeLevelSta == threeLevelStaVal){
										var rightUrl = "${pageContext.request.contextPath}${cm.assemblyName}";
										$('#rightFrame', window.parent.document).attr("src",rightUrl);
									}

									/**添加样式div ljy**/
									var dtNodes = $("dt");
									$.each(dtNodes, function(i) {
										if(i==0){
											$(this).attr("style", "BACKGROUND:#bfd5fd");
										}
									});
									/**添加样式a标签**/
									var checkedNodes = $("a");
									$.each(checkedNodes, function(i) {
										if(i==0){
											$(this).attr("style", "background:#bfd5fd");
										}
									});
								</script>
							</s:if>
						</s:iterator>
					</ul></dd>
 			</s:iterator>
 			</div>
		 	</dl>
		</div>
 	</div>
 </div>
 </body>
</html>
