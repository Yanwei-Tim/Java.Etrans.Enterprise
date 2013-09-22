//地图自定义类型
function initCustomType(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("请选择", "-1"));
		unit.options.add(new Option("矩形", "5"));
		unit.options.add(new Option("圆形", "2"));
		unit.options.add(new Option("多边形", "4"));
		unit.options.add(new Option("兴趣点", "1"));
		//unit.options.add(new Option("线路", "3"));
	}
}


/**
 * 初始化选择框
 * @param elementId 页面select元素ID
 * @param url 例"sys/initGroups.action"
 * @param flag 默认选择项 0-没有默认项,1-"请选择"，2-"全部"
 */
function initAjaxSelect(elementId,url,flag) {
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		
		if(flag && flag == 1)
			unit.options.add(new Option("请选择", -1));
		if(flag && flag == 2)
			unit.options.add(new Option("全部", -1));
		
		$.ajax({
			type : "POST",
			dataType : "json",
			url : url,
			success : function(data) {
				$(data).each(function(i, n) {
					unit.options.add(new Option(n.name, n.id));
				});
			},
			error : function(msg) {
				alert("因网络不畅,数据加载未完成,请刷新页面!");
			}
		});
	}
}

/**
 * 初始化选择框
 * @param elementId 页面select元素ID
 * @param url 例"sys/initGroups.action"
 * @param flag 默认选择项 0-没有默认项,1-"请选择"，2-"全部"
 */
function initAjaxSelect_Ansynce(elementId,url,flag,isAnsynce) {
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		
		if(flag && flag == 1)
			unit.options.add(new Option("请选择", -1));
		if(flag && flag == 2)
			unit.options.add(new Option("全部", -1));
		
		$.ajax({
			type : "POST",
			dataType : "json",
			url : url,
			async:isAnsynce,
			success : function(data) {
				$(data).each(function(i, n) {
					unit.options.add(new Option(n.name, n.id));
				});
			},
			error : function(msg) {
				alert("因网络不畅,数据加载未完成,请刷新页面!");
			}
		});
	}
}

/**
 * 初始化车辆使用状态下拉框
 */
function initWorkStatus(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("使用","0"));
		unit.options.add(new Option("停止使用","1"));
	}
}

/**
 * 初始化车辆使用状态下拉框
 */
function initIsDummy(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("是","1"));
		unit.options.add(new Option("否","0"));
	}
}

/**
 * 初始化车辆定位速度下拉框
 */
function initIsSensor(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("GPS速度","1"));
		unit.options.add(new Option("传感器速度","0"));
	}
}

/**
 * 初始化车辆盲区处理下拉框
 */
function initIsBlind(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("是","1"));
		unit.options.add(new Option("否","0"));
	}
}
/**
 * 初始化SIM卡是否使用下拉框
 */
function initIsInUse(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("是", "1"));
		unit.options.add(new Option("否", "0"));
	}
}

/**
 * 初始化维护车队使用下拉框
 */
function initVehicleTeam(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("请选择", -1));
	}
}

/**
 * 初始化SIM卡是否开通短信下拉框
 */

function initIsNote(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("是", "1"));
		unit.options.add(new Option("否", "0"));
	}
}

/**
 * 初始化SIM卡开通语音类别下拉框
 */

function initSoundKind(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("呼出", "1"));
		unit.options.add(new Option("呼入", "0"));
	}
}

/**
 * 初始化SIM卡是否粤港两地卡下拉框
 */
function initIsTwoCities(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("是", "1"));
		unit.options.add(new Option("否", "0"));
	}
}

/**
 * 初始化终端使用状态下拉框的值 
 */
function initTerminalUseFlag(elementId){
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("停用", "0"));
	unit.options.add(new Option("开户", "1"));
	
}
/**
 * 初始化历史查岗记录标志下拉框
 */
function initIsResult(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("请选择", "-1"));
		unit.options.add(new Option("回复", "1"));
		unit.options.add(new Option("未回复", "0"));
	}
}
/**
 * 初始化历史报警督办下拉框
 */
function initOverSeeingType(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("请选择", "-1"));
		unit.options.add(new Option("自动", "1"));
		unit.options.add(new Option("手动", "0"));
	}
}

/**
 * 选择企业查出对应的车队信息下拉框
 */
function checkVehicleTeam(elementId){
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		unit.options.add(new Option("请选择", "-1"));
	}
}

/**
 * 初始化报警类型选择框
 * @param elementId 页面select元素ID
 */
