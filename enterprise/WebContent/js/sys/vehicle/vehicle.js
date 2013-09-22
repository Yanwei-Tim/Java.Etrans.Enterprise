$(function() {
	
	initGrid();
	
	//初始化验证插件
	$("#editWindow").validation();
	
	//按钮绑定点击事件
	$('#adSearchBtn').bind('click', toOpenAds);
	$('#searchBtn').bind('click', toSearch);
    $('#createBtn').bind('click', toCreate);
    $('#exportBtn').bind('click', toExportExl);
 
    $('#cancelBtn').bind('click', hide);
 
    $('#adColumnBtn').bind('click', toOpenAdColumn);
    

   
     
    
});

/**
 * 初始化表格
 */
function initGrid(){
	$("#vehicleList").flexigrid( {
		url : 'sys/vehicleList.action',
		dataType : 'json',
		colModel : [ 
		{
			display : '车牌号码',
			name : 'registrationNo',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '车牌颜色',
			name : 'noColor',
			width : 80,
			sortable : true,
			align : 'center'
		},{
			display : '企业名称',
			name : 'workUnitName',
			width : 200,
			sortable : true,
			align : 'center'
		},{
			display : '所属区域',
			name : 'areaName',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '行业类型',
			name : 'tradeName',
			width : 100,
			sortable : true,
			align : 'center'
		}
//		,{
//			display : '车辆分类',
//			name : 'customerTrade',
//			width : 100,
//			sortable : true,
//			align : 'center'
//		}
		,{
			display : '车辆类型',
			name : 'kindName',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '车牌类型',
			name : 'registrationNoKindName',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '车辆颜色',
			name : 'vColor',
			width : 80,
			sortable : true,
			align : 'center'
		}
//		,{
//			display : '平台名称',
//			name : 'platformName',
//			width : 100,
//			sortable : true,
//			align : 'center'
//		}
		,{
			display : '终端类型',
			name : 'terminalTypeName',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '通信号',
			name : 'commNo',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : 'SIM卡号',
			name : 'simNo',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '所属车队',
			name : 'vehicleTeamName',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '第一司机',
			name : 'firstDriver',
			width : 80,
			sortable : true,
			align : 'center'
		},{
			display : '道路运输证号',
			name : 'transportPermits',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '经营许可证号',
			name : 'licenseNo',
			width : 100,
			sortable : true,
			align : 'center'
		},{
			display : '使用状态',
			name : 'workStatusStr',
			width : 80,
			sortable : false,
			align : 'center'
		},{
			display : '盲区处理',
			name : 'isBlindStr',
			width : 80,
			sortable : false,
			align : 'center'
		},{
			display : '操作',
			name : 'Handler',
			handlefunction : 'getHandleColumn',
			paramcolnames : ['id','workStatusInt','registrationNo'], 
			width : 230,
			sortable : false,//操作列不能排序
			align : 'center'
		}],
		
		sortname : "id",//第一次加载数据时排序列
		sortorder : "desc",//第一次加载数据时排序类型
		usepager : true,//是否分页，默认为true。
		showTableToggleBtn : true,//是否显示收起/打开按钮,默认不显示。
		useRp : true,//是否可以动态设置每页显示的结果数，默认为false。
		rp : 8,//每页记录数，默认为10
		singleSelect:false,
		width : 'auto',//表格宽度
		height : getNormalHeight()-20//表格高度
	});
}

/**
 * 组装操作列显示内容
 * @param id
 * @returns {String}
 */
