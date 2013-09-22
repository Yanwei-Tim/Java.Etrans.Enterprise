$(function(){
	
	findUsers();
	//编辑验证
	$("#editWindow").validation();
	
	$("#divAddUserPanel").validation();
	
	//$("#roleTab").validation();
	
	
	/**
	 * 查询
	 */
	$("#btnSearch").click(searchUsers);
	
	$("#btnAddUserPanel").click(togglePannel);
	$('#btnAddUserCancle').bind('click', togglePanneladd);
	$('#btnAddUserColse').bind('click', togglePanneladd);
	
	$('#btnAddWorkUser').bind('click', addWorkUser);
	
	
	/**
	 * 取消更新 hide();
	 */
	//$("#btnUpdateUserCancle").click(function(){jsUtil.showOrClosePanel("divUpdateUserPanel");});
	$('#btnUpdateUserCancle').bind('click', hideEdit);
	
	
	/**
	 * 用户编辑
	 */
	$('#editBtn').bind('click', toEdit);
	

	
	
	
	
	/**
	 * 查看车组(取消)
	 */
	$('#btnUpdateVehicleCancle').bind('click', hideVehicle);
	


	
	
		
});


/**
 * 编辑方法入口
 */
function toEdit(){
	var checkedIds = $("#tbUsers").getCheckedRows();
	
	if(checkedIds.length<1){
		$.messager.alert('提示信息','请选择一行后进行编辑操作！','info');
		return;
	}
	if(checkedIds.length>1){
		$.messager.alert('提示信息','只能选择一行进行编辑操作！','info');
		return;
	}
	if(checkedIds.length == 1){
		doEdit(checkedIds[0]);
	}
}

function doEdit(id){
	
	loadUserById(id);
}

/*企业管理员当前的企业id**/
var workUnitID;
/**
 * 企业管理员当前的是否为超级管理员
 * */
var IsSuperUsers;


/**
 * 加载单个用户信息
 * @param id
 */
function loadUserById(id)
{
	$("#btnUpdateUser").unbind("click");
	clearForm("editWindow");
	showEdit();
	$("#editWindow .errorMsg").closeMessage();
	jsUtil.defaultAjax(
			"sys/user/findUser.action", 
			{"id":id},
			function(data)
			{
				$("#txtUpdateName").val(data.Name);
				$("#txtUpdateUserName").val(data.UserName);
				//$("input[name='IsSuperUser1'][value="+data.IsSuperUser+"]").attr("checked",true);
				$("#IsSuperInput").val(data.IsSuperUser);
//				if(data.IsSuperUser==1){
//					$("#IsSuperInput").attr("checked",true);
//				}else{
//					$("#IsNotSuperInput").attr("checked",true);
//				}
				$("input[name='aStatus1'][value="+data.Status+"]").attr("checked",true);
				$("#txtUpdateRunTime").val(data.RunTime);
				$("#txtUpdateOverTime").val(data.OverTime);
				$("#txtUpdateUserId").val(id);
				$('#btnUpdateUser').bind('click', doUpdate);
				workUnitID=data.workUnitId;
				IsSuperUsers=data.IsSuperUser;
//				checkedSelectByValue(data.workUnitId);
				$("#workUnitID1").val(data.workUnitId);
    			$("#workUnitIDName").val(data.workunitName);
			}
			,function(data) {
		    	showError();
		    }
		);

}