function initAlarmType(elementId) {
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("所有", "-1"));
	unit.options.add(new Option("超速报警", "2"));
	unit.options.add(new Option("疲劳驾驶报警", "3"));
	unit.options.add(new Option("紧急报警", "1"));
	unit.options.add(new Option("预警", "4"));
	unit.options.add(new Option("GNSS模块发生故障", "5"));
	unit.options.add(new Option("GNSS天线未接或被剪断", "6"));
	unit.options.add(new Option("GNSS天线短路", "7"));
	unit.options.add(new Option("终端主电源欠压", "8"));
	unit.options.add(new Option("终端主电源掉电", "9"));
	unit.options.add(new Option("终端LCD或显示器故障", "10"));
	unit.options.add(new Option("TTS模块故障", "11"));
	unit.options.add(new Option("摄像头故障", "12"));
	unit.options.add(new Option("当天累计驾驶超时", "13"));
	unit.options.add(new Option("超时停车", "14"));
	//unit.options.add(new Option("进出区域", "15"));
	unit.options.add(new Option("进出路线", "16"));
	unit.options.add(new Option("路段行驶时间不足/过长", "17"));
	unit.options.add(new Option("路线偏离报警", "18"));
	unit.options.add(new Option("车辆VSS故障", "19"));
	unit.options.add(new Option("车辆油量异常", "20"));
	unit.options.add(new Option("车辆被盗", "21"));
	unit.options.add(new Option("车辆非法点火", "22"));
	unit.options.add(new Option("车辆非法位移", "23"));
	unit.options.add(new Option("碰撞侧翻报警", "24"));
	
	unit.options.add(new Option("进入区域", "26"));
	unit.options.add(new Option("离开区域", "27"));
	
	//平台报警
	unit.options.add(new Option("超速报警(平台)", "315"));
	unit.options.add(new Option("疲劳驾驶报警(平台)", "316"));
	unit.options.add(new Option("进出地点报警(平台)", "318"));
	unit.options.add(new Option("进出区域报警(平台)", "319"));
	unit.options.add(new Option("夜间行车报警(平台)", "321"));
	unit.options.add(new Option("地点超时停车报警(平台)", "317"));
	
	//过检指定六种报警平台报警
	unit.options.add(new Option("路段偏离报警(平台)", "320"));
	unit.options.add(new Option("分路段超速报警(平台)", "322"));
	unit.options.add(new Option("进入指定区域报警(平台)", "323"));
	unit.options.add(new Option("离开指定区域报警(平台)", "324"));
	unit.options.add(new Option("规定时间未到达指定地点报警(平台)", "325"));
	unit.options.add(new Option("规定时间未离开指定地点报警(平台)", "326"));
	


	
	
}

/**
 * 初始化809报警类型选择框
 * @param elementId 页面select元素ID
 */
function init809AlarmType(elementId) {
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("所有", "-1"));
	unit.options.add(new Option("超速报警", "1"));
	unit.options.add(new Option("疲劳驾驶报警", "2"));
	unit.options.add(new Option("紧急报警", "3"));
	unit.options.add(new Option("进入指定区域报警", "4"));
	unit.options.add(new Option("离开指定区域报警", "5"));
	unit.options.add(new Option("路段堵塞报警", "6"));
	unit.options.add(new Option("危险路段报警", "7"));
	unit.options.add(new Option("越界报警", "8"));
	unit.options.add(new Option("盗警", "9"));
	unit.options.add(new Option("劫警", "10"));
	unit.options.add(new Option("偏离路线报警", "11"));
	unit.options.add(new Option("车辆移动报警", "12"));
	unit.options.add(new Option("超时驾驶报警", "13"));
	unit.options.add(new Option("其他报警", "14"));
}



/**
 * 初始化选择框
 * @param elementId 页面select元素ID
 * @param url 例"sys/initGroups.action"
 * where 查询条件
 */
function initAjaxSelect_ByWhere(elementId,url,sqlwhere) {
	var params = null;
	//查询条件
	if(null!=sqlwhere&&sqlwhere!=''){
		params =  {
			"sqlWhere" : sqlwhere
		}
		//alert(sqlwhere);
	}
	var unit = $("#" + elementId).get(0);
	if(unit.options.length == 0){
		$.ajax({
			type : "POST",
			dataType : "json",
			data:params,
			url : url,
			success : function(data) {
				$(data).each(function(i, n) {
					unit.options.add(new Option(n.name, n.id));
				});
			},
			error : function(msg) {
				alert("因网络不畅,数据加载未完成,请刷新页面!");
			}
		});
	}
}




/////////////////////作用于报警设置模块begin////////////////////////////////
//全局变量【用作PA库的报警设置】
var name1=1;
var name2=2;
var name3=3;

//这个可以设置日期范围
//<input type="text" class="Wdate" id="d412" onfocus="WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'2008-03-08 11:30:00',maxDate:'2008-03-10 20:59:30'})" value="2008-03-09 11:00:00"/>

/**
 * 修改时间图片点击事件
 * @param selBegin 开始时间图片id
 * @param selEnd 结束时间图片id
 * @param typ 修改类型类型1,2（1表示修改为时分秒选项，2表示年月日选项）
 * @param begin_time 开始时间文字描述div层id
 * @param end_time	 结束时间文字描述div层id
 * @return
 */
