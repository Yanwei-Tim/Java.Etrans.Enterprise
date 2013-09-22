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
		<script src="<%=basePath%>js/command/batch/special/509.js" type="text/javascript"></script>
	</head>

	<body>
      <br/>
	 <table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr><td height="20">&nbsp;</td></tr>
			<tr>
			  <td width="100%" align="center">
				   <fieldset style="border-Color:#80CAEA;width: 98%;"><legend>信息点播菜单设置：指令参数</legend>
				  		<table width="100%" cellpadding="0" cellspacing="1">
				            
				            <tr>
				              <td width="3">&nbsp;</td>
				              <td width="181"><table width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
				                  <td nowrap="nowrap"><div align="right">设置类型：</div></td>
				                  <td>
				                  		 <select id="eventType" onchange="changeEventType()">
                    	  <option value="1">更新菜单</option>
                    	  <option value="2">追加菜单</option>
                          <option value="3">修改菜单</option>
                          <option value="0">删除菜单</option>
                    	 </select>
                    	  </td></tr>
                    	   <tr>
                   <td width="60px" id="eventCountId">信息项总数</td>
                   <td  width="30px"><input id="eventCount"></input></td>
                   <td  width="30px"><input id="okButon" type="button" value="确定" onclick="addEvent()"/></td>
                   <td>&nbsp;</td>
                  </tr>
				              </table></td>
				              <td width="3" rowspan="2" background="imgs/commandbg.gif">.</td>
				              <td width="15">&nbsp;</td>
				              <td width="300"><div id="back" class="hiddiv" style="display: none;"><img alt="正在发送指令" src="imgs/load.gif">正在发送指令......</div></td>
				              <td width="200"></td>
				            </tr>
							  <tr>
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
			
		 <tr>
		 <td valign="top"><a href="javascript:void(0)" onClick="sendMessage();"><img src="imgs/command.gif"  border="0"></a><a  href="javascript:void(0)" class="ser_btn" onClick="parent.hideSpecial();"><img src="imgs/cancel.gif"  border="0"></a>
	   </td>
		 </tr>
		 <tr>
	<td>
	<div id="result"></div>
	</td>
		</tr>
		</table>
		  <table width="100%" border="0" cellspacing="0" cellpadding="0" background="#EBF2FA">
          <tr background="#EBF2FA">
                    <td style="border-top:1px solid #1FFFF;">
                     <table id="eventList"  class="form">
			    <thead>
				<tr>
				     <th>信息类型</th>
					<th>信息名称	</th>
				</tr>
			</thead>
			</table>
                    </td>
                  </tr>
         </table>
	</body>
</html>