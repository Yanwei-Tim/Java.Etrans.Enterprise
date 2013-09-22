//--------------------------------- 定义常量 -------------------------------- //
var CONST = {}; // 常量对象

// 树相关常量
CONST.ROOT_NODE_ID = 0; // 默认根节点ID, 该节点在初始化数据库时导入，不可删除，不显示

// 操作类型
CONST.OPERATE_TYPE = {};
CONST.OPERATE_TYPE.INSERT = "insert"; // 插入
CONST.OPERATE_TYPE.INSERT.TOP = "insertTop"; // 顶级菜单插入
CONST.OPERATE_TYPE.MODIFY = "modify"; // 修改

// 菜单类型
CONST.MENU_TYPE = {};
CONST.MENU_TYPE.MAIN_FUNCTION = "mainFunction"; // 主功能菜单
CONST.MENU_TYPE.CHILD_FUNCTION = "childFunction"; // 其他子菜单
// --------------------------------- 定义变量 -------------------------------- //
var functionTree = null; // 树对象
var elementIds = [ "functionName", "functionCode", "functionImg",
		"functionType", "assemblyName", "ordering", "state", "remark",
		"assemblyBut" ]; // 所有表单元素的ID数组
var showElementIds = [ "functionName", "functionCode", "functionImg",
		"functionType", "ordering", "state", "remark", "parentFuncId" ]; // 显示时需要设置的元素ID数组
var functionNode = null; // 当前选中的节点对象
var menuType = null; // 当前选中的菜单类型. 选中主功能菜单时为"mainFunction",
var parentWorkId;						// 选中其他功能菜单时为"childFunction"
var operateType = null; // 当前操作类型. 插入状态时为"insert", 修改状态时为"modify"
var parentNodeId = CONST.ROOT_NODE_ID; // 父节点(功能)ID
var moduleId = CONST.ROOT_NODE_ID; // 模块ID(顶级功能ID)
var updateQueryVehicleId;
$(function(){
	$("#addVehicleBtn").click(addVehicleGrouopHandler);
	$("#updateVehicleBtn").click(updateVehicleGrouopHandler);
	$("#deleteBut").click(delVehicleGroupHandler);
	showVehicle();
	/**
	 * 查询
	 */
	$("#searchBtn_List").click(searchVehicle);
});
 
/**
 * 用户查询
 */
function searchVehicle()
{
	var name = $("#vehicleRegisterId").val();
	var params = null;	
	if(isVehicleGroup){
		params = [
			{name : 'RegistrationNO',value : name},
			{name:'workUnitId',value:search_workUnitId},
			{name:'groupId',value:search_VehicleGroupId}
		];
	}else if(isWorkUnit){
		params = [
			{name : 'RegistrationNO',value : name},
			{name:'workUnitId',value:search_workUnitId}
		];
	}else{
		params = [
			{name : 'RegistrationNO',value : '-999999999'},
			{name:'workUnitId',value:'-999999999'}
		];
	}
	gridReload(params);	
}
function updateVehicleGrouopHandler(){
	    var c="";
	    var p="";
	    $(".tree-checkbox1").parent().children('.tree-title').each(function(){
	      c+=$(this).parent().attr('node-id')+",";
	    });
	    var str=(c);
	    str=str.substring(0,str.length-1);
		$.ajax({
			type:"POST",
			url:"sys/updateVehicleGroup.action",
			data:{
				"vehicleGroupBean.id":functionNode.id,
				"vehicleGroupBean.name":$("#updateVehicleName").val(),
				"vehicles":str
			},
			dataType:"JSON",
			success:function(data){
				if(data){
					showWarning("修改成功!");
					$('#updateGroupForm').dialog('close');
					refreshTree();
				}else{
					showWarning("修改失败!");
				}
			},
			error:function(data){
				showError();
			}
			
		});	
}
function delVehicleGroupHandler(){
	if (confirm("请在删除之前 [确认] 节点 [没被引用], 否则可能导致删除失败!\n确定删除将 [不可恢复], 是否确定?")) {
		var deleteUrl = "sys/delVehicleGroup.action";
		var deleteParams = {
			"id" : functionNode.id
		};
		$.post(deleteUrl, deleteParams, function(data) {
			if (data == "true") {
				showWarning("删除成功!");
				refreshTree();
			}else if(data == "false"){
				showWarning("删除失败!");
			}else{
				showWarning(data);
			}
		});
	}
}
function isDigit(){ 
	if($("#vehicleName").val()!=null || $("#vehicleName").val()!=""){
		$("#vehicleNamespan").closeMessage();
	}
	
} 