function upClick(selBegin,selEnd,typ,begin_time,end_time){
	//$("#beginDate_go").attr('onClick', '').unbind('onClick').click(wdatePicker_beginGo_hh_mm_ss); 
	//$("#endDate_go").attr('onClick', '').unbind('onClick').click(wdatePicker_endGo_hh_mm_ss);
	/**先解除点击事件**/
	$("#"+selBegin).attr('onClick', '').unbind('click');
	$("#"+selEnd).attr('onClick', '').unbind('click');
	
	/**重新添加点击事件**/
	//设置日期选项为时分秒
	if(typ==1){
		$("#"+begin_time).html("检测开始时间：");
		$("#"+end_time).html("检测结束时间：");
		//设置默认时间
		initTime_Value("beginDate","00:00:00","endDate","23:59:59");
		$("#"+selBegin).bind("click",wdatePicker_beginGo_hh_mm_ss);
		$("#"+selEnd).bind("click",wdatePicker_endGo_hh_mm_ss);
	}
	//设置日期选项为年月日
	else if(typ==2){
		$("#"+begin_time).html("检测开始日期：");
		$("#"+end_time).html("检测结束日期：");
		//设置默认时间
		initTime_Value("beginDate","1990-01-01","endDate","2029-12-31");
		$("#"+selBegin).bind("click",wdatePicker_beginGo_yyyy_MM_dd);
		$("#"+selEnd).bind("click",wdatePicker_endGo_yyyy_MM_dd);
	}
}





/**
 * 日期类型下拉框值改变时调用
 * @param dateTypeIDSel  当前调用此方法的下拉框id
 * @param selBegin	开始时间图片id
 * @param selEnd	结束时间图片id
 * @param workingDays 检测日期下拉框id
 * @param begin_time 开始时间文字描述div层id
 * @param end_time	结束时间文字描述div层id
 * @return
 */
function dateTypeIDSelOnchange(dateTypeIDSel,selBegin,selEnd,workingDays,begin_time,end_time){
		//获得下拉框选中的值
		//var workingDaysvalue = $("#"+dateTypeIDSel+" option:selected").text();
		var workingDaysvalue = $("#"+dateTypeIDSel).val();
		/**每天*/
		if(workingDaysvalue==name1){
			//设置检测日期下拉框不可用
			$('#'+workingDays).attr("disabled","disabled");
			//清空检测日期下拉
			removerSel(workingDays);
			//设置日期选项为时分秒
			upClick(selBegin,selEnd,1,begin_time,end_time);
		}
		/**日期范围*/
		else if(workingDaysvalue==name2){
			//设置检测日期下拉框不可用
			$('#'+workingDays).attr("disabled","disabled");
			//清空检测日期下拉
			removerSel(workingDays);
			//设置日期选项为年月日
			upClick(selBegin,selEnd,2,begin_time,end_time);
		}
		/**工作日*/
		else if(workingDaysvalue==name3){
			//设置检测日期下拉框可用
			$('#'+workingDays).removeAttr("disabled");
			//初始化检测日期下拉框
			initTimeSel(workingDays);
			//设置日期选项为时分秒
			upClick(selBegin,selEnd,1,begin_time,end_time);
		}
}


/**
 * 清空下拉框
 * @param elementId
 * @return
 */
function removerSel(elementId){
	var time_sel = $("#" + elementId).get(0);
	time_sel.options.length = 0;
	return time_sel;
}

/**
 * 设置默认时间
 * @param beginDateID 层1id
 * @param beginDateValue 默认值字符串
 * @param endDateID 层2id
 * @param endDateValue 默认值字符串
 * @return
 */
function initTime_Value(beginDateID,beginDateValue,endDateID,endDateValue){
	$('#'+beginDateID).val(beginDateValue);
	$('#'+endDateID).val(endDateValue);
}

/**
 * 初始化检查日期列表
 * @param elementId 下拉框id
 * @return
 */
function initTimeSel(elementId){
	var time_sel=removerSel(elementId);
	time_sel.options.add(new Option("1-5", "1,2,3,4,5"));
	time_sel.options.add(new Option("1-6", "1,2,3,4,5,6"));
		
}


/**
 * 修改开始时间选项为时分秒（默认是年月日时分秒时）
 * @param id
 * @return
 */
function wdatePicker_beginGo_hh_mm_ss(){
	var beginDate = document.getElementById("beginDate");
//	var beginDate = $("#beginDate");
	WdatePicker({isShowClear:false,firstDayOfWeek:1,isShowWeek:true,el:beginDate,dateFmt:'HH:mm:ss'});
}

/**
 * 修改结束时间选项为时分秒（原来是时分秒时）
 * @param id
 * @return
 */
function wdatePicker_endGo_hh_mm_ss(){
	var beginDate = document.getElementById("endDate");
//	var beginDate = $("#endDate");
	WdatePicker({isShowClear:false,firstDayOfWeek:1,isShowWeek:true,el:beginDate,dateFmt:'HH:mm:ss'});
}

