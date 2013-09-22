var vehicleId='';
$(function() {
	
	var mainFrame = window.dialogArguments; // 接收Left页面传来的参数
	vehicleId=$.query.get("vehicleId");//mainFrame[1];
	// 取结果
	getCommandResult();

	// 读取区域
        var reurl="command/getCommandAreaSel.action?shapeId=2";
	
        $("#area").bind('change', function(){
        	getPoint();
         });
	$.ajax({
		type : "POST",
		dataType : "json",
		url : reurl,
		success : function(data) {
		    var area = $("#area").get(0);
	    	area.options.add(new Option("请选择区域","-1"));
			$(data).each(function(i, n) {
				area.options.add(new Option(n.name,n.val));
			});
		},
		error : function(msg) {
			alert("因网络不畅,数据加载未完成,请刷新页面!");
		}
	});
});

// 取点
function getPoint() {
	var  selectArea = $('#area').val();
	if (selectArea != '-1') {
	    var areaValue=selectArea.split(",");
	    $("#param3-1").val(areaValue[0]);
	    $("#param3-2").val(areaValue[1]);
	    $("#param3-3").val(areaValue[2]);
	}
}

function sendMessage(){
	var params='';
	var param4=$("#param4").val();
	if(param4==''){
		param4="0";
	}
	var param5=$("#param5").val();
	if(param5==''){
		param5="0";
	}
	  params=$("#param1").val()+","+$("#param2").val()+","+$("#param3-2").val()+","+$("#param3-1").val()+","+$("#param3-3").val()+","
	          +param4+","+param5+","+$("#param6").val()+","+$("#param7").val()+","+$("#param8").val()+","
	          +$("#param9").val()+","+$("#param10").val()+","+$("#param11").val()+","+$("#param12").val()+","+$("#param13").val()+","
	          +$("#param14").val()+","+$("#param15").val();
	    var commandName ="设置圆形区域";
		var commandId ="373";
		var vehicleId= $.query.get('vehicleId');
		var jsonParams = {
			commandCode :"8600",
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
}


//取结果
function getCommandResult() {
	var vehicleId= $.query.get('vehicleId');
	var jsonParams = {
		vehicleId : "8600|"+vehicleId,
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