function getHandleColumn(id,workStatusInt,registrationNo){
	//alert("registrationNo:"+registrationNo);
	
	var handleStr = "";
	
	var editStr = "";
	var deleteStr = "";
	var terminalStr = "";
	var usedStr = "";
	var pauseStr = "";
	var terminalParamStr = "";
	//变量resources为用户的所有资源权限
	if(resources!=null){
		//判断ACTION的访问权限
		if(resources.indexOf("|updateVehicle|")!=-1){
			editStr = '<a href="javascript:void(0)" onclick="doEdit(' + id + ')">编辑</a>';
		}
		if(resources.indexOf("|deleteVehicle|")!=-1){
			deleteStr = '<a href="javascript:void(0)" onclick="doDelete(\''+id+'\',\''+registrationNo+'\')">删除</a>';
		}
		if(resources.indexOf("|restartVehicle|")!=-1){ 
			usedStr = '<a href="javascript:void(0)" onclick="doUsed(' + id + ',' + workStatusInt + ')">启用</a>';
		}
		if(resources.indexOf("|pauseVehicle|")!=-1){ 
			pauseStr = '<a href="javascript:void(0)" onclick="doPause(' + id + ',' + workStatusInt + ')">停用</a>';
		}
		if(resources.indexOf("|changeTerminal|")!=-1){  
			terminalStr = '<a href="javascript:void(0)" onclick="changeTerminal(' + id + ')">终端转车</a>';
		}
		if(resources.indexOf("|terminalParamList|")!=-1){ 	 
			terminalParamStr = '<a href="javascript:void(0)" onclick="doViewTerminal(' + id + ')">查看终端参数</a>';
		}
	}
	var statusStr = "";
	if(workStatusInt == 1){
		statusStr = usedStr ;
	}else{
		statusStr = pauseStr ;
	}
	handleStr = editStr + '&nbsp;&nbsp;' + deleteStr + '&nbsp;&nbsp;' + statusStr + '&nbsp;&nbsp;' + terminalStr + '&nbsp;&nbsp;' + terminalParamStr ;
	return handleStr;
	
}

/**
 * 打开高级搜索框
 */
function toOpenAds(){
	var adSearch=$("#adSearch");
	adSearch.animate({height: 'toggle', opacity: 'toggle'}, 10);
	var adSearchBtn=$("#adSearchBtn");
	if(adSearchBtn.html()=='高级搜索'){
		adSearchBtn.html("收起高级搜索");
	}else{
		adSearchBtn.html("高级搜索");
	}
}
function toOpenAdColumn(){
	$("#adColumn").animate({height: 'toggle', opacity: 'toggle'}, 400);
}

/**
 * 条件查询
 */
function toSearch(){
	
	var registrationNo = $("#reNoParam").val();
	var vehicleIds=$("#vehicleIds").val();
	var unitName = $("#workUnitNameParam").val();
	var commNo = $("#comNoParam").val();
	var simNo = $("#simParam").val();
	var firstDriver = $("#driverParam").val();
	//查询参数
	var params = [{
		name : 'registrationNo',
		value : registrationNo
	},{
		name : 'unitName',
		value : unitName
	},{
		name :'vehicleIds',
		value :vehicleIds
	},{
		name : 'commNo',
		value : commNo
	},{
		name : 'simNo',
		value : simNo
	},{
		name : 'firstDriver',
		value : firstDriver
	} ];
	// 重置表格的某些参数
	$("#vehicleList").flexOptions({
			newp : 1,// 设置起始页
			params : params// 设置查询参数
		}).flexReload();// 重新加载
	document.getElementsByName("vehicleIds")[0].value="";
	document.getElementsByName("reNoParam")[0].value="";
	
}

/**
 * 新增加方法入口
 */
function toCreate(){
	
	$("#titleInfo").html("新增车辆信息");
	
	$("#submitBtn").unbind("click");
	

	resetForm("editWindow");
	showEditForm();
	$('#submitBtn').bind('click', doCreate);
}




function addOptions(elementId,flag){
	var unit = $("#" + elementId).get(0);
   if(unit.options.length == 0){
		if(flag && flag == 1)
			unit.options.add(new Option("请选择", -1));
		if(flag && flag == 2)
			unit.options.add(new Option("全部", -1));
   }
}


function initVehicleSel(){
	var url="sys/initVehicleSel.action";
	jsUtil.useAjaxDefault(url, null, initVehicleSelSucc);
}

function initVehicleSel2(){
	
	var url="sys/initVehicleSel2.action";
	jsUtil.useAjaxDefault(url, null, initVehicleSelSucc2);
}

function initVehicleSelSucc(data){
	//data数据{车辆颜色、车牌类型、车牌颜色、通信号、车辆类型、平台名称、}
	//新增表单
//	addSelOption("colorId",data["vehicleColor"]);
//	addSelOption("registrationNoKindId",data["registrationNoKind"]);
//	addSelOption("registrationNoColorId",data["registrationNoColor"]);
//	addSelOption("terminalId",data["terminal"]);
//	addSelOption("kindId",data["kind"]);
//	addSelOption("platformId",data["platform"]);	
	
	
	
	
}


