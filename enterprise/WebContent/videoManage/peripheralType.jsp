<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/common/validateHead.jsp"%>
<%@taglib prefix="auth"  uri="/auth-tags"  %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>外设类型管理</title>
		<script type="text/javascript" src="${basePath}js/videoManage/peripheralType.js"></script>
		<script type="text/javascript" src="${basePath}js/datepicker/WdatePicker.js"></script>
	</head>

	<body>
	
		<div style="width: 100%" id="cont_box">
		<div class="main">
		<div class="mon_cont">
			<div class="E_Tit">外设类型管理</div>
			<div id="adSearch">
				<table border="0" cellspacing="0" cellpadding="0" class="que_tab">
					<tr>
						<td width="100" align="right">名称:</td>
						<td width="150" align="left">
							<input id="otName" name="otName" type="text" class="mon_ser_text" style="width: 130px;"
								maxlength="30"
								onchange="value=value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,'')" 
				                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,''))"/>
						</td>
						<td width="60">
							<a id="searchBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">查询</a>
						</td>
						<td width="60">
						    <a id="exportBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">导出</a>
						</td>
						<auth:authorize operation="createSimCard">
						<td width="60">
							<a id="createBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">新增</a>
						</td>
						</auth:authorize>
					</tr>
				</table>
			</div>
			<div id="editWindow" class="wDiv" style="width:100%;display: none;border: 1px solid #d0d0d0;">
				<div class="td_title" id="titleInfo">外设类型编辑</div>
				<table width="100%">
					<tr>
					   
					    <td width="120" align="right"><span class="xin_red">*</span>名称：</td>
						<td width="250" align="left">
						    <input type="hidden" name="id" id="id" class="td_input"/>
							<input type="text" name="peripheralTypeName" id="peripheralTypeName" size="50"  class="td_input" style="width: 180px;"
								formCheck="true" 
								required="true" requiredError="请输入外设类别名称！" 
								noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！"
								ajaxAction="videoManage/getPeripheralTypeByName.action" 
								ajaxDataId="id" 
								ajaxActionError="已存在此名称的外设类别，请重新输入！">
							<span id="peripheralTypeNamespan" class="errorMsg" style="display: none"></span>
						</td>
						
						
						
						<td align="right"><span class="xin_red">*</span>代码：</td>
						<td align="left">
							<input type="text" name="code" id="code" class="td_input" 
							    formCheck="true"
				      			required="true" requiredError="必须输入项!"  
								noSpecialCaracters="true" size="50"
								/>
							<span id="codespan" class="errorMsg" style="display: none"></span>
						</td>
						
						<td rowspan="3" align="center" width="200">
							<a id="submitBtn" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">提交</a><br/>
							<a id="reSetBtn" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">重置</a><br/>
							<a id="cancelBtn" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">取消</a>
						</td>
						
					</tr>
					<tr>
						<td align="right">备注：</td>
						<td align="left" rowspan="4">
						    <input type="text" name="memo" id="memo" class="td_input" size="50"/>
						</td>
					
					
					</tr>
				</table>
			</div>
			 <table id="peripheralTypeList" style="display: none"></table>
			</div>
		</div>
		</div>
	</body>
</html>
