$(function() {
	
	initGrid();
	
	//初始化验证插件
	$("#editWindow").validation();
	initSelects();
	//按钮绑定点击事件
	$('#searchBtn').bind('click', toSearch);
    $('#createBtn').bind('click', toCreate);
    $('#editBtn').bind('click', toEdit);
    $('#deleteBtn').bind('click', toDelete);
    $('#exportBtn').bind('click', toExportExl);
    $('#cancelBtn').bind('click', hide);
    $('#reSetBtn').bind('click', reSetAddForm);
	    
});

function initGrid(){
		$("#vehicleDeviceModelList").flexigrid( {
			url : 'videoManage/vehicleDeviceModelList.action',
			dataType : 'json',
			colModel : [
             {
 				display : '名称',
 				name : 'Name',
 				width : 150,
 				sortable : true,
 				align : 'center'
 			},{
				display : '代码',//表头
				name : 'Code',//JSON数据中属性名
				width : 120,// 得加上 要不IE报错
				sortable : true,//此字段是否能排序
				align : 'center'//对齐方式
			},{
				display : '所属设备名称',
				name : 'DeviceTypeName',
				width : 120,
				sortable : true,
				align : 'center'
			},{
				display : '品牌名称',
				name : 'BrandName',
				width : 120,
				sortable : true,
				align : 'center'
			}, {
				display : '厂商名称',
				name : 'DeviceVendorName',
				width : 120,
				sortable : false,
				align : 'center'
			}, {
				display : '参数',
				name : 'ParamValue',
				width : 120,
				sortable : false,
				align : 'center'
			}, {
				display : '备注',
				name : 'Memo',
				width : 100,
				sortable : false,
				align : 'center'
			},{
				display : '操作',
				name : 'Handler',
				handlefunction : 'getHandleColumn',
				paramcolnames : ['ID'],
				width : 100,
				sortable : false,//操作列不能排序
				align : 'center'
			}],
			
			sortname : "ID",//第一次加载数据时排序列
			sortorder : "desc",//第一次加载数据时排序类型
			usepager : true,//是否分页，默认为true。
			showTableToggleBtn : true,//是否显示收起/打开按钮,默认不显示。
			useRp : true,//是否可以动态设置每页显示的结果数，默认为false。
			rp : 8,//每页记录数，默认为10
			//checkbox : true,//是否要多选框,默认为false。
			rowId : 'ID',// 多选框绑定行的id,只有checkbox : true时才有效。
			singleSelect:false,
			width : 'auto',//表格宽度
			height : getNormalHeight()-20//表格高度
		});
		
		
	    
};

/**
 * 组装操作列显示内容
 * @param id
 * @returns {String}
 */
function getHandleColumn(id){
	
	var editStr = "";
	var deleteStr = "";
	//变量resources为用户的所有资源权限 格式：|findPlatFormList||createPlatForm||updatePlatForm||deletePlatForm|
	if(resources!=null){
		//判断ACTION的访问权限
		 if(resources.indexOf("|updateVehicleDeviceModel|")!=-1){
			 editStr ='<a href="javascript:void(0)" onclick="doEdit(' + id + ')">编辑</a>'
		 }
		 if(resources.indexOf("|deleteVehicleDeviceModel|")!=-1){
			 deleteStr ='<a href="javascript:void(0)" onclick="doDelete(' + id + ')">删除</a>'
		 }
	}
	return editStr + '&nbsp;&nbsp;' + deleteStr;
	
}

/**
 * 查询方法
 */
function toSearch(){
	
	var name = $("#ParamName").val();
	
	var params = [{
		name : 'name',
		value : name
	}];
	// 重置表格的某些参数
	$("#vehicleDeviceModelList").flexOptions({
			newp : 1,// 设置起始页
			params : params// 设置查询参数
		}).flexReload();// 重新加载
}

/**
 * 新增加方法入口
 */
function toCreate(){
	$("#titleInfo").html("外设型号新增");
	$("#submitBtn").unbind("click");
	clearForm("editWindow");
	initSelects();
	showEditForm();
	$('#submitBtn').bind('click', doCreate);
}


/**
 *初始化终端信息管理界面下拉框
 */
function initSelects(){
	initAjaxSelect_Ansynce("DeviceVendorID","sys/initDeviceVendors.action","2",false);//设备厂商
	initAjaxSelect_Ansynce("DeviceTypeID","sys/initDeviceTypes.action","2",false);//设备类型
}