function initVehicleSelSucc2(data){
	//data数据{行业类型、车辆分类、所属区域、车辆用途、车辆品牌、车辆厂商}
//	addSelOption("tradeKindId",data["tradeKind"]);	
	//addSelOption("customTradeKindId",data["customTradeKind"]);	
	//addSelOption("areaId",data["area"]);
	//addSelOption("usageId",data["usage"],1);
	//addSelOption("bandId",data["band"],1);
	//addSelOption("manufactoryId",data["manufactory"],1);
	
}
////////////////////////////////////////////////////////////////////
function checkVehicleTeam(workUnitId){
	removerSel("vehicleTeamId");
	var url="sys/checkVehicleTeam.action?workUnitIds="+$("#workUnitId").val();
	initAjaxSelect_Ansynce("vehicleTeamId",url,1,false);
}


////////////////////////////////////////////////////////////////////
/**
 * 初始化车辆选择框
 * @param elementId 页面select元素ID
 */
function addSelOption(elementId,dataArr) {
	var unit = $("#" + elementId).get(0);
	$(dataArr).each(function(i, n) {
		unit.options.add(new Option(n.name, n.id));
	});
}


/**
 * 初始化FORM表单
 */
function initSelects(){
	
//	initAjaxSelect("colorId","sys/initColors.action");
//	initAjaxSelect("registrationNoKindId","sys/initRegistrationNoKinds.action");
//	initAjaxSelect("registrationNoColorId","sys/initRegistrationNoColors.action");
//	initAjaxSelect("terminalId","sys/initTerminals.action");
//	initAjaxSelect("workUnitId","sys/initWorkUnits.action");
//	initAjaxSelect("kindId","sys/initKinds.action");
//	initAjaxSelect("platformId","sys/initPlatforms.action");
//	initAjaxSelect("tradeKindId","sys/initTradeKinds.action");
//	
//	initAjaxSelect("customTradeKindId","sys/initCustomTradeKinds.action");
//	initAjaxSelect("areaId","sys/initAreas.action");
//	initAjaxSelect("usageId","sys/initUsages.action",1);
//	initAjaxSelect("bandId","sys/initBands.action",1);
//	initAjaxSelect("manufactoryId","sys/initManufactorys.action",1);
//	initAjaxSelect("vehicleTeamId","sys/initVehicleTeams.action",1);
//	
//	initAjaxSelect("firstDriverId","sys/initDrivers.action");
//	initAjaxSelect("secondDriverId","sys/initDrivers.action",1);
//	
//	initWorkStatus("workStatus");
//	initIsBlind("isBlind");
	
}

function initSelects2(){
	
//	initAjaxSelect("firstDriverId","sys/initDrivers.action");
//	initAjaxSelect("secondDriverId","sys/initDrivers.action",1);
	
//	initWorkStatus("workStatus");
//	initIsBlind("isBlind");
	//initVehicleTeam("vehicleTeamId");
	//map.put("workUnit", initSelectServices.initWorkUnits(params));
	//initAjaxSelect("workUnitId","sys/initWorkUnits.action",1);
}

/**
 * 获取表单数据
 * @returns 
 */
