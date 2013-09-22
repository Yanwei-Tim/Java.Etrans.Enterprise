var vehicleIdStr = ""; // 所选车辆
var isSend = false;
$(function() {
	$("div tbody tr:odd").addClass("even");
	
	// 取结果
	getCommandResult();
	getCommandParam();
	
});

/**
 * 取指令参数  
 * @param data
 * @return
 */
function getCommandParam(){
	var commandKindID =$.query.get('commandKindId');
	var terminalKindID=$.query.get('terminalKindID');
	$("#commandKindId").val(commandKindID);
	
	var commandId ="";
	 var param={
    		 date:new Date(),
    		 commandKindID:commandKindID,
    		 terminalKindID:terminalKindID
             };
	var url="command/getPhotoCommand.action";
	var lnglagArray=new Array();
	 $.ajax({
		url : url,
		type : "POST",
		dataType : "json",
		data : param,
		async:false,
		success : function(req){
		 if(req=="null"||req==null){
			 commandId=0;
		 }else{
			 commandId=req.commandId;
		 }
		}
	});
	if(commandId==0){
      parent.closeDialog();
	}
	 $.ajax( {
			type:"POST",
			url : "command/getCommandSendParam.action",
			data:{"commandId":commandId},
			success : getCommandParamSucc,
			error : getCommandParamError
		});
}
function getCommandParamSucc(data){
	if(data!=null && data.length>0){
		$("#commandCode").val(data[0]["functionNo"]);
		$("#commandName").html(data[0]["commandName"]);
		$("#commandId").val(data[0]["commandId"]);
		if(data[0]["ID"]=='undefined'||data[0]["ID"]==null){//没有参数
			var tabObj =  document.getElementById("tabInfo");
			var trObj = creElement("tr");
			var tdObj1 = creElement("td");
		  var spanObj = creElement("span");
		  spanObj.innerHTML = "本指令下发无须参数";
		  tdObj1.appendChild(spanObj)
		  trObj.appendChild(tdObj1)
		  tabObj.appendChild(trObj);
		}else{//有参数
			var addSpaceTd = false;//最后一行是否要补两个空单元格
		
		if(data.length%2==1){
			addSpaceTd = true;
		}
		var tabObj= document.getElementById("tabInfo");

		if(data.length>1){
			for(var i=0;i<data.length-1;i++){
				var trObj = creElement("tr");
				var tdObj1 = creElement("td");
				var tdObj2 = creElement("td");
				var tdObj3 = creElement("td");
				var tdObj4 = creElement("td");
				
				tdObj1.style.cssText = "text-align:right;text-overflow:ellipsis; white-space: nowrap;";
				tdObj2.style.cssText = "text-align:left;text-overflow:ellipsis; white-space: nowrap;";
				tdObj3.style.cssText = "text-align:right;text-overflow:ellipsis; white-space: nowrap;";
				tdObj4.style.cssText = "text-align:left;text-overflow:ellipsis; white-space: nowrap;";
				
				tdObj1.appendChild(createTitle(data[i]));
				tdObj2.appendChild(createParamFactory(data[i]));
				tdObj2.appendChild(getDesc(data[i]));
				
				tdObj3.appendChild(createTitle(data[i+1]));
				tdObj4.appendChild(createParamFactory(data[i+1]));
				tdObj4.appendChild(getDesc(data[i+1]));
				
				trObj.appendChild(tdObj1);
				trObj.appendChild(tdObj2);
				trObj.appendChild(tdObj3);
				trObj.appendChild(tdObj4);
				
				tabObj.appendChild(trObj);
				
				i=i+1;
			}
		}
		
		if(addSpaceTd){
			var trObj = creElement("tr");
			var tdObj1 = creElement("td");
			var tdObj2 = creElement("td");
			var tdObj3 = creElement("td");
			var tdObj4 = creElement("td");
			
			tdObj1.style.cssText = "text-align:right;text-overflow:ellipsis; white-space: nowrap;";
			tdObj2.style.cssText = "text-align:left;text-overflow:ellipsis; white-space: nowrap;";
			tdObj3.style.cssText = "text-align:right;text-overflow:ellipsis; white-space: nowrap;";
			tdObj4.style.cssText = "text-align:left;text-overflow:ellipsis; white-space: nowrap;";
			
			tdObj1.appendChild(createTitle(data[data.length-1]));
			tdObj2.appendChild(createParamFactory(data[data.length-1]));
			tdObj2.appendChild(getDesc(data[data.length-1]));
			
			trObj.appendChild(tdObj1);
			trObj.appendChild(tdObj2);
			trObj.appendChild(tdObj3);
			trObj.appendChild(tdObj4);
			
			tabObj.appendChild(trObj);
		}
		}
		
	}else{
		alert("因网络不畅,数据加载未完成,请刷新页面!");
	}
}

