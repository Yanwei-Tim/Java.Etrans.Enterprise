<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/common/validateHead.jsp"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.etrans.common.util.web.IpUtils"%>
<%
			
			 /**用户IP类型**/
		   	String ipType="";//ip类型
			ipType = (String)request.getSession().getAttribute(IpUtils.LOGIN_IP_TYPE);
			request.setAttribute("ipType",ipType);//innerip内网outerip外网
%>
<html>

<head>


<script type="text/javascript">
var ipType ='${ipType}';
</script>


<base href="<%=basePath%>"></base>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>企业中心</title>		
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/carlist.css"/>
<script type="text/javascript" src="${basePath}js/common/HashMap.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common/StringUtil.js"></script>
<script type="text/javascript" src="<%=basePath%>js/monitorCenter/carlist.js"></script>
</head>
<body>
<!-- 顶部菜单 -->
<div id="cont_box">
	<div class="main">
    	<div class="left mon_meun">
        	<div class="E_Tit" align="left">
                <div class="mon_ser_box" style="padding-left: 0px;" align="left">
                	<table width="248" border="0" cellspacing="0" cellpadding="0" style="padding-left: 0px">
                      <tr>
                        <td width="120" align="left"><input name="mon_ser_text" value="请输入车牌号" type="text" id="registrationNo" class="mon_ser_text2"/></td>
                        <td width="50"><span class="ser_btn" onclick="educateCarList.queryCar()">搜索</span></td>
                        	<td>&nbsp;&nbsp;<span class="gjser_btn" ><a href="javascript:void(0)"  id="adSearchBtn">高级搜索</a></span></td>
                      </tr>
                    </table>
				 </div>
           </div>
           <div class="advanced search_bg"  id="adSearch" style=" margin-left:2px; width:268px; height:140px; border:1px; solid #FFF; background:#e4e4e4; overflow:hidden;display: none;">  
           <div class="advanced search" style="width:265px; height:117px;">
            	<ul>
            		<li class="advanced search_02" style="float:left; margin-left:8px; margin-top:3px; color:#333;"><pre>所属行业 :&nbsp;<select id="tradeKind" name="advanced search_01" style="border:1px solid #BFBFBF; width:142px; height:21px;">
                	</select> </pre></li>
                	<li class="advanced search_01" style="float:left; margin-left:8px; margin-top:8px; color:#333; word-spacing:2px;"><pre>SIM卡号 : <input name="advanced search_02" type="text" id="simNo" style="border:1px solid #BFBFBF; width:140px; height:21px;"/></pre></li>
                    <li class="advanced search_02" style="float:left; margin-left:8px; margin-top:3px; color:#333;"><pre>运输企业 : <input name="advanced search_03" type="text" id="workUnitName" style="border:1px solid #BFBFBF; width:140px; height:21px;"/></pre></li>
                    <li class="advanced search_03" style="float:left; margin-left:8px; margin-top:3px; color:#333;"><pre>所属车队 : <input name="advanced search_04" type="text" id="vehicleTeam" style="border:1px solid #BFBFBF; width:140px; height:21px;"/></pre></li>
                    <li class="advanced search_04" style="float:left; margin-left:8px; margin-top:3px; color:#333;"><pre>司机名称 : <input name="advanced search_05" type="text" id="driverName" style="border:1px solid #BFBFBF; width:140px; height:21px;"/></pre></li>
                </ul>
            </div>
         </div>
          <div id="car_list">
          <div class="ser_res" style="font-size: 11px;">
          	<a id="treeList" name="0" href="javascript:educateCarList.loadListCar();" class="treeSer_btn2"></a>
          	<input name="" id="checkAll" type="checkbox"/>
          	共<h5 id="totalCount">0</h5>辆,<h6 id="onlineCount">0</h6>/<h6 id="onlineCurrentCount">0</h6>(在线/当前页)</div>
          <!-- 树 -->
          <div align="left" id="carTree" style="OVERFLOW-Y:auto;OVERFLOW-X:hidden;" >
							<ul id="carTreeList">
							</ul>
		  </div>
		  <!--列表 -->
          <div  class="mobox" id="mobox">
          </div>   
          </div> 
          
    </div>
    <div style="height: 100%; width: 100%;" align="center" id="moreVehicle"></div> 
    </div>
    </div>
</body>
</html>
