<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/validateHead.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<head>
<script type="text/javascript" src="${basePath}js/jq/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jq/jquery.Query.js"></script>
  
<link rel="stylesheet" type="text/css" href="${basePath}css/body.css">
<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${basePath}js/easyui/themes/icon.css">
<script type="text/javascript" src="${basePath}js/easyui/jquery.easyui.min.js"></script>

<script type="text/javascript" src="${basePath}js/sys/customMap/area.js"></script>

<style type="text/css">
	.load{width: 100px; height: 16px; position: absolute; left: 20px; top: 80px  }
	.ser_btn1{width:48px; height:22px; font-size:12px; line-height:21px; background:#2a80b9; text-align:center; color:#fff; border:1px solid #336699; cursor:pointer; display:inline-block;}
   
</style>
</head>

<body style="background-color: #fff;">
       <table sytle="font-size:12px;" width="175" height="98" border="0" cellpadding="0" cellspacing="1">
			    
			    <tr style="font-size:12px;">
				  <td width="8">&nbsp;</td>
			      <td width="164"> 名称：<input id="name" name="name" size="14"/></td>
			    </tr>
			   
				<tr>
			      <td colspan="2" align="right">
			       <input type="hidden" id="Radius" />
			       <input type="hidden" id="CustomType" />
				   <input type="hidden" id="LngLat" />
				   <input type="hidden" id="OriginLngLat" />
				   <a id="CoseBtn" href="javascript:void(0)"  class="ser_btn1" style="margin-bottom: 3px;">取消</a>
			       <a id="CPBtn" href="javascript:void(0)"  class="ser_btn1" style="margin-bottom: 3px;">保存</a>
			      </td>
			    </tr>
			  </table>  
   
		   	
</body>
</html>