//5=日期时间，6=日期，7=时间
var g_dateTime='yyyy-MM-dd HH:mm:ss'; 
var g_date='yyyy-MM-dd';
var g_time='hh:mm:ss';
/**
 * 取日期类型
 * @param obj
 * @return
 */
function getFormatDateStr(obj){
	if(obj["EditKind"]==5){
		return g_dateTime;
	}else if(obj["EditKind"]==6){
		return g_date;
	}else if(obj["EditKind"]==7){
		return g_time;
	}else{
		return g_date;
	}
}

/**
 * 取日期控件
 * @param obj
 * @return
 */
function getWdatePicker(obj){
	var paramName = "param"+obj["Sequence"];
	var dateObj = creElement("img");
	var $dateObj=$(dateObj);
	 $dateObj.bind('click', function(){
	 WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById(paramName),dateFmt:getFormatDateStr(obj)});
	 });
	//dateObj.onclick=function(){
	 // WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById(paramName),dateFmt:getFormatDateStr(obj)});
	//}
	//setAttr(dateObj,"onClick","WdatePicker({firstDayOfWeek:1,isShowWeek:true,el:document.getElementById('"+paramName+"'),dateFmt:'"+getFormatDateStr(obj)+"'})");
	setAttr(dateObj,"src","Images/time.jpg");
	setAttr(dateObj,"width","20px");
	setAttr(dateObj,"height","24px");
	
	return dateObj;
}

/**
 * 取参数描述
 * @param obj
 * @return
 */
function getDesc(obj){
	var spanObj=creElement("span");
//	spanObj.style.cssText = "text-align:left;text-overflow:ellipsis; white-space: nowrap;";
	spanObj.innerHTML = isUndefined(obj["Description"]);
	return spanObj;
}
/**
 * 判断未定义变量
 * @param obj
 * @return
 */
function isUndefined(obj){
	return obj==undefined?'':obj;
}
/**
 * 生成DOM对象
 * @param obj
 * @return
 */
function creElement(str){
	return document.createElement(str);
}
/**
 * 设置表单元素属性
 * @param obj
 * @return
 */
function setAttr(obj,name,val){
	return obj.setAttribute(name,val);
}
/**
 * 生成指令参数字段名
 * @param obj
 * @return
 */
function createTitle(obj){
	var divObj = creElement("div");
	divObj.setAttribute("align","right");
	divObj.setAttribute("nowrap","nowrap");
	divObj.setAttribute("id","settingName"+obj["Sequence"]);
	divObj.setAttribute("sequence",obj["Sequence"]);
	divObj.innerHTML = obj["Name"]+"：";

	return divObj; 
}
/**
 * 判断生成字段类型
 * @param obj
 * @return
 */
//--0=字符串，1=整数，2=浮点数，3=布尔值，4=参考表（下拉），5=日期时间，6=日期，7=时间 8=单选
function createParamFactory(obj){
	
	if(obj["EditKind"]==0 || obj["EditKind"]==1 || obj["EditKind"]==2  ){
		return createInputElement(obj);
		
	}else if(obj["EditKind"]==3){ 
		return createSelBooleanElement(obj);
		
	}else if(obj["EditKind"]==4){
		return createSelectElement(obj);
		
	}else if(obj["EditKind"]==5 || obj["EditKind"]==6 || obj["EditKind"]==7){
		return createInputDateElement(obj);
		
	}else if(obj["EditKind"]==8){
		return createRadioElement(obj);
		
	}else if(obj["EditKind"]==101 || obj["EditKind"]==102 || obj["EditKind"]==103 || obj["EditKind"]==104){
		return createMapElement(obj);
	}
		
}
/**
 * 生成选择框
 * @param obj
 * @return
 */
