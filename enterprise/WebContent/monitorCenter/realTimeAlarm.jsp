<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page language="java" import="com.etrans.bubiao.sys.UserContext"%>
<%@ page language="java" import="com.etrans.bubiao.auth.SessionUser"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
			SessionUser user = UserContext.getLoginUser();
			String userName=user.getUserName();
			if(userName==null){
				userName="";
			}
			String phone="";
			if(phone==null){
				phone="";
			}
			String email="";
			if(email==null){
				email="";
			}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>报警管理</title>
<base href="<%=basePath%>"></base>
   
<link href="<%=basePath%>css/command.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="<%=basePath%>js/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=basePath%>js/easyui/themes/icon.css">
<link rel="stylesheet" href="<%=basePath%>js/formvalidator/jquery.formValidator.css" type="text/css">
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.4"></script>
<script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/datepicker/WdatePicker.js"></script>
<script language="javascript" type="text/javascript" src="<%=basePath%>js/common/StringUtil.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/realTimeAlarm.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common/AlarmMap.js"></script>
<script language="javascript" type="text/javascript" src="<%=basePath%>js/common/jsjava-2.0.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jq/jquery.Query.js"></script>
<script type="text/javascript" src="<%=basePath%>js/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/formvalidator/jquery.formValidator.js"></script>

