var CONST = {}; // 常量对象
CONST.ROOT_NODE_ID = 1; // 默认根节点ID
var parentNodeId = CONST.ROOT_NODE_ID; // 父节点(功能)ID

$(function(){
	initTree();
	$("#submitBtn").click(toSearch);
});
var workUnitId2=null;
function initTree() {
	
	// 终端
	 var workUnitId=window.parent.document.getElementById("workUnitID1").value;
	 workUnitId2=workUnitId;
		$('#simTree').tree({
			url : "sys/tree/getSimTree.action?workUnitId="+workUnitId,
			animate : true,
			onClick : function(node) {
			  var ids=node.id;
			  var strs=ids.split("|"); //字符分割      
			  window.parent.document.getElementById("SimID").value =strs[0];
		      window.parent.document.getElementById("simName").value =node.text;
		      var oInput = window.parent.document.getElementById("simName");
		      oInput.focus();//验证时获取到鼠标焦点
		      window.parent.closeDialog();
			}
		});	
}
function toSearch(){
	
	var simName = $("#simName").val();
	
	if(simName.length>0){
		   $('#simTree').tree({
				url : "sys/tree/getSimTree.action?simName="+simName+"&workUnitId="+workUnitId2,
				animate : true,
				onClick : function(node) {
				  var ids=node.id;
				  var strs=ids.split("|"); //字符分割      
				  window.parent.document.getElementById("SimID").value =strs[0];
			      window.parent.document.getElementById("simName").value =node.text;
			      var oInput = window.parent.document.getElementById("simName");
			      oInput.focus();//验证时获取到鼠标焦点
			      window.parent.closeDialog();
				}
			});	
	}else{
		$('#simTree').tree({
			url :  "sys/tree/getSimTree.action?workUnitId="+workUnitId2,
			animate : true,
			onClick : function(node) {
			  var ids=node.id;
			  var strs=ids.split("|"); //字符分割      
			  window.parent.document.getElementById("SimID").value =strs[0];
		      window.parent.document.getElementById("simName").value =node.text;
		      var oInput = window.parent.document.getElementById("simName");
		      oInput.focus();//验证时获取到鼠标焦点
		      window.parent.closeDialog();
			}
		});	
}   
}