function doUpdate(){
	
	var flag = $("#editWindow").beforeSubmit();
	if(flag){
		var id = $("#txtUpdateUserId").val();
		var name = $("#txtUpdateName").val();
		var username = $("#txtUpdateUserName").val();
		var isSuperUser = $("#IsSuperInput").val();
		var Status = $('input[name="aStatus1"]:checked').val();
		var RunTime = $("#txtUpdateRunTime").val();
		var OverTime = $("#txtUpdateOverTime").val();
		var workUnitId =$("#workUnitID1").val();
		$.ajax({
		    type : "POST",
		    url : "sys/user/editUser.action",
		    data : {id:id,name:name,username:username,isSuperUser:isSuperUser,Status:Status,RunTime:RunTime,OverTime:OverTime,workUnitId:workUnitId},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data.code == '0'){
		    		hideEdit();
		    		$("#tbUsers").flexReload();
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
 * 用户查询
 */
function findUsers()
{
	$("#tbUsers").flexigrid( {
		url : 'sys/userManage/getUserList.action',
		dataType : 'json',
		colModel : [{
			display : '用户名',//表头
			name : 'Name',//序号列为固定值fid
			width : 80,// 得加上，要不IE报错
			sortable:false,// 序号列不能排序
			align : 'center'//对齐方式
		}, {
			display : '登陆名',//表头
			name : 'UserName',//JSON数据中属性名
			width : 80,// 得加上，要不IE报错
			sortable : true,//此列是否能排序
			align : 'center'//对齐方式
		}, 
		{
			display : '所属企业',
			name:"workunitName",
			width : 100,
			sortable : false,
			align : 'center'
		}, 
		{
			display : '所属车组',
			name:"VehicleGroupName",
			width : 100,
			sortable : false,
			align : 'center'
		}, 
		{
			display : '用户类型',
			name : "isSuper",
			paramcolnames : ['isSuper'],
			handlefunction : 'paserUserType',
			width : 100,
			sortable : false,
			align : 'center'
		}, 		
		{
			display : '创建时间',
			name : 'CreateTime',
			width : 130,
			sortable : false,
			align : 'center'
		},
		{
			display : '过期时间',
			name : 'OverTime',
			width : 130,
			sortable : false,
			align : 'center'
		},
		 {
			display : '操作',
			name : 'Handler',
			handlefunction : 'getHandleColumn',
			paramcolnames : ['ID','IsSuperUser','roleId','isSuper','WorkUnitID','workunitName','vehicleGroupId','VehicleGroupName','menuCnt'],
			width : 300,
			sortable : false,//操作列不能排序
			align : 'left'
		}],
		
		sortname : "ID",//第一次加载数据时排序列
		sortorder : "desc",//第一次加载数据时排序类型
		usepager : true,//是否分页，默认为true。
		showTableToggleBtn : true,//是否显示收起/打开按钮,默认不显示。
		useRp : true,//是否可以动态设置每页显示的结果数，默认为false。
		rp : 8,//每页记录数，默认为10
		checkbox : false,//是否要多选框,默认为false。
		rowId : 'ID',// 多选框绑定行的id,只有checkbox : true时才有效。
		singleSelect:false,
		width : 'auto',//表格宽度
		height :  getNormalHeight()-20//表格高度
	});	
}



function setAdmin(ID,AdminState,WorkUnitID){
	var flag = true;
	if(AdminState==1){
		flag = confirm("如果已有企业管理员则会替换,是否继续?");
	}
	if(flag){
		$.ajax({
		    type : "POST",
		    url : "sys/user/setAdmin.action",
		    data : {id:ID,WorkUnitID:WorkUnitID,adminState:AdminState},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data){
		    		$.messager.alert('提示信息','设置成功！','info');
		    		$("#tbUsers").flexReload();
		    	}else{
		    		$.messager.alert('提示信息','设置失败,请重试！','info');
		    	}
		    },
		    error : function(data) {
		    	showError();
		    }
	    });
	}
}

/**
 * 组装操作列显示内容
 * @param id
 * @returns {String}
 */
function getHandleColumn(ID,IsSuperUser,roleId,isSuper,WorkUnitID,workunitName,vehicleGroupId,VehicleGroupName,menuCnt){

	var rolePlatFormStr = "";
	var setAdminStr="";
	var roleStr = "";
	var editStr = "";
	var pwdStr = "";
	var deleteStr = "";
	var vehicleGroupStr = "";
	var roleStr="";
	var special="";
	var vehiclesStr="-1";
	if(resources!=null){
		
		if(isSuper=='-1'){
			if(resources.indexOf("|getWorkUnitVehicleLists|")!=-1){
				  vehicleGroupStr = '<a href="javascript:void(0)" title="查看车组"  onclick="toLookVehicleGroup(\''+ID+'\',\''+WorkUnitID+'\',\''+workunitName+'\',\''+vehicleGroupId+'\',\''+VehicleGroupName+'\')">查看车组</a>';
			}
			if(resources.indexOf("|findMenusByParent_new|")!=-1){
				  roleStr=  '<a href="javascript:void(0)" title="查看权限"  onclick="toLookRole(\''+ID+'\',\''+roleId+'\',\''+vehiclesStr+'\',\''+vehicleGroupId+'\')">查看权限</a>';
			}
		}
		
	    if(resources.indexOf("|editUser|")!=-1){
			  editStr = '<a href="javascript:void(0)" title="编辑"  onclick="doEdit(' + ID + ')">编辑</a>';
		}
		if(resources.indexOf("|passwordEdit|")!=-1){
			  pwdStr = '<a href="javascript:void(0)" title="重置密码"  onclick="updatePassword(' + ID + ')">重置密码</a>';
	    }
		if(resources.indexOf("|rollback|")!=-1){
			if(isSuper=='-1'){
				 deleteStr = '<a href="javascript:void(0)" title="删除"  onclick="deletecase(' + ID + ','+roleId+','+vehicleGroupId+')">删除</a>';
			}else{
				 deleteStr = '<a href="javascript:void(0)" title="删除"  onclick="deleteWorkUser(' + ID + ','+IsSuperUser+','+WorkUnitID+')">删除</a>';
			}
			 
		}
		
//		if(menuCnt!='0'){
//			if(resources.indexOf("|specialTree|")!=-1){
//				special= ' <a href="javascript:void(0)" title="个性化报表"  onclick="special('+ ID +')">个性报表</a>';
//            }
//	    }
//		var isroot = $("#isroot").val();
//		if(isroot=='true'){
//			if(resources.indexOf("|specialTree|")!=-1){
//				special= ' <a href="javascript:void(0)" title="个性化报表"  onclick="special('+ ID +')">个性报表</a>';
//            }
//	    }
		
	}
	return editStr + '&nbsp;&nbsp;' + pwdStr+ '&nbsp;&nbsp;' + deleteStr+ '&nbsp;&nbsp;'+special +"&nbsp;&nbsp;"+roleStr+'&nbsp;&nbsp;'+vehicleGroupStr;
	
}


/**
 * 用户查询
 */
function searchUsers()
{
	var name = $("#txtQueryUserName").val();
	
	//查询参数
	var params = 
	[{
		name : 'name',
		value : name
	}];
	
	reloadDate(params);
}


/**
 * 重新加载列表
 * @param params
 */
function reloadDate(params)
{
	if(params)
	{
		// 重置表格的某些参数
		$("#tbUsers").flexOptions({
					newp : 1,// 设置起始页
					params : params// 设置查询参数
				}).flexReload();// 重新加载
	}
	else
	{
		// 重置表格的某些参数
		$("#tbUsers").flexOptions({
					newp : 1// 设置起始页
				}).flexReload();// 重新加载
	}
	
}



/**
 * 解析状态
 * @param status
 * @returns {String}
 */
function paserStatus(status)
{
	if(status==0)
		return "正常";
	
	else if (status==1)
		return "失效";
	else
		return "未知";
}



/**
 * 解析用户类型
 * @param type
 * @returns {String}
 */
function paserUserType(type)
{
	if(type!=-1)
		return "企业管理员";
	else
		return "普通管理员";
	
}
/**
 * 删除
 */
function deletecase(id,roleId,vehicleGroupId){
	var str="确定删除该用户";
	if(confirm(str)){
		/*jsUtil.useAjax(
				"sys/user/deleteUser.action", 
				{"id":id,"isSuper":IsSuperUser!=-1?"1":"0","WorkUnitID":WorkUnitID},
				function(msg){
//					alert(msg);
					if(msg=="SUCCESS")
					{	$.messager.alert('提示信息','删除成功！','info');
						 reloadDate();
					}
				},
				"text",
				null,
				function(){
					$.messager.alert('提示信息','删除失败！','info');
				}
			);*/
		 $.ajax({
				type:"POST",
				url:"sys/userManage/rollback.action",
				data:{
			   	Id:id,
			   	"role.id":roleId,
			   	vehicleGroupId:vehicleGroupId
				},
				dataType:"JSON",
				success:function(data){
					$.messager.alert('提示信息','删除成功！','info');
					 reloadDate();
				},
				error:function(data){
					$.messager.alert('提示信息','删除失败！','info');
				}
			});
	}	
}

/**
 * 打开或者收缩面板
 */
function togglePannel(){
	    $("#txtName").val("");
	    $("#txtUserName").val("");
		$("#txtPassword").val("");
		$("#txtPasswordA").val("");
		//$("#txtRunTime").val("");
		$("#txtOverTime").val("");
		$("#workUnitId").val("");
		$("#workUnitIdPram").val("");
		
		$("#vehicleName").val("");
		$("#workunitName").val("");
		
		$("#delUserId").val("");
		$("#delRoleId").val("");
		$("#hroupId").val("");
		
		user.id="";
		user.groupId="";
		user.roleId="";
		user.workUnitId="";
		user.vehicleGroupId="";
		
	    show();
		$("#divAddUserPanel .errorMsg").closeMessage();
}



/**
 * 添加用户
 */
function addUser(){
	document.getElementById("tbUsers").style.display="none";
    var Status = $('input[name="aStatus"]:checked').val();
	var flag = $("#formAddUser").beforeSubmit();
	var flag2 = checkWorkUnitAdmin();
	if(flag2){		
		if(flag){
			jsUtil.useAjax(
					"sys/user/createUser.action?Status="+Status, 
					$("#formAddUser").serialize(),
					addUserSuccess,
					"text",
					null,
					addUserError
					
				);
			}
	}else{
		$.messager.alert('提示信息','该企业已经存在企业管理员，企业管理员是唯一的不可替换！','info');
		
//		if(confirm("该企业已经存在企业管理员,是否替换!")){
//			if(flag){
//				jsUtil.useAjax(
//						"sys/user/createUser.action?Status="+Status, 
//						$("#formAddUser").serialize(),
//						addUserSuccess,
//						"text",
//						null,
//						addUserError
//					);
//			}
//		}
	}
}

/**
 * 添加用户成功
 * @param data
 */
function addUserSuccess(data)
{
		if(data=="SUCCESS")
		{
			$("#formAddUser").get(0).reset();
			togglePanneladd();
			reloadDate();
		}
		else
		{
			$.messager.alert('提示信息','添加用户出错！','info');
		}
}

function togglePanneladd(){
	    $("#txtName").val("");
	    $("#txtUserName").val("");
		$("#txtPassword").val("");
		$("#txtPasswordA").val("");
		//$("#txtRunTime").val("");
		$("#txtOverTime").val("");
		$("#workUnitId").val("");
		$("#workUnitIdPram").val("");
		
		$("#vehicleName").val("");
		$("#workunitName").val("");
		
		$("#delUserId").val("");
		$("#delRoleId").val("");
		$("#hroupId").val("");
		
		user.id="";
 		user.groupId="";
 		user.roleId="";
 		user.workUnitId="";
 		user.vehicleGroupId="";
 		
	$("#divAddUserPanel .errorMsg").closeMessage();
	hide();
}

/**
 * 添加用户失败
 * @param err
 */
function addUserError(err)
{
	$.messager.alert('提示信息','添加用户出错！','info');
}




/**
 * 打开分配角色对话框
 * @param userId
 */
function  openRoleDlg(userId)
{
	$("#roleDlg select").each(function(i){
		$(this).empty();
	});
	
	$("#txtUID").val(userId);
	initRole();
	$("#roleDlg").css("display", "block");
	$("#roleDlg").dialog( {
		width : 450,
		height : 140,
		title : '分配角色'
	});
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

function updatePassword(id) {
	var password="888888";
	if (confirm("用户密码将会被重置为888888(6个8),确定要重置此用户的密码吗?")) {
	
		$.ajax({
		    type : "POST",
		    url : "sys/user/passwordEdit.action",
		    data : {id:id,password:password},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data){
		    		$.messager.alert('提示信息','密码重置成功！','info');
		    	}else{
		    		$.messager.alert('提示信息','密码重置失败！','info');
		    	}
		    },
		    error : function(data) {
		    	$.messager.alert('提示信息','密码重置失败！','info');
		    }
	    });
	}
}
/**
 * 查看车组
 * @return
 */
function toLookVehicleGroup(id,WorkUnitID,shortname,vehiclegroupid,VehicleGroupName){
//	alert(id+"WorkUnitID:"+WorkUnitID+"==shortname:"+shortname+"vehiclegroupid:"+vehiclegroupid);
	hide();
	showVehicle();
	doLookVehicleGroup(id,WorkUnitID,shortname,vehiclegroupid,VehicleGroupName);
	
}
var x_id=null;
var x_WorkUnitID=null;
var x_shortname=null;
var x_vehiclegroupid=null;
function doLookVehicleGroup(id,WorkUnitID,shortname,vehiclegroupid,VehicleGroupName){
//	alert("xxxxx");
	addVehicleTree1("selectVehicle1",true,id,WorkUnitID,shortname,vehiclegroupid,VehicleGroupName);
	x_id=id;
	x_WorkUnitID=WorkUnitID;
	x_shortname=shortname;
	x_vehiclegroupid=vehiclegroupid;
	$("#updateVehicleBtn").click(vehilceGroupNext);
}

function addVehicleTree1(TreeId,isAdd,id,WorkUnitID,shortname,vehiclegroupid,VehicleGroupName) {
//	alert(TreeId+"==="+isAdd+"==="+id+"-----"+WorkUnitID+"------"+shortname+"****"+vehiclegroupid+"^^^^^^"+VehicleGroupName);
	
	try{
		$("#updateVehicleName").val(VehicleGroupName);
		$("#addTheirCustomer").val(shortname);
		var workId = WorkUnitID;
		var groupId = vehiclegroupid;
		var id=-1;
		$("#"+TreeId).html('<img src="imgs/load.gif" />');
		$.ajax({
		    type : "POST",
		    url : "sys/userManage/getWorkUnitVehicleLists.action",
		    data : {nodeId:id,workId:workId,groupId:groupId,IsShow:"1"},
		    dataType : "JSON",
		    success : function(data) {
//		    	alert(data);
		    	$('#'+TreeId).tree({
		    		data:data,
		    		checkbox:true,
		    		animate : true,
		    		onlyLeafCheck:false   
		    	});
		    	setTimeout(function(){$('#'+TreeId).tree("expandAll", $('#'+TreeId).tree("getRoot",null).target);},1500);
		    	
		    }
		    
	    });
	}catch(e){}
}


/**
 * 新增、修改车辆
 * @return
 */
function vehilceGroupNext(){
//	alert($("#updateVehicleName").val()+"~~~~~");
	if($("#updateVehicleName").val()==null || $("#updateVehicleName").val()==""){
		$("#updateVehicleName").showMessage({
				type : "error",
				closeable : false, 
				text : "名称不能为空！"});
		    return;
	}
	//var str=getIdsForTree("selectVehicle1");
	var c="",p="";
    $(".tree-checkbox1").parent().children('.tree-title').each(function(){
      c+=$(this).parent().attr('node-id')+",";
    });
   $(".tree-checkbox2").parent().children('.tree-title').each(function(){
    	 p+=$(this).parent().attr('node-id')+",";
    });
   str=(c+p).substring(0,(c+p).length-1);
	$.ajax({
	type:"POST",
	url:"sys/userManage/updateVehicleGroups.action",
	data:{
		"vehicleGroupBean.id":x_vehiclegroupid,
		"vehicleGroupBean.parentGroupId":x_vehiclegroupid,
		"vehicleGroupBean.isLeaf":1,
		"vehicleGroupBean.level":2,
		"vehicleGroupBean.name":$("#updateVehicleName").val(),
		"vehicleGroupBean.workUnitId":x_WorkUnitID,
		"vehicleGroupBean.authorizedGroupId":0,
		"vehicleGroupBean.kind":4,
		"vehicleGroupBean.isSourceVisible":0,
		"vehicleGroupBean.privilegeFlag":0,
		"vehicles":str
	},
	dataType:"JSON",
	success:function(data){
		if(data){
//			showWarning("修改成功!");
			$("#tbUsers").flexReload();
			hideVehicle();
		}else{
			showWarning("修改失败!");
		}
	},
	error:function(data){
		showError();
	}
	
});
    
	
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
 * 车组展开
 */
function showVehicle(){
	$(".vehicleDiv").animate({height: 'show', opacity: 'show'}, 400);
	
}

/**
 * 车组收起
 */
function hideVehicle(){
	$(".vehicleDiv").animate({height: 'hide', opacity: 'hide'}, 400);
}



function initRole() {
	var unit = $("#slRoles").get(0);
	unit.options.add(new Option("请选择", "-1"));
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "sys/role/findAllRoles.action",
		success : function(data) {
			$(data).each(function(i, n) {
				unit.options.add(new Option(n.Name, n.ID));
			});
		},
		error : function(msg) {
			$.messager.alert('提示信息','因网络不畅,数据加载未完成,请刷新页面！','info');
		}
	});
}