<style type="text/css">
.input{width: 150px; height: 22px;font-size: 12px; color: #000;line-height: 22px}

body{overflow:hidden;}


</style>

<script type="text/javascript">
function killErrors() { 
	 return true; 
	} 
	window.onerror = killErrors;
</script>

  </head>
  <body style="margin-left: 10px">
  
  <div id="tabs" style="height: 430px">
  <div  align="left">
  <table width="50%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td nowrap="nowrap">   报警类型 ：<select name="alarmType" id="alarmType" style="width: 170"  onchange="initTableDate()">
											</select>				
          </td>
          <td nowrap="nowrap"> &nbsp;&nbsp;  报警来源：<select name="alarmSource" id="alarmSource" onchange="updateAlarmType()">
												<option value="-1">全部来源</option>
												<option value="1">车载终端</option>
												<option value="10">平台报警</option>
												<option value="9">其他</option>
												
          </select>
          </td>
          <td nowrap="nowrap"> &nbsp; &nbsp; 车牌号：
      <input name="registrationNo" type="text" size="20" id="registrationNo" /></td>
        <td width="7%">&nbsp;&nbsp;&nbsp;
                 <!--img src="imgs/look_up.gif"  id="btnSearch"  style="boder:0px; cursor: pointer;" /-->
          </td>
        </tr>
      </table>
    </div>	    				
	      <div title="当前报警列表" style="margin-bottom: 10px;height: 410px">
		        <table   cellpadding="0" cellspacing="0" class="form" style="margin-top: 20px;margin-bottom: 10px">
			  	  	<tr align="left">
			  	  		<td>
			  	  		 
			  	  				<input type="button" value="显示车辆" id="btnShowVehicle"  class="topbut2">
			  	  			 <input type="button" value="上报报警处理结果" id="btnAlarmTodoInfo"  class="topbut2">
			  	  			 	<input type="button" value="手动刷新" id="btnRefresh" tag="0" class="topbut2">
			  	  		</td>
			  	  		
			  	  	</tr>
			  	  </table>
			  	  
			  	  
			<div id="vehicleInfoDialog" style="display: none;padding:5px;top:400px;">
			  <fieldset title="基本信息">
			<legend>车辆基本信息</legend>
		
			 <table width="100%" border="0" cellpadding="0" cellspacing="0" class="form" >
			    <tr class="odd">
			      <td class="left">车牌号码</td>
			      <td class="right" style="width: 380px"><div id="rNo"></div>
			      </td>
			        <td class="left">车辆类型  </td>
				      <td class="right" style="width: 380px"><div id="standType"></div>
				       </td>
				</tr>	
				
				
			<tr class="even">
			      <td class="left">SIM卡号    </td>
				  <td class="right"><div id="phoneNo"></div></td>
			      <td class="left">所属行业  </td>
			      <td class="right"> 
			      		<div id="typeName"></div>
			       </td>
	   	     </tr>
	   	 	   <tr class="odd">
			      <td class="left">车牌颜色 </td>
			      <td class="right"> 
			     <div id="rnoColor"></div>
			       </td>
			       
			      <td class="left">所属平台  </td>
			      <td class="right"> 
			      <div id="platformName"></div>
			       </td>
	   	     </tr>
			   <tr class="even">
			      <td class="left">所属区域 </td>
			      <td class="right"> 
							 <div id="areaName"></div>
			       </td>
			       
			      <td class="left">运输企业  </td>
			      <td class="right"> 
			      		 <div id="workUnitName"></div>
			       </td>
	   	     </tr>
	   	      <tr class="odd">
			      <td class="left">车辆道路运输证号 </td>
			      <td class="right"> 
							 <div id="transportPermits"></div>
			       </td>
			       
			       <td class="left">终端类型  </td>
			      <td class="right"> 
			      		 <div id="terminalName"></div>
			       </td>
	   	     </tr>
	   	     <tr>
	   	      <td colspan="4">
				  <a  href="javascript:void(0)" class="ser_btn" onClick="hideDiaoLog('vehicleInfoDialog');"><input type="button" value="隐藏"></input></a>
				  </td>
			   </tr>
			 </table>
		</fieldset>
			</div>  	  
	   <div id="todoDialog" style="display: none;padding:5px;top:10px;">
    <table cellpadding="0" cellspacing="4" class="form" >
   		<tr class="odd">
   			<td>
   			 <div id="txtMsg" style="font-size: 14px"></div>
   			</td>
   		</tr>	
   		<tr class="even">
   			<td>
   			报警处理结果：
   				<select id="paramDuban" style="width:300px">
   					<option value="0">处理中</option>
					<option value="1" >已处理完毕</option>
					<option value="2" >不作处理</option>
					<option value="3" >将来处理</option>
   				</select>
   				
   			</td>
   		</tr>
   		<tr class="even">
   		<td>
   		报警处理内容：
   		<textarea id="handleConent" style="width:300px"></textarea>
   		</td>
   		</tr>
		 <tr>
		 <td valign="top"><a href="javascript:void(0)" onClick="shangbao();"><img src="imgs/command.gif"  border="0"></a><a  href="javascript:void(0)" class="ser_btn" onClick="hideDiaoLog('todoDialog');"><img src="imgs/cancel.gif"  border="0"></a>
	   </td>
		 </tr>
		 <tr>
			 <td><span id="shanbaoResult"></span></td>
			</tr>
   	</table>
   </div>
   
   
       
           <div style="height: 360px;">
		       <table cellpadding="0" cellspacing="0" class="form" >
		       <tr>
		         <td>
		            <table align="left" style="border-color: #1D82D2;border-width: 1px;
		            border-style: solid; border-color: #1D82D2 #1D82D2 #1D82D2 #1D82D2;
		            background: url(../images/tb_top.png);border-collapse: collapse;
		            FONT-FAMILY: '寰蒋闆呴粦';FONT-SIZE: 12px;" 
		            id="alarmListFirst" width="98.5%">
		                <tr>
			       		 <th>
			       		 	<input type="checkbox" id="ckAll">
			       		 </th>
			       		 <th>车牌号</th>
			       		 <th>车牌颜色</th>
			       		 <th>接收时间</th>
			       		 <th>报警类型</th>
			       		 <th>报警来源</th>
			       		 <th>经度</th>
			       		 <th>纬度</th>
			       		 <th>GPS速度 </th>
			       		 <th>报警描述</th>
			       		 <th>当前位置</th>
			       		 <th>操作</th>
		       		</tr>
		            </table>
		         
		         </td>
		       </tr>
		       <tr>
		         <td>
		          <div style='height: 300px; overflow-y: scroll' id='realTimeAlarmInfo'>
		            <table cellpadding="0" cellspacing="0" class="form" id="alarmList">
		               
		            </table>
		           </div>
		         </td>
		       </tr>
		       
		       
		       		
		       		
		       </table>
	    </div> 
       </div>
   </div> 
  </body>
</html>
