$(function() {
	initTerminalKind();
})

var allCarList = new Array();
var firstKindID;
var firstKind;

/**
 * 获取当前选中的车辆列表
 * 
 * @returns {Array}
 */
function getSelectedCarList(){
	return allCarList;
}

/**
 * 刷新树
 */
function changeTree(select){
	var idStr= $(select).val().split("|");
	initTree(idStr[0],idStr[1]);
}

/**
 * 去车辆复选框的沟
 * 订阅数据删除、取消复选框的时候触发
 * 
 * @param commno 车辆ID
 */
function deleteCheckBox(commno) {
	try {
		var index =allCarList.indexOf(commno);
		if (index > -1) {
			allCarList.splice(index, 1);			
		}
	} catch (e) {}
}

/**
 * 初始化终端类型
 */
function initTerminalKind(){
	$.ajax({
	    type : "POST",
	    url : "monitorCenter/getTerminalKind.action",
	    dataType : "JSON",
	    success : function(data) {
	    	if(data!='false'){
	    		var html="";
	    		for(var i=0;i<data.length;i++){
	    			if(i==0){
	    				firstKindID=data[i].ID;;
	    				firstKind = data[i].Kind;
	    			}
	    			html+="<option value='"+data[i].ID+"|"+data[i].Kind+"'>"+data[i].Name+"</option>";
	    		}
	    		$("#terminalKind").html(html);
	    		initTree(firstKindID,firstKind);
	    	}	    	 
	    }
    });
}
function initTree(terminalKind,firstKind){
	parent.mapFrame.load(terminalKind);
	parent.mapFrame.loadBu(firstKind);
	var url = "monitorCenter/getTreeVehicleOne.action?times=123&terminalKindID="+terminalKind+"&kind="+firstKind;
	$('#carTreeList').tree({
		url : encodeURI(encodeURI(url)),
		checkbox : true, // 复选框
		onlyLeafCheck:true,
		onCheck:function(node,e){				
			var nId = node.id.split("|");
			var vehicleId = nId[1];
			if(nId[2]=='b'){
				if(node.checked){
					allCarList.push(nId[1]);
				}else{
					deleteCheckBox(nId[1]);
				}
			}
		}
	});
}