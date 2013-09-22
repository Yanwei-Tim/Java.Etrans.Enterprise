<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.etrans.bubiao.sys.Constants"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String vehicleId=request.getParameter("vehicleId");
	String registrationNo = new String(request.getParameter("registrationNo").getBytes("ISO-8859-1"),"utf-8");
%>
<html>
<head>
<base href="<%=basePath%>"></base>
<title>企业中心</title>
<meta http-equiv=Content-Type content=text/html;charset=utf-8>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="description" content="企业中心">	
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/body.css">
<script type="text/javascript" language="javascript" src="<%=Constants.MAP_BASE_URL%>/SE_JSAPI?&uid=<%=Constants.MAP_UID %>"></script>
<script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/HashMap.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/track/tools/CarPools.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/track/tools/MarkerUtils.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/trackBack.js"></script>
<script type="text/javascript" src="<%=basePath%>js/datepicker/WdatePicker.js"></script>
<script type="text/javascript"	src="${basePath}js/sys/tree/vehicleTree.js"></script>

<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/icon.css">
<script type="text/javascript" src="${basePath}js/easyui/jquery.easyui.min.js"></script>

<script type="text/javascript">
function getCurDateTime(){ 
	var d = new Date(); 
	var years = d.getFullYear(); 
	var month = d.getMonth()+1; 
	var days = d.getDate(); 
	var hours = d.getHours(); 
	var minutes = d.getMinutes(); 
	var seconds=d.getSeconds(); 
	var ndate = years+"-"+month+"-"+days+" "+hours+":"+minutes+":"+seconds;
	return ndate;
}
function getStartDateTime(){ 
	
	var d = new Date(); 
	var d=d.getTime()-6*60*60*1000;
	var d = new Date(d);
	var years = d.getFullYear(); 
	var month = d.getMonth()+1; 
	var days = d.getDate(); 
	var hours = d.getHours(); 
	var minutes = d.getMinutes(); 
	var seconds=d.getSeconds();  
	var ndate = years+"-"+month+"-"+days+" "+hours+":"+minutes+":"+seconds;
	return ndate;
}
function hideShowTable(obj){
	var baseP = '<%=basePath%>';
	if(obj.valueFlag==0){
		$("#map").css("display","none");
		obj.src=baseP+"imgs/down_btn.gif";
		obj.valueFlag=1;
		$("#tableDiv").css("height", "330");
	}else{
		obj.src=baseP+"imgs/up_btn.gif";
		obj.valueFlag=0;
		$("#map").css("display","block");
		$("#tableDiv").css("height", "38");
	}
}
</script>
</head>
<body onload="load('<%=vehicleId %>','<%=registrationNo%>');">

<div id="cont_box">
<div class="main2">
 <div class="mon_cont2">
 
			<%--地图--%>
           <div id="map"></div>
           
           
           <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td colspan="3" valign="bottom" nowrap="nowrap">
					<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mon_t_01">
							<tr >
								<td >回放车辆：
	<%--							<select id="registrationSelect" name="registrationSelect"></select>--%>
									<input type="text" id="registrationVhicleNo"  name="registrationVhicleNo"  
								     	style="width:100px;"
								      	formCheck="true" required="true"  onclick="showRegistrationVhicleTree();"  readonly="readonly" requiredError="请选择一项"
								      	readonly="readonly" /> 
	                      			<input type="hidden" id="registrationVehicleId" />