function createSelectElement(obj){
	var selObj = creElement("select");
	selObj.setAttribute("paramType",getParamType(obj));
	selObj.setAttribute("id","param"+obj["Sequence"]);
	
	var param = obj["ListItem"];
	if(param!=null){
		var paramArr = param.split(",");
		if(paramArr.length>0){
			for(var i=0; i<paramArr.length; i++){
				var optionObj = creElement("option");
				selObj.options.add(optionObj);
				optionObj.text=paramArr[i].split("=")[1];
				optionObj.value=paramArr[i].split("=")[0];
			}
		}
	}
	
	if(obj["DefaultValue"]!=undefined){
		selObj.selectedIndex=obj["DefaultValue"];
	}
	
	return selObj;
}
/**
 * 判断查询用户点线面的类型
 * @param obj
 * @return
 */
function getMapType(str){
	
	if(str.indexOf("圆形")>-1){
		return 2;
	}else if(str.indexOf("多边形")>-1){
		return 3;
	}else if(str.indexOf("矩形")>-1){
		return 1;
	}else if(str.indexOf("路线")>-1){
		return 4;
	}
}

/**
 * 描述：查询用户自定义圆形，多边形，矩形数据  
 *  shapeId 代表 2:圆形，3:多边形，1:矩形坐标   
 *  EditKindId 分别代表 设置圆形区域  103
 *  设置多边形区域  101
 *  设置矩形区域  102
 *  设置路线     104
 */
function createMapElement(obj){
	var selObj = creElement("select");
	selObj.setAttribute("paramType",getParamType(obj));
	selObj.setAttribute("id","param"+obj["Sequence"]);
	var reurl = "";
	
	switch(getMapType(obj["commandName"])){
	case 3:
		reurl="command/getCommandAreaSel.action?shapeId=3";
		 break;
	case 1:
		reurl="command/getCommandAreaSel.action?shapeId=1";
		 break;
	case 2:
		reurl="command/getCommandAreaSel.action?shapeId=2";
		 break;
	case 4:
		reurl="command/getCommandLineSel.action";
		 break;
	default:
		return creElement("span");
	}
	
	$.ajax({
		type : "POST",
		dataType : "json",
		url : reurl,
		success : function(data) {
			$(data).each(function(i, n) {
				selObj.options.add(new Option(n.name, n.val));
			});
		},
		error : function(msg) {
			alert("因网络不畅,数据加载未完成,请刷新页面!");
		}
	});
	return selObj;
}
/**
 * 生成单选框
 * @param obj
 * @return
 */
function createRadioElement(obj){
	
	 var spanObj = creElement("span");
	  
	var param = obj["ListItem"];
	if(param!=null){
		var paramArr = param.split(",");
		if(paramArr.length>0){
			for(var i=0; i<paramArr.length; i++){
				var arr = paramArr[i].split("=");
				var lableObj = creElement("lable");
				setAttr(lableObj,"for","param"+obj["Sequence"]);
				lableObj.innerHTML=arr[1];
				spanObj.appendChild(lableObj);
				
				
				var radioObj = creElement("input");
				setAttr(radioObj,"type","radio");
				setAttr(radioObj,"paramType",getParamType(obj));
				setAttr(radioObj,"id","param"+obj["Sequence"]);
				setAttr(radioObj,"name","param"+obj["Sequence"]);
				setAttr(radioObj,"value",arr[0]);
				spanObj.appendChild(radioObj);
					if(i!=0&&(i+1)%3==0){
				var br=creElement("br");
				spanObj.appendChild(br);
				}
				if(obj["DefaultValue"]!=undefined){
					if(arr[0] ==obj["DefaultValue"]){
						$(radioObj).attr("checked","checked");
					}
				}
				
			}
		}
	}
	
	
	return spanObj;
}
/**
 * 生成输入框
 * @param obj
 * @return
 */	
function createInputElement(obj){
    var inputObj = creElement("input");
    inputObj.setAttribute("type","text");
    inputObj.setAttribute("id","param"+obj["Sequence"]);
    if(obj["DefaultValue"]!=undefined){
    	inputObj.value = obj["DefaultValue"];
    }
    
    inputObj.setAttribute("paramRang",checkMinVal(obj["MinValue"])+"-"+checkMaxVal(obj["MaxValue"])); // 参数值范围
    inputObj.setAttribute("paramName",obj["Name"]); // 参数名称
    inputObj.setAttribute("paramType",getParamType(obj)); // 参数类型
    inputObj.setAttribute("isNull",validNull(obj["commandName"])); // 参数值可否为空
   inputObj.setAttribute("paramLength",checkMaxLen(obj["MaxLength"])); // 参数值长度
	return inputObj;
}

