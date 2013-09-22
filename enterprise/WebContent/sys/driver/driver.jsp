<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/common/validateHead.jsp"%>
<%@taglib prefix="auth"  uri="/auth-tags"  %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>司机信息管理</title>
		<script type="text/javascript" src="${basePath}js/sys/driver/driver.js"></script>
		<script type="text/javascript"	src="${basePath}js/sys/tree/tree.js"></script>	
		<script type="text/javascript" src="${basePath}js/datepicker/WdatePicker.js"></script>
		<script type="text/javascript"	src="${basePath}js/sys/tree/treeAddWorkunit.js"></script>
		
	</head>

	<body>
	
		<div style="width: 100%" id="cont_box">
		<div class="main">
		<div class="mon_cont">
			<div class="E_Tit">司机信息管理</div>
			<table border="0" cellspacing="0" cellpadding="0" class="que_tab">
				<tr>
					<td width="80" align="right">司机名称：</td>
					<td width="150" align="left">
						<input type="text" id="dNameParam" name="dNameParam" class="mon_ser_text" style="width: 130;"
							maxlength="30" 
			                onchange="value=value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,'')" 
			                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,''))"/>
					</td>
					<td width="80" align="right">企业名称：</td>
					<td width="150" align="left">
						<input type="text" 
						    id="workUnitNameParam" ondblclick="showWorkUnitTree()"
						    name="uNameParam" class="mon_ser_text" style="width: 130;"
							maxlength="30" 
			                onchange="value=value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,'')" 
			                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,''))"/>
					</td>
					<td width="240">
						<a id="searchBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">查询</a>
						<a id="exportBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">导出</a>
						<auth:authorize operation="createDriver">
							<a id="createBtn" href="javascript:void(0)" class="ser_btn" style="color: white;">新增</a>
						</auth:authorize>
					</td>
				</tr>
			</table>
			
			<div id="editWindow" class="wDiv" style="width:100%;display: none;border: 1px solid #d0d0d0;height:260px;overflow-y:auto;">
				<div class="td_title" id="titleInfo">司机信息编辑</div>
				<table width="100%" align="center">
					<tr>
						<td align="right"><span class="xin_red">*</span>司机名称：</td>
						<td align="left">
							<input type="hidden" id="driverId" value=""/>
							<input type="text" name="name" id="name" class="td_input" maxlength="20"
				      			formCheck="true"
				      			required="true" requiredError="必须输入项"  
								noSpecialCaracters="true"">
							<span id="namespan" class="errorMsg" style="display: none"></span>
						</td>
						<td align="right"><span class="xin_red">*</span>身份证号：</td>
						<td align="left">
							<input type="text" name="identityCard" id="identityCard" class="td_input" maxlength="20"
				      			formCheck="true" 
				      			required="true" requiredError="必须输入项" 
								chinaid="true">
							<span id="identityCardspan" class="errorMsg" style="display: none"></span>
						</td>
						
						<td rowspan="20" align="center" width="150">
							<a id="submitBtn" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">提交</a>
							<br>
							<a id="cancelBtn" href="javascript:void(0)" class="ser_btn">取消</a>
						</td>
					</tr>
					
					<tr>
					   <td align="right"><span class="xin_red">*</span>企业名称：</td>
						<td align="left">
						       <input type="text" id="workUnitIDName"  formCheck="true"  onclick="showWorkUnitAddTree()" class="td_input"
								required="true" requiredError="必须输入项!" noselect="true" requiredError="请选择一项"
								readonly="readonly"/> 
			      		       <input type="hidden" id="workUnitID1" />
						       <span id="workUnitIDNamespan" class="errorMsg" style="display: none"></span>
						       <a  href="javascript:void(0)" onclick="showWorkUnitAddTree()"  class="ser_btn">请选择</a>
						</td>
						<td align="right">驾驶证号：</td>
						<td align="left">
							<input type="text" name="drivingLicence" id="drivingLicence" class="td_input" maxlength="20"
				      		 >
							<!--<span id="drivingLicencespan" class="errorMsg" style="display: none"></span>-->
						</td>
						
						
						<td></td>
					</tr>
					
					<tr>
						<td align="right">联系电话：</td>
						<td align="left">
							<input type="text" name="phoneNo" id="phoneNo" class="td_input" maxlength="20"
				      			>
							<span id="phoneNospan" class="errorMsg" style="display: none"></span>
						</td>
						<td align="right">IC卡号：</td>
						<td align="left">
							<input type="text" name="workLicenceNo" id="workLicenceNo" class="td_input" maxlength="20"
				      			>
							<!--<span id="workLicenceNospan" class="errorMsg" style="display: none"></span>-->
							</td>
						<td></td>
					</tr>
					
					<tr>
						<td align="right">司机工号：</td>
						<td align="left">
							<input type="text" name="driverNo" id="driverNo" class="td_input" maxlength="20"
				      			formCheck="true" 
								noSpecialCaracters="true">
							<span id="driverNospan" class="errorMsg" style="display: none"></span>
						</td>
						<td align="right">司机编码：</td>
						<td align="left">
							<input type="text" name="driverCode" id="driverCode" class="td_input" maxlength="20"
				      			formCheck="true" 
								noSpecialCaracters="true">
							<span id="driverCodespan" class="errorMsg" style="display: none"></span>
						</td>
						<td></td>
					</tr>
					
					<tr>
						<td align="right">驾驶证有效期(单位：月)：</td>
						<td align="left">
							<input type="text" name="licenseNoEffective" id="licenseNoEffective" class="td_input" maxlength="20"
				      			formCheck="true" 
								integer="true">
							<span id="licenseNoEffectivespan" class="errorMsg" style="display: none"></span>
						</td>
						<td align="right">驾驶证年审日期：</td>
						<td align="left">
							<input type="text" id="yearCheckTime" name="yearCheckTime" class="td_input" onFocus="this.blur()" readonly="readonly"  style="width:155px"/>
							<img src="Images/time.jpg" width="20" height="23" style="margin-left:2px;"
								onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('yearCheckTime'),dateFmt:'yyyy-MM-dd'})"/>
							<span id="yearCheckTimespan" class="errorMsg" style="display: none"></span>
						</td>
						<td></td>
					</tr>
					<tr>
						<td align="right">准入证号：</td>
						<td align="left">
							<input type="text" name="admittanceCertificate" id="admittanceCertificate" class="td_input" maxlength="20"
				      		>
							<!--<span id="admittanceCertificatespan" class="errorMsg" style="display: none"></span>-->
							</td>
						<td align="right">准入证审验日期：</td>
						<td align="left">
							<input type="text" id="admittanceCheckDate" name="admittanceCheckDate" class="td_input" onFocus="this.blur()" readonly="readonly"  style="width:155px"/>
							<img src="Images/time.jpg" width="20" height="23" style="margin-left:2px;"
								onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('admittanceCheckDate'),dateFmt:'yyyy-MM-dd'})"/>
							<span id="admittanceCheckDatespan" class="errorMsg" style="display: none"></span>
						</td>
						<td></td>
					</tr>
					<tr>
						<td align="right">准入证有效期(单位：月)：</td>
						<td align="left">
							<input type="text" name="admittanceEffective" id="admittanceEffective" class="td_input" maxlength="20"
				      			formCheck="true" 
								integer="true">
							<span id="admittanceEffectivespan" class="errorMsg" style="display: none"></span>
						</td>
						<td align="right">资格证到期日期：</td>
						<td align="left">
							<input type="text" id="workCertificateExpiryDate" name="workCertificateExpiryDate" class="td_input" onFocus="this.blur()" readonly="readonly"  style="width:155px"/>
							<img src="Images/time.jpg" width="20" height="23" style="margin-left:2px;"
								onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('workCertificateExpiryDate'),dateFmt:'yyyy-MM-dd'})"/>
							<span id="workCertificateExpiryDatespan" class="errorMsg" style="display: none"></span>
						</td>
						<td></td>
					</tr>
				</table>
			</div>
				
			<table id="driverList" style="display: none"></table>
		</div>
		</div>
		</div>
		
		<div id="dialogs" class="hiddiv" style="display: none;padding:5px;top:10px;">
			<iframe src="" id="dialogFrame" name="dialogFrame" width="100%"  height="100%" frameborder="0" scrolling="auto"></iframe>
		</div>
	</body>
</html>