<%--									<input type="button" id="" class="btn_map" onClick="showRegistrationVhicleTree();" value="请选择"/>--%>
									
									
								</td>
								<td>
									开始：
									<input type="text" id="beginTime" name="beginTime" class="inputnone" size="20" onFocus="this.blur()" readonly="readonly" />
									<img onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('beginTime'),dateFmt:'yyyy-M-d H:m:s',maxDate:'%y-%M-%d'})"
										src="Images/time.jpg" width="17" height="22" align="absmiddle">
								 </td>
								<td>
									结束：
									<input type="text" id="endTime" name="endTime" class="inputnone" size="20" onFocus="this.blur()" readonly="readonly" />
									<img onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('endTime'),dateFmt:'yyyy-M-d H:m:s',maxDate:'%y-%M-%d'})"
										src="Images/time.jpg" width="17" height="22" align="absmiddle">
								</td>
								<td nowrap="nowrap">
								<div align="center">
							    	 回放速度：
										<select id="playRate" name="playRate">
										<option value="10">0.01秒</option>
										<option value="50">0.05秒</option>
										<option value="200">0.2秒</option>
										<option value="500">0.5秒</option>
										<option value="1000">1秒</option>
										<option value="2000">2秒</option>
										</select>
								</div>
								</td>
								<td>
								<div align="left">
								  <input type="button" id="queryBackTrack" class="btn_map" onClick="findPlayBackTrack();" value="查询"/>
								  <input type="button" id="playback" class="btn_map" onClick="playBackTrack();" value="播放"/> 	
<%-- 								  <input type="button"  class="btn_map" onClick="backMonitor('<%=basePath%>');" value="返回监控"/> 	 --%>
								   <input type="button"  class="btn_map" onClick="exportTrack('<%=basePath%>');" value="导出"/> 	
								</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
				<td align="center">
 	        
		   	<div id="showData" style="display: block;">
		   	<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mon_t_infor">
             	<tr class="mon_t_01">
	                <td class="m_t" nowrap="nowrap" width="9%">车牌</td>
	                <td class="m_t" nowrap="nowrap" width="10%">经度</td>
	                <td class="m_t" nowrap="nowrap" width="10%">纬度</td>
	                <td class="m_t" nowrap="nowrap" width="5%">油位</td>
	                <td class="m_t" nowrap="nowrap" width="15%">状态</td>
	                <td class="m_t" nowrap="nowrap" width="15%">位置</td>
	                <td class="m_t" nowrap="nowrap" width="5%">速度</td>
	                <td class="m_t" nowrap="nowrap" width="5%">方向</td>
	                <td class="m_t" nowrap="nowrap" width="8%">里程(KM)</td>
	                <td class="m_t" nowrap="nowrap" width="18%">时间</td>
              	</tr>
            </table>
		   	<div align="center" class="m_t" style="height: 9px;"><img  src="<%=basePath %>imgs/up_btn.gif" valueFlag="0" id="showTalbeImage" style="cursor: pointer;" onclick="hideShowTable(this)"/></div>         
            
			<div id="back"  style="display: none;">
				 <img alt="正在分析轨迹数据" src="<%=basePath %>imgs/load.gif">
				正在分析轨迹数据,请稍等......
		   	</div>   
            <div id="tableDiv" style="overflow-x: scroll; overflow-y: scroll; height:38px; width: 100%;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" id="mytable" class="mon_t_infor">
            </table>
            </div>
            <div>
            <table>
            	<tr>
            		<td id="noPreInfo" style="color: red;">&nbsp;&nbsp;</td>
            		<td><img src="<%=basePath %>js/flexigrid/images/prev.gif" onclick="prexPage()" style="cursor: pointer;" title="上一页"/></td>
            		<td>&nbsp;&nbsp;</td>
            		<td id="currentPageId">当前第0页</td>
            		<td>&nbsp;&nbsp;</td>
            		<td id="sumPage">总共0页</td>
            		<td>&nbsp;&nbsp;</td><td><img onclick="nextPage()" style="cursor: pointer;"  title="下一页" src="<%=basePath %>js/flexigrid/images/next.gif"/></td>
            		<td id="lastInfo" style="color: red;">&nbsp;&nbsp;</td>
            	</tr>
            </table>
		   	</div>
	     	<div id="finish">
		 	</div></td>
				</tr>
			</table>
  </div>
 </div>
 </div>
 <script type="text/javascript">
 $('#beginTime').val(getStartDateTime());
 $('#endTime').val(getCurDateTime());
 </script>
 		<%--弹出--%>
 		<div id="dialogs" class="hiddiv" style="display: none;padding:5px;top:10px;">
			<iframe src="" id="dialogFrame" name="dialogFrame" width="100%"  height="100%" frameborder="0" scrolling="auto"></iframe>
		</div>
</body>
</html>