/**
 * 修改开始时间选项为年月日（原来是时分秒时）
 * @param id
 * @return yyyy-MM-dd
 */
function wdatePicker_beginGo_yyyy_MM_dd(){
	var beginDate = document.getElementById("beginDate");
	WdatePicker({isShowClear:false,firstDayOfWeek:1,isShowWeek:true,el:beginDate,dateFmt:'yyyy-MM-dd'});
}

/**
 * 修改结束时间选项为年月日（原来是时分秒时）
 * @param id
 * @return
 */
function wdatePicker_endGo_yyyy_MM_dd(){
	var beginDate = document.getElementById("endDate");
	WdatePicker({isShowClear:false,firstDayOfWeek:1,isShowWeek:true,el:beginDate,dateFmt:'yyyy-MM-dd'});
}


/**
 * 初始化是否报警下拉
 * @param selId
 * @return
 */
function initYersOrNo(selId){
	var time_sel=removerSel(selId);
	time_sel.options.add(new Option("只记录",0));
	time_sel.options.add(new Option("报警",1));
	
}




//车辆搜索
function findVehicleList() {
	//车牌号码
	var queryValue = $("#searchValue").val();
	$("#vehicle").html("<img src='imgs/load.gif'>正在查询车辆.......");
	$.post("sys/getVehilceListByWorkUnitID.action", {
		registrationNO : queryValue
	}, function(data) {
		if (data == "") {
			$("#vehicle").html("未找到符合条件的车辆!");
		} else {
			var vehicleList = data.split(",");
			var vehicleListStr = "";
			vehicleListStr += "<ul>";

			for ( var f = 0; f < (vehicleList.length - 1); f++) {
				vehicleListStr += "<li><input type='checkbox' name='vehicles' id='vehicles' onClick='checkboxMessage()' value='" + vehicleList[f].split("=")[0] + "'/>" + vehicleList[f].split("=")[1] + "</a></li>";
			}
			vehicleListStr += "</ul>";

			$("#vehicle").html(vehicleListStr);
		}
	});
	
	// 全选
	$("#CheckAll").bind().click(function() {
		var flag = $("#CheckAll").attr("checked");
		if(flag){
			$("[name=vehicles]:checkbox").each(function() {
				$(this).attr("checked", true);
			});
		}else{
			$("[name=vehicles]:checkbox").each(function() {
				$(this).attr("checked",false);
			});
		}
		checkboxMessage();
	});
		
}

/**
 * 复选框验证
 */
function checkboxMessage(){
	if($("input[name='vehicles']:checked").size() == 0) {
		$("#vehiclesspan").showMessage({
			type : "error",
			closeable : false, 
			text : "请至少选择一个车辆！"});
	}else{
		$("#vehiclesspan").closeMessage();
	}
	
}

/**
 * 初始化报警来源选择框
 * @param elementId 页面select元素ID
 */
function initAlarmSource(elementId) {
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("全部", "-1"));
	unit.options.add(new Option("车载终端", "1"));
	/*
	unit.options.add(new Option("企业监控平台", "2"));
	unit.options.add(new Option("政府监管平台", "3"));
	unit.options.add(new Option("其它", "9"));
	*/
	unit.options.add(new Option("平台", "10"));
}

/////////////////【用作TA】begin////////////////////////////

/**
 * 日期类型下拉框值改变时调用【TA】
 * @param dateTypeIDSel 当前调用此方法的下拉框id
 * @param checkTimeValue 检测日期控件id
 * @param checkTimeBegin 检测开始时间控件id
 * @param checkTimeBegin_go 检测开始时间控件后面的图片id
 * @param checkTimeEnd 检测结束时间控件id
 * @param checkTimeEnd_go 检测结束时间控件后面的图片id
 */
