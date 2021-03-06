<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/common/validateHead.jsp"%>
<%@taglib prefix="auth"  uri="/auth-tags"  %>

<style>
<!--
<%--		background-color:#ace;--%>
	a:hover {color:blue;text-decoration:underline; }
-->
</style>

							<%--车辆外设表管理--%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>道路运输车辆卫星定位监管平台-广州亿程交通信息有限公司</title>
		<script type="text/javascript" src="${basePath}js/videoManage/vehicleDeviceSetup.js"></script>
		<script type="text/javascript" src="${basePath}js/datepicker/WdatePicker.js"></script>
		 <script type="text/javascript"	src="${basePath}js/sys/tree/vehicleMaintree.js"></script>
		<%--【自动补全】begin--%>
        <script type="text/javascript" src="${basePath}js/common/autoComplete.js"></script>
        <link rel="stylesheet" type="text/css" href="${basePath}css/autoComplete.css">
        <%--【自动补全】end--%>
	</head>

<%--onclickAll 【自动补全】--%>
<body onclick="onclickAll();">
	<%--【自动补全】begin--%>
    <div style="position:absolute; overflow:auto; scroll;height: 143px; width: 120px;" id="popup">
        <table  id="name_table" bgcolor="#FFFAFA" border="0" cellspacing="0" cellpadding="0"/>            
            <tbody id="name_table_body" style="font-size: 13px;"></tbody>
        </table>
    </div>
	<%--【自动补全】end--%> 
	<div style="width: 100%" id="cont_box">
	<div class="main">
        <div class="mon_cont">
        	<div class="E_Tit">车辆外设管理</div>
            <table border="0" cellspacing="0" cellpadding="0" class="que_tab">
				<tr>
					<td width="80" align="right">车牌号码：</td>
					<td width="100" align="left">
					<%--【自动补全】车牌号码--%>
					<input id="vehicleIds" type="hidden" name="vehicleIds"/>
					<input id="registrationNo" name="registrationNo" type="text"
					       class="mon_ser_text" style="width: 130;"
							maxlength="50"
							ondblclick="showVehicleTree('registrationNo')"
							onkeyup="doAutoComplete('registrationNo','name_table','popup','name_table_body')" 
			               />
				    </td>
					<td width="150" align="center">
						<a id="searchBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">查询</a>
						<%--权限控制--%>
						<auth:authorize operation="addVehicleDeviceSetupInfo">
						<a id="createBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">新增</a>
						</auth:authorize>
					</td>
				</tr>
			</table>

			<!-- 新增,修改 --> 
			<div id="editWindow" class="wDiv" style="width:100%;display: none;border: 1px solid #d0d0d0;height:350px;overflow-y:auto;">
				<div id="vehicleTitle" class="td_title">车辆外设新增</div>
				<%--隐藏域--%>
				<input type="hidden" name="id" id="id"/>
				<table width="100%" align="center">
				<%--第一行--%>
					<tr>
						<td width="150" align="right"><span class="xin_red">*</span>外设类型：</td>
						<td width="160" align="left">
							<select id="type_name" name="type_name" onchange="typeChange()" class="td_sel"
							formCheck="true"
							required="true" 
							requiredError="必选项!"  
							noselect="true" 
							requiredError="请选择一项"
							>
							</select>
							<span id="type_namespan" class="errorMsg" style="display: none"></span>
						</td>
						<td width="150" align="right"><span class="xin_red">*</span>外设型号：</td>
						<td width="160" align="left">
							<select id="model_name" name="model_name" class="td_sel"
							formCheck="true"
							required="true" 
							requiredError="必选项!"  
							noselect="true" 
							requiredError="请选择一项"
							></select>
							<span id="model_namespan" class="errorMsg" style="display: none"></span>
						</td>
						<td rowspan="6" width="200" align="left">
							<span id="vehiclesspan" class="errorMsg" style="display: none;vertical-align: top;"></span>
							<br/>
							<br/>
							<br/>
							<a id="submitBtn" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">提交</a>
							<br> 
							<a id="cancelBtn" href="javascript:void(0)" class="ser_btn">取消</a>
						</td>
					</tr>
					<%--第二行--%>
					<tr>
					<td width="150" align="right"><span class="xin_red">*</span>安装位置：</td>
						<td width="160" align="left">
							<select id="position_name" name="position_name" class="td_sel"
							formCheck="true"
							required="true" 
							requiredError="必选项!"  
							noselect="true" 
							requiredError="请选择一项"
							></select>
							<span id="position_namespan" class="errorMsg" style="display: none"></span>
						</td>
					<td  width="150" align="right"><span class="xin_red">*</span>外设状态：</td>
						<td id="qyValue" width="160" align="left">
							<select id="state" name="state" class="td_sel"
							formCheck="true"
							required="true" 
							requiredError="必选项!"  
							noselect="true" 
							requiredError="请选择一项"
							></select>
							<span id="statespan" class="errorMsg" style="display: none"></span>
						</td>
					</tr>
					
					<%--行--%>
					<tr>
						<td width="150" align="right"><span class="xin_red">*</span>设置参数：</td>
						<td type="text" align="left" colspan="4" >
							<input type="text" class="td_input" id="paramValue" name="paramValue"   style="width: 518px; border:1px solid #CCC; height:22px; line-height: 22px;" 
									formCheck="true"
									required="true" 
									requiredError="请设置参数！"
									textLength="1-150"
									valLengthError="长度必须在150个字符内"/>
									<span id="paramValuespan" class="errorMsg" style="display: none"></span>
						</td>
					</tr>
					<%--行【车辆名称】--%>
					<tr id="vehicleNa">
							<td width="150" align="right">车牌：</td>
							<td width="160" align="left" colspan="4">
								<input type="text"  id="vehicleName" name="vehicleName"  disabled="disabled"
									style="width: 518px; border:1px solid #CCC; height:22px; line-height: 22px;" 
								/>
							</td>
					</tr>
					
					<%--行【树】--%>
					<tr id="vehicleTr">
						<td width="150" align="right" valign="top"><span class="xin_red">*</span>车辆选择：</td>
						<td width="250" colspan="3" align="left">
							<%--table--%>
							<table width="100%"
								style="border: 1px outset #EEEEEE; padding-top: 2px; overflow-x: hidden; overflow-y: hidden;">
								<tr>
									<td id="vehi"><div id="imgSelectVehicle" style="height: 30px;"><img src='imgs/load.gif'>正在查询车辆.......</div></td>
								</tr>
								<tr>
								<td style="width:100%">
									<%--车辆树--%>
									<div align="left" id="vehicle"
									style="height:180;width:100%;OVERFLOW-Y: auto; OVERFLOW-X: hidden;padding-top: 0;vertical-align: top;">
									<ul id="vehicleListTree" style="width:100%;">
									</ul>
									</div>
								</td>
									<td>
									</td>
								</tr>
							</table>
						</td>
						<td></td>
					</tr>
					<%--行--%>
					<tr>
							<td width="150" align="right">备注：</td>
							<td width="160" align="left" colspan="4">
								<input type="text" class="td_input" id="description" name="description" 
									style="width: 518px; border:1px solid #CCC; height:22px; line-height: 22px;" 
									textLength="1-50" 
									valLengthError="长度必须在100个字符内" 
								/>
								<span id="descriptionspan" class="errorMsg" style="display: none"></span>
							</td>
					</tr>
					
					
				</table>
			</div>
			
			<%--查看【------------------没用到------】--%>
			<div id="viewWindow" style="width:100%;display: none;border: 1px solid #d0d0d0;height:403px;overflow-y:auto;">
				<div class="td_title">轨迹分析组详情</div>
				<table width="100%" align="center">
					<tr>
						<td width="150" align="right"><span class="xin_red">*</span>名称：</td>
						<td width="160" align="left">
