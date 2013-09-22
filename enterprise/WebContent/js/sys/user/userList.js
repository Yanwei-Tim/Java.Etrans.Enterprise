

$(function(){
	
	findUsers();
	
	/**
	 * 查询
	 */
	$("#btnSearch").click(searchUsers);
	
	$("#btnAddUserPanel").click(togglePannel);
	$('#btnAddUserCancle').bind('click', togglePanneladd);
	
	/**
	 * 添加用户
	 */
	$("#btnAddUser").click(addUser);
	
	/**
	 * 取消更新
	 */
	$("#btnUpdateUserCancle").click(function(){jsUtil.showOrClosePanel("divUpdateUserPanel");});
	
	/**
	 * 编辑
	 */
	//$("#btnUpdateUser").click(doEdit);
	
	$('#editBtn').bind('click', toEdit);
	
	$("#editFrom").validation();
	$("#formAddUser").validation();
	
	$("#roleTab").validation();

	
	/**
	 * 更新角色
	 */
	$("#btnUpdateRole").click(function(){
		
		
		var userId = $("#txtUID").val();
		var roleId = $("#slRoles").val();
		
		var flag = $("#roleTab").beforeSubmit();
		if(flag){
		$.ajax({
				url:"sys/user/assignRole.action", 
				type:"POST",
				data:{"userId":userId,"roleId":roleId},
				dataType:"TEXT",
				success:function(data)
				{
					if(data=="SUCCESS")
					{
						 reloadDate();
						 $("#roleDlg").dialog("close");
						 
					}
					else
					{
						$.messager.alert('提示信息','分配角色失败！','info');
					}
				},
				error:function(){$.messager.alert('提示信息','分配角色失败！','info');}
				});
		}
	});
	
	
		
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
	hide();
	showEdit();
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
	
	var flag = $("#editFrom").beforeSubmit();
	if(flag){
		var id = $("#txtUpdateUserId").val();
		var name = $("#txtUpdateName").val();
		var username = $("#txtUpdateUserName").val();
//		 var isSuperUser;
//		if($("input[name=IsSuperUser1]:checked").val()!=null && $("input[name=IsSuperUser1]:checked").val()!=""){
//		    isSuperUser = $("input[name=IsSuperUser1]:checked").val();
//		    alert(isSuperUser);
//		}else{
//		    isSuperUser=IsSuperUsers;
//		}
		var isSuperUser = $("#IsSuperInput").val();
		//alert(isSuperUser);
		var Status = $('input[name="aStatus1"]:checked').val();
		
		var RunTime = $("#txtUpdateRunTime").val();
		var OverTime = $("#txtUpdateOverTime").val();
		var workUnitId =$("#workUnitID1").val();
//		if ($("#WorkUnitIDEdit").val()!=null && $("#WorkUnitIDEdit").val()!=""){
//			 workUnitId =$("#WorkUnitIDEdit").val();
//		}else{
//			 workUnitId = workUnitID;
//		}
//		var workUnitId =$("#WorkUnitIDEdit").val();
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
		url : 'sys/user/findUsers.action',
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
			name:"shortname",
			width : 100,
			sortable : false,
			align : 'center'
		}, 
		{
			display : '用户状态',
			name:"Status",
			paramcolnames : ['Status'],
			handlefunction : 'paserStatus',
			width : 100,
			sortable : false,
			align : 'center'
		}, 
		{
			display : '用户类型',
			name : 'IsSuperUser',
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
			paramcolnames : ['ID','IsSuperUser','isSuper','WorkUnitID'],
			width : 300,
			sortable : false,//操作列不能排序
			align : 'center'
		}/*,{
			display : '操作',
			ishref : true,//是否为操作列
			linkname : 'ID',//参数列
			//操作列显示内容,其中{linkname_value}为参数列的值
			hrefsrc : "<a href='javascript:void(0)' onclick='openRoleDlg({linkname_value})'>分配角色</a>&nbsp;&nbsp;<a href='javascript:void(0)' onclick='deletecase({linkname_value})'>删除</a>",
			name : 'Handler',
			width : 130,
			sortable : false,//操作列不能排序
			align : 'center'
		}*/ ],
		
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
		height : getBaseHeight()//表格高度
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
function getHandleColumn(ID,IsAdmin,IsSuperUser,WorkUnitID){
	var rolePlatFormStr = "";
	var setAdminStr="";
	var roleStr = "";
	var editStr = "";
	var pwdStr = "";
	var deleteStr = "";
	if(resources!=null){
		if(resources.indexOf("|setAdmin")!=-1){
			  roleStr = '<a href="javascript:void(0)" title="分配角色"  onclick="userRole.openRoleListDialog(' + ID + ')">分配角色</a>';
		}
//		if(isBsRoot){
//			if(IsSuperUser!=-1){
//				setAdminStr = '<a href="javascript:void(0)" title="设为普通管理员" onclick="setAdmin(' + ID + ','+0+','+WorkUnitID+')">设为普通管理员</a>';
//			}else{
//				setAdminStr = '<a href="javascript:void(0)" title="设为企业管理员" onclick="setAdmin(' + ID + ','+1+','+WorkUnitID+')">设为企业管理员</a>';
//			}			
//		}
		 if(resources.indexOf("|editUser|")!=-1){
			    editStr = '<a href="javascript:void(0)" title="编辑"  onclick="doEdit(' + ID + ')">编辑</a>';
			 }
		 if(resources.indexOf("|editUser|")!=-1){
			 pwdStr = '<a href="javascript:void(0)" title="重置密码"  onclick="updatePassword(' + ID + ')">重置密码</a>';
			 }
		 if(resources.indexOf("|deleteUser|")!=-1){
			  deleteStr = '<a href="javascript:void(0)" title="删除"  onclick="deletecase(' + ID + ','+IsSuperUser+','+WorkUnitID+')">删除</a>';
		}
	}
	return roleStr + '&nbsp;&nbsp;' +setAdminStr+'&nbsp;&nbsp;'+ rolePlatFormStr + '&nbsp;&nbsp;' +  editStr + '&nbsp;&nbsp;' + pwdStr+ '&nbsp;&nbsp;' + deleteStr;
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
function deletecase(id,IsSuperUser,WorkUnitID){
	var str="确定删除该用户";
	if(IsSuperUser!=-1)str="该用户是企业管理员,确定删除？";	
	if(confirm(str)){
		jsUtil.useAjax(
				"sys/user/deleteUser.action", 
				{"id":id,"isSuper":IsSuperUser!=-1?"1":"0","WorkUnitID":WorkUnitID},
				function(msg){
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
			);
	}	
}

/**
 * 打开或者收缩面板
 */
function togglePannel(){
	show();
}



/**
 * 添加用户
 */
function addUser(){
	togglePannel();
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