/**
 * 新增车辆分组提交
 */
function addVehicleGrouopHandler(){
		if($("#vehicleName").val()==null || $("#vehicleName").val()==""){
			 $("#vehicleNamespan").showMessage({
					type : "error",
					closeable : false, 
					text : "名称不能为空！"});
			    return;
		}
	    if(isWorkUnit){
	    	functionNode.id = functionNode.parentGroupId;
	    	functionNode.workId = search_workUnitId;
	    }else{
	    	functionNode.id=updateQueryVehicleId;
	    }
	    var c="";
	    var p="";
	    $(".tree-checkbox1").parent().children('.tree-title').each(function(){
	      c+=$(this).parent().attr('node-id')+",";
	    });
	    var str=(c);
	    str=str.substring(0,str.length-1);
		$.ajax({
			type:"POST",
			url:"sys/addVehicleGroup.action",
			data:{
				"vehicleGroupBean.fullId":null,
				"vehicleGroupBean.parentGroupId":functionNode.id,
				"vehicleGroupBean.isLeaf":1,
				"vehicleGroupBean.level":2,
				"vehicleGroupBean.name":$("#vehicleName").val(),
				"vehicleGroupBean.workUnitId":functionNode.workId,
				"vehicleGroupBean.authorizedGroupId":0,
				"vehicleGroupBean.kind":4,
				"vehicleGroupBean.isSourceVisible":0,
				"vehicleGroupBean.privilegeFlag":0,
				"vehicles":str
			},
			dataType:"JSON",
			success:function(data){
				if(data){
					showWarning("新增成功!");
					$('#addGroupForm').dialog('close');
					refreshTree();
				}else{
					showWarning("新增失败!");
				}
			},
			error:function(data){
				showError();
			}
			
		});
}

/**
 * 刷新组织树
 */
function refreshTree() {
	initTree();
}

var isWorkUnit;
var isVehicleGroup;

var search_workUnitId;
var search_VehicleGroupId;

/**
 * 初始化车辆组树形结构
 */
function initTree() {
	// 区域树
	$('#vehicleGroupTree').tree({
		url : "sys/getVehicleGoupTreeWorkUnitList.action",
		onClick : function(node){
			
			try{
				if(node.attributes!=null && node.attributes[0].workId!=null){
					if(node.attributes[0].workId != 'undefined' && node.attributes[0].workId!=null){	
						parentWorkId = node.attributes[0].workId;
					}
				}	
			}catch(e){				
			}
			// 保存节点类型、和父节点ID
			functionNode = {
				id : node.id.split("|")[1],
				nodeName:node.text,
				kind:node.attributes.kind,
				workId:node.attributes.workId,
				workUnitName:node.attributes.workUnitName,
				parentGroupId:-1
			}; 
			parentNodeId = node.id.split("|")[1];
			// 选中节点时设置按钮状态
			if(functionNode.kind==4){
				setDisabled( [ "insertBut","modifyBut","deleteBut","cancelBut" ], false);
			}else{
				setDisabled( [ "insertBut","modifyBut","deleteBut","cancelBut" ], true);
			}
			// 企业
			if(node.id.split("|")[0]=='w' || functionNode.kind==0){
				isWorkUnit = true;
				isVehicleGroup = false;
				functionNode.workUnitName = node.text;
				functionNode.workId = functionNode.id;
				functionNode.kind = node.attributes[0].kind;
				functionNode.parentGroupId=node.attributes[0].parentGroupId;
				search_workUnitId = functionNode.workId;
				setDisabled( [ "insertBut","cancelBut" ], false);
				setDisabled( [ "modifyBut","deleteBut" ], true);
			}else if(functionNode.kind==3 || functionNode.kind==4){
				isWorkUnit = false;
				isVehicleGroup = true;
				search_workUnitId = functionNode.workId;
				search_VehicleGroupId = functionNode.id;
				updateQueryVehicleId = functionNode.id;
			}else{
				isWorkUnit = false;
				isVehicleGroup = false;
			}
			// 除了非授权(非授权下级节点)节点外都显示车辆信息
			if(functionNode.kind==4 || node.id.split("|")[0]=='w'){
				toSearch(functionNode.kind);
				setValueToVehicleInfo();
			}
		}
	});
}

