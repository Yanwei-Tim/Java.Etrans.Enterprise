<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.etrans.bubiao.sys.Constants"%>
<%@ page import="com.etrans.bubiao.auth.SessionUser"%>
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
			
	Boolean isShowHandle=user.getIsShowHandle();
	Boolean  isShowNotice=user.getIsShowNotice();
	
	
	
	 //用户资源权限
   String resources = "";
   try{
   if(user!=null){
	   resources = user.getResources();
   }
   }catch(Exception e){e.printStackTrace();}
   
   request.setAttribute("resources",resources);	
%>
<html>

<script type="text/javascript">
var isShowNotice = <%=isShowNotice%>;
var isShowHandle=<%=isShowHandle%>;

 function showHandle(){
	document.getElementById("guide-step").style.display = "block";
	showSearchTip();
	setSearchTip();
}

 var basePath = '<%=basePath%>';
 var resources = '${resources}';

</script>     
<head>
<base href="<%=basePath%>"></base>
<title>道路运输车辆卫星定位企业平台</title>
<meta http-equiv=Content-Type content=text/html;charset=utf-8>
<link href="<%=basePath%>css/command.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/handle.css">
<script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="${basePath}js/easyui/jquery.easyui.min.js"></script>
<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/icon.css">
<script type="text/javascript" src="<%=basePath%>js/common/index.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common/jquery_cookie.js"></script>
<script type="text/javascript" src="js/guide2.js"></script>
</head> 
 
 
<style type="text/css">
*{margin:0;padding:0;list-style-type:none;}
a,img{border:0;}
body{font:12px/180% Arial, Helvetica, sans-serif, "新宋体";background:url(indexImages/paper.jpg);}
#guide-step{width:1365px;height:648px;overflow:hidden;margin:0px auto; no-repeat;position:relative;}
#vehicleMonitoring-step{width:1365px;height:648px;overflow:hidden;margin:0px auto; no-repeat;position:relative;}
/* tipbar 
.tipSwitch,.tipbox,.tipword,.progress li,.tipbar .arrow,.tipBarword{background:url(indexImages/guidebg1.png) no-repeat;}*/
#searchTip{overflow:hidden;}
.tipbox{width:1365px;height:600px;display:none;}
.tipbox .tipboxBtn{position:absolute;display:inline-block;width:25px;height:25px;right:50px;top:20px;cursor:pointer;}
.tipboxNextbtn{position:absolute;display:inline-block;width:160px;height:58px;right:150px;top:95px;cursor:pointer;}
.tipboxNextbtn1{position:absolute;display:inline-block;width:160px;height:58px;right:110px;top:227px;cursor:pointer;}
.tipword{position:absolute;}
#step1{z-index:1005;}
#step2{z-index:1004;}
#step3{z-index:1003;}
#step4{z-index:1002;}
#step1 .tipword{width:1365px;height:600px; left:1px;  background:url(indexImages/guidebg1.png) no-repeat;}
#step2 .tipword{width:1365px;height:600px; left:1px; background:url(indexImages/guidebg2.png) no-repeat;}
#step3 .tipword{width:1365px;height:600px; left:1px; background:url(indexImages/guidebg3.png) no-repeat;}
#step4 .tipword{width:1365px;height:600px; left:1px; background:url(indexImages/guidebg4.png) no-repeat;}
#step4{width:1365px;height:600px;}
#step4 .tipboxBtn{right:50px;top:20px;}
#step4 .tipboxNextbtn{right:140px;top:292px; width:160px;height:58px;}


#searchTipVehicle{overflow:hidden;}
.tipboxVehicle{width:1365px;height:600px;display:none;}
.tipboxVehicle .tipboxBtnVehicle{position:absolute;display:inline-block;width:25px;height:25px;right:50px;top:20px;cursor:pointer;}
.tipboxVehicleNextbtn{position:absolute;display:inline-block;width:160px;height:58px;right:45px;bottom:35px;cursor:pointer;}
.tipboxVehicleNextbtn1{position:absolute;display:inline-block;width:160px;height:58px;right:45px;bottom:35px;cursor:pointer;}
.tipwordVehicle{position:absolute;}
#stepVehicle1{z-index:1005;}
#stepVehicle2{z-index:1004;}
#stepVehicle3{z-index:1003;}

#stepVehicle1 .tipwordVehicle{width:1365px;height:600px; left:1px;  background:url(indexImages/vehicleMonitoring1.png) no-repeat;}
#stepVehicle2 .tipwordVehicle{width:1365px;height:600px; left:1px; background:url(indexImages/vehicleMonitoring2.png) no-repeat;}
#stepVehicle3 .tipwordVehicle{width:1365px;height:600px; left:1px; background:url(indexImages/vehicleMonitoring3.png) no-repeat;}