function validNull(commandName){
	if(validSpecialCommand(commandName)){
		return "Yes";
	}else{
		return "NO";
	}
}

/**
 * 格式化最小值
 * @param obj
 * @return
 */
function checkMinVal(str){
	if(str!=undefined && IsInteger(str)){
		return  str;
	}else{
		return 0;
	}
}
/**
 * 格式化最大长度
 * @param obj
 * @return
 */
function checkMaxLen(str){
	if(str!=undefined && IsInteger(str)){
		return  str;
	}else{
		return 0;
	}
}
/**
 * 格式化最大值
 * @param obj
 * @return
 */
function checkMaxVal(str){
	if(str!=undefined && IsInteger(str)){
		return  str;
	}else{
		return 1000000;
	}
}

var g_str="STRING";
var g_int="INT";
var g_float="FLOAT";
/**
 * 判断生成指令参数的输入类型
 * @param obj
 * @return
 */
//--0=字符串，1=整数，2=浮点数，3=布尔值，4=参考表（下拉），5=日期时间，6=日期，7=时间 8=单选
function getParamType(obj){
	switch(obj["EditKind"]){
		case 0:	
			return g_str;
		case 1:
			return g_int;
		case 2:
			return g_float;
		case 3:
			return g_int;
		case 4:
			return g_int;
		case 5:
			return g_str;
		case 6:
			return g_str;
		case 7:
			return g_str;
		case 8:
			return g_int;
		default:
			return g_str;
	}
}
/**
 * 生成是/否下拉框
 * @param obj
 * @return
 */
function createSelBooleanElement(obj){
	var selBoolean = creElement("select");
	selBoolean.setAttribute("paramType",getParamType(obj));
	
	    
	var optionObj1 = creElement("option");
	selBoolean.options.add(optionObj1);
	optionObj1.text="是";
	optionObj1.value="1";
	selBoolean.options.add(optionObj1);
	
	var optionObj2 = creElement("option");
	selBoolean.options.add(optionObj2);
	optionObj2.text="否";
	optionObj2.value="0";
	selBoolean.options.add(optionObj2);

	if(obj["DefaultValue"]!=undefined){
		if(obj["DefaultValue"]==0){
			selBoolean.selectedIndex = 1;
		}
	}
	return selBoolean;
}
/**
 * 生成日期输入框
 * @param obj
 * @return
 */
function createInputDateElement(obj){
	 var spanObj = creElement("span");
	
	 var inputObj = creElement("input");
	    inputObj.setAttribute("type","text");
	    inputObj.setAttribute("readonly","readonly");
	    inputObj.setAttribute("id","param"+obj["Sequence"]);
	    
	    inputObj.setAttribute("paramType",getParamType(obj));
	    inputObj.setAttribute("paramName",obj["Name"]); // 参数名称
	    inputObj.setAttribute("isNull","NO"); // 参数值可否为空
	    inputObj.setAttribute("paramLength",obj["MaxLength"]); // 参数值长度
	  
	  spanObj.appendChild(inputObj);
	  spanObj.appendChild(getWdatePicker(obj));
	  
	  if(obj["DefaultValue"]!=undefined){
		  inputObj.defaultValue = obj["DefaultValue"];
		}
	  
	  return spanObj;
}

function getCommandParamError(obj){
	alert("因网络不畅,数据加载未完成,请刷新页面!"+msg);
}
/**
 * 验证发送指令
 * @return
 */
