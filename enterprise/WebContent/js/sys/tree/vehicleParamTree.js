
$(function(){
 	
	var url="sys/tree/getVehicleTreeList.action";
	initTree(url);
	
});

function initTree(url) {
	$.ajax({
		url :url,
		type:"post",
		dataType:"text",
		success:function(result){
			if(result!=null && result.length>0){
				var objs=eval(result);
				
				
			    var str2="<div style='background-color:write;'><tr><td>车牌号码：" +
			    		"<input style='width: 120;' id='registrationNo' name='registrationNo' " +
			    		"onkeyup=\"doAutoComplete('registrationNo','name_table','popup','name_table_body')\">" +
			    		" <a id='searchBtn' href='javascript:void(0)' class='common_btn' onclick='toSearch()'>查询</a>" +
			    		"<input type='checkbox'  value='on' id='CheckAll'  onclick='CheckAll()'>全选" +
			    		"</td></tr></div>";
			
			    var str="<div style='background-color:write;WIDTH: 365; HEIGHT: 280;overflow-x: hidden; OVERFLOW: scroll;'>";
			    for(var i=0;i<objs.length;i++){
		    		str+="<div><tr><td>&nbsp;<input type='checkbox'  name='id' id='id' onclick='onClickItem()' "+vaildCheck(objs[i])
		    			+" value='"+objs[i]["id"]+"|"+objs[i]["text"]+"'/>"+objs[i]["text"]+"</td></tr></div>";
			    }
			    str+="</div>";
			    
			    str1="<div style='background-color:write'><tr><td align='center'><a id='submitBtn' href='javascript:void(0)' class='common_btn' onclick='functionAssign()'>提交</a>&nbsp;&nbsp;&nbsp;"
				      +"<a id='cancelBtn' href='javascript:void(0)' class='common_btn' onclick='closeds();'>取消</a></td></tr></div>";
				
			    $("#vehicleDiv").append(str2);
			    $("#vehicleTree").append(str);
			    $("#vehicleBtn").append(str1);
				onClickItem();
			}
		}
		
	});
}

/**
 * 全选，反选
 * @param value
 * @param obj
 * @return
 */
function CheckAll(){
	// 全选
	$("#CheckAll").bind().click(function() {
		var flag = $("#CheckAll").attr("checked");
		if(flag){
			$("[name=id]:checkbox").each(function() {
				$(this).attr("checked", true);
			});
		}else{
			$("[name=id]:checkbox").each(function() {
				$(this).attr("checked",false);
			});
		}
		onClickItem();
	});
}

function vaildCheck(obj){
	if(obj.checked){
		return "checked";
	}
}

function getAllCheckBox(){
//	var ids="";
//	$(":checked:not(:checkbox[name='allChk'])").each(function(){
//		 ids+=$(this).text()+",";
//	 });
//	return ids;
	
	//车辆id组合以,隔开
	var vehicleStr = '';
	$("[name=id]:checkbox").each(function() {
		
		if ($(this).attr("checked") == "checked") {
			
//			vehicleStr += $(this).attr("value") + ",";
			vehicleStr += $(this).attr("value") + ",";
		}
	});
//	alert("vstr:"+vehicleStr);
	return vehicleStr;
	
}

/**
 * 按车牌号码查询
 * @return
 */
function toSearch(){
	
	var registrationNo= $("#registrationNo").val();
	$("#vehicleTree").children().remove();
	$("#vehicleDiv").children().remove();
	$("#vehicleBtn").children().remove();
	var url="sys/tree/getVehicleTreeList.action?registrationNo="+registrationNo;
	initTree(url);	
}

function onClickItem(){
	var obj = $(":checkbox[name='id']");
	var selObj = $(":checkbox[name='id']:checked");
	
	$("#allChk").attr("checked",obj.length==selObj.length);
}

//提交

function functionAssign() {
	
	
	var vehicleIds=null;
	var registrationNos=null;
	var str=null;
	
	var selObj = $(":checkbox[name='id']:checked");
	var ids = getAllCheckBox();
	if(ids.length>0){
		var str1=ids.substr(0, ids.length-1); 
		
		// 接收父窗口传过的 window对象.
		var parWin= window.dialogArguments;
		var strs=str1.split(","); //字符分割     
		
		for(var i=0;i<strs.length;i++){
		    str+=strs[i]+"|";
		}
		var str2 = str.substr(0,str.length-1);
		var str3 = str2.substr(4,str2.length);
		var strs1 = str3.split("|");
		
		for(var j=0;j<strs1.length;j++){
			if(j%2==0){
				vehicleIds+=strs1[j]+",";
			}else{
				registrationNos+=strs1[j]+",";
			}
			
		
		}
		
		var vehicleIds=vehicleIds.substr(0,vehicleIds.length-1);
		var vehicleIds=vehicleIds.substr(4,vehicleIds.length);
		
		var registrationNos=registrationNos.substr(0,registrationNos.length-1);
		var registrationNos=registrationNos.substr(4,registrationNos.length);
		
//		alert("--:"+ids);
		 window.parent.document.getElementById("vehicleIds").value =vehicleIds;
		 window.parent.document.getElementById(vehicleFlag).value =registrationNos;
		 window.parent.closeDialog();
	}else{
		alert("请选择一个车牌号码");
	}
	
	
	
}
function closeds(){
	 window.parent.closeDialog();
}