#stepVehicle3{width:1365px;height:600px;}
#stepVehicle3 .tipboxBtnVehicle{right:50px;top:20px;}
#stepVehicle3 .tipboxVehicleNextbtn{right:45px;bottom:25px; width:160px;height:58px;}
</style>




  

	
 <body>

 <div style="position:relative;">
   <!-- 上级信息、报警的显示层  class="hiddiv"-->
   <div id="dialogs"  class="hiddiv"  style="display: none;padding:5px;top:30px;">
			<iframe src="" id="dialogFrame" name="dialogFrame" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>
   </div>
   
   <!-- 自动弹出， 报警督办、查岗信息层-->
   <div id="dialogs2"  class="hiddiv"  style="display: none;padding:5px;top:30px;">
			<iframe src="" id="showDivFrame" name="showDivFrame" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>
   </div>
   
	<%-- 车辆详细信息层--%>
   	<div id="vehicleInfoDiv" class="hiddiv"  style="display: none;padding:5px;top:30px;" >  
    	<iframe src="" id="dialogFrame2" name="dialogFrame2" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>  
	</div>
	<%-- 指令层--%>
   	<div id="controlDiv" class="hiddiv"  style="display: none;padding:5px;top:30px;" >  
    	<iframe src="" id="dialogFrame3" name="dialogFrame3" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>  
	</div>
	<%-- 文本下发层--%>
   	<div id="quicklyDiv" class="hiddiv"  style="display: none;padding:5px;top:30px;" >  
    	<iframe src="" id="dialogFrame4" name="dialogFrame4" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>  
	</div>
	<%-- 拍照层--%>
   	<div id="photoDiv" class="hiddiv"  style="display: none;padding:5px;top:30px;" >  
    	<iframe src="" id="dialogFrame5" name="dialogFrame5" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>  
	</div>
	<%-- 视频层--%>
   	<div id="videoDiv" class="hiddiv"  style="display: none;padding:5px;top:30px;" >  
    	<iframe src="" id="dialogFrame6" name="dialogFrame6" width="100%"  height="100%" frameborder="0" scrolling="yes"></iframe>  
	</div>
  
	
   <iframe src="common/index3.jsp" id="mainIndexFrame" width=100% height=100% marginwidth=0></iframe>
    
   <div id="showHideDiv" style="position:absolute; display: none; right:10px; bottom:35px;z-index:1111; height:180px; width:98px;
       border: solid 4px #3394c9; background-color: #fff" >
       <table  height="100%"  width="100%" style="text-align: center;" border="0">
       <tr onclick="openIcon('<%=basePath%>','openLowerLevelMessage')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'">
         <td height="25">
		   <img src="Images/ico/zdxx.png" id="imgLowerMessage" width="17" height="18"/>&nbsp;&nbsp;
		   <label>终端信息</label>
         </td>
       </tr>
       <tr  onclick="openIcon('<%=basePath%>','openHigherLevelMessage')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'">   
         <td  height="25">
		   <img src="Images/ico/footer_i_02.png" id="imgMessage" width="17" height="18"/>&nbsp;&nbsp;
		   <label>上级信息</label>
         </td>
         
         </tr>
       <tr onclick="openIcon('<%=basePath%>','setSystemNotice')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'"> 
          <td  height="25">
		   <img src="Images/ico/SystemNotice.png"  id="setSystemNotice" width="16" height="16"/>
		   &nbsp;&nbsp;
		   <label>历史公告</label>
         </td>
       </tr >
       
       <tr onclick="openIcon('<%=basePath%>','setParams')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'">
         <td  height="25">
		   <img src="Images/ico/system.png"  id="setParams" width="16" height="16"/>&nbsp;&nbsp;
		   <label>弹窗设置</label>
         </td>
       </tr>
       <tr onclick="openIcon('<%=basePath%>','showHandle')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'"> 
        <td  height="25">
		    <img src="Images/ico/showHandle.png"  id="showHandle" width="16" height="16"/>&nbsp;&nbsp;
		   <label>首页指示</label>
         </td>
         </tr>
          <tr onclick="openIcon('<%=basePath%>','showVehicleHandle')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'"> 
        <td  height="25">
		    <img src="Images/ico/vehicleMonitoring.png"  id="showHandle" width="16" height="16"/>&nbsp;&nbsp;
		   <label>监控指示</label>
         </td>
         </tr>
       <tr onclick="openIcon('<%=basePath%>','systemHelp')"  onmouseout="this.style.background='none'" onmouseover="this.style.background='#CCCCCC'"> 
         <td  height="25">
		    <img src="Images/ico/help.png" width="16" height="16"/>&nbsp;&nbsp;
		   <label>系统帮助</label>
         </td>
       
       </tr>
		</table>

   </div>

	<div id="systemNotice"   style="display: none;padding:2px;top:3px; overflow-x:hidden;overflow-y:hidden;">  
    	<iframe src="" id="dialogFrame7" name="dialogFrame7" frameborder="0"  width="100%"
    	height="100%"></iframe>  
	</div>
<%--     首页操作指示--%>
	<div id="guide-step" style="position:absolute; display:none;  left:850px; top:0px;z-index:999; height:30px;width:100px;">

	</div>
<%--	车辆监控操作指示--%>
	<div id="vehicleMonitoring-step" style="position:absolute; display:none;  left:750px; top:0px;z-index:998; height:30px;width:100px;">

	</div>
	
   </div>
 </body>
</html>
