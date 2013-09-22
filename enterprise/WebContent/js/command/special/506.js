var vehicleId='';
var type;
var typeValue;
var patrn;
var unit;
$(function() {
	var mainFrame = window.dialogArguments; // 接收Left页面传来的参数
	vehicleId=$.query.get("vehicleId");//mainFrame[1];
	getCommandResult();
});

function getCurrentOption(){
	var select = document.getElementById("terminalParams");
	var indexSelect = select.selectedIndex;
	var currentOptions = select.options[indexSelect];
	return currentOptions;
}
/**
 * 下拉框改变事件
 */
function changeTerminalParams(){
	
	var currentOptions = getCurrentOption();
	type = currentOptions.type;
	typeValue=currentOptions.typeValue;
	patrn=currentOptions.patrn;
	unit=currentOptions.unit;
	var paramsId=$("#terminalParams").val();
	var paramsName=	 $("#terminalParams").find("option:selected").text()+"：";
	$("#unit").html(unit);
	$("#paramsName").html(paramsName);
	if(type==0){
		$("#elementTd").html("<input id='paramsValue' size='36'/>");
		$("#paramsValue").val("");
	}else{
		//1: 下拉
		if(type==1){
			$("#elementTd").html(createSelect(typeValue));
		}
	}
	$("#result").html('');
}

/**
 * 创建一个下拉框
 * 
 * @param TypeValue
 * @returns {String}
 */
function createSelect(TypeValue){
	var typeValue$ = TypeValue.split(";");
	var typeValue$2;
	var select = "<SELECT id='paramsValue'>";
	for(var i=0;i<typeValue$.length;i++){
		typeValue$2 = typeValue$[i].split(",");
		select+="<option value='"+typeValue$2[0]+"'>"+typeValue$2[1]+"</option>"
	}
	select+="</SELECT>"
	return select;
}

/**
 * 删除当前行
 * 
 * @param TR
 */
function delCurrentRow(TR){
	$($(TR).parent()).remove();
}

/**
 * 添加到列表
 */
function addParams(){
	var paramsName=$("#paramsName").html();
	paramsName = paramsName.substr(0,paramsName.length-1);
	var paramsValue=$("#paramsValue").val();
	var paramsId=$("#terminalParams").val();
	if(paramsValue==""){
		alert(paramsName+"值不能为空");
		return ;
	}
	var currentOptions = getCurrentOption();
	var isCanAdd = false;
	if(currentOptions.patrn!='' && currentOptions.type=='0'){
		if(checkValueIsValid(paramsValue,currentOptions.patrn)){
			isCanAdd = true;
		}else{
			isCanAdd = false;
			alert(paramsName+"的值必须为"+currentOptions.error);
			return;
		}
	}else{
		isCanAdd = true;
	}
	if(isCanAdd){
		var tbody="";
		tbody +="<tr class='odd'>"
			+"<td align='left'>"+paramsId+"</td>"
			+"<td align='left'>"+paramsName+"</td>"
		    +"<td align='left'>"+paramsValue+"</td>"
		 +"<td align='center' onclick='delCurrentRow(this)' style='cursor: hand;color:red;'>删除</td>";
			tbody+="</tr>";
		  $("#vechList").append(tbody);
	}
}

/**
 * 检查输入的值是否有效
 * 
 * @param value
 * @param patrn
 * @returns {Boolean}
 */
function checkValueIsValid(value,patrn)  {  
	var npatrn = /^[0-9]*[1-9][0-9]*$/;
	if (!npatrn.test(value)) return false  
	return true  
}
function sendMessage(){
	var params = '';
	var paramsCount = 0;
	$("#vechList tr").each(function() {
		var paramsId = $(this).children("td:first").text();
		var paramsValue = $(this).children("td:eq(2)").text();
		if (paramsId != '') {
			params = params + "<"+paramsId + ">=" + paramsValue+",";
			paramsCount++;
		}
	});
		  
		  params=paramsCount+","+params;
		  params = params.substr(0,params.length-1);
			  var commandName ="终端参数设置";
				var commandId ="680";
				var vehicleId= $.query.get('vehicleId');
				var jsonParams = {
					commandCode :"9103",
					commandTarget : vehicleId,
					paramMeassage : params,
					commandName : commandName,
					commandId   : commandId,
					datetimes : new Date()
				};
				$.post("command/sendSpecialCommand.action", jsonParams, function(data) {
						if (data== 'true') {
								$("#result").html('发送成功!');
						} else {
							$("#result").html('发送失败!');
						}
					});

		var paramsNameValue="";
		//参数设置入库
		 $("#vechList tr").each(function(){
			  var paramsId = $(this).children("td:first").text();
			  var paramName = $(this).children("td:eq(1)").text();
			  var paramValue = $(this).children("td:eq(2)").text();
			  if(paramsId!=''){
				  if(paramsNameValue==""){
						paramsNameValue=paramName+":"+paramValue;
					}else{
						paramsNameValue=paramsNameValue+"|"+paramName+":"+paramValue;
					} 
			  }
			    });
		 var  addParams = {
					commandTarget : vehicleId,
					paramsNameValue : paramsNameValue,
					datetimes : new Date()
				};
		 $.post("command/addTerminalParam.action", addParams, function(data) {

			});
}

/**
 * 取结果
 */
function getCommandResult() {
	var vehicleId= $.query.get('vehicleId');
	var jsonParams = {
		vehicleId : "8103|"+vehicleId,
		datetimes : new Date().getTime()
	};
	$.post("command/findCommandResult.action", jsonParams, function(data) {
	if (data != 'false' && data!='') {
	     var resultObj = $("#result");
	 	resultObj.html("回复结果："+data);
	}
	setTimeout('getCommandResult()', 5000);
}	);
}