function dateTypeIDSelOnchange_TA(dateTypeIDSel,checkTimeValue,checkTimeBegin,checkTimeBegin_go,checkTimeEnd,checkTimeEnd_go){
	//获得下拉框选中的值
	var dateTypeIDSelValue = $("#"+dateTypeIDSel).val();
	
	/**随时检测**/
	if(dateTypeIDSelValue==4){
		//设置三个控件同时不可用
		jspControlYesOrNo(checkTimeValue,checkTimeBegin,checkTimeBegin_go,checkTimeEnd,checkTimeEnd_go,"no");
		/**还原初始设置**/
		initControlSetup(checkTimeValue,checkTimeBegin,checkTimeEnd);
	}
	/**按日期**/
	else if(dateTypeIDSelValue==3){
		//设置三个控件同时可用
		jspControlYesOrNo(checkTimeValue,checkTimeBegin,checkTimeBegin_go,checkTimeEnd,checkTimeEnd_go,"yes");
		/**给检测日期下拉框赋值1-31号**/
		//清空检测日期下拉
		removerSel(checkTimeValue);
		var unit = $("#" + checkTimeValue).get(0);
		for(var i =1; i<32; i++){
			unit.options.add(new Option(i,i));
		}
	}
	/**按星期**/
	else if(dateTypeIDSelValue==2){
		//设置三个控件同时可用
		jspControlYesOrNo(checkTimeValue,checkTimeBegin,checkTimeBegin_go,checkTimeEnd,checkTimeEnd_go,"yes");
		/**给检测日期下拉框赋值1-7日**/
		//清空检测日期下拉
		removerSel(checkTimeValue);
		var unit = $("#" + checkTimeValue).get(0);
		for(var i =1; i<8; i++){
			unit.options.add(new Option(i,i));
		}
	}
	/**每天**/
	else if(dateTypeIDSelValue==1){
		//设置三个控件同时可用
		jspControlYesOrNo(checkTimeValue,checkTimeBegin,checkTimeBegin_go,checkTimeEnd,checkTimeEnd_go,"yes");
		//设置单个控件不可用
		controlYesOrNo(checkTimeValue,"no");
		/**给检测日期下拉框赋值默认值**/
		initControlSetup(checkTimeValue,checkTimeBegin,checkTimeEnd);
	}
	
	
	//每天和随时检测不需要设置默认时间【因为在他们的if里面已经设置了】
	if(dateTypeIDSelValue!=1||dateTypeIDSelValue!=4){
		//设置默认时间
		initTime_Value(checkTimeBegin,"00:00:00",checkTimeEnd,"23:59:59");
	}

	
}



var xs=0; //目前显示多少条数据
//Math是javascript的一个内部对象，该对象的方法主要是一些数学计算方法
//floor：下退 Math.floor(12.9999) = 12
//ceil：上进 Math.ceil(12.1) = 13;
//round: 四舍五入 Math.round(12.5) = 13  Math.round(12.4) = 12 
/**
 * 车辆搜索【用作TA】
 * op 【1表示是查询，2表示是更多】
 * pageNo 当前页
 */
