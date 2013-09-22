$(function() {
	var lng =$.query.get("lng");
	var lat =$.query.get("lat");
	$("#longitude").val(lng);
	$("#latitude").val(lat);
	
	$('#CPBtn').bind('click', savaCMP);
	
	initAjaxSelect('type','customMapPoint/getEntCustomMapIcons.action','0');
	
});


function savaCMP(){
   var nameType= $("#type").val();
   var name=$("#name").val();
   var lng= $("#longitude").val();
   var lat= $("#latitude").val();
   window.parent.queryById(nameType);
   if(name!=''){
	   var jsonParams = {
				name : name,
				nameType : nameType,
				lng : lng,
				lat : lat,
				datetimes : new Date()
			};
			$.post("customMapPoint/createEntCustomMapPoint.action", jsonParams, function(data) {
				if(data!='false' ){
					var strs=data;
					var arry=strs.split("@");
					var id=arry[0];
					var name=arry[1];
					//alert("id-->:"+id+"name-->:"+name);
					window.parent.closeDialog();
					window.parent.$("#customMapPointList").flexReload();
					window.parent.addMarker(lng,lat,id,name);   
				}else{
						alert('添加失败,请确认是否有同名！');
				}
				
			});
   }else{
	   alert('名称不能为空');
   }
 

}


function onchanges(){
	//var aa =window.parent.document.getElementById("typeId").value;
	//window.parent.document.getElementById("typeId").value=$("#type").val();
}




