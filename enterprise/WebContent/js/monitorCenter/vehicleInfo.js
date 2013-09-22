$(function() {
	var vehicleId =$.query.get("vehicleId");
	aa(vehicleId);
		//初始化验证插件
		$("#editForm").validation();
		$('#etnBtn').bind('click', doEdit);//设置文本框可编辑
		$('#savaBtn').bind('click', toEdit);//编辑车辆信息
		$("#savaBtn").attr("disabled",true);
		
//		$('#ColorBtn').bind('click', showColorTree);
//		$('#tradeBtn').bind('click', showtradeKindTree);
//		$('#areaBtn').bind('click', showAreaTree);
//		$('#workBtn').bind('click', showWorkUnitTree);
		
});


function aa(vehicleId){
	$("#id").val(vehicleId);
	$.ajax({
	url:"monitorCenter/getGpsVehicleInfo.action",
	type:"POST",
	dataType:"json",
	data:{"vehicleId":vehicleId},
	success:function(data){
		   if(data!=''&&data!=null){
//		   	  $("#rNo").html(data.registrationNO);
//		   	  $("#standType").html(data.standType);
//		   	  $("#phoneNo").html(data.phoneNo);
//		   	  $("#typeName").html(data.typeName);
//		   	  $("#rnoColor").html(data.registrationNOColor);
//		   	  $("#areaName").html(data.areaName);
//		   	  $("#workUnitName").html(data.workUnitName);
//		   	  $("#transportPermits").html(data.transportPermits);
		       $("input").attr("disabled",true);
		       $("#rNo").attr("disabled",true);
		       $("#ColorBtn").attr("disabled",true);
		       $("#tradeBtn").attr("disabled",true);
		       $("#areaBtn").attr("disabled",true);
		       $("#workBtn").attr("disabled",true);
		       
		       $("#rNo").val(data.registrationNO);
		       $("#standType").val(data.standType);
		       $("#phoneNo").val(data.phoneNo);
		       $("#typeName").val(data.typeName);
		       
		       
		       $("#rnoColor").val(data.registrationNOColor);
		       $("#areaName").val(data.areaName);
		       $("#workUnitName").val(data.workUnitName);
		       $("#transportPermits").val(data.transportPermits);
		       
		       $("#commNO").val(data.commNO);
		       $("#terminalId").val(data.terminalId);
		       $("#simId").val(data.simId);
		       
		       $("#registrationNOColorId").val(data.registrationNOColorId);
		       $("#tradeKindId").val(data.tradeKindID);
		       $("#workUnitId").val(data.workUnitID);
		       $("#areaId").val(data.areaID);
		   }
	}

});
}


//设置文本框可编辑
function doEdit(){
	$("input").attr("disabled",false);	
	
	$("#flag").hide();
	$("#savaBtn").attr("disabled",false);
	
	$("#rnoColor").attr("disabled",true);
	$("#typeName").attr("disabled",true);
	$("#areaName").attr("disabled",true);
	$("#workUnitName").attr("disabled",true);
	$("#rNo").attr("disabled",true);
	$("#ColorBtn").attr("disabled",false);
    $("#tradeBtn").attr("disabled",false);
    $("#areaBtn").attr("disabled",false);
    $("#workBtn").attr("disabled",false);
}



//编辑车辆信息
function toEdit(){
	var vehicleId = $("#id").val();
	var registrationNo = $("#rNo").val();
	var terminalId = $("#terminalId").val();
	var commNO = $("#commNO").val();
	var phoneNo = $("#phoneNo").val();
	var simId = $("#simId").val();
	
	var tradeKindId = $("#tradeKindId").val();
	var registrationNOColorId = $("#registrationNOColorId").val();
	var areaId = $("#areaId").val();
	var workUnitId = $("#workUnitId").val();
	var transportPermits = $("#transportPermits").val();
	
	
//	var params = {
//			vehicleId : vehicleId,
//			registrationNo : registrationNo,
//			terminalId : terminalId,
//			commNO : commNO,
//			phoneNo : phoneNo,
//			simId : simId,
//			areaId : areaId,
//			tradeKindId : tradeKindId,
//			registrationNOColorId : registrationNOColorId,
//			workUnitId : workUnitId,
//			transportPermits : transportPermits
//			};
	
	
	var canSubmit = $("#editForm").beforeSubmit();
	if(canSubmit){
		$.ajax({
		    type : "POST",
		    url : "monitorCenter/updateVehicleinfo.action",
		    data : {vehicleId : vehicleId,
			registrationNo : registrationNo,
			terminalId : terminalId,
			commNO : commNO,
			phoneNo : phoneNo,
			simId : simId,
			areaId : areaId,
			tradeKindId : tradeKindId,
			registrationNOColorId : registrationNOColorId,
			workUnitId : workUnitId,
			transportPermits : transportPermits},
		    dataType : "JSON",
		    success : function(data) {
		    	try {
		    		if(data.code == '1'){
			    	//	alert("车辆信息修改成功");
			    		$("input").attr("disabled",true);	
			    		$("#flag").show();
			    		$("#savaBtn").attr("disabled",true);
			    		$("#ColorBtn").attr("disabled",true);
					    $("#tradeBtn").attr("disabled",true);
					    $("#areaBtn").attr("disabled",true);
					    $("#workBtn").attr("disabled",true);
			    		
			    	}else{
			    		showError();
			    	}
				} catch (e) {
					alert(e);
				}
		    	
		    },
		    error : function(data) {
		    	showError();
		    }
		});
	}
	
}

function showError(){
	showWarning('服务器忙，请重试！');
}





//function showtradeKindTree() {
//	var basePath = getRootPath(); 
//	var url=basePath+'/sys/tree/tradeKindTree.jsp';
//	window.showModalDialog(url,window,"dialogWidth=350px;dialogHeight=400px;help=no;scrollbars=yes;");   
//}
//
//function showAreaTree(){
//	var basePath = getRootPath(); 
//	var url=basePath+'/sys/tree/areaTree.jsp';
//	window.showModalDialog(url,window,"dialogWidth=350px;dialogHeight=400px;help=no;scrollbars=yes;");   
//
//}
//
//function showWorkUnitTree(){
//	var basePath = getRootPath(); 
//	var url=basePath+'/sys/tree/wrokUnitTree.jsp';
//	window.showModalDialog(url,window,"dialogWidth=350px;dialogHeight=400px;help=no;scrollbars=yes;");   
//
//}
//
//function showColorTree(){
//	var basePath = getRootPath(); 
//	var url=basePath+'/sys/tree/colorTree.jsp';
//	window.showModalDialog(url,window,"dialogWidth=350px;dialogHeight=400px;help=no;scrollbars=yes;");   
//
//}



function getRootPath(){    
	//获取当前网址，如： http://192.168.2.133:8080/bubiaoQdn/sys/vehicle/vehicleModifyHistory.jsp    
	var curWwwPath=window.document.location.href;    
	//获取主机地址之后的目录，如：bubiaoQdn/sys/vehicle/vehicleModifyHistory.jsp
	var pathName=window.document.location.pathname;   
	var pos=curWwwPath.indexOf(pathName);    
	//获取主机地址，如：http://192.168.2.133:8080 
	var localhostPaht=curWwwPath.substring(0,pos);    
	//获取带"/"的项目名，如：/bubiaoQdn    
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);    
	return(localhostPaht+projectName);
	
}