function sendMessage() {
	var message = ""; // 要发送的参数值
	var flag = true; // 验证结果标签
	$("[id^='param']").each(function(idx1) {
		
		var currentValue = $(this).val(); // 当前值
			var paramRang = $(this).attr("paramrang"); // 参数值范围
			var paramName = $(this).attr("paramname"); // 参数名称
			var paramType = $(this).attr("paramtype"); // 参数类型
			var isNull = $(this).attr("isnull"); // 参数值可否为空
		 var paramLength = $(this).attr("paramlength"); // 参数值长度
      var type=$(this).attr("type");
			var tagName = $(this)[0];
      if(type=='radio'){
      	var isChecked=$(this).attr("checked")
      	if(isChecked!='checked'){
      		return true;
      	}
      }
      /*
			if(tagName.tagName=="INPUT"){
				// 参数值不能为空
				if (isNull == 'NO') {
					if (currentValue == '' ) {
						alert(paramName + ",值不能为空!");
						flag = false;
						return false;
					}
	
					if(paramType==g_int){
						if(!IsInteger(currentValue)){
							alert("请输入整数值！");
							flag = false;
							return false;
						}
					}else if(paramType==g_float){
						if(!IsFloat($(this).get(0),"")){
							flag = false;
							return false;
						}
						//IsFloat($(this).get(0),"");
					}
					
					
					// 参数值范围检查
					if (paramType == g_int && paramRang != '') {
						if ((parseInt(currentValue, 10) < parseInt(paramRang.split('-')[0], 10))
								|| (parseInt(currentValue, 10) > parseInt(paramRang.split('-')[1], 10))) {
							alert(paramName + ",值超出规定范围!");
							flag = false;
							return false;
						}
					}
				}else{
					//针对一些删除操作的指令，不用输入所有参数，不做是否输入验证,默认值-999
					if (currentValue == '' ) {
						currentValue = '-9999';
					}
				}
				
				if(paramLength!=0){//有长度限制
					 if(currentValue.length>paramLength){
					 		alert(paramName + ",长度超出规定范围!");
					 		flag = false;
							return false;
					 }
				}
				
			}
			*/
			message+= paramType + "@" + currentValue+"=|=";
		});
	
	if(message.endsWith("=|=")){
		message=message.substring(0, message.length-3);
	}
	if(flag){
		
 sendCommandMessage(message);// 发送 
	}
}

/**
 *  可以不输入
 *  256	设备管理	删除几个特定事件
    267	区域线路	删除圆形区域
	270	区域线路	删除矩形区域
	273	区域线路	删除多边形区域
	276	区域线路	删除路线
 */
function validSpecialCommand(commandName){
	if(commandName.indexOf("删除")>-1){
		return true;
	}
	return false;
}


/**
 * 发送指令
 */