<%--						nameView--%>
<%--							<input type="text"--%>
<%--								class="td_input" maxlength="20"--%>
<%--								id="nameView" name="nameView" formCheck="true"--%>
<%--								required="true" requiredError="请输入名称！"--%>
<%--								noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！"--%>
<%--								ajaxAction="analyse/checkName.action"--%>
<%--								ajaxActionError="已存在此名称，请重新输入！" />--%>
<%--							<span id="nameViewspan" class="errorMsg" style="display: none"></span>--%>
						</td>
						
						<td width="150" align="right">
							所属企业：
						</td>
						<td width="160" align="left">
							<%--readonly="readonly"--%>
							<input type="text" class="td_input" id="workNameView" name="workNameView" disabled="disabled" />
						</td>
						<td rowspan="2" width="200" align="left">
							<a id="closeBtn" href="javascript:void(0)" class="ser_btn">关闭</a>
						</td>
					</tr>
					<%--车辆列表--%>
					<tr>
						<td width="150" align="right" valign="top"><span class="xin_red">*</span>车辆选择：</td>
						<td width="250" colspan="3" align="left">
							<%--table--%>
							<table width="100%"
								style="border: 1px outset #EEEEEE; padding-top: 2px; overflow-x: hidden; overflow-y: hidden;">
								<tr>
									<td id="vehi"><div id="imgSelectVehicleView" style="height: 30px;"><img src='imgs/load.gif'>正在查询车辆.......</div></td>
								</tr>
								<tr>
								<td>
									<%--车辆树--%>
									<div align="left" id="vehicleView"
									style="height:295;width:240;OVERFLOW-Y: auto; OVERFLOW-X: hidden;padding-top: 0;vertical-align: top;">
									<ul id="vehicleListTreeView">
									</ul>
									</div>
								</td>
								</tr>
							</table>
						</td>
						<td></td>
					</tr>


					<tr>
						<td width="150" align="right">说明：</td>
						<td width="160" colspan="3" align="left">
							<input type="text" class="td_input" id="descriptionView" name="descriptionView" disabled="disabled"
									style="width:  670px; border:1px solid #CCC; height:22px; line-height: 22px;" 
								/>
						</td>
					</tr>
				</table>
			</div>
			
			
			 <%--列表--%>
			 <div><table id="DeviceSetupList" style="display: none"></table></div>
		</div> 
    </div>
	</div>
    <div id="dialogs" class="hiddiv" style="display: none;padding:5px;top:10px;">
			<iframe src="" id="dialogFrame" name="dialogFrame" width="100%"  height="100%" frameborder="0" scrolling="auto"></iframe>
		</div>
	</body>
</html>