function findVehicleListTA(op,pageNo){
	//车牌号码
	var queryValue = $("#searchValue").val();
	
	if(op=='1'){
		$("#vehicle").html("<img src='imgs/load.gif'>正在查询车辆.......");
	}
	
	$.post("analyse/findVehilceListByUserType.action", {
		registrationNO : queryValue,
		pageNo:pageNo
	}, function(data) {
		if (data == "") {
			$("#vehicle").html("未找到符合条件的车辆!");
		} else {
			var vehicleList = data.split(",");
//			var str="633=ljy1,634=ljy2,635=ljy3,636=ljy4,637=ljy5,638=ljy6,639=ljy7,640=ljy8,641=ljy9,642=ljy10,642=ljy11,";
//			var str="633=ljy1,634=ljy2,635=ljy2,636=ljy4,637=ljy5,638=ljy6,639=ljy7,640=ljy8,641=ljy9,642=ljy10,643=粤A65194,644=粤AR6510,645=粤AQ9845,646=粤A66449,647=粤AG339Z,648=粤AQ9481,649=粤AR5088,650=粤AQ9159,651=粤AQ8473,652=粤A64883,653=粤AQ7978,654=粤A63460,655=粤AWW093,656=粤ADK955,657=粤A91478,658=粤A233GJ,659=粤AC5639,660=粤AC7756,661=粤AC5601,662=粤AC5780,663=粤A0915C,664=粤A0939C,665=粤A3390T,666=粤A66023,667=粤A66500,668=粤AQ9612,669=粤AQ9257,670=粤AQ9296,671=粤AQ7760,672=粤AQ9617,673=粤AQ9009,674=粤AQ8835,675=粤AQ9739,676=粤AQ9066,677=粤AQ9039,678=粤A65359,679=粤A135BC,680=粤AC6030,681=粤A9742D,682=粤AC6253,683=粤AC5949,684=粤AC6229,685=粤AC6150,686=粤AC6200,687=粤AC6212,688=粤AC6209,689=粤X13875,690=粤X13757,691=粤A64646,692=粤AE4639,693=粤AC6470,694=粤AC6240,695=粤AF0210,696=粤AF0212,697=粤AC6940,698=粤AF0396,699=粤AF0410,700=粤A724HY,701=粤A806HY,702=粤A764JR,703=粤A746JV,704=粤AF0562,705=粤AF0552,706=粤AF0499,707=粤AF0536,708=粤AF7W22,709=粤E07557,710=粤E09834,711=粤E09788,712=粤E09989,713=粤E09534,714=粤E08828,715=粤E07548,716=粤E07534,717=粤E07555,718=粤E08692,719=粤E08680,720=粤E08757,721=粤E07551,722=粤E08699,723=粤E09852,724=粤E08833,725=粤E08634,726=粤E07558,727=粤E07573,728=粤E06973,729=粤E06872,730=粤E06980,731=粤E06969,732=粤E06910,733=粤E07553,734=粤E06882,735=粤E06929,736=粤E06965,737=粤E07550,738=粤E06933,739=粤E09505,740=粤E07510,741=粤E07516,742=粤E07405,743=粤E07566,744=粤E07576,745=粤E08669,746=粤E08772,747=粤E07567,748=粤E07569,749=粤E08593,750=粤E07565,751=粤E08791,752=粤E08693,753=粤E08826,754=粤E08494,755=粤E08753,756=粤E06988,757=粤E06994,758=粤E06928,759=粤E06993,760=粤E06861,761=粤E06959,762=粤E06900,763=粤E06957,764=粤E09894,765=粤E06968,766=粤E09794,767=粤E09884,768=粤E09875,769=粤E09705,770=粤E09992,771=粤E09793,772=粤E4Q340,773=粤E2Q497,774=粤E97035,775=粤E4Q757,776=粤EF3359,777=粤E11621,778=粤E11623,779=粤E11618,780=粤E11620,781=粤E11629,782=粤E11619,783=粤E11625,784=粤E11622,785=粤E11585,786=粤E11617,787=粤E11612,788=粤E11615,789=粤E6D543,790=粤E6G442,791=粤E4L907,792=粤E07509,793=粤ANT935,794=粤A62M82,795=粤A6370B,796=粤AMG335,797=粤A555FL,798=粤A6350B,799=粤A6499C,800=粤AJN236,801=粤A797CZ,802=粤A438H6,803=粤AEZ705,804=粤A415Q0,805=粤A473Q5,806=粤A55Q95,807=粤A436Q8,808=粤A985FX,809=粤A172BJ,810=粤A438Q3,811=粤A490Q1,812=粤AFY727,813=粤A80552,820=湘KY6676,821=湘KY6670,822=湘KY6671,828=湘KY3626,829=湘KY3618,830=湘KY3613,831=湘KY3616,832=湘KY3595,833=湘KY3580,834=湘KY3625,835=湘KY3628,836=湘KY3619,837=湘KY3587,838=湘KY3601,839=湘KY3602,840=湘KY6626,841=湘KY6618,846=湘KY6376,847=湘KY6597,848=湘KY6632,850=湘KY6621,851=湘KY6633,852=湘KY6619,853=湘KY6629,856=湘KY6451,857=湘KY6600,859=湘KY6635,860=湘KY6628,861=湘KY3267,862=湘KY3188,863=湘KY3110,864=湘KY3078,865=湘KY3327,866=湘KY3182,867=湘KY3329,868=湘KY3097,869=湘KY3077,870=湘KY3089,871=湘KY3108,872=湘KY3062,873=湘KY3156,874=湘KY3498,875=湘KY3070,876=湘KY3166,877=湘KY3053,878=湘KY3332,879=湘KY3452,880=湘KY3057,881=湘KY3157,882=湘KY3065,883=湘KY3180,884=湘KY3069,885=湘KY3503,886=湘KY3120,887=湘KY3060,888=湘KY3315,889=湘KY3506,890=湘KY3423,891=湘KY3500,892=湘KY3608,893=湘KY3142,894=湘KY3381,895=湘KY3488,896=湘KY3088,897=湘KY3265,898=湘KY3496,899=湘KY3056,900=湘KY3505,901=湘KY3501,902=湘KY3499,903=湘KY3085,904=湘KY3067,905=湘KY3318,906=湘KY3307,907=湘KY3330,908=湘KY3325,909=湘KY3137,910=湘KY3510,911=湘KY3561,912=湘KY3328,913=湘KY3233,914=湘KY3230,915=湘KY3479,916=湘KY3450,917=湘KY3348,918=湘KY3481,919=湘KY3507,920=湘KY3508,921=湘KY3402,922=湘KY3128,923=湘KY3127,924=湘KY3199,925=湘KY3080,926=湘KY3168,931=湘KY6615,932=湘KY3518,933=湘KY3061,934=湘KY3509,935=湘KY3453,936=湘KY3090,937=湘KY3071,938=湘KY3083,939=湘KY6680,940=湘KY3629,947=湘KY6639,976=湘KC2035,977=湘KY6698,978=湘KY6683,979=粤B12345,981=义A00001,1014=01,1424=001,1425=002,";
//			var vehicleList = str.split(",");
			var vehicleListStr = "";
			vehicleListStr += "<ul>";

			//原始代码
//			for ( var f = 0; f < (vehicleList.length - 1); f++) {
////				vehicleListStr += "<li><input type='checkbox' name='vehicles' id='vehicles' onClick='checkboxMessage()' value='" + vehicleList[f].split("=")[0] + "'/>" + vehicleList[f].split("=")[1] + "</a></li>";
//				vehicleListStr += "<li><input type='checkbox' name='vehicles' id='vehicles' onClick='checkboxMessage()' value='" + vehicleList[f].split("=")[0] + "'/>" + vehicleList[f].split("=")[1] + "</a>";
//				if(f==5){
//					vehicleListStr+="</li>";
//				}
//			}
			
			/**根据总数据条数计算需要显示多少行**/
			var vehicleListLength=vehicleList.length-1; //结果长度【数据总长度】
			var rowlength=6;//每行多少条数据
			var rowq=0;//每次取倒是条数据
			var row;//分多少行显示
			var type=0;//类型【有没有小数点，如果有就减去一行】
			
			if(vehicleListLength%rowlength>0){
				row=(vehicleListLength/rowlength)+1
				type=1;
			}else{
				row = vehicleListLength/rowlength
			}
			//有小数下退
			if(type==1){
				row=Math.floor(row);
			}
			/**控制行**/
			for(var i = 0 ; i<row; i++){
				vehicleListStr+="<li>";
				//循环到最后一行需要判断是否取每行显示的条数
				if(i==(row-1)){
					//余数
					var hs=vehicleListLength%rowlength;
					if(hs>0){
						//取多余的条数【比如11行数据每行显示2两天，那最后一行只去一条数据】
						rowq=hs;
					}else{
						rowq=rowlength;
					}
				}else{
					rowq=rowlength;
				}
				/**取数据**/
				for(var o=0; o<rowq;o++){
					var iGo = 0;//
					o==0?Go=i*rowlength:Go=i*rowlength+o;//i*rowlength是为了取每次开始数据循环加o就可以控制每行的数据读取
//					vehicleListStr+="<input type='checkbox' name='vehicles' id='vehicles' value='"+i+"'/>"+ vehicleList[Go].split("=")[1]+"&nbsp;&nbsp;";
					vehicleListStr += "<input type='checkbox' name='vehicles' id='vehicles' onClick='checkboxMessage()' value='" + vehicleList[Go].split("=")[0] + "'/>" + vehicleList[Go].split("=")[1]+"&nbsp;&nbsp;";
				}
				vehicleListStr+="</li>";
			}
			vehicleListStr += "</li></ul>";
			
			//如果是查询功能，先清空数据，再添加数据
			if(op=='1'){
				$("#vehicle").text("")
				$("#vehicle").html(vehicleListStr);
				xs=vehicleList.length-1;
			}else{
				$("#vehicle").append(vehicleListStr);
//				$("#vehicle").append("<ul><li id ='lj'>nihaolujunyong<li></ul>");
//				$("#lj").append("&nbsp;&nbsp;1234");
//				$("#lj").append("<li>999<li></ul>");
				xs=Number(xs)+(vehicleList.length-1);
			}
			
			/***总共多少条数据**/
			var countNumber = vehicleList[vehicleList.length-1].split("=")[0];
			//当前页数
			var pageNo = vehicleList[vehicleList.length-1].split("=")[1];
//			alert("总共数据条数："+countNumber+"  当前页数："+vehicleList[vehicleList.length-1].split("=")[1]);
			$("#count").text(countNumber);
			$("#pageNo").val(pageNo);
			
			/**目前显示多少条数据**/
			$("#xs").text(xs);
			
			/**还剩多少条数据**/
			var hs="";
			countNumber>(pageNo*200)?hs = countNumber-pageNo*200:hs=0;
			$("#hs").text(hs);
			$("#hshidden").val(hs);
			
			/**更多点击事件**/
//			hs==0?$("#gd").unbind("click"):$("#gd").bind('click', gdGo);
			$("#gd").unbind("click");
			$("#gd").bind('click', gdGo)
			
			/**全选**/
			vehicleAll();
		}
	});
	
}