function checkedSelectByValue(Value){
	$("#WorkUnitIDEdit option").each(function() {  
		if ($(this).val() == Value) {  
		$(this).attr("selected", "selected");  
			return false;
		}  
	});     
}
function checkWorkUnitAdmin(){
	var falg = false;
	var isSuper = $('input[name="IsSuperUser"]:checked').val();
	if(isSuper=='0' || isSuper==null){
		return true;
	}
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "sys/user/checkWorkUnitAdmin.action",
		async:false,
		data : {WorkUnitID:$("#workUnitId").val()},
		success : function(data) {
			if(data){
				falg = true;
			}else{
				falg = false;
			}
		},
		error : function(msg) {
			$.messager.alert('提示信息','因网络不畅,数据加载未完成,请刷新页面！','info');
		}
	});
	return falg;
}
function loadCommandTree(id,vehiclesStr,vehicleGroupId){
	$("#commandAuthTree").html('<img src="imgs/load.gif" />');
	$.ajax({
	    type : "POST",
	    url : "sys/role/findCommandMenu.action",
	    data : {roleId:id,vehiclesStr:vehiclesStr,vehicleGroupId:vehicleGroupId},
	    dataType : "JSON",
	    success : function(data) {
	    	$('#commandAuthTree').tree({
	    		data:data,
	    		checkbox:true,
	    		animate : true
	    	});
	    }
    });}