function sendCommandMessage(paramMeassageValue) {
	var commandName = $("#commandName").html();
	var commandId = $("#commandId").val();
	var vehicleId= $.query.get('vehicleId');
	var jsonParams = {
		commandCode : $("#commandCode").val(),
		commandTarget : vehicleId,
		paramMeassage : paramMeassageValue,
		commandKindId : $("#commandKindId").val(),
		commandName : commandName,
		commandId   : commandId,
		datetimes : new Date()
	};
	$.post("command/sendCommandMessage.action", jsonParams, function(data) {
			if (data== 'true') {
				isSend = true;
					$("#result").html('发送成功!');
			} else {
				isSend = false;
				$("#result").html('发送失败!');
			}
		});
	//如果是终端参数设置入库
	if(commandName.indexOf("设置")>-1&&commandName!="设置圆形区域"&&commandName!="设置矩形区域"&&commandName!="设置多边形区域"&&commandName!="设置路线"){
		var paramsNameValue="";
		$("[id^='settingName']").each(function(idx1) {
			
			var paramName = $(this).html(); // 当前值
			paramName=paramName.split("：")[0];
			var seqno=$(this).attr("sequence");
			var paramValue=$("#param"+seqno).val();
			if(paramsNameValue==""){
				paramsNameValue=paramName+":"+paramValue;
			}else{
				paramsNameValue=paramsNameValue+"|"+paramName+":"+paramValue;
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
}

/**
 * 字符串的字节长度
 */
function  getByteLength(str){
	return (str.replace(/[^x00-xFF]/g,'**').length);
}
var testCount=0;
var testUrlStr="";
// 取结果
function getCommandResult() {
	var specialFlag = SpecialHandle();
	var vehicleId= $.query.get('vehicleId');
	var jsonParams = {
		vehicleId : vehicleId,
		datetimes : new Date().getTime()
	};
	if(isSend){
		$.post("command/findCommandResult.action", jsonParams, function(data) {
			if (data != 'false' && data!='') {
			     var resultObj = $("#result");
						if(data.indexOf("8800000501318000")==-1){
							if(specialFlag=="mediaMuilt"){//多媒体检索
								loadMediaMuilt(data);
							}else{
								resultObj.html("回复结果："+data);
							}
							
						}
				
			}
			if(specialFlag=="image"){
				findPictureResult();
			}
			}		
		);
	}
	setTimeout('getCommandResult()', 5000);
}

function loadMediaMuilt(data){
	    var index=data.indexOf("类型");
	   if(index>-1){
	    var newData=data.substring(index,data.length);
	    var table='<table id="eventList"  class="form"><thead><tr><th>类型</th><th>通道ID</th><th>事件</th><th>定位时间</th><th>经度</th><th>纬度</th></tr></thead>';
	    newData=newData.replace(/\n/g, "#");
	    var dataArray=newData.split("#");
		  for(var i=0;i<dataArray.length-1;i++){
			  var listString=dataArray[i];
			  var resultArray=listString.split("，");
			  var dateTime=resultArray[3].split(":");
			  var dateTimeString=dateTime[1]+":"+dateTime[2]+":"+dateTime[3];
			  table+='<tr>'
				    +'<td align="left">'+resultArray[0].split(":")[1]+'</td>'
				    +'<td align="left">'+resultArray[1].split(":")[1]+'</td>'
				    +'<td align="left">'+resultArray[2].split(":")[1]+'</td>'
				    +'<td align="left">'+dateTimeString+'</td>'
				    +'<td align="left">'+resultArray[4].split(":")[1]+'</td>'
				    +'<td align="left">'+resultArray[5].split(":")[1]+'</td>'
				   +'</tr>';
		  } 
		 
		 table+="</table>";
		 var resultObj = $("#result");
		 resultObj.html("回复结果："+table);
	   }else{
		   var resultObj = $("#result");
		   resultObj.html("回复结果：没有多媒体数据");
	   }
	
}

//取图片结果
function findPictureResult() {
	var vehicleId= $.query.get('vehicleId');
	var jsonParams = {
		vehicleId : vehicleId,
		datetimes : new Date()
	};
	$("#media").hide();
	$("#loadwait").html('<img src="imgs/load.gif" />请耐心等待,正在努力拍照中......');
	$.post("command/findPictureResult.action", jsonParams, function(data) {
		if (data != 'false' && data!='') {	
			isSend = false;
			$("#loadwait").remove();
			loadPhoto(data,vehicleId,jsonParams);
		}
	});
}

/**
 * 载入初始化
 */
function loadInit(){
	var sWidth = $("#image").width(); //获取焦点图的宽度（显示面积）
	var len = $("#image ul li").length; //获取焦点图个数
	var index = 0;
	var picTimer;
	
	//以下代码添加数字按钮和按钮后的半透明条，还有上一页、下一页两个按钮
	var btn = "<div class='btnBg'></div><div class='btn'>";
	for(var i=0; i < len; i++) {
		btn += "<span></span>";
	}
	btn += "</div><div class='preNext pre'></div><div class='preNext next'></div>";
	$("#image").append(btn);
	$("#image .btnBg").css("opacity",0.5);

	//为小按钮添加鼠标滑入事件，以显示相应的内容
	$("#image .btn span").css("opacity",0.4).mouseover(function() {
		index = $("#image .btn span").index(this);
		showPics(index);
	}).eq(0).trigger("mouseover");

	//上一页、下一页按钮透明度处理
	$("#image .preNext").css("opacity",0.2).hover(function() {
		$(this).stop(true,false).animate({"opacity":"0.5"},300);
	},function() {
		$(this).stop(true,false).animate({"opacity":"0.2"},300);
	});

	//上一页按钮
	$("#image .pre").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});

	//下一页按钮
	$("#image .next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});

	//本例为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
	$("#image ul").css("width",sWidth * (len));
	
	//显示图片函数，根据接收的index值显示相应的内容
	function showPics(index) { //普通切换
		var nowLeft = -index*sWidth; //根据index值计算ul元素的left值
		$("#image ul").stop(true,false).animate({"left":nowLeft},300); //通过animate()调整ul元素滚动到计算出的position
		//$("#focus .btn span").removeClass("on").eq(index).addClass("on"); //为当前的按钮切换到选中的效果
		$("#image .btn span").stop(true,false).animate({"opacity":"0.4"},300).eq(index).stop(true,false).animate({"opacity":"1"},300); //为当前的按钮切换到选中的效果
	}
}
//指令返回结果的特殊处理
function SpecialHandle(){
	var commandName = $("#commandName").html();
	
	if(commandName.indexOf("摄像头立即拍摄命令")>-1||commandName.indexOf("存储多媒体数据上传命令")>-1||commandName.indexOf("录音开始命令")>-1){
		//摄像头立即拍摄命令
		return "image";
	}else if(commandName.indexOf("存储多媒体数据检索")>-1){
		return "mediaMuilt"
	}
	else{//不用做特殊处理
		return "-1";
	}
}

/**
 * 保存图片
 * 
 * @param vehicleId
 * @param imageName
 */
function savePhoto(){
	 $.ajax( {
			type:"POST",
			url : "sys/photo/downPhoto.action",
			data:{"vehicleId":'123',"imageName":'test'}
		});
}

/**
 * 
 * @param fileName
 * @param vehicleId
 * @param jsonParams
 */
function loadPhoto(fileName,vehicleId,jsonParams){
	if(fileName!=null && fileName.length>0){
	   if(fileName.indexOf(".jpg")>-1){//图像
		   var imageDiv = $("#image");
		   if(imageDiv!=null && imageDiv!=undefined){
				 $("#media").hide();
				 var imgUls=null;
				 $.post("sys/findHistoryPictureTop9.action", jsonParams, function(data) {
					if (data != 'false' && data!='') {
						imgUls = data.split(",");
						var imgUl = $("#imageUl");
						var ulImage="";
						imgUl.html("");
						ulImage+="<li><a href='sys/photo/downPhoto.action?path=0&vehicleId="+vehicleId+"&imageName="+fileName+"'><img  title='单击保存图片' src='command/upload/"+fileName+"'/></a></li>";
						for(var i = 0;i<imgUls.length;i++){
							ulImage += "<li><a href='sys/photo/downPhoto.action?path=1&vehicleId="+vehicleId+"&imageName="+imgUls[i]+"'><img title='单击保存图片' src='command/upload/history/"+vehicleId+"/"+imgUls[i]+"'/></a></li>";
						}
						imgUl.html(ulImage);
						imgUl.show();
						loadInit();
						imageDiv.show();
					}
				});
			}
	   }else{//音频或者视频
		   var imageDiv = $("#image");
		   imageDiv.hide();
		   var url="command/upload/"+fileName;
		   player.URL=url;
		   var mediaDiv =$("#media");
		   mediaDiv.show();
	   }
		
	}
	
}

//function showImage(path) {//onclick='showImage(this)' 
//	var url = "monitorCenter/showImageDialog.jsp?path=" + $(path).attr("src");
//	parent.parent.parent.parent.openDialog(url, 600, 400,"大图");
//}


//校验是否整数
function IsInteger(snum){
	var slen;
	slen=snum.length;
	for (i=0; i<slen; i++){
		cc = snum.charAt(i);
		if (cc <"0" || cc >"9")
		{
			return false;
		}
	}
	return true;
}

//校验当前域值是否float
function IsFloat(snum,desc){			//带两位小数的数字
    if  (snum.value == ""){
    	alert("请输入"+desc);
		snum.focus();
        return false;
    }
    else{
        s1=/[^0-9.]+/;
        if  (snum.value.length == 1){
            s2=/[0-9]+/;
        }            
        else{
            s2=/[0-9]+[.]?[0-9]+/;
        }
        s3=/[.]+\w*[.]+/;
        ifpoint1=snum.value.substring(snum.value.length-1,snum.value.length);
        ifpoint2=snum.value.substring(0,1);
        if  (ifpoint1=="."||ifpoint2=="."){
     	    window.alert(desc+"错误：数字头尾不能是'.'");
			snum.focus();
	        return false;
        }
        ifpoint3=snum.value.substring(snum.value.length-3,snum.value.length-2);
		
        if  (ifpoint3!='.'){
     	    window.alert(desc+"请保留两位小数");
			snum.focus();
	        return false;
        }		
        ok1=s1.exec(snum.value);
        ok2=s2.exec(snum.value);
        ok3=s3.exec(snum.value);
        if  ((ok1==null)&&(ok2!=null)&&(ok3==null)){
            var tempnum = parseFloat(snum.value);
            if  (tempnum > 0)
	            return true;
	        else{
	            alert(desc+"应大于0");
				snum.focus();
	            return false;
	        }
	    }
        else{
	        alert(desc+"非法数字");
			snum.focus();
	        return false;
	    }
    }
}