/**
 * 全选车辆【TA】
 * @return
 */
function vehicleAll(){
	// 全选
	$("#CheckAll").bind().click(function() {
		var flag = $("#CheckAll").attr("checked");
		if(flag){
			$("[name=vehicles]:checkbox").each(function() {
				$(this).attr("checked", true);
			});
		}else{
			$("[name=vehicles]:checkbox").each(function() {
				$(this).attr("checked",false);
			});
		}
		checkboxMessage();
	});
}

///**
// * 初始化轨迹分析组名称选择框
// * @param elementId 页面select元素ID
// */
//function initAnalyseGroup(elementId) {
//	//清空检测日期下拉
//	removerSel(elementId);
//	//添加
//	var unit = $("#" + elementId).get(0);
//	unit.options.add(new Option("默认分析组", "5"));
//	unit.options.add(new Option("javatest1", "2"));
//	unit.options.add(new Option("javatest2", "3"));
//	unit.options.add(new Option("javatest3", "4"));
//}

/**
 * 初始是否报警选择框
 * @param elementId 页面select元素ID
 */
function initAnnunciator(elementId){
	//清空检测日期下拉
	removerSel(elementId);
	//添加
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("只记录", "0"));
	unit.options.add(new Option("报警", "1"));
}

/**
 * 初始分析方式选择框
 * @param elementId 页面select元素ID
 */
