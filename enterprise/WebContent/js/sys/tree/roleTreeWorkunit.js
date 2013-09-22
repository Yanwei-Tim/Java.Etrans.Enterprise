function showWorkUnitTree(){
	var basePath = getRootPath(); 
	var  url=basePath+'/sys/tree/workUnitParamName.jsp';
	openDialog1(url, 400, 400,"企业信息");
	
}


function closeDialog(){
	$('#dialogs').dialog('close');
}

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

function openDialog1(src, width, height, title) {

	$("#dialogs").css("display", "block");
	$("#dialogFrame").attr("src", src);
	$("#dialogs").dialog({
		width : width,
		height : height,
		title : title,
		maximizable : false,
		inline : true
	});
}
