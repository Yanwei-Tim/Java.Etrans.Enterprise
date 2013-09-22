<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/validateHead.jsp"%>
<%@taglib prefix="auth"  uri="/auth-tags"  %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%@page import="com.etrans.bubiao.sys.UserContext" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>			
			<%
			request.setAttribute("isSuper",String.valueOf(((SessionUser) request.getSession().getAttribute(Constants.LOGIN_USER)).getIsSuperUser()));
				boolean isRoot = UserContext. isBsRootUser();
			%>
		    <title>企业用户管理</title>
		    <link rel="stylesheet" type="text/css" href="${basePath}css/style.css">
		    <script type="text/javascript">
		    	var isBsRoot = <%=isRoot%>;
		    </script>
			<script type="text/javascript" src="${basePath}js/sys/user/enterUserList.js"></script>
			<script type="text/javascript" src="${basePath}js/sys/user/buildHtmlUtil.js"></script>
			<script type="text/javascript" src="${basePath}js/datepicker/WdatePicker.js"></script>
			<script type="text/javascript"	src="${basePath}js/sys/tree/treeWorkunit.js"></script>
		    <script type="text/javascript"	src="${basePath}js/sys/tree/treeAddWorkunit.js"></script>	
	
	</head>
	
<body>


<div style="width: 100%" id="cont_box">
	<div class="main">
		<div class="mon_cont">
        	<div class="E_Tit">企业用户管理信息</div>
            <table border="0" cellspacing="0" cellpadding="0" class="que_tab" >
              <tr>
                <td width="100" align="right">用户名：</td>
                <td width="150" align="left">
                <input id="txtQueryUserName"  type="text" class="mon_ser_text" 
	                style="width: 130px"
	                maxlength="50"
					onchange="value=value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,'')" 
	                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,''))"/>
                </td>
                <td width="120">
                	<a id="btnSearch" href="javascript:void(0)" class="ser_btn" style="color: white;">查询</a>&nbsp;&nbsp;
                 <auth:authorize operation="createEnterUser">
				 	<a id="btnAddUserPanel" href="javascript:void(0)" class="ser_btn" style="color: white;">新增</a> 
				 </auth:authorize>
                </td>
                </tr>
            </table>
            
            <div id="divAddUserPanel" class="wDiv" style="width:100%;display: none;border: 1px solid #d0d0d0;">
        	      <div class="td_title">企业用户管理信息新增</div>
  	  				<form id="formAddUser" action="">
		        	   <table  border="0" cellspacing="0" cellpadding="0">
			              <tr>
			                <td width="100" align="right"><span class="xin_red">*</span>用户名：</td>
			                <td width="240" align="left">
			                 <input id="txtName" name="Name" type="text" 
			                    class="td_input" style="width: 130px;"
								formCheck="true" 
								required="true" requiredError="请输入用户名称！" 
								noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！"
								 />
								<span id="txtNamespan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                 <td width="100" align="right"><span class="xin_red">*</span>登陆名：</td>
			                <td width="150" align="left">
			                 <input id="txtUserName" name="UserName" type="text" 
			                    class="td_input" style="width: 130px;"
			                    formCheck="true" 
								required="true" requiredError="请输入登陆名！" 
								noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！"
								ajaxAction="sys/user/checkUserName.action" 
								ajaxActionError="已存在此名称，请重新输入！" />
								<span id="txtUserNamespan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                <td width="200" align="center" rowspan="4" >
			                   <a id="btnAddUser" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">提交</a>
			                	<br>
			                	<a id="btnAddUserCancle" href="javascript:void(0)" class="ser_btn">取消</a>
			                </td>
			              </tr>
			              
			              <tr>
			                <td width="100" align="right"><span class="xin_red">*</span>密码：</td>
			                <td width="240" align="left">
			                 <input id="txtPassword" name="Password" type="password" 
			                  class="td_input" style="width: 130px;"
			                   formCheck="true" 
							   required="true" requiredError="请输入密码" 
							   textLength="6-10" valLengthError="长度必须在6到10个" />
							   <span id="txtPasswordspan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                <td width="100" align="right"><span class="xin_red">*</span>确认密码：</td>
			                <td width="150" align="left">
			                 <input id="txtPasswordA" name="PasswordA" type="password" 
			                    class="td_input" style="width: 130px;"
			                    formCheck="true" 
							    required="true" requiredError="请输入密码" 
							    confirmpwd="txtPassword" confirmpwd="两次密码输入不一致！" />
							    <span id="txtPasswordAspan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                 <td></td>
			              </tr>
			              
			               <tr>
			                <td width="100" align="right"><span class="xin_red">*</span>账户启用时间：</td>
			                <td width="240" align="left">
			                 
			                 	<input id="txtRunTime" name="RunTime" type="text" onFocus="this.blur()" readonly="readonly"
			                 	class="td_input" 
			                 	formCheck="true" 
								required="true" requiredError="请选择账户启用时间！" 
			                 	style="width: 130px;" >
			                 	<img src="Images/time.jpg" width="20" height="23" style=""
							    onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('txtRunTime'),dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-{%d}'})"/>
			                 <span id="txtRunTimespan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                <td width="100" align="right"><span class="xin_red">*</span>账户过期时间：</td>
			                <td width="170" align="left">
			                 	<input id="txtOverTime" name="OverTime" type="text" onFocus="this.blur()" readonly="readonly"
			                 	class="td_input"
			                 	 formCheck="true" 
								required="true" requiredError="请选择账户过期时间！" 
			                 	 style="width: 130px;" >
			                 	<span id="txtOverTimespan" class="errorMsg" style="display: none"></span>
			                 	  <img src="Images/time.jpg" width="20" height="23" style="margin-top:1px "
							      onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('txtOverTime'),dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-{%d}'})"/>
			                </td>
			                <td></td>
			              </tr>
			              
			               <tr>
