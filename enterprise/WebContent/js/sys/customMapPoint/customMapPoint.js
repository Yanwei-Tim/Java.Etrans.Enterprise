var  map;
var pointHashMap = new HashMap();

$(function() {
	initGrid();
	$('#cpMap').css("width", getMapWidth() -550+"px");
	$('#cpMap').css("height",getMapHeight() -88+ "px");
	map = new BMap.Map("cpMap");
	var point = new BMap.Point(116.39885,39.96571);    // 创建点坐标
	map.centerAndZoom(point,6);                     // 初始化地图,设置中心点坐标和地图级别。
	map.enableScrollWheelZoom();                            //启用滚轮放大缩小
	map.addControl(new BMap.NavigationControl());
	map.addControl(new BMap.ScaleControl());  
	map.addControl(new BMap.OverviewMapControl());   
	
	ZoomControl.prototype = new BMap.Control();

	// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
	// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
	ZoomControl.prototype.initialize = function(map){
	  // 创建一个DOM元素
	  var div = document.createElement("div");
	  // 添加文字说明
	  div.appendChild(document.createTextNode("兴趣点"));
	  // 设置样式
	  div.style.cursor = "pointer";
	  div.style.border = "1px solid gray";
	  div.style.backgroundColor = "#2a80b9";
	  div.style.color  = "white";
	  div.style.width  = "40px";
	  div.style.height  = "20px";
	  div.style.aligh="center";
	  // 绑定事件,兴趣点设置入口
	  div.onclick = function(e){
		  getCMP();
	  };
	  // 添加DOM元素到地图中
	  map.getContainer().appendChild(div);
	  // 将DOM元素返回
	  return div;
	};
	// 创建控件
	var myZoomCtrl = new ZoomControl();
	// 添加到地图当中
	map.addControl(myZoomCtrl);
		

	    
	    
  
 


	initAjaxSelect('nameType','customMapPoint/getEntCustomMapIcons.action','2');

//	//按钮绑定点击事件
	
//    $('#createBtn').bind('click', toCreate);
//    $('#editBtn').bind('click', toEdit);
	
	$('#btnSearch').bind('click', toSearch);
    $('#deleteBtn').bind('click', toDelete);
    $('#showBtn').bind('click', showPoint);
    $('#delCMPBtn').bind('click', deletePoint);
    
    //显示兴趣点
    showPointList();
        
});




function ZoomControl(){
	  // 默认停靠位置和偏移量
	  this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;  
	  this.defaultOffset = new BMap.Size(10, 10);
	}


function SquareOverlay(center,length ,width, color,text){     
	 this._center = center;     
	 this._length = length; 
	 this._width = width;
	 this._color = color; 
	 this._text = text;
} 


function getCMP(){
	map.addEventListener('click',showInfo);
}
function showInfo(e){
	
	map.removeEventListener("click", showInfo);  
	var lng=e.point.lng;
	var lat=e.point.lat;

	var basePath = getRootPath();
	var  url=basePath+'/sys/customMapPoint/mapIco.jsp?lng='+lng+'&lat='+lat;
	
    var X = $(dialogs).offset().left;
    var Y = $(dialogs).offset().top;
	openDialog1(url, 220, 210,"兴趣点",X,Y);
	//alert(X + ", " + Y); 	
}


function addMarker(lng,lat,id,name){  // 创建图标对象    
	var point = new BMap.Point(lng,lat); 
	
	var basePath = getRootPath();
	var imageURL=$("#imageURL").val();
	
	var url= basePath+imageURL;
	

	
	var myIcon = new BMap.Icon(url, new BMap.Size(32, 42), {     
		// 指定定位位置。    
		// 当标注显示在地图上时，其所指向的地理位置距离图标左上     
		// 角各偏移10像素和25像素。您可以看到在本例中该位置即是    
	   // 图标中央下端的尖角位置。     
	   offset: new BMap.Size(10, 25),     
	   // 设置图片偏移。    
	   // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您    
	   // 需要指定大图的偏移位置，此做法与css sprites技术类似。     
	   imageOffset: new BMap.Size(0, 0 * 25)   // 设置图片偏移     
	 });  
	
	// 创建标注对象并添加到地图    
	 var marker = new BMap.Marker(point, {icon: myIcon});     
	 map.addOverlay(marker); 
	 var label = new BMap.Label(name,{offset:new BMap.Size(18,18)});
		label.setStyle({
      borderColor:"#808080",
      color:"#333",
      cursor:"pointer"
		});
	 marker.setLabel(label);

	 pointHashMap.put(id,marker);

}