function getFormParams(){
	
	var vehicleId = $("#vehicleId").val();
	var colorId = $("#colorId").val();
	var registrationNoKindId  = $("#registrationNoKindId").val();
	var vin = $("#vin").val();
	var registrationNoColorId = $("#registrationNoColorId").val();
	var terminalId = $("#terminalId").val();
	var workUnitId = $("#workUnitID1").val();
	var kindId = $("#kindId").val();
	//var platformId = $("#platformId").val();
	var tradeKindId = $("#tradeKindId").val();
	//var customTradeKindId = $("#customTradeKindId").val();
	var usageId = $("#usageId").val();
	var bandId = $("#bandId").val();
	var manufactoryId = $("#manufactoryId").val();
	var transportPermits = $("#transportPermits").val();
	var firstDriverId = $("#firstDriverId").val();
	var secondDriverId = $("#secondDriverId").val();
	var workStatus ="0";
	var isBlind = "0";
	var setupWorker = $("#setupWorker").val();
	var setupDate = $("#setupDate").val();
	var memo = $("#memo").text();
	var areaId = $("#areaId").val();
	var regAddress = $("#regAddress").val();
	var licenseNo = $("#licenseNo").val();
	var driverInfo = $("#driverInfo").val();
	var guardsInfo = $("#guardsInfo").val();
	var loadingCapacity = $("#loadingCapacity").val();
	var tonnage = $("#tonnage").val();
	var origin = $("#origin").val();
	var destination = $("#destination").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var businessScope = $("#businessScope").val();
	var banlineType = $("#banlineType").val();
	var traction = $("#traction").val();
	var seatCount = $("#seatCount").val();
	var originStop = $("#originStop").val();
	var terminalStation = $("#terminalStation").val();
	var orgVehNo = $("#orgVehNo").val();
	var trailerVehNo = $("#trailerVehNo").val();
	var vehicleTeamId = $("#vehicleTeamId").val();
	
	/**作用于修改内存车辆信息**/
	var registrationNo = $("#registrationNo").val(); //车牌号
	var registrationNoColorName=$("#registrationNoColorName").val(); //车牌颜色名称
	var workUnitIDName =$("#workUnitIDName").val();//企业名称
	var tradeKindName = $("#tradeKindName").val(); //行业类型名称
	var simParam =  $("#simParam").val(); //sim名称
//	alert("车牌号:"+registrationNo+" 车牌颜色名称: "+registrationNoColorName+" 企业名称:"+workUnitIDName+" 行业类型名称:"+tradeKindName+" sim名称:"+simParam);
	
	//表单参数
	var params = {
		vehicleId : vehicleId,
		registrationNo : registrationNo,
		colorId : colorId,
		registrationNoKindId  : registrationNoKindId,
		vin : vin,
		registrationNoColorId : registrationNoColorId,
		terminalId : terminalId,
		workUnitId : workUnitId,
		kindId : kindId,
		//platformId : platformId,
		tradeKindId : tradeKindId,
		//customTradeKindId : customTradeKindId,
		usageId : usageId,
		bandId : bandId,
		manufactoryId : manufactoryId,
		transportPermits : transportPermits,
		firstDriverId : firstDriverId,
		secondDriverId : secondDriverId,
		workStatus : workStatus,
		isBlind : isBlind,
		setupWorker : setupWorker,
		setupDate : setupDate,
		memo : memo,
		areaId : areaId,
		regAddress : regAddress,
		licenseNo : licenseNo,
		driverInfo : driverInfo,
		guardsInfo : guardsInfo,
		loadingCapacity : loadingCapacity,
		tonnage : tonnage,
		origin : origin,
		destination : destination,
		startTime : startTime,
		endTime : endTime,
		businessScope : businessScope,
		banlineType : banlineType,
		traction : traction,
		seatCount : seatCount,
		originStop : originStop,
		terminalStation : terminalStation,
		orgVehNo : orgVehNo,
		trailerVehNo : trailerVehNo,
		vehicleTeamId : vehicleTeamId,
		registrationNoColorName:registrationNoColorName,
		workUnitIDName:workUnitIDName,
		tradeKindName:tradeKindName,
		simParam:simParam
	};
	
	return params;
}

/**
 * 执行后台方法新增数据
 */
function doCreate(){
	
	var canSubmit = $("#editWindow").beforeSubmit();
	if(canSubmit){
		var params = getFormParams();
		$.ajax({
		    type : "POST",
		    url : "sys/createVehicle.action",
		    data : {params : $.toJSON(params)},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data.code == '1'){
		    		hide();
		    		$("#vehicleList").flexReload();
		    	}else{
		    		showError();
		    	}
		    },
		    error : function(data) {
		    	showError();
		    }
		});
	}
}


/**
 * 进入编辑页面
 * @param id
 */
