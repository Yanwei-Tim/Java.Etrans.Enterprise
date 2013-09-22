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
	        <script type="text/javascript" src="<%=basePath%>js/jq/jquery-1.7.1.min.js"></script>
		<script type="text/javascript" src="<%=basePath%>js/jq/jquery.Query.js"></script>
		<script src="<%=basePath%>js/command/special/508.js" type="text/javascript"></script>
		<script  type="text/javascript" src="<%=basePath%>js/datepicker/WdatePicker.js"></script>
	    <style type="text/css">
<!--
.STYLE1 {color: #003366}
-->
        </style>
</head>

	<body>
	 <table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
			  <td width="100%" align="center">
				  <fieldset style="border-Color:#80CAEA;width: 98%;"><legend>设置路线：指令参数</legend>
				  		<table width="100%" cellpadding="0" cellspacing="1">
				            <tr>
				              <td>&nbsp;</td>
				              <td width="269">&nbsp;</td>
				              <td width="30">&nbsp;</td>
				              <td width="16">&nbsp;</td>
				              <td>&nbsp;</td>
				              <td width="3" rowspan="3" background="imgs/commandbg.gif">.</td>
				              <td>&nbsp;</td>
				              <td colspan="2">&nbsp;</td>
				            </tr>
				            <tr>
				              <td width="3">&nbsp;</td>
				              <td colspan="3" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">
				                
				                <tr>
                                  <td width="9%" height="25" nowrap="nowrap"><div align="right">路线ID：</div></td>
				                  <td colspan="1" valign="middle" nowrap="nowrap">
                                      <input name="param1" 
											   id="param1" 
											   type="text" 
											   size="5"
											   maxlength="2"
											   value=""
											  /></td>
                                     
				           <td height="25" nowrap="nowrap"><div align="right">根据时间：</div></td>
				                  <td valign="top" nowrap="nowrap"><select name="params2-1" id="params2-1">
                                      <option value="1">是</option>
                                      <option value="0">否</option>
                                  </select></td>
			                    </tr>
				              
				                <tr>
				                  <td height="25" nowrap="nowrap"><div align="right">出路线报警给平台：</div></td>
				                  <td valign="top" nowrap="nowrap"><select name="params2-5" id="params2-5">
				                    <option value="1">是</option>
				                    <option value="0">否</option>
                                                                    </select></td>
                                  <td height="25" nowrap="nowrap"><div align="right">出路线报警给驾驶员：</div></td>
				                  <td valign="top" nowrap="nowrap"><select name="params2-4" id="params2-4">
                                      <option value="1">是</option>
                                      <option value="0">否</option>
                                  </select></td>
				                </tr>
				                <tr>
				                  <td height="25" nowrap="nowrap"><div align="right">进路线报警给平台：</div></td>
				                  <td valign="top" nowrap="nowrap"><select name="params2-3" id="params2-3">
                                      <option value="1">是</option>
                                      <option value="0">否</option>
                                  </select></td>
                                  <td height="25" nowrap="nowrap"><div align="right">进路线报警给驾驶员：</div></td>
				                  <td valign="top" nowrap="nowrap"><select name="params2-2" id="params2-2">
                                      <option value="1">是</option>
                                      <option value="0">否</option>
                                  </select></td>
				                </tr>
				                <tr>
				                  <td height="25" colspan="4" nowrap="nowrap"><div align="left">&nbsp;&nbsp;起始时间：
                                      <input id="param3" name="param3" size="12" class="input"  maxlength="12"  style="height: 20px;font-size: 12px;"/>
                                      <img onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('param3'),dateFmt:'yyyy-MM-dd HH:mm:ss'})"
										 src="Images/time.jpg" width="20" height="24" />&nbsp;&nbsp;结束时间：
                                      <input id="param4" name="param4" size="12" class="input" maxlength="12"  style="height: 20px;font-size: 12px;"/>
                                      <img onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('param4'),dateFmt:'yyyy-MM-dd HH:mm:ss'})"
										 src="Images/time.jpg" width="20" height="24" /></div></td>
			                    </tr>
				                <tr>
                                  <td height="25" colspan="4" nowrap="nowrap"><div align="left"></div></td>
			                    </tr>
                                <tr>
                                  <td height="25" nowrap="nowrap"><div align="right">选择线路：</div></td>
				                  <td valign="top" nowrap="nowrap">
				                    <div align="left">
				                        <select id="area"></select>
                                  	</div>
                                  </td>
                                  <td height="25" nowrap="nowrap"><div align="right">拐点数：</div></td>
				                  <td valign="top" nowrap="nowrap">
				                    <input id="param5" value="0"/>
                                  </td>
			                    </tr>
				              </table>
				              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
				              <td width="16">&nbsp;</td>
<%--				              <td width="184"><a href="javascript:void(0)" onClick="sendMessage();"><img src="imgs/command.gif"  border="0"></a><a  href="javascript:void(0)" class="ser_btn" onClick="parent.hideSpecial();"><img src="imgs/cancel.gif"  border="0"></a><div id="result"></div></td>--%>
<%--				              <td width="685"><div id="back" class="hiddiv" style="display: none;"><img alt="正在发送指令" src="imgs/load.gif">正在发送指令......</div></td>--%>
				              <td width="685">&nbsp;</td>
				              
				           </tr>
							  <tr>
				              <td>&nbsp;</td>
				              <td>&nbsp;</td>
				              <td>&nbsp;</td>
				              <td>&nbsp;</td>
				              <td>&nbsp;</td>
				              <td>&nbsp;</td>
				              <td colspan="2">&nbsp;</td>
				            </tr>
		          		</table>
				  </fieldset>
			  </td>
			</tr>
			<%--按钮--%>
			<tr>
				<td valign="top"><a href="javascript:void(0)" onClick="sendMessage();"><img src="imgs/command.gif"  border="0"></a><a  href="javascript:void(0)" class="ser_btn" onClick="parent.hideSpecial();"><img src="imgs/cancel.gif"  border="0"></a><div id="result"></div></td>
				<td width="685"><div id="back" class="hiddiv" style="display: none;"><img alt="正在发送指令" src="imgs/load.gif">正在发送指令......</div></td>
			</tr>
		</table>
		 <table width="100%" border="0" cellspacing="0" cellpadding="0" background="#EBF2FA">
          <tr background="#EBF2FA">
                    <td style="border-top:1px solid #1FFFF;">
                     <table id="list"  class="form">
			    <thead>
				<tr>
				    <th>拐点id</th>
					<th>路段id</th>
					<th>拐点纬度</th>
					<th>拐点经度</th>
					<th>路段宽度</th>
					<th>行驶时间</th>
					<th>限速</th>
					<th>纬度</th>
					<th>经度</th>
					<th>路段行驶过长阈值</th>
					<th>路段行驶不足阈值</th>
				    <th>路段最高速度</th>
					<th>路段超速持续时间</th>
				</tr>
			</thead>
			</table>
                    </td>
                  </tr>
         </table>
	</body>
</html>