function initPlaceInAlarm(elementId){
	//清空检测日期下拉
	removerSel(elementId);
	//添加
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("点范围外报警", "0"));
	unit.options.add(new Option("点范围内报警", "1"));
}

/**
 * 初始化是否蜂鸣器报警选择框
 * @param elementId 页面select元素ID
 */
function initIsWarn(elementId){
	//清空检测日期下拉
	removerSel(elementId);
	//添加
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("蜂鸣器响", "0"));
	unit.options.add(new Option("蜂鸣器不响", "1"));
}


/**
 * 初始化检测方式选择框
 * @param elementId 页面select元素ID
 */
function initIsMoreThan(elementId){
	//清空检测日期下拉
	removerSel(elementId);
	//添加
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("超速检测", "0"));
	unit.options.add(new Option("低速检测", "1"));
}


/**
 * 初始是否记录结果选择框
 * @param elementId 页面select元素ID
 */
function initIsRecordResult(elementId){
	removerSel(elementId);
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("记录", "0"));
	unit.options.add(new Option("不记录", "1"));
}

/**
 * 初始化及时记录选择框
 * @param elementId 页面select元素ID
 */
function initBetimes(elementId){
	//清空检测日期下拉
	removerSel(elementId);
	//添加
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("是", "0"));
	unit.options.add(new Option("否", "1"));
}


/**
 * 设置某个控件可用不可用
 * @param elementId 控件id
 * @param YesOrNo 可用不可用【yes表示可用，no不可用】
 * @return
 */
function controlYesOrNo(elementId,YesOrNo){
	
	if(elementId!=""&&elementId!=null){
		//可用
		if(YesOrNo=="yes"){
			$('#'+elementId).removeAttr("disabled");
		}
		//不可用
		else if(YesOrNo=="no"){
			$('#'+elementId).attr("disabled","disabled");
		}
	}
		
}

/**
 * 控件可用不可用【这里提供最多三个控件设置，第一个控件时任何类型，第二个和第三个控件时日期控件的开始时间和结束时间】
 * @param elementId 检测日期下拉框id
 * @param elementId2，elementId2Image   检测开始时间id【一个是文本框id一个是图片id】
 * @param elementI3，elementI3Image		检测结束时间id【一个是文本框id一个是图片id】
 * @param YesOrNo 可用还是不可用【yes表示可用，no表示不可用】
 * @return
 */
function jspControlYesOrNo(elementId,elementId2,elementId2Image,elementI3,elementI3Image,YesOrNo){
	/**第一个控件**/
	if(elementId!=""&&elementId!=null){
		//可用
		if(YesOrNo=="yes"){
			$('#'+elementId).removeAttr("disabled");
		}
		//不可用
		else if(YesOrNo=="no"){
			$('#'+elementId).attr("disabled","disabled");
		}
	}
	/**第二个控件【日期控件的开始控件】*/
	if((elementId2!=""&&elementId2!=null)||(elementId2Image!=""&&elementId2Image!=null)){
		if(YesOrNo=="yes"){
			$('#'+elementId2).removeAttr("disabled");
			$('#'+elementId2Image).removeAttr("disabled");
		}
		else if(YesOrNo=="no"){
			$('#'+elementId2).attr("disabled","disabled");
		    $('#'+elementId2Image).attr("disabled","disabled");
		}
	}
	/**第三个控件【日期控件的结束控件】*/
	if((elementI3!=""&&elementI3!=null)||(elementI3Image!=""&&elementI3Image!=null)){
		if(YesOrNo=="yes"){
			$('#'+elementI3).removeAttr("disabled");
			$('#'+elementI3Image).removeAttr("disabled");
		}
		else if(YesOrNo=="no"){
			$('#'+elementI3).attr("disabled","disabled");
		    $('#'+elementI3Image).attr("disabled","disabled");
		}
	}
	
}

/**
 * 初始化控件属性【针对TA报警设置的检测时间业务】
 * @param elementId 检测类型控件id
 * @param elementId2 检测开始时间控件id
 * @param elementI3 检测结束时间控件id
 */
function initControlSetup(elementId,elementId2,elementI3){
	
	//清空检测日期下拉
	removerSel(elementId);
	//设置检测日期下拉框默认值
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option("1", "1"));
	
	//设置默认时间
	initTime_Value(elementId2,"00:00:00",elementI3,"23:59:59");
}


/**
 * 用作“修改”的时候点线面下拉框不可以修改
 * @param elementId 下拉框id
 * @param elementValue 下拉框显示值
 * @return
 */
function initSelectDXM(elementId,elementValue){
	//清空检测日期下拉
	removerSel(elementId);
	//添加
	var unit = $("#" + elementId).get(0);
	unit.options.add(new Option(elementValue, "0"));
}



/////////////////【用作TA】end////////////////////////////

/////////////////////作用于报警设置模块end////////////////////////////////////