function doEdit(id){
	if(id != null && id != ''){
		
		$("#titleInfo").html("编辑车辆信息");
		$("#submitBtn").unbind("click");
		$("#terminalId").empty();
		
		resetForm("editWindow");
		showEditForm();
		
		$.ajax({
		    type : "POST",
		    url : "sys/getVehicleById.action",
		    data : {id:id},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data.code == '1'){
		    		var vInfo = data.data;
		    		
		    		if(vInfo){
		    			$("#vehicleId").val(vInfo.ID);
		    			$("#registrationNo").val(vInfo.RegistrationNO);
		    			$("#colorId").val(vInfo.ColorID);
		    			$("#colorName").val(vInfo.colorName);
		    			//setSelected("colorId",vInfo.ColorID);
		    			$("#registrationNoKindId").val(vInfo.RegistrationNOKindID);
		    			$("#registrationNoKindName").val(vInfo.registrationNoKindName);
		    			//setSelected("registrationNoKindId",vInfo.RegistrationNOKindID);
		    			$("#vin").val(vInfo.Vin);
		    			$("#registrationNoColorId").val(vInfo.RegistrationNOColorID);
		    			$("#registrationNoColorName").val(vInfo.registrationNoColorName);
		    			//setSelected("registrationNoColorId",vInfo.RegistrationNOColorID);
		    			
		    			$("#terminalId").val(vInfo.TerminalID);
		    			$("#terminalName").val(vInfo.commNo);
		    			
		    			//var selectedEls = $("#terminalId option[value='" + vInfo.TerminalID + "']").length;
//		    			if(vInfo.TerminalID && selectedEls == 0){
//		    				$("#terminalId").get(0).options.add(new Option(vInfo.commNo,vInfo.TerminalID));
//		    				setSelected("terminalId",vInfo.TerminalID);
//		    			}
		    			
		    			$("#workUnitID1").val(vInfo.WorkUnitID);
		    			$("#workUnitIDName").val(vInfo.workUnitIDName);
		    			//setSelected("workUnitID1",vInfo.WorkUnitID);
		    			//setSelected("kindId",vInfo.KindID);
		    		    
		    			$("#kindId").val(vInfo.KindID);
		    			$("#kindName").val(vInfo.kindName);
		    			
		    			$("#tradeKindId").val(vInfo.TradeKindID);
		    			$("#tradeKindName").val(vInfo.tradeKindName);
		    			//setSelected("tradeKindId",vInfo.TradeKindID);
		    			
		    			$("#usageId").val(vInfo.UsageID);
		    			$("#usageName").val(vInfo.usageName);
		    			//setSelected("usageId",vInfo.UsageID);
		    			
		    			$("#bandId").val(vInfo.BandID);
		    			$("#bandName").val(vInfo.bandName);
		    			
		    			//setSelected("bandId",vInfo.BandID);
		    			//setSelected("manufactoryId",vInfo.ManufactoryID);
		    			$("#manufactoryId").val(vInfo.ManufactoryID);
		    			$("#manufactoryName").val(vInfo.manufactoryName);
		    			
		    			$("#firstDriverId").val(vInfo.firstDriverId);
		    			$("#secondDriverId").val(vInfo.secondDriverId);
		    			$("#firstDriverName").val(vInfo.firstDriverName);
		    			$("#secondDriverName").val(vInfo.secondDriverName);
		    			
		    			//setSelected("firstDriverId",vInfo.firstDriverId);
		    			//setSelected("secondDriverId",vInfo.secondDriverId);
		    			
		    			//setSelected("vehicleTeamId",vInfo.VehicleTeamID);
		    			//维护车队
		    			$("#vehicleTeamId").val(vInfo.VehicleTeamID);
		    			$("#vehicleTeamName").val(vInfo.vehicleTeamName);
		    			
		    			$("#areaId").val(vInfo.AreaID);
		    			$("#areaName").val(vInfo.areaName);
		    			
		    			//setSelected("workStatus",vInfo.WorkStatus);
		    			//setSelected("isBlind",vInfo.IsBlind);
		    			//setSelected("platformId",vInfo.PlatformID);
		    			//setSelected("customTradeKindId",vInfo.CustomTradeKindID);
		    			
		    			$("#transportPermits").val(vInfo.TransportPermits);
		    			$("#setupWorker").val(vInfo.setupWorker);
		    			$("#setupDate").val(vInfo.setupDateTime);
		    			$("#memo").text(vInfo.Memo);
		    			
		    			
		    			$("#regAddress").val(vInfo.RegAddress);
		    			$("#licenseNo").val(vInfo.LicenseNo);
		    			$("#driverInfo").val(vInfo.DriverInfo);
		    			$("#guardsInfo").val(vInfo.GuardsInfo);
		    			$("#loadingCapacity").val(vInfo.LoadingCapacity);
		    			$("#tonnage").val(vInfo.Tonnage);
		    			$("#origin").val(vInfo.Origin);
		    			$("#destination").val(vInfo.Destination);
		    			$("#startTime").val(vInfo.StartTime);
		    			$("#endTime").val(vInfo.EndTime);
		    			$("#businessScope").val(vInfo.BusinessScope);
		    			$("#banlineType").val(vInfo.BanlineType);
		    			$("#traction").val(vInfo.Traction);
		    			$("#seatCount").val(vInfo.SeatCount);
		    			$("#originStop").val(vInfo.OriginStop);
		    			$("#terminalStation").val(vInfo.TerminalStation);
		    			$("#orgVehNo").val(vInfo.OrgVehNo);
		    			$("#trailerVehNo").val(vInfo.TrailerVehNo);
		    			
		    			//checkVehicleTeam(vInfo.WorkUnitID);
		    			
		    			//alert("2:"+vInfo.VehicleTeamID);
		    			
		    			
		    			$('#submitBtn').bind('click', doUpdate);
		    		}
		    	}else{
		    		showError();
		    	}
		    },
		    error : function(data) {
		    	showError();
		    }
	    });
	}
}