function  toLookRole(uid,id,vehiclesStr,vehicleGroupId){
	hide();
	document.getElementById("roles").style.display="block";
	user.roleId=id;
	user.id=uid;
	document.getElementById("roles").children[0].style.display="block";
	document.getElementById("roles").children[0].innerHTML="查看权限";
	var ele=document.getElementById("roles").children[1].rows;
	ele[0].cells[2].style.display="block";
	ele[0].cells[3].style.display="none";
	loadCommandTree(id,vehiclesStr,vehicleGroupId);
	$("#fnctionAuthTree").html('<img src="imgs/load.gif" />');
	$.ajax({
	    type : "POST",
	    url : "sys/role/findMenusByParent_new.action",
	    data : {roleId:id,userid:uid},
	    dataType : "JSON",
	    success : function(data) {
	    	$('#fnctionAuthTree').tree({
	    		data:data,
	    		checkbox:true,
	    		animate : true,
	    		onLoadSuccess:function(node,data){
	    		/*	if(!data) return;
	    			var ids="";
	    			var f=function (data){
	    				for(var i=0;i<data.length;i++){
		    				var ele=data[i];
		    				if(!ele.children.length){
		    					if(!ele.checked) continue;
		    					ids+=ele.id+",";
		    				}else{
		    					f(ele.children);
		    				}
		    			}
	    			}
	    			f(data);*/
	    			
	    		}
	    	});
	    	
	    }
    });
}
function doNode(){
/*    var str=getIdsForTree("fnctionAuthTree")+getIdsForTree("commandAuthTree");
    str=str.substring(0,str.length-1);*/
	var c="",p="";
    $(".tree-checkbox1").parent().children('.tree-title').each(function(){
      c+=$(this).parent().attr('node-id')+",";
    });
   $(".tree-checkbox2").parent().children('.tree-title').each(function(){
    	 p+=$(this).parent().attr('node-id')+",";
    });
   str=(c+p).substring(0,(c+p).length-1);
    $.ajax({
	    type : "POST",
	    url : "sys/userManage/saveRoleAuth.action",
	    data : {userid:user.id,roleType:1,roleId:user.roleId,auths:str,isCommand:0},
	    dataType : "JSON",
	    success : function(data) {
	    	document.getElementById("roles").style.display="none";
	    	$("#txtName").val("");
	 	    $("#txtUserName").val("");
	 		$("#txtPassword").val("");
	 		$("#txtPasswordA").val("");
	 		//$("#txtRunTime").val("");
	 		$("#txtOverTime").val("");
	 		$("#workUnitId").val("");
	 		$("#workUnitIdPram").val("");
	 		
	 		$("#vehicleName").val("");
	 		$("#workunitName").val("");
	 		
	 		$("#delUserId").val("");
	 		$("#delRoleId").val("");
	 		$("#hroupId").val("");
	 		
	 		user.id="";
	 		user.groupId="";
	 		user.roleId="";
	 		user.workUnitId="";
	 		user.vehicleGroupId="";
	    },
	    error : function(data) {
	    }
    });
}
	var user={id:"",baseInfo:{txtName:"",txtUserName:"",txtPassword:"",txtRunTime:"",txtOverTime:""}
			,name:"",roleId:"",workUnitId:"",workUnitName:"",groupId:"",groupName:"",vehicleGroupId:""};
	var currentStep=-1;
	function  next(i){
		
		//if(i==currentStep) return;
		if(i==1){
				addUser();	
		}
		else if(i==0){
			document.getElementById("divAddUserPanel").style.display="block";
			document.getElementById("vechileGroup").style.display="none";
			document.getElementById("roles").style.display="none";
		}
		else if(i==2){
//			if(currentStep>i){
//				var ele=document.getElementById("roles").children[1].rows;
//				document.getElementById("roles").children[0].style.display="block";
//				ele[0].cells[2].style.display="none";
//				ele[0].cells[3].style.display="block";
//				document.getElementById("roles").style.display="block";
//				document.getElementById("divAddUserPanel").style.display="none";
//				document.getElementById("vechileGroup").style.display="none";
//			}else{
				vehilceGroupNext_new();
		//	}
			
		}else if(i==3){
			doNode();
			searchUsers();
			document.getElementById("tbUsers").style.display="block";
			document.getElementById("roles").style.display="none";
			document.getElementById("divAddUserPanel").style.display="none";
			document.getElementById("vechileGroup").style.display="none";
		}
		else if(i==4){
			document.getElementById("divAddUserPanel").style.display="none";
			document.getElementById("vechileGroup").style.display="block";
			document.getElementById("roles").style.display="none";
			addVehicleTree("selectVehicle",true,user.workUnitName);
		}
	}
   function addUser(){
	   if(!$("#formAddUser").beforeSubmit()) return;
		var jsonParams = {
		userId : user.id,
		name :  $("#txtName").val(),
		userName : $("#txtUserName").val(),
		password : $("#txtPassword").val(),
		runTime : $("#txtRunTime").val(),
		overTime : $("#txtOverTime").val(),
		workUnitId : $("#workUnitId").val(),
		roleId : user.roleId==''?0:user.roleId,
		datetimes : new Date()};
		$.post("sys/userManage/createUser.action", jsonParams, function(data) {
			if(data!='false' ){
				user.baseInfo.txtName=$("#txtName").val();
				user.baseInfo.txtPassword= $("#txtPassword").val();
				user.baseInfo.txtRunTime=$("#txtOverTime").val();
				user.baseInfo.txtOverTime=$("#txtOverTime").val();
				user.baseInfo.txtUserName=$("#txtUserName").val();
				
				var arry=data.split("@"); //字符分割      
				user.id=arry[0];
				user.workUnitId=$("#workUnitId").val();
				user.groupId=arry[1];
				user.roleId=arry[2];
				user.workUnitName=$("#workUnitIdPram").val();
				user.groupName=arry[3];
				
				$("#delUserId").val(arry[0]);
				$("#delRoleId").val(arry[2]);
				
				
				
				document.getElementById("divAddUserPanel").style.display="none";
				document.getElementById("vechileGroup").style.display="block";
				document.getElementById("roles").style.display="none";
				addVehicleTree("selectVehicle",true,user.workUnitName);
			}
		});
   }
   function addVehicleTree(TreeId,isAdd,groupName) {
		try{
		//	$("#vehicleName").val(user.baseInfo.txtUserName+"车组");
			
			var txtUserName=$("#txtUserName").val()+"车组";
			var workId=$("#workUnitId").val();
			var workunitName=$("#workUnitIdPram").val();
			var hroupId=$("#hroupId").val();
			$("#vehicleName").val(txtUserName);
			$("#"+TreeId).html('<img src="imgs/load.gif" />');
			$("#workunitName").val(workunitName);
			
			//车组权限
			$("#"+TreeId).html('<img src="imgs/load.gif" />');
			$("#workunitName").val(user.workUnitName);
			$.ajax({
			    type : "POST",
			    url : "sys/userManage/getWorkUnitVehicleLists.action",
			    data : {nodeId:-1,workId:workId,groupId:hroupId,IsShow:"0",datetimes:new Date()},
			    dataType : "JSON",
			    success : function(data) {
			    	$('#'+TreeId).tree({
			    		data:data,
			    		checkbox:true,
			    		animate : true,
			    		onlyLeafCheck:false   
			    	});
			    	setTimeout(function(){$('#'+TreeId).tree("expandAll", $('#'+TreeId).tree("getRoot",null).target);},1500);
			    }
		    });
			
		}catch(e){}
	}
   
   function vehilceGroupNext_new(){
		if($("#vehicleName").val()==null || $("#vehicleName").val()==""){
			$("#vehicleNamespan").showMessage({
					type : "error",
					closeable : false, 
					text : "车组名称不能为空！"});
			    return;
		}
		var c="",p="";
	    $(".tree-checkbox1").parent().children('.tree-title').each(function(){
	      c+=$(this).parent().attr('node-id')+",";
	    });
	   $(".tree-checkbox2").parent().children('.tree-title').each(function(){
	    	 p+=$(this).parent().attr('node-id')+",";
	    });
	   str=(c+p).substring(0,(c+p).length-1);
	   // str=str.substring(0,str.length-1);
		$.ajax({
		type:"POST",
		url:"sys/userManage/createVehicleGroup.action",
		data:{
			"vehicleGroupBean.fullId":null,
			"vehicleGroupBean.parentGroupId":user.groupId,
			"vehicleGroupBean.isLeaf":1,
			"vehicleGroupBean.level":2,
			"vehicleGroupBean.name":$("#vehicleName").val(),
			"vehicleGroupBean.workUnitId":user.workUnitId,
			"vehicleGroupBean.authorizedGroupId":0,
			"vehicleGroupBean.kind":4,
			"vehicleGroupBean.isSourceVisible":0,
			"vehicleGroupBean.privilegeFlag":0,
			vehicles:str,
			roleId:user.roleId,
			vehicleGroupId:user.vehicleGroupId
		},
		dataType:"JSON",
		success:function(data){
			if(data!='false'){
				user.vehicleGroupId=data;
				document.getElementById("roles").style.display="block";
				document.getElementById("divAddUserPanel").style.display="none";
				document.getElementById("vechileGroup").style.display="none";
				var vehiclesStr=str;
				//alert("vehiclesStr:"+vehiclesStr);
				toLookRole(user.id ,user.roleId,vehiclesStr,"-1");
				var ele=document.getElementById("roles").children[1].rows;
				document.getElementById("roles").children[0].style.display="block";
				document.getElementById("roles").children[0].innerHTML="第三步：分配权限";
				ele[0].cells[2].style.display="none";
				ele[0].cells[3].style.display="block";
			}
		},
		error:function(data){
			
		}
		
	});
	}
   function  rollBack(){
//	    $("#txtName").val("");
//	    $("#txtUserName").val("");
//		$("#txtPassword").val("");
//		$("#txtPasswordA").val("");
//		//$("#txtRunTime").val("");
//		$("#txtOverTime").val("");
//		$("#workUnitId").val("");
//		$("#workUnitIdPram").val("");
//		
//		$("#vehicleName").val("");
//		$("#workunitName").val("");
//		
//		$("#delUserId").val("");
//		$("#delRoleId").val("");
//		$("#hroupId").val("");
//		
//		user.id="";
//		user.groupId="";
//		user.roleId="";
//		user.workUnitId="";
//		user.vehicleGroupId="";
		
		var userId=$("#delUserId").val();
		var roleId=$("#delRoleId").val();
		
	   $.ajax({
			type:"POST",
			url:"sys/userManage/rollback.action",
			data:{
		    userId:userId,
		    roleId:roleId,
		   	Id:user.id,
		   	"role.id":user.roleId,
		   	vehicleGroupId:user.vehicleGroupId
			},
			dataType:"JSON",
			success:function(data){
			},
			error:function(data){
			}
		});
   }
   var userid="";
	function setSpecial(){
		if(userid=="") return;
		var c="",p="";
	    $(".tree-checkbox1").parent().children('.tree-title').each(function(){
	      c+=$(this).parent().attr('node-id')+",";
	    });
	   $(".tree-checkbox2").parent().children('.tree-title').each(function(){
	    	 p+=$(this).parent().attr('node-id')+",";
	    });
	   str=(c+p).substring(0,(c+p).length-1);
	   $.ajax({
			type : "POST",
			dataType : "json",
			url : "sys/user/specialSave.action",
			async:false,
			data : {id:userid,
		   			menu:str},
			success : function(data) {
		   			document.getElementById('special').style.display='none';
			},
			error : function(msg) {
				$.messager.alert('提示信息','因网络不畅,数据加载未完成,请刷新页面！','info');
			}
		});
	}
	function special(id){
		hide();
		userid=id;
		$("#special").show();
		$.ajax({
			type : "POST",
			dataType : "json",
			url : "sys/user/specialTree.action",
			async:false,
			data : {userid:userid},
			success : function(data) {
				if(data.length==0){
					userid="";
					document.getElementById("specialTree").innerHTML="您没有个性报表";
				    return;
				}
				$('#specialTree').tree({
		    		data:data,
		    		checkbox:true,
		    		animate : true,
		    		onLoadSuccess:function(node,data){
		    		}
		    	});
			},
			error : function(msg) {
				$.messager.alert('提示信息','因网络不畅,数据加载未完成,请刷新页面！','info');
			}
		});
	
	}

   function getIdsForTree(treeid){
	   var str="";
	   for(var i=0;i<$("#"+treeid).tree("getRoots").length;i++){
	    	var rootNode=$("#"+treeid).tree("getRoots")[i];
	    	if($("#"+treeid).tree("getChildren",rootNode.target).length==0) {
	    		str+=rootNode.id+"," ;continue;};
	    	for(var j=0;j<$("#"+treeid).tree("getChildren",rootNode.target).length;j++){
	    		var childNode=$("#"+treeid).tree("getChildren",rootNode.target)[j];
	    		if($("#"+treeid).tree("isLeaf",childNode.target)&&childNode.checked){
	    			str+=childNode.id+",";
	    		}else continue;
	    	}
	   }
	   return str;
   }
   
   
   
   function showUserDiv(){
	   $("#userDiv").show();
	   $("#workDiv").hide();
	   $("#addUDiv").html("第一步：新建普通管理员");
   }
   
   function showWorkDiv(){
	  $("#workDiv").show();
	  $("#userDiv").hide();
	  $("#addUDiv").html("新建企业管理员");
   }
   
   function addWorkUser(){
	  var name=$("#txtName").val();
	  var userName=$("#txtUserName").val();
	  var password=$("#txtPassword").val();
	  var runTime=$("#txtRunTime").val();
	  var overTime=$("#txtOverTime").val();
	  var workUnitId=$("#workUnitId").val();
	  //判断是否存在企业管理员
	  var flag=checkWorkUnitAdmin(workUnitId);
	  //验证
	  var flag2 = $("#formAddUser").beforeSubmit();
	  if(flag){
		  if(flag2){
			  var jsonParams = {
						name : name,
						userName : userName,
						password : password,
						runTime : runTime,
						overTime : overTime,
						workUnitId : workUnitId,
						datetimes : new Date()
				};
			  
			  $.post("sys/userManage/createWorkUser.action", jsonParams, function(data) {
					if(data!='false' ){
						togglePanneladd();
			    		$("#tbUsers").flexReload();
					}
				});
		  }
	  }else{
		  $.messager.alert('提示信息','该企业已经存在企业管理员，企业管理员是唯一的不可替换！','info');
	  }
	
	   
   }
   
   //判断是否存在企业管理员
   function checkWorkUnitAdmin(workUnitId){
		var falg = false;
		var isSuper = $('input[name="IsSuperUser"]:checked').val();
		if(isSuper=='0' || isSuper==null){
			return true;
		}
		$.ajax({
			type : "POST",
			dataType : "json",
			url : "sys/user/checkWorkUnitAdmin.action",
			async:false,
			data : {WorkUnitID:workUnitId},
			success : function(data) {
				if(data){
					falg = true;
				}else{
					falg = false;
				}
			},
			error : function(msg) {
				$.messager.alert('提示信息','因网络不畅,数据加载未完成,请刷新页面！','info');
			}
		});
		return falg;
	}
   
   //删除企业管理员
   function deleteWorkUser(id,IsSuperUser,WorkUnitID){
		var str="确定删除该用户";
		if(IsSuperUser!=-1)str="该用户是企业管理员,确定删除？";	
		if(confirm(str)){
			jsUtil.useAjax(
					"sys/user/deleteUser.action", 
					{"id":id,"isSuper":IsSuperUser!=-1?"1":"0","WorkUnitID":WorkUnitID},
					function(msg){
						if(msg=="SUCCESS")
						{	$.messager.alert('提示信息','删除成功！','info');
						 $("#tbUsers").flexReload();
						}
					},
					"text",
					null,
					function(){
						$.messager.alert('提示信息','删除失败！','info');
					}
				);
		}	
	}