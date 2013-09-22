<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/validateHead.jsp"%>
<%@taglib prefix="auth"  uri="/auth-tags"  %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%@page import="com.etrans.bubiao.sys.UserContext" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>			
			
		    <title>普通用户管理</title>
		    <link rel="stylesheet" type="text/css" href="${basePath}css/style.css">
		    <script type="text/javascript"	src="${basePath}js/sys/tree/treeWorkunit.js"></script>
		    <script type="text/javascript" src="${basePath}js/datepicker/WdatePicker.js"></script>
	
	</head>
	
<body>


<div style="width: 100%" id="cont_box">
	<div class="main">
		<div class="mon_cont">
           
            
                 <div class="td_title"><strong>第一步：</strong>新建用户</div>
  	  				<form  action="">
		        	   <table  id="formAddUser" border="0" cellspacing="0" cellpadding="0">
			              <tr>
			                <td width="300" align="right"><span class="xin_red">*</span>用户名：</td>
			                <td width="200" align="left">
			                 <input id="txtUserId" name="id" type="hidden" />
			                 <input id="txtName" name="Name" type="text" 
			                    class="td_input" style="width: 150px;"
								formCheck="true" 
								required="true" requiredError="请输入用户名称！" 
								noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！" />
								<span id="txtNamespan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                <td width="300" align="right"><span class="xin_red">*</span>登陆名：
			                 <input id="txtUserName" name="UserName" type="text" 
			                    class="td_input" style="width: 150px;"
			                    formCheck="true" 
								required="true" requiredError="请输入登陆名！" 
								noSpecialCaracters="true" noSpecialCaractersError="请输入中英文或数字！"
								ajaxAction="sys/user/checkUserName.action" 
								ajaxActionError="已存在此名称，请重新输入！" />
								<span id="txtUserNamespan" class="errorMsg" style="display: none"></span>
			                </td>
			              </tr>
			              
			              <tr>
			                <td width="300" align="right"><span class="xin_red">*</span>密码：</td>
			                <td width="200" align="left">
			                 <input id="txtPassword" name="Password" type="password" 
			                  class="td_input" style="width: 150px;"
			                   formCheck="true" 
							   required="true" requiredError="请输入密码" 
							   textLength="6-10" valLengthError="长度必须在6到10个" />
							   <span id="txtPasswordspan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                <td width="300" align="right"><span class="xin_red">*</span>确认密码：
			                 <input id="txtPassword1" name="PasswordA" type="password" 
			                    class="td_input" style="width: 150px;"
			                    formCheck="true" 
							    required="true" requiredError="请输入密码" 
							    confirmpwd="txtPassword" confirmpwd="两次密码输入不一致！" />
							    <span id="txtPassword1span" class="errorMsg" style="display: none"></span>
			                </td>
			              </tr>
			              
			               <tr>
			                <td width="300" align="right"><span class="xin_red">*</span>启用时间：</td>
			                <td width="200" align="left">
			                 	<input id="txtRunTime" name="RunTime" type="text" onFocus="this.blur()" readonly="readonly"
			                 	class="td_input" 
			                 	formCheck="true" 
								required="true" requiredError="请选择账户启用时间！" 
			                 	style="width: 130px;" >
			                 	<img src="Images/time.jpg" width="20" height="23" style=""
							    onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('txtRunTime'),dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-{%d}'})"/>
			                 <span id="txtRunTimespan" class="errorMsg" style="display: none"></span>
			                </td>
			                
			                <td width="304" align="right"><span class="xin_red">*</span> 过期时间：
			                 	<input id="txtOverTime" name="OverTime" type="text" onFocus="this.blur()" readonly="readonly"
			                 	class="td_input"
			                 	 formCheck="true" 
								required="true" requiredError="请选择账户过期时间！" 
			                 	 style="width: 130px;" >
			                 	<span id="txtOverTimespan" class="errorMsg" style="display: none"></span>
			                 	  <img src="Images/time.jpg" width="20" height="23" style="margin-top:1px "
							      onClick="WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('txtOverTime'),dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-{%d}'})"/>
			                </td>
			              </tr>
			              
			               <tr>
			               <td width="300" align="right" ><span class="xin_red">*</span>所属企业：</td>
                           <td align="left" width="200">
							    	 <input type="text" name="workUnitName" id="workUnitIdPram"  formCheck="true"   class="td_input"  style="width:130"
									required="true" requiredError="必须输入项!" noselect="true" requiredError="请选择一项"
									readonly="readonly"/> 
				      		        <input type="hidden" id="workUnitId" name="WorkUnitID"/>
							        <span id="workUnitIDNamespan" class="errorMsg" style="display: none"></span>
							       <a  href="javascript:void(0)" onclick="showWorkUnitTree()"  class="ser_btn">请选择</a>
							    </td>
			              </tr>
			         </table>
	            </form>
        	</div>
        	
        	
		        	   
	              
        	</div>
        
          
		
</div>

  <div id="dialogs" class="hiddiv" style="display: none;padding:5px;top:10px;">
			<iframe src="" id="dialogFrame" name="dialogFrame" width="100%"  height="100%" frameborder="0" scrolling="auto"></iframe>
		</div>

</html>