<!--		                    <td width="100" align="right"><span class="xin_red">*</span>用户类型：</td>-->
<!--				                <td width="240" align="left">-->
<!--				                    <input type="radio" name="IsSuperUser" value="0" >普通管理员-->
<!--					                <input type="radio" name="IsSuperUser" value="1" checked="checked">企业管理员-->
<!--				                </td>-->
<!--			                 -->
		                	<td width="100" align="right" ><span class="xin_red">*</span>所属企业：</td>		                
                                <td align="left" width="240">
						    	 <input type="text" name="workUnitName" id="workUnitIdPram"  formCheck="true"   class="td_input"  style="width:130"
								required="true" requiredError="必须输入项!" noselect="true" requiredError="请选择一项"
								readonly="readonly"/> 
			      		        <input type="hidden" id="workUnitId" name="WorkUnitID"/>
						        <span id="workUnitIDNamespan" class="errorMsg" style="display: none"></span>
						       <a  href="javascript:void(0)" onclick="showWorkUnitTree()"  class="ser_btn">请选择</a>
						    </td>
			              </tr>
<!-- 						<tr>-->
<!--			               	<td width="100" align="right"><span class="xin_red">*</span>用户状态：</td>-->
<!--			                 	<td  width="150" align="left">-->
<!--			                   		<input id="aStatus" type="radio" name="aStatus" value="0" checked="checked">正常-->
<!--			                   		<input id="aStatus" type="radio" name="aStatus" value="1">失效-->
<!--			               	 	</td>-->
<!--			            </tr>-->
			         </table>
	            </form>
        	</div>
        	
        	
        	 <div id="divUpdateUserPanel" class="wDivEdit" style="width:1100px;HEIGHT:180px;display: none;border: 1px solid #d0d0d0;">
        	   <div class="td_title">企业用户管理信息编辑</div>
	        	  
		        	<table border="0" cellspacing="10" cellpadding="0" id="editFrom" >
			              <tr>
			                <td width="100" align="right"><span class="xin_red">*</span>用户名：</td>
			                <td width="150" align="left">
			                  <input id="txtUpdateUserId" name="id" type="hidden" />
			                 <input id="txtUpdateName" name="Name" type="text" 
				                 class="td_input" style="width: 130px;"
				                 formCheck="true" 
								 required="true" requiredError="请输入用户名称！" 
								 noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！"
								  />
								 <span id="txtUpdateNamespan" class="errorMsg" style="display: none"></span>
			                </td>
			                 <td width="100" align="right"><span class="xin_red">*</span>登陆名：</td>
			                <td  width="240" align="left">
			                 <input id="txtUpdateUserName" name="UserName" type="text" 
				                 class="td_input" style="width: 130px;"
				                 formCheck="true" 
								 required="true" requiredError="请输入登陆名！" 
								 noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！" 
								 ajaxAction="sys/user/checkUserName.action" 
								 ajaxDataId="txtUpdateUserId" 
								 ajaxActionError="已存在此名称，请重新输入！" />
							  <span id="txtUpdateUserNamespan" class="errorMsg" style="display: none"></span>
			                </td>
			                <td width="200" align="center" rowspan="4" >
			                 
			                   <a id="btnUpdateUser" href="javascript:void(0)" class="ser_btn" style="margin-bottom: 3px;">提交</a>
			                	<br>
			                	<a id="btnUpdateUserCancle" href="javascript:void(0)" class="ser_btn">取消</a>
			                </td>
			              </tr>
			            
			             <tr>
			                <td width="100" align="right"><span class="xin_red">*</span>账户启用时间：</td>
			                <td width="240" align="left">
			                 
			                 	<input id="txtUpdateRunTime" name="RunTime" type="text"  onFocus="this.blur()"
			                 	class="td_input"
			                 	formCheck="true" 
								required="true" requiredError="请选择账户启用时间！" 
			                 	 style="width: 130px;" readonly="readonly">
			                 	 <span id="txtUpdateRunTimespan" class="errorMsg" style="display: none"></span>
			                 			                 
			                </td>
			                <td width="100" align="right"><span class="xin_red">*</span>账户过期时间：</td>
			                <td width="170" align="left">
			                 	<input id="txtUpdateOverTime" name="OverTime" type="text"  onFocus="this.blur()"
			                 	class="td_input" 
			                 	 formCheck="true" 
								required="true" requiredError="请选择账户过期时间！" 
			                 	style="width: 130px;">
			                 	<span id="txtOverTimespan" class="errorMsg" style="display: none"></span>
			                 	  <img src="Images/time.jpg" width="20" height="23" style="margin-top:5px "
							      onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('txtUpdateOverTime'),dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-{%d-1}'})"/>
			                 
			                </td>
			                <td>
			                </td>
			              </tr>
			                 <tr>
			                  	