function setValueToVehicleInfo(){
	$("#vName").val(functionNode.nodeName);
	$("#vType").val("自编组");
	$("#vCustomer").val(functionNode.workUnitName);
}
function addVehicleGroup(NodeId){
	$("#addVehicleGroupType").val(functionNode.nodeName);
	$("#vehicleName").val("");
	$("#addTheirCustomer").val(functionNode.workUnitName);
	$("#addGroupForm").css("display", "block");
	$("#addGroupForm").dialog( {
		width : 680,
		height : 440,
		modal:true,
		title : '新建车辆组'		
	});
	addVehicleTree("selectVehicle",true);
}

function updateVehicleGroup(NodeId){
	$("#updateVehicleName").val("");
	$("#updateVehicleName").val(functionNode.nodeName);
	$("#updateTheirCustomer").val(functionNode.workUnitName);
	$("#updateGroupForm").css("display", "block");
	$("#updateGroupForm").dialog( {
		width : 680,
		height : 440,
		modal:true,
		title : '编辑车辆组'		
	});
	addVehicleTree("updateAllVehicle",false);
}

function addVehicleTree(TreeId,isAdd) {
	try{
		//车组权限
		$("#"+TreeId).html('<img src="imgs/load.gif" />');
		// 如果当前选中的是企业那么分组ID自动给-1(此值为无效值)
		if(isWorkUnit){
			functionNode.workId = functionNode.id;
		}
		if(isAdd){
			functionNode.id=-1;
		}else{
			functionNode.id=updateQueryVehicleId;
		}
		$.ajax({
		    type : "POST",
		    url : "sys/getVehicleList.action",
		    data : {nodeId:functionNode.id,workId:functionNode.workId},
		    dataType : "JSON",
		    success : function(data) {
		    	$('#'+TreeId).tree({
		    		data:data,
		    		checkbox:true,
		    		animate : true,
		    		onlyLeafCheck:false   
		    	});
		    }
	    });
	}catch(e){}
}
function addOption(SELECTID){
	$.ajax({
	    type : "POST",
	    url : "sys/getVehicleList.action",
		data : {
			nodeId:functionNode.id
		},
	    dataType : "JSON",
	    success : function(data) {
	    	if(data.code == '0'){
	    		var options = '';
	    		for(var i=0; i<data.data.length; i++)
	    		{
	    		options +=  "<option value='"+data.data[i].id+"'>"+data.data[i].registrationNo+"</option>";
	    		}
	    		$('#'+SELECTID).html(options);
	    	}else{
	    		showError();
	    	}
	    },
	    error : function(data) {
	    	showError();
	    }
    });	
}
 
