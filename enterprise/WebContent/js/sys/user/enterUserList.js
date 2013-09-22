

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
	
	
	$('#editBtn').bind('click', toEdit);
	
	$("#editFrom").validation();
	$("#formAddUser").validation();
		
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

var workUnitID2;//编辑企业用户判断没有选择所属企业当时的workUnitID

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
				$("#IsSuperInput").val(data.IsSuperUser);
				$("input[name='aStatus1'][value="+data.Status+"]").attr("checked",true);
				$("#txtUpdateRunTime").val(data.RunTime);
				$("#txtUpdateOverTime").val(data.OverTime);
				$("#txtUpdateUserId").val(id);
				$('#btnUpdateUser').bind('click', doUpdate);
				workUnitID=data.workUnitId;
				IsSuperUsers=data.IsSuperUser;
				$("#workUnitID1").val(data.workUnitId);
    			$("#workUnitIDName").val(data.workunitName);
    			workUnitID2=data.workUnitId;
			}
			,function(data) {
		    	showError();
		    }
		);

}

function doUpdate(){
	
	var flag = $("#editFrom").beforeSubmit();
	if(flag){
		var workUnitId =$("#workUnitID1").val();
		var flag2 = checkWorkUnitAdmin1(workUnitId);
		if(flag2){
			var id = $("#txtUpdateUserId").val();
			var name = $("#txtUpdateName").val();
			var username = $("#txtUpdateUserName").val();
			var RunTime = $("#txtUpdateRunTime").val();
			var OverTime = $("#txtUpdateOverTime").val();
			var workUnitId =$("#workUnitID1").val();
			$.ajax({
			    type : "POST",
			    url : "sys/user/editEnterUser.action",
			    data : {id:id,name:name,username:username,RunTime:RunTime,OverTime:OverTime,workUnitId:workUnitId,workUnitID2:workUnitID2},
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
		
		}else{
			$.messager.alert('提示信息','该企业已经存在企业管理员，企业管理员是唯一的不可替换！','info');
		}
	}
	
}



/**
 * 用户查询
 */
function findUsers()
{
	$("#tbUsers").flexigrid( {
		url : 'sys/user/findEnterUsers.action',
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
		height : getBaseHeight()-20//表格高度
	});	
}

/**
 * 组装操作列显示内容
 * @param id
 * @returns {String}
 */
function getHandleColumn(ID,IsAdmin,IsSuperUser,WorkUnitID){
	var editStr = "";
	var pwdStr = "";
	var deleteStr = "";
	var special="";
	if(resources!=null){
		 if(resources.indexOf("|editEnterUser|")!=-1){
			    editStr = '<a href="javascript:void(0)" title="编辑"  onclick="doEdit(' + ID + ')">编辑</a>';
			 }
		 if(resources.indexOf("|passwordEdit|")!=-1){
			 pwdStr = '<a href="javascript:void(0)" title="重置密码"  onclick="updatePassword(' + ID + ')">重置密码</a>';
			 }
		 if(resources.indexOf("|deleteUser|")!=-1){
			  deleteStr = '<a href="javascript:void(0)" title="删除"  onclick="deletecase(' + ID + ','+IsSuperUser+','+WorkUnitID+')">删除</a>';
		}
		 special= ' <a href="javascript:void(0)" title="个性化报表"  onclick="special('+ ID +')">个性化报表</a>';
	}
	return  special+'&nbsp;&nbsp;'+ editStr + '&nbsp;&nbsp;' + pwdStr+ '&nbsp;&nbsp;' + deleteStr;
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
	var flag = $("#formAddUser").beforeSubmit();
	var workUnitId =$("#workUnitId").val();
//	alert("workUnitId:"+workUnitId);
	var flag2 = checkWorkUnitAdmin1(workUnitId);
	if(flag2){		
		if(flag){
			jsUtil.useAjax(
					"sys/user/createEnterUser.action", 
					$("#formAddUser").serialize(),
					addUserSuccess,
					"text",
					null,
					addUserError
					
				);
			}
	}else{
		$.messager.alert('提示信息','该企业已经存在企业管理员，企业管理员是唯一的不可替换！','info');
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
		data : {WorkUnitID:$("#WorkUnitID").val()},
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

/**
 * 修改的时候验证该企业是否存在企业管理员
 */
function checkWorkUnitAdmin1(workUnitId){
	var falg = false;
//	alert(workUnitID2+"=="+workUnitId);
	if(workUnitID2==workUnitId){
		falg= true;
	}else{
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
	}
	
	return falg;
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
					document.getElementById("specialTree").innerHTML="您没有个性报表"
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
