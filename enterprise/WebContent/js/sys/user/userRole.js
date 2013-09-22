$.ajaxSetup( {
	cache : false
});
var userRole = {
		roleArray : new Array(),
		userId:null,
		/**
		 * 打开角色分配对话框
		 */
		openRoleListDialog:function(userId){
			this.userId = userId;
			roleArray = new Array();
			$.ajax({
			    type : "POST",
			    async: false,
			    cache:"false",
			    url : "sys/user/getRoles.action?time="+new Date().getTime(),
			    data : {id:userId},
			    dataType : "JSON",
			    success : function(data) {
			    	$("#roleList").html("");			    	
			    	if(data!=null && data.data.length==0){
			    		$("#roleList").html("<tr><td align=center style='font:13px'>没有可选角色</td></tr>");
			    	}
			    	if(data!=null && data.data!=null && data.data.length>0){			    		
			    		var ndata = data.data;
			    		var str="";
			    		for(var i=0;i<ndata.length;i++){
			    			appendStr="";
			    			if(ndata[i].roleHas!=null){
			    				appendStr="checked='true'";
			    				
			    			}
			    			 str += "<tr>";
			    			 str += "<td align=center style='font:13px'><input type='checkbox' value='"+ndata[i].ID+"' name='roleId'id='roleId' "+appendStr+"/></td>";
			    			 str += "<td align='left' style='font:13px' align='left' class='ndcol2'>" + ndata[i].Name + "</td>";
			    			 str += "</tr>";
			    		}
						$("#roleList").html(str);
			    	}
			    	$("#roleDlg").css("display", "block");
					$("#roleDlg").dialog({
			                title : '角色选择',
			                width : 280,
			                height : 350,
			                bgiframe : true,
			                modal : true,
					        buttons : [ {
								text : '确定',
								iconCls : 'icon-ok',
								handler : function() {
									userRole.assignRole();
								}
					        	}, {
								text : '取消',
								handler : function() {
									$('#roleDlg').dialog('close');
								}
					        	} ]
			            });
			    },
			    error : function(data) {
			    	$.messager.alert('提示信息!','网络繁忙');
			    }
		    });
			
			
		},
		/**
		 * 分配角色
		 */
		assignRole:function(RoleList){
			var noList = "";
			var roleList = document.getElementsByName("roleId");
			for(var i=0;i<roleList.length;i++){
				if(roleList[i].checked){
					noList += roleList[i].value + "|";
				}
			}    
			$.ajax({
				type:"POST",
				url:"sys/user/assignRole.action",
				data:{"roleId":noList,"userId":this.userId},
				dataType:"JSON",
				success:function(){
					$('#roleDlg').dialog('close');
					$.messager.alert('提示信息!','分配角色成功');
				}
			});
		}
};