function addMarkerList(lng,lat,imageURL,id,name){  // 创建图标对象    
	var point = new BMap.Point(lng,lat); 
	
	var basePath = getRootPath();
	var url= basePath+imageURL;
	var myIcon = new BMap.Icon(url, new BMap.Size(32, 42), {     
		// 指定定位位置。    
		// 当标注显示在地图上时，其所指向的地理位置距离图标左上     
		// 角各偏移10像素和25像素。您可以看到在本例中该位置即是    
	   // 图标中央下端的尖角位置。     
	   offset: new BMap.Size(10, 25),     
	   // 设置图片偏移。    
	   // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您    
	   // 需要指定大图的偏移位置，此做法与css sprites技术类似。     
	   imageOffset: new BMap.Size(0, 0 * 25)   // 设置图片偏移     
	 });  
	
	// 创建标注对象并添加到地图    
	 var marker = new BMap.Marker(point, {icon: myIcon});     
	 map.addOverlay(marker); 
	 
	 var label = new BMap.Label(name,{offset:new BMap.Size(10,-10)});
		label.setStyle({
         borderColor:"#808080",
         color:"#333",
         cursor:"pointer"
		});
	 marker.setLabel(label);
    
	 pointHashMap.put(id,marker);

}





//删标注
function deleteMarkerList(id) {
	var newMarker = pointHashMap.get(id);
	try {
		// 清空地图图标
		if (newMarker != null) {
			map.removeOverlay(newMarker);// 删标注
		}
	} catch (e) {
	}
	pointHashMap.remove(id); // 删标注

	}

//显示标注
function showPoint(){
	 var ids = $("#customMapPointList").getCheckedRows();
	 
	 if(ids.length>0){
		 var jsonParams = {
				    ids:ids.toString(),
					datetimes : new Date()
		 };
		 
		 $.post("customMapPoint/getEntCustomMapPointByIdList.action", jsonParams, function(data) {
			 if (data != 'false') {
				    map.clearOverlays();
					var arrlist = data ;
					for ( var a = 0; a < arrlist.length; a++) {
						var id =arrlist[a].id;
						var name =arrlist[a].name;
						var lng =arrlist[a].Longitude;
						var lat =arrlist[a].Latitude;
						var imageURL =arrlist[a].imageURL;
						addMarkerList(lng,lat,imageURL,id,name);
					}
			  }
		 });
	 }else{
		 showWarning("请选择一行后进行操作！");
	 }		
}


//显示标注
function showPointList(){
	 var jsonParams = {
				datetimes : new Date()
	 };
	 
	 $.post("customMapPoint/getEntCustomMapPointByUserList.action", jsonParams, function(data) {
		 if (data != 'false') {
			    map.clearOverlays();
				var arrlist = data ;
				for ( var a = 0; a < arrlist.length; a++) {
					var id =arrlist[a].id;
					var name =arrlist[a].name;
					var lng =arrlist[a].Longitude;
					var lat =arrlist[a].Latitude;
					var imageURL =arrlist[a].imageURL;
					var nameType=arrlist[a].nameType;
					addMarkerList(lng,lat,imageURL,id,name,nameType);
				}
		  }
	 });
}	



//移除标注
function deletePoint(){
	 var ids = $("#customMapPointList").getCheckedRows();
	// alert(ids);
	 if(ids.length>0){
		 var jsonParams = {
				    ids:ids.toString(),
					datetimes : new Date()
		 };
		 
		 $.post("customMapPoint/getEntCustomMapPointByIdList.action", jsonParams, function(data) {
			 if (data != 'false') {
					var arrlist = data ;
					for ( var a = 0; a < arrlist.length; a++) {
						var id=arrlist[a].id;
//						var lng =arrlist[a].Longitude;
//						var lat =arrlist[a].Latitude;
//						var imageURL =arrlist[a].imageURL;
						deleteMarkerList(id);
					}
			  }
		 });
	 }else{
		 showWarning("请选择一行后进行操作！");
	 }		
}

function getMapWidth() {
	var width;
	if (window.innerWidth)
		width = window.innerWidth;
	else
		width = document.body.offsetWidth;

	return width;
}
function getMapHeight() {
	var height;
	height = document.body.clientHeight;
	return height;
}

function initGrid(){
	var name = $("#txName").val();
	var nameType = $("#nameType").val();
	
	//查询参数
	var params = [{
		name : 'name',
		value : name
	},
	{
		name : 'nameType',
		value : nameType
	}];
		$("#customMapPointList").flexigrid( {
			url : 'customMapPoint/getEntCustomMapPointList.action',
			dataType : 'json',
			params : params,
			colModel : [ 
             {
				display : '名称',
				name : 'name',
				width : 100,
				sortable : true,
				align : 'center'
			},
			{
				display : '类型',
				name : 'nameType',
				width : 100,
				sortable : true,
				align : 'center'
			},
			{
				display : '经度',
				name : 'Longitude',
				width : 100,
				sortable : true,
				align : 'center'
			},
			{
				display : '纬度',
				name : 'Latitude',
				width : 100,
				sortable : true,
				align : 'center'
			},{
				display : '操作',
				name : 'Handler',
				handlefunction : 'getHandleColumn',
				paramcolnames : ['id'],
				width : 80,
				sortable : false,//操作列不能排序
				align : 'center'
			}],
			
			sortname : "id",//第一次加载数据时排序列
			sortorder : "desc",//第一次加载数据时排序类型
			usepager : true,//是否分页，默认为true。
			showTableToggleBtn : true,//是否显示收起/打开按钮,默认不显示。
			useRp : true,//是否可以动态设置每页显示的结果数，默认为false。
			rp : 8,//每页记录数，默认为10
			checkbox : true,//是否要多选框,默认为false。
			rowId : 'id',// 多选框绑定行的id,只有checkbox : true时才有效。
			singleSelect:false,
			width : 'auto',//表格宽度
			height :getNormalHeight()-20//表格高度
		});
	    
};

/**
 * 组装操作列显示内容
 * @param id
 * @returns {String}
 */
function getHandleColumn(id){
	var deleteStr = "";
	//变量resources为用户的所有资源权限 格式
	if(resources!=null){
		//判断ACTION的访问权限
		
		 if(resources.indexOf("|deleteEntCustomMapPoint|")!=-1){
			 deleteStr ='<a href="javascript:void(0)" onclick="doDelete(' + id + ')">删除</a>';
		 }
		
	}
	return  deleteStr;
	
}

/**
 * 查询方法
 */
function toSearch(){
	  
		var name = $("#txName").val();
		var nameType = $("#nameType").val();
		//查询参数
		var params = [{
			name : 'name',
			value : name
		},
		{
			name : 'nameType',
			value : nameType
		}];
		// 重置表格的某些参数
		$("#customMapPointList").flexOptions({
				newp : 1,// 设置起始页
				params : params// 设置查询参数
			}).flexReload();// 重新加载
	
	
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

function checked(){
	var checkedIds = $("#customMapPointList").getCheckedRows();
	if(checkedIds.length>1){
		alert("123");
	}
}

/**
 * 删除方法入口
 */
function toDelete(){
	var checkedIds = $("#customMapPointList").getCheckedRows();
	if(checkedIds.length<1){
		showWarning("请选择一行后进行删除操作！");
		return;
	}
	
	doDelete(checkedIds);
}


/**
 * 执行后台方法删除数据
 * @param ids
 * @returns {Boolean}
 */
function doDelete(ids){
	if (ids != null || ids.length > 0) {
		if (!confirm("确定删除选中的兴趣点信息?")) {
			return false;
		} else {
			$.ajax({
			    type : "POST",
			    url : "customMapPoint/deleteEntCustomMapPoint.action",
			    data : {ids:ids.toString()},
			    dataType : "JSON",
			    success : function(data) {
			    	if(data!=null){
			    		$("#customMapPointList").flexReload();
			    	}else{
			    		showError();
			    	}
			    },
			    error : function(data) {
			    	showError();
			    }
		    });
		return true;
		}
	}
}


function queryById(id){
	if(id != null && id != ''){
		
		$.ajax({
		    type : "POST",
		    url : "customMapPoint/getEntCustomMapIconById.action",
		    data : {id:id},
		    dataType : "JSON",
		    success : function(data) {
		    	if(data!= null){
		    		var otInfo =  eval("("+data+")");
		    		if(otInfo.length > 0){
		    			var imageURL=otInfo[0].imageURL;
		    			$("#imageURL").val(imageURL);
		    			
		    		}
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




function getRootPath(){    
	//获取当前网址，如： http://192.168.2.133:8080/bubiaoQdn/sys/vehicle/vehicleModifyHistory.jsp    
	var curWwwPath=window.document.location.href;    
	//获取主机地址之后的目录，如：bubiaoQdn/sys/vehicle/vehicleModifyHistory.jsp
	var pathName=window.document.location.pathname;   
	var pos=curWwwPath.indexOf(pathName);    
	//获取主机地址，如：http://192.168.2.133:8080 
	var localhostPaht=curWwwPath.substring(0,pos);    
	//获取带"/"的项目名，如：/bubiaoQdn    
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);    
	return(localhostPaht+projectName);
	
}

function openDialog1(src, width, height, title,X,Y) {
  
	$("#dialogs").css("display", "block");
	$("#dialogFrame").attr("src", src);
	

	
	$("#dialogs").dialog({
		width : width,
		height : height,
		title : title,
		maximizable : false,
		inline : true,
		position:[X,Y],   // 赋值弹出坐标位置
		hide:'fold',      // 窗口关闭动画
        show:'fold'      // 窗口显示动画


	});
}



function closeDialog(){
	$('#dialogs').dialog('close');
}