<!--			       			<s:if test="'true' eq #request.isSuper">-->
<!--								<td width="100" align="right"><span class="xin_red">*</span>用户状态：</td>-->
<!--			                 	<td  width="150" align="left">-->
<!--			                   		<input id="" type="radio" name="aStatus1" value="0" >正常-->
<!--			                   		<input id="" type="radio" name="aStatus1" value="1">失效-->
<!--			                   		<input type="hidden" id="IsSuperInput" name="IsSuperInput" />-->
<!--			               	 	</td>-->
                              <td align="right" width="100"><span class="xin_red">*</span>企业名称：</td>
						      <td align="left" width="240">
							<input type="text" id="workUnitIDName" name="workUnitIDName"   style="width:130"
								   class="td_input"
								   required="true" formCheck="true"    requiredError="请选择一项"
								    readonly="readonly"/> 
			      		    <input type="hidden" id="workUnitID1" />
							<span id="workUnitIDNamespan" class="errorMsg" style="display: none"></span>
<!--							<a  href="javascript:void(0)" onclick="showWorkUnitAddTree()"  class="ser_btn">请选择</a>-->
						</td>
			              
<!--			               </s:if>	-->
			              </tr>
			             
		            </table>
        	</div>
        	 <div id="special" style="width:1100px;HEIGHT:180px;display: none;border: 1px solid #d0d0d0;">
        	   <div class="td_title">个性化报表</div>
	        	   <table>
	        	   		<tr>
	        	   			<td>
	        	   				<fieldset style="width:500;">
					            	<div style=" width:500px;height:120px;OVERFLOW-Y: auto; OVERFLOW-X: hidden;padding-top: 0;vertical-align: top;">
					            		<ul id="specialTree" style="height: 220px;"></ul>
					            	</div>
			          		  	</fieldset>
	        	   			</td>
	        	   			<td>
	        	   				 <a id="specialSure" href="javascript:void(0)" onclick="setSpecial()" class="ser_btn" style="margin-bottom: 3px;">确定</a>
			                	<br>
			                	<a id="specialCancel" onclick="document.getElementById('special').style.display='none';" href="javascript:void(0)" class="ser_btn">取消</a>
			                </td>
	        	   		</tr>
	        	   </table>
        	   </div>
        	
          <table id="tbUsers" style="margin-top: 5px;display: none;"></table>
		
</div>
</div>
</div>

 <div id="dialogs" class="hiddiv" style="display: none;padding:5px;top:10px;">
			<iframe src="" id="dialogFrame" name="dialogFrame" width="100%"  height="100%" frameborder="0" scrolling="auto"></iframe>
		</div>
</body>
</html>