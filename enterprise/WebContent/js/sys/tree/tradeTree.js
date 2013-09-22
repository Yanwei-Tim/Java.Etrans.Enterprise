var CONST = {}; // 常量对象
CONST.ROOT_NODE_ID = 1; // 默认根节点ID
var parentNodeId = CONST.ROOT_NODE_ID; // 父节点(功能)ID

$(function(){
	initTree();
});

function initTree() {
	
	//行业类型
	
		$('#tradeKindTree').tree({
			url : "getTradeKindTreeList.action",
			animate : true,
			//checkbox : true,    //复选框
			onClick : function(node) {
			  var parWin= window.dialogArguments;
			  window.parent.document.getElementById("tradeKindId").value =node.id;
			  window.parent.document.getElementById("typeName").value =node.text;
			  window.parent.closeDialog();
			
			}
		});

	
	
}