/**
 * 封装界面表单属性参数
 */
function getAddForm(){
	var id = $("#id").val();
	var Code = $("#Code").val();
	var Name = $("#Name").val();
	var BrandName = $("#BrandName").val();
	var Memo = $("#Memo").val();
	var ParamValue = $("#ParamValue").val();
	var DeviceVendorID = $("#DeviceVendorID").val();
	var DeviceTypeID = $("#DeviceTypeID").val();
	//表单参数
	var params = {
			id : id,
			Code : Code,
			Name : Name,
			BrandName : BrandName,
			Memo : Memo,
			ParamValue : ParamValue,
			DeviceVendorID : DeviceVendorID,
			DeviceTypeID : DeviceTypeID
	};
	return params;
}
/**
 * 执行后台方法新增数据
 */
function doCreate(){
	var canSubmit = $("#editWindow").beforeSubmit();
	if(canSubmit){
		var params = getAddForm();
		$.ajax({
		    type : "POST",
		    url : "videoManage/createVehicleDeviceModel.action",
		    data : {params : $.toJSON(params)},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data != null){
		    		hide();
		    		$("#vehicleDeviceModelList").flexReload();
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
 * 编辑方法入口
 */
function toEdit(){
	var checkedIds = $("#vehicleDeviceModelList").getCheckedRows();
	if(checkedIds.length<1){
		showWarning("请选择一行后进行编辑操作！");
		return;
	}
	if(checkedIds.length>1){
		showWarning("只能选择一行进行编辑操作！");
		return;
	}
	if(checkedIds.length == 1){
		doEdit(checkedIds[0]);
	}
}

/**
 * 查询机构信息显示在编辑窗口
 * @param id
 */
function doEdit(id){
	$("#titleInfo").html("外设型号编辑");
	if(id != null && id != ''){
		
		$("#submitBtn").unbind("click");
		clearForm("editWindow");
		initSelects();
		showEditForm();
		
		$.ajax({
		    type : "POST",
		    url : "videoManage/getVehicleDeviceModelById.action",
		    data : {id:id},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data!= null){
		    		var otInfo =  eval("("+data+")");
		    		if(otInfo.length > 0){
		    			$("#id").val(otInfo[0].ID);
		    			$("#Code").val(otInfo[0].Code);
		    			$("#Name").val(otInfo[0].Name);
		    			$("#BrandName").val(otInfo[0].BrandName);
		    			$("#Memo").val(otInfo[0].Memo);
		    			$("#ParamValue").val(otInfo[0].ParamValue);
		    			$("#DeviceVendorID option[value='" + otInfo[0].DeviceVendorID + "']").attr("selected", true);
		    			$("#DeviceTypeID option[value='" + otInfo[0].DeviceTypeID + "']").attr("selected", true);
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
 * 执行后台方法更新数据
 */
function doUpdate(){
	
	var canSubmit = $("#editWindow").beforeSubmit();
	if(canSubmit){
		var params = getAddForm();
		$.ajax({
		    type : "POST",
		    url : "videoManage/updateVehicleDeviceModel.action",
		    data : {params : $.toJSON(params)},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data!= null){
		    		hide();
		    		$("#vehicleDeviceModelList").flexReload();
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
 * 删除方法入口
 */
function toDelete(){
	var checkedIds = $("#vehicleDeviceModelList").getCheckedRows();
	if(checkedIds.length<1){
		showWarning("请选择一行后进行删除操作！");
		return;
	}
	doDelete(checkedIds);
}
/**
 * 表单重置方法入口
 */
function reSetAddForm(){
	resetForm("editWindow");
}
/**
 * 执行后台方法删除数据
 * @param ids
 * @returns {Boolean}
 */
function doDelete(ids){
	
	if (ids != null || ids.length > 0) {
		if (!confirm("确定删除选中的外设型号信息?")) {
			return false;
		} else {
			$.ajax({
			    type : "POST",
			    url : "videoManage/deleteVehicleDeviceModel.action",
			    data : {ids:ids.toString()},
			    dataType : "JSON",
			    success : function(data) {
			    	if(data!=null){
			    		$("#vehicleDeviceModelList").flexReload();
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
 * 导出方法入口
 */
function toExportExl(){
	exportExl('vehicleDeviceModelList','videoManage/vehicleDeviceModelExport.action');
}