/**
 * 设置下拉框选中项
 * @param eleId
 * @param selectedVal
 */
function setSelected(eleId,selectedVal){
	$("#" + eleId + " option[value='" + selectedVal + "']").attr("selected", true);
}
/**
 * 执行后台方法更新数据
 */
function doUpdate(){
	
	var canSubmit = $("#editWindow").beforeSubmit();
	if(canSubmit){
		
		var params = getFormParams();
		$.ajax({
		    type : "POST",
		    url : "sys/updateVehicle.action",
		    data : {params : $.toJSON(params)},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data.code == '1'){
		    		hide();
		    		$("#vehicleList").flexReload();
		    	}else{
		    		showError();
		    	}
		    },
		    error : function(data) {
		    	showError();
		    }
		});
	}
}

/**
 * 打开编辑窗口
 */
function showEditForm(){
	show();
	$("#editWindow .errorMsg").closeMessage();
}

/**
 * 显示错误信息
 */
function showError(){
	showWarning('服务器忙，请重试！');
}

/**
 * 显示提示信息
 */
function showWarning(str){
	$.messager.alert('提示信息',str,'info');
}

/**
 * 执行后台方法删除数据
 * @param id
 * @returns {Boolean}
 */
function doDelete(id,registrationNo){
	if (id) {
		if (!confirm("确定删除此车辆?")) {
			return false;
		} else {
			$.ajax({
			    type : "POST",
			    url : "sys/deleteVehicle.action",
			    data : {id:id,registrationNo:registrationNo},
			    dataType : "JSON",
			    success : function(data) {
			    	if(data.code == '1'){
			    		$("#vehicleList").flexReload();
			    	}else{
			    		showError();
			    	}
			    },
			    error : function(data) {
			    	showError();
			    }
		    });
			return true;
		}
	}
}

/**
 * 车辆更换终端
 * @param id
 */
function changeTerminal(id){
	var url = "sys/vehicle/terminalChange.jsp?vehicleId=" + id;
	openDialog(url, 400, 300, "终端转车");
}

/**
 * 查看终端参数
 * @param id
 */
function doViewTerminal(id){
	var url = "sys/vehicle/terminalParams.jsp?vehicleId=" + id;
	openDialog(url, 650, 400, "终端参数");
}

function openDialog(src, width, height, title) {

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

function closeDialog(){
	$('#dialogs').dialog('close');
}

function gridReload(){
	$("#vehicleList").flexReload();
}

/**
 * 车辆启用
 * @param id
 */
function doUsed(id,workStatusInt){
	if(workStatusInt == 1){
//		updateWorkStatus(id,0);
		$.ajax({
		    type : "POST",
		    url : "sys/restartVehicle.action",
		    data : {id:id,workStatus:0},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data.code == '1'){
		    		$("#vehicleList").flexReload();
		    	}else{
		    		showError();
		    	}
		    },
		    error : function(data) {
		    	showError();
		    }
	    });
	}else{
		showWarning("此车辆已正在使用！");
	}
	
}

/**
 * 车辆停用
 * @param id
 */
function doPause(id,workStatusInt){
	if(workStatusInt == 0){
//		updateWorkStatus(id,1);
		$.ajax({
		    type : "POST",
		    url : "sys/pauseVehicle.action",
		    data : {id:id,workStatus:1},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data.code == '1'){
		    		$("#vehicleList").flexReload();
		    	}else{
		    		showError();
		    	}
		    },
		    error : function(data) {
		    	showError();
		    }
	    });
	}else{
		showWarning("此车辆已停止使用！");
	}
}

/**
 * 更新车辆使用状态
 * @param vehicelId
 * @param workStatus
 */
function updateWorkStatus(id,workStatus){
	$.ajax({
	    type : "POST",
	    url : "sys/updateVehicleWorkStatus.action",
	    data : {id:id,workStatus:workStatus},
	    dataType : "JSON",
	    success : function(data) {
	    	if(data.code == '1'){
	    		$("#vehicleList").flexReload();
	    	}else{
	    		showError();
	    	}
	    },
	    error : function(data) {
	    	showError();
	    }
    });
}

/**
 * 导出方法入口
 */
function toExportExl(){
	exportExl('vehicleList','sys/vehicleExport.action');
}




