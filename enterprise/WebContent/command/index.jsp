<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.etrans.bubiao.sys.UserContext" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!--[if IE 8]>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<![endif]--> 
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<base href="<%=basePath%>"></base>
<title>指令管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<script type="text/javascript" src="${basePath}js/jq/jquery-1.7.1.min.js"></script>
		
<script type="text/javascript" src="${basePath}js/formvalidator/jquery.formValidator.js"></script>
<script type="text/javascript" src="${basePath}js/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${basePath}js/flexigrid/flexigrid.pack.js"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/commandIndex.css">
<link href="<%=basePath%>css/jq/jquery-ui.css" rel="stylesheet" type="text/css"/>
<script src="<%=basePath%>js/jq/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jq/jquery.Query.js"></script>
<script src="<%=basePath%>js/command/command.js" type="text/javascript"></script>
<script src="<%=basePath%>js/command/bucommand.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath%>js/datepicker/WdatePicker.js"></script>
<script>
  $(document).ready(function() {
    $("#tabs").tabs();
  });
  
</script>
</head>
<body>
<div id="tabs">
    <ul>
        <li><a href="#cont_box"><span>终端指令</span></a></li>
        <li><a href="#flatForm_Frame"><span>平台车辆指令</span></a></li>
         <li><a href="#cont_box2"><span>其它指令</span></a></li>
    </ul>
	<div id="cont_box" >
		<div class="main">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr class="i_f_02">
                    <td width="80" class="i_f_01">第一步</td>
                    <td>
	                     <div id="commandType">
	                     </div>
                    </td>
                  </tr>
                  <tr class="i_f_02" >
                    <td width="80" class="i_f_01" style="border-top:1px solid #fff;">第二步</td>
                    <td style="border-top:1px solid #fff;">
	                    <div id="commandSendTwo" style="height:200px;overflow-y:auto">
	                    </div>
                    </td>
                  </tr>
                  <tr class="i_f_02">
                    <td width="80" class="i_f_01">第三步</td>
                    <td style="border-top:1px solid #1FFFF;">
                      <div id="commandSendThree" style="display: none;height:240px;width:1000px;overflow-y:auto;overflow-x:auto">
                      <iframe src="" id="mainFrame"  name="mainFrame" width="1000px" height="230px"  frameborder="0" scrolling="auto"></iframe>
                        </div>
                    	
                    </td>
                  </tr>
               </table>            
        </div>
    </div>
    <div id="flatForm_Frame">
	<div class="main">
        	<table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr class="i_f_02" >
                    <td width="80" class="i_f_01" style="border-top:1px solid #fff;">第一步</td>
                    <td style="border-top:1px solid #fff;">
                    <div id="commandSendTwo2" style="height:100px;overflow-y:auto">
                    	<%	if(UserContext.isBsRootUser()|| UserContext.getLoginUser().isWorkUnitSuperAdmin()){ %>
                    		<ul class="instr_list_05">
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7010" commandId='7010' class="instr_rad">补发车辆定位信息请求
                    			</li>
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7012" commandId='7012' class="instr_rad">申请交换指定车辆定位信息请求
                    			</li>
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7013" commandId='7013' class="instr_rad">取消交换指定车辆定位信息请求
                    			</li>
                    		 	<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7020" commandId='7020' class="instr_rad">车辆定位信息自动补报
                    			</li>
                    			</ul>
                    			<%}else{ %>
                    			<ul class="instr_list_05" id="plantCommand">                    				
                    			</ul>
                    			<%} %>
                    		  <!-- 
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7019" commandId='7019' class="instr_rad">实时上传定位信息
                    			</li>
                    			
                    			
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7021" commandId='7021' class="instr_rad">主动上报驾驶员信息
                    			</li>
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7022" commandId='7022' class="instr_rad">主动上报车辆电子运单
                    			</li>
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7023" commandId='7023' class="instr_rad">上报报警信息
                    			</li>
                    			<li>
                    				<input name="commandCodeVehicle"  commandKindID='' type="radio" value="7024" commandId='7024' class="instr_rad">定位信息自动补报请求
                    			</li>
                    			-->                    		
                        </div>
                    </td>
                  </tr>
                 <tr class="i_f_02">
                    <td width="80" class="i_f_01">第二步</td>
                    <td style="border-top:1px solid #1FFFF;">
                      <div id="commandSendThree2" style="display: none;height:150px;width:1000px;overflow-y:hidden;overflow: x:hidden">
                      <iframe src="" id="mainFrame2"  name="mainFrame2" width="900px" height="330px"  frameborder="0" scrolling="auto">
                      </iframe>
                      </div>
                       <div  style="height:50px;" align="left">
		               <span id="result"></span>
		              </div>     
                    </td>
                  </tr>
                </table> 
                     
        </div>
        </div>    
       
		  
		<div id="cont_box2" >
		<div class="main">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr class="i_f_02">
                    <td width="80" class="i_f_01">第一步</td>
                    <td>
	                     <div id="commandType2">
	                      <ul class="instr_list_02">
	                      <li class="instr_hot2" onclick="hideSpecial();">其它指令</li>
	                      </ul>
	                     </div>
                    </td>
                  </tr>
                  <tr class="i_f_02" >
                    <td width="80" class="i_f_01" style="border-top:1px solid #fff;">第二步</td>
                    <td style="border-top:1px solid #fff;">
	                    <div id="commandSendTwoSpecial" style="height:200px;overflow-y:auto">
	                    <%	if(UserContext.isBsRootUser()|| UserContext.getLoginUser().isWorkUnitSuperAdmin()){ %>
	                          <ul class="instr_list_05">
                    			<li>
                    				<input name="commandSpecial"  type="radio" value="506" class="instr_rad">设置终端参数
                    				<input name="commandSpecial"  type="radio" value="507" class="instr_rad">事件设置 
                    				<input name="commandSpecial"  type="radio" value="373" class="instr_rad">设置圆形区域
                    				<input name="commandSpecial"  type="radio" value="376" class="instr_rad">设置矩形区域
                    				<input name="commandSpecial"  type="radio" value="379" class="instr_rad">设置多边形区域
                    				<input name="commandSpecial"  type="radio" value="508" class="instr_rad">设置路线
                    				<input name="commandSpecial"  type="radio" value="509" class="instr_rad">信息点播菜单设置
                    				<input name="commandSpecial"  type="radio" value="510" class="instr_rad">设置电话本
                    				<input name="commandSpecial"  type="radio" value="511" class="instr_rad">提问下发
                    			</li>
                    		</ul>
                    		<%} else{%>
                    		 <ul class="instr_list_05">
                    		 	<li id="otherCommand"></li>
                    		 </ul>
                    		<%} %>
	                    </div>
                    </td>
                  </tr>
                  <tr class="i_f_02">
                    <td width="80" class="i_f_01">第三步</td>
                    <td style="border-top:1px solid #1FFFF;">
                      <div id="commandSendThreeSpecial" style="display: none;height:240px;width:1000px;overflow-y:auto;overflow-x:auto">
                      <iframe src="" id="specialFrame"  name="specialFrame" src="" width="1000px" height="220px"  frameborder="0" scrolling="auto"></iframe>
                        </div>
                    	
                    </td>
                  </tr>
               </table>            
        </div>
    </div>        
 </div>
 <script type="text/javascript">
 $.ajax({
		url:"command/getPlatAndOtherCommand.action",
		type:"POST",
		dataType:"json",
		success:function(data){
			if(data!='false'){
				var platFormHtml='';
				var otherHtml='';
				if(data.indexOf("7010")>-1){
					platFormHtml+='<li><input name="commandCodeVehicle"  commandKindID="" type="radio" value="7010" commandId="7010" class="instr_rad">补发车辆定位信息请求</li>';
				}
				if(data.indexOf("7012")>-1){
					platFormHtml+='<li><input name="commandCodeVehicle"  commandKindID="" type="radio" value="7012" commandId="7012" class="instr_rad">申请交换指定车辆定位信息请求</li>';
				}
				if(data.indexOf("7013")>-1){
					platFormHtml+='<li><input name="commandCodeVehicle"  commandKindID="" type="radio" value="7013" commandId="7013" class="instr_rad">取消交换指定车辆定位信息请求</li>';
				}
				if(data.indexOf("7020")>-1){
					platFormHtml+='<li><input name="commandCodeVehicle"  commandKindID="" type="radio" value="7020" commandId="7020" class="instr_rad">车辆定位信息自动补报</li>';
				}
				if(data.indexOf("506")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="506" class="instr_rad">设置终端参数';							
				}
				if(data.indexOf("507")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="507" class="instr_rad">事件设置';
				}
				if(data.indexOf("373")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="373" class="instr_rad">设置圆形区域';
				}
				if(data.indexOf("376")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="376" class="instr_rad">设置矩形区域';
				}
				if(data.indexOf("379")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="379" class="instr_rad">设置多边形区域';
				}
				if(data.indexOf("508")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="508" class="instr_rad">设置路线';
				}
				if(data.indexOf("509")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="509" class="instr_rad">信息点播菜单设置';
				}
				if(data.indexOf("510")>-1){
					otherHtml+='<input name="commandSpecial"  type="radio" value="510" class="instr_rad">设置电话本';
				}
				if(platFormHtml!=""){
					$("#plantCommand").html(platFormHtml);
				}
				if(otherHtml!=''){
					$("#otherCommand").html(otherHtml);
				}
			}			
		}
	});
 </script>
</body>
</html>