function updateOption(SELECTID){
	var hasSelectedVehicle = null;
	$.ajax({
	    type : "POST",
	    url : "sys/getSelectedVehicle.action",
		data : {
			id:functionNode.id
		},
	    dataType : "JSON",
	    success : function(data) {
	    	if(data.code == '0'){
	    		hasSelectedVehicle = data;
	    		var options = '';
	    		for(var i=0; i<data.data.length; i++)
	    		{
	    		options +=  "<option value='"+data.data[i].id+"'>"+data.data[i].registrationNo+"</option>";
	    		}
	    		$('#updateSelectVehicle').html(options);
	    		$.ajax({
	    		    type : "POST",
	    		    url : "sys/getVehicleList.action",
	    			data : {
	    				nodeId:functionNode.id
	    			},
	    		    dataType : "JSON",
	    		    success : function(data) {
	    		    	if(data.code == '0'){
	    		    		var options = '';
	    		    		if(hasSelectedVehicle!=null){
	    		    			for(var i=0; i<data.data.length; i++){
		    			    		var flag = false;
		    			    		for(var j=0;j<hasSelectedVehicle.data.length;j++){
			    			    		if(hasSelectedVehicle.data[j].id==data.data[i].id){
			    			    			flag = true;
			    			    		}
		    			    		}
		    			    		if(!flag){
		    			    			options +=  "<option value='"+data.data[i].id+"'>"+data.data[i].registrationNo+"</option>";
		    			    		}
		    			    		flag = false;
	    		    			}
	    		    		}else{
	    		    			for(i=0; i<data.data.length; i++){
	    		    				options +=  "<option value='"+data.data[i].id+"'>"+data.data[i].registrationNo+"</option>";
	    			    		}
	    		    		}	    		
	    		    		$('#'+SELECTID).html(options);
	    		    	}else{
	    		    		showError();
	    		    	}
	    		    },
	    		    error : function(data) {
	    		    	showError();
	    		    }
	    	    });	
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
 * 初始化按钮事件
 */
function initButtonEvents() {
	//新增按钮事件
	$("#insertBut").click(function() {
		addVehicleGroup(functionNode.id);
	});
	$("#modifyBut").click(function() {
		updateVehicleGroup(functionNode.id);
	});
	$("#saveBut").click(function() {
		
	});
}


/**
 * 设置表单元素可不可用
 */
function setDisabled(eleIds, flag) {
	$.each(eleIds, function(i, n) {
		$("#" + n).attr("disabled", flag);
	});
}
function showVehicle() {
    $("#tbVehicle").flexigrid( {
		url : 'sys/getVehicleByGroupId.action',
		dataType : 'json',
		colModel : [ 
		{
			display : '车牌号',
			name : 'RegistrationNO',
			height:20,
			width : 150,
			sortable : true,
			align : 'left'
		}],		
		sortname : "id",//第一次加载数据时排序列
		sortorder : "asc",//第一次加载数据时排序类型
		usepager : true,//是否分页，默认为true。
		showTableToggleBtn : true,//是否显示收起/打开按钮,默认不显示。
		useRp : false,//是否可以动态设置每页显示的结果数，默认为false。
		rp : 5,//每页记录数，默认为10
		checkbox : false,//是否要多选框,默认为false。
		rowId : 'id',// 多选框绑定行的id,只有checkbox : true时才有效。
		singleSelect:false,
		width : 'auto',//表格宽度
		height : 190//表格高度
	});
    
}

$(function() {		
	initTree();
	initButtonEvents();
});

/**
 * 查询方法
 */
function toSearch(KIND){
	var params = null;
	if(KIND==1){
		params = [ {
			name : 'workUnitId',
			value : '-9999'
		}];
	}
	if(KIND==-1){
		params = [ {
			name : 'workUnitId',
			value : functionNode.workId
		}];
	}else{
		params = [ {
			name : 'groupId',
			value : functionNode.id
		}];
	}
	gridReload(params);	
}

function gridReload(params){
	$("#tbVehicle").flexOptions({
		newp : 1,// 设置起始页
		params : params// 设置查询参数
	}).flexReload();// 重新加载
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

//打开一个对话框
function openDialog(id, widthValue, heightValue, titleValue) {
	$("#" + id).css("display", "block");
	$("#" + id).dialog( {
		width : widthValue,
		height : heightValue,
		title : titleValue,
		maximizable : false
	});
}
 