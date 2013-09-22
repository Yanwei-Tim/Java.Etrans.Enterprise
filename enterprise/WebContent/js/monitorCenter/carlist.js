var basePath="";
var currentPage = 1;
var maxCarSzie=200;
var nodeMap = null;
$(function() {
	/**
	 * 初始化设置，车辆监控中心
	 * 
	 */
	if(!Array.indexOf){  
	   Array.prototype.indexOf = function(Object){  
	     for(var i = 0;i<this.length;i++){  
	        if(this[i] == Object){  
	           return i;  
	         }  
	     }  
	     return -1;  
	   }  
	}
	divSetting.oriHeight = getHeight();
	divSetting.oriWidth = 269;
	divSetting.minHeight = 0;
	divSetting.minWidth = 0;
	// 默认选中树形
	nodeMap = new HashMap();

	$("#treeList").css("color","#fe5e06");
	$("#treeList").css("font-weight","bold");
	checkboxSetting.checked("treeList");
	initTradeKind();
	//初始化树列表
	educateCarList.treeInit();
	//定时取定位信息
	timeoutGetGPSInfor();
	
	$('#adSearchBtn').bind('click', toOpenAds);//高级搜索
	$('#checkAll').bind('click', checkAll);//全选
	$('#registrationNo').bind('focus', focusRegistrationNo);
	$('#registrationNo').bind('blur', blurRegistrationNo);
	 var head = document.getElementsByTagName("head")[0]
	 var base = head.getElementsByTagName("base")[0];
	 if (base) {
	        basePath=base.href;
	    } else {
	       basePath="";
	    }
	 $('#mobox').css("height", getHeight()+ "px");
	 $('#carTree').css("height", getHeight()+ "px");
})
	var CarList = new Array(); // 定阅车辆
	var allCarList=new Array();//所有查询出来的车辆
	// 定时取定位信息
	var timeIntval;
	function timeoutGetGPSInfor() {
		try {
			var func=function(){
				if (allCarList.length == 0) return;
				getGpsInfos();
				getGpsVehicleStatus();
			}
			timeIntval=setInterval(func, 10000);
			
		} catch (e) {
		}
	}
function focusRegistrationNo(){
	var registrationNo=$("#registrationNo");
	registrationNo.attr("class","mon_ser_text");
	 if(registrationNo.val()=="请输入车牌号"){
		 registrationNo.val("");
	 }
}
function blurRegistrationNo(){
	var registrationNo=$("#registrationNo");
	  if(registrationNo.val()==""){
		  registrationNo.attr("class","mon_ser_text2");
		  registrationNo.val("请输入车牌号");
	}
	
}
allCarList=new Array();// 清空

var totalCount=0;
var onlineCount=0;
var totalCountAll=0;
var trackBack="";
function initTradeKind(){
	$.ajax({
	    type : "POST",
	    url : "monitorCenter/getTradeKind.action",
	    dataType : "JSON",
	    success : function(data) {
	    	if(data!='false'){
	    		var html="<option value='0'>全部</option>";
	    		for(var i=0;i<data.length;i++){
	    			html+="<option value='"+data[i].ID+"'>"+data[i].Name+"</option>";
	    		}
	    		$("#tradeKind").html(html);
	    	}	    	 
	    }
	,complete: function (XHR, TS) { XHR = null } 
    });
}

/**全局变量【用作地图上面显示快捷按钮】begin**/
/**
 * 存储形式为 【健：值】比如：{车辆id_类型编号:参数1，参数2......}
 * 类型编号解释：1表示"轨迹回放"
 * 2表示"指令"
 * 3表示"车辆信息"
 * 4标示“拍照”
 * 5表示“视频”
 * 6表示“文本下发”
 * 44表示“拍照权限” true就是有权限false就是无权限
 * 55表示“视频权限” true就是有权限false就是无权限
 * 66标示“文本下发权限” true就是有权限false就是无权限
 */
var selectWhere = {}; 

var photoBool = "false"; //拍照权限
var videoBool = "false";//视频权限
var quicklyPubCommandCodeBool = "false"; //文本下发权限

/**全局变量【用作地图上面显示快捷按钮】--end**/



/**
 * 加载车辆列表
 */
function getGpsVehicle()
{	 
	
	var vehicleStr='';
	var rno = $("#registrationNo").val();
	rno=lrtrim(rno);
	if(rno=="请输入车牌号"){
		rno="";
	}
	var simNo=$("#simNo").val()
	if(simNo!=''){
			simNo=lrtrim(simNo);
	}
		var vehicleTeam=$("#vehicleTeam").val()
	if(vehicleTeam!=''){
			vehicleTeam=lrtrim(vehicleTeam);
	}
	var workUnitName=$("#workUnitName").val()
	if(workUnitName!=''){
			workUnitName=lrtrim(workUnitName);
	}
	var driverName=$("#driverName").val()
	if(driverName!=''){
			driverName=lrtrim(driverName);
	}
	var tradeKind = $("#tradeKind option:selected").val(); 
	if(tradeKind==null || ''==tradeKind)tradeKind=0;
	$.ajax({
		url:"monitorCenter/getGpsVehicleList.action",
		type:"POST",
		dataType:"json",
		async :false,
		data: {"registrationNo":rno,"currentPage":currentPage,"simNo":simNo,"workUnitName":workUnitName,"vehicleTeam":vehicleTeam,"driverName":driverName,"datetimes": new Date(),"tradeKind":tradeKind},
		success:function(data){
		if(currentPage==1)$("#mobox").html('');
		$(data).each(function(i,n){
		  var vehicleId = n.vehicleId;
		  var code=n.code;
		  var commandKindId=n.commandKindId;
			allCarList.push(vehicleId);//保存所有的车
			totalCount++;
			var isOnline=n.isOnline;
			var onlineStr='<img  id="img'+vehicleId+'" src="Images/xx1.gif" width="27" height="26"  title="车辆下线" align="middle" no-repeat 4px 5px/>';
			if(isOnline){
			onlineCount++;
			onlineStr='<img id="img'+vehicleId+'" src="Images/sx1.gif" width="27" height="26" title="车辆上线" align="middle" no-repeat 4px 5px/>';
			}
			var registrationNo=n.registrationNo;
			var terminalKindID=n.terminalKindID;
			var kind=n.kind;
			totalCountAll = n.totalCount;
			trackBack+=","+vehicleId+"|"+registrationNo; //全局变量保存车牌信息
			vehicleStr+='<dl><dt><input type="checkbox"  id="'+vehicleId+'" value="'+vehicleId+'" name="vehicleGroup"   onclick=checkboxOnclick(this) class="ck_box"/><a href="javascript:goGroup_attention(\''+vehicleId+'\')">'+registrationNo+'</a>'+onlineStr
        +'<a href="javascript:gotoTrack(\''+vehicleId+'\',\''+registrationNo+'\')"><img src="Images/ico/map_btn_03.jpg"  title="轨迹回放" align="middle" no-repeat 4px 5px/></a>&nbsp;&nbsp;<a href="javascript:gotoControl(\''+terminalKindID+'\',\''+vehicleId+'\',\''+kind+'\',\''+registrationNo+'\')"><img src="Images/ico/carzl.jpg"  title="指令" align="middle" no-repeat 4px 5px/></a>'
        +'&nbsp;&nbsp;<a href=javascript:gotoVehicleInfo(\''+vehicleId+'\',\''+registrationNo+'\')><img src="Images/ico/map_btn_02.gif"  title="车辆信息" align="middle" no-repeat 4px 5px/></a>';
			
        //ljy
		if(code=='Camera'&&commandKindId=='282'){
        	vehicleStr+='&nbsp;&nbsp;<a href="javascript:gotoPhoto(\''+terminalKindID+'\',\''+vehicleId+'\',\''+commandKindId+'\',\''+registrationNo+'\')"><img src="Images/ico/map_btn_01.gif"  title="拍照" align="middle" no-repeat 4px 5px/></a>' 
        	/********************************存值begin********************************/
        	photoBool ="true";
        	var _4value=String(terminalKindID)+","+String(vehicleId)+","+String(commandKindId)+","+String(registrationNo);
     		selectWhere[n.vehicleId+"_4"]=_4value;
		}else{
        	photoBool = "false";
        	/********************************存值end***********************************/
        }
		if(n.video=='Video'){
			vehicleStr+='&nbsp;&nbsp;<a href=javascript:govideo(\''+vehicleId+'\',\''+registrationNo+'\')><img src="Images/ico/video.gif"  title="视频监控" align="middle" no-repeat 4px 5px/></a>';
			/********************************存值begin********************************/
			videoBool = "true";
			var _5value=String(vehicleId)+","+String(registrationNo);
     		selectWhere[n.vehicleId+"_5"]=_5value;
		}else{
			videoBool = "false";
			/********************************存值end***********************************/
		}
		if(n.txtCommand!=null){
			vehicleStr+='&nbsp;&nbsp;<a href="javascript:quicklyPubCommandCode(253,\''+n.txtCommand+'\',\''+vehicleId+'\',\''+registrationNo+'\')"><img src="Images/ico/map_btn_05.gif"  title="文本下发" align="middle" no-repeat 4px 5px/></a>'
			/********************************存值begin********************************/
			quicklyPubCommandCodeBool="true";
			var _6value=String("253")+","+String(n.txtCommand)+","+String(vehicleId)+","+String(registrationNo);
     		selectWhere[n.vehicleId+"_6"]=_6value;
		}else{
			quicklyPubCommandCodeBool = "false";
			/********************************存值end***********************************/
		}
        vehicleStr+='</dt></dl>';
        
		/********************************存值begin********************************/
        //轨迹回放存值
        var _1value=String(vehicleId)+","+String(registrationNo);
		selectWhere[n.vehicleId+"_1"]=_1value;
		//指令存值
		var _2value=String(terminalKindID)+","+String(vehicleId)+","+String(kind)+","+String(registrationNo);
		selectWhere[n.vehicleId+"_2"]=_2value;
		//车辆信息存值
		var _3value=String(vehicleId)+","+String(registrationNo);
		selectWhere[n.vehicleId+"_3"]=_3value;
		
		/**权限存值**/
		selectWhere[n.vehicleId+"_44"]=String(photoBool)
		selectWhere[n.vehicleId+"_55"]=String(videoBool)
		selectWhere[n.vehicleId+"_66"]=String(quicklyPubCommandCodeBool)
		/********************************存值end***********************************/
        
		});
		 $("#mobox").append(vehicleStr);
			$("input:checkbox").each(function() {
			if(CarList.indexOf(this.value)!=-1){
					$(this).attr("checked",'true');
			}
		});
		 $("#totalCount").html(totalCountAll); //共多少辆车
		 $("#onlineCurrentCount").html(totalCount);//当前页显示多少条
		 $("#onlineCount").html(onlineCount);//多少条数据在线
		 if(totalCountAll>100*currentPage){
				$("#moreVehicle").html('<a href="javascript:getMoreVehicle()">查看更多(还剩'+(totalCountAll-totalCount)+')...</a>');
			}else{
				$("#moreVehicle").html('');
			}
	   }
		,complete: function (XHR, TS) { XHR = null } 
	});
}
function getMoreVehicle(){
	currentPage++;
	getGpsVehicle();
}
/**
 * 获取所有车辆的上下线状态
 */
function getGpsVehicleStatus(){
var vehicleIdStr =allCarList.join(',');
	var jsonParams = {
		vehicleIdStr : vehicleIdStr,
		datetimes : new Date()
	};
	$.ajax({
	  	url:"monitorCenter/getGpsVehicleStatus.action",
		type:"POST",
		async :false,
		dataType:"json",
		data:jsonParams,
		success :function(data){
		//var Obj=cloneObj(data);
		//data=null;
		getGpsVehicleStatusBack(data);
		data=null;
		},
		 complete: function (XHR, TS) {  XHR=null;  }
	});
}
/**
 * 获取车辆上下线状态返回处理
 * @param {} data
 */
function getGpsVehicleStatusBack(data) {
	try {
	     var onlineCount=0;
			if(data!='false'){
			$.each(data,function(key,values){//循环map
				if(values==true){//上线
					$("#img"+key).attr("src","Images/sx1.gif")
					onlineCount++;
				}else{//下线
					$("#img"+key).attr("src","Images/xx1.gif")
				}       
			});
			 $("#onlineCount").html(onlineCount);
			 data=null;
		}
			data=null;
	} catch (e) { 
	}
}

function checkAll(){
	var isCheckAll=$("#checkAll");
	if (isCheckAll.attr('checked')=="checked") {//全选
		$("input:checkbox").each(function() {
			if(this.id!='changeTree'){
				 var vehicleId=this.value;
					if(CarList.indexOf(vehicleId)==-1){
				    	//vehicleCallTrack(vehicleId);
				    	CarList.push(vehicleId); // 加入数组
						$(this).attr("checked",'true');
					}
			}
		 
		});
		//获取当前选中全部车辆的定位数据
		getGpsInfos();
	}else{//全不选
		$("input:checkbox").each(function() {
			if(this.id!='changeTree'){
				var vehicleId=this.value;
				parent.mapFrame.deleteCar(vehicleId);
				$(this).attr("checked",false);
			}
		});
	}
	
}
function getTrackBackRegistrationNo(){
	return trackBack;
}
/**
 * 勾选是否订阅
 * @param {} checkbox
 */
function checkboxOnclick(checkbox) {
	var jqCheckBox=$(checkbox);
	var TempSim =jqCheckBox.val();
	if (jqCheckBox.attr('checked')=="checked") {
	  CarList.push(TempSim); // 加入数组
	  vehicleCallTrack(TempSim);
  }else{
	  CarList.splice(CarList.indexOf(TempSim), 1);
	 // nodeMap.get(TempSim).checked=false;
	  parent.mapFrame.deleteCar(TempSim);
   }
}

/**
 * 单车订阅
 * @param {} data
 */
function vehicleCallTrack(vehicleId) {
	var jsonParams = {
		vehicleIdStr : vehicleId,
		datetimes : new Date()
	};
	//ljy获取地图类型
	var mapType = parent.mapFrame.getMapType();
	$.ajax({
	  	url:"monitorCenter/getGpsInfos.action?mapType="+mapType,
		type:"POST",
		dataType:"json",
		data:jsonParams,
		success :function(data){
			//var Obj=cloneObj(data);
			vehicleCallTrackBack(data);
			data=null;
		},
		complete:function(xhr,en){
		xhr=null; 
	}
	});
}

/**
 * 检查车辆是否被选中
 * @param vehicleId
 */
function IsCheck(vehicleId){
	return $("#"+vehicleId).is(":checked");
}

/**
 * 单车订阅返回处理
 * @param {} data
 */
function vehicleCallTrackBack(data) {
	try {
		if(data!='false'){
			$(data).each(function(i,n){
			var vehicleId=n.vehicleId;
			if(CarList.indexOf(vehicleId)!=-1){
				var name = $("#treeList").attr("name");
				 parent.mapFrame.MakerCar(n, true,name);
			}
		 });
		}
	} catch (e) {
	}
}

/**
 * 多车订阅
 */
function getGpsInfos() {
	var vehicleIdStr =CarList.join(',');
	var jsonParams = {
		vehicleIdStr : vehicleIdStr,
		datetimes : new Date()
	};
	var mapType = parent.mapFrame.getMapType();	
	$.ajax({
		url : "monitorCenter/getGpsInfos.action?mapType=" + mapType,
		type : "POST",
		// async :false,
		dataType : "json",
		data : jsonParams,
		success : function(data) {
		  //   var ob=cloneObj(data);
			if (data) {
				getGpsInfosBack(data);
			} else {
				// alert("fail");
			}
			data=null;
		},
		 complete: function (XHR, TS) { XHR=null;   }
	});
}
/**树多选时
 */
function getGpsInfosForTree(ar) {
	if(ar.length<=0) return;
	var vehicleIdStr =ar.join(',');
	var jsonParams = {
		vehicleIdStr : vehicleIdStr,
		datetimes : new Date()
	};
	var mapType = parent.mapFrame.getMapType();	
	$.ajax({
		url : "monitorCenter/getGpsInfos.action?mapType=" + mapType,
		type : "POST",
		// async :false,
		dataType : "json",
		data : jsonParams,
		success : function(data) {
		  //   var ob=cloneObj(data);
			if (data) {
				getGpsInfosBack(data);
			} else {
				// alert("fail");
			}
			data=null;
		},
		 complete: function (XHR, TS) { XHR=null;   }
	});
}
/**
 * 多车订阅返回处理
 * @param {} data
 */
function getGpsInfosBack(data) {
	try {
		if(data!='false'){
			var name = $("#treeList").attr("name");
			var frame= parent.mapFrame;
			timedChunk(data,processItem,null,name,frame,null);
//			$(data).each(function(i,n){
//				var vehicleId=n.vehicleId;
//				if(CarList.indexOf(vehicleId)!=-1){
//					// parent.mapFrame.MakerCar(n, true,name);
//					frame.MakerCar(n, true,name);
//				}
//				n=null;
//			 });
		}
	} catch (e) {
	}
}

function processItem(obj,name,frame){
	var vehicleId=obj.vehicleId;
	if(CarList.indexOf(vehicleId)!=-1){
		frame.MakerCar(obj, true,name);
	}
}

// 分时函数
function timedChunk(items, process, context,name,frame, callback) { 
    var todo = items.concat(), delay = 25; 
    setTimeout(function() { 
        var start = +new Date(); 
        do { 
            process.call(context, todo.shift(),name,frame); 
        } while (todo.length > 0 && (+new Date() - start < 50)) 
        if(todo.length > 0) { 
            setTimeout(arguments.callee, 25); 
        } else if(callback) { 
            callback(); 
        } 
    }, delay); 
}

function addVehicle(vehicleId){
var index =CarList.indexOf(vehicleId);
		if (!(index > -1)) {//在车辆列表没有就添加
			CarList.push(vehicleId);
		}
}
/**
 * 去车辆复选框的沟
 * 订阅数据删除、取消复选框的时候触发
 * 
 * @param commno 车辆ID
 */
function deleteCheckBox(commno) {
	try {
		var index =CarList.indexOf(commno);
		if (index > -1) {
			CarList.splice(index, 1);
			$("#"+commno).attr("checked",false);
			try {
				// 列表、树形同步进行
				if(nodeMap.containsKey(commno)>-1){
					var node = nodeMap.get(commno);
					$("#carTreeList").tree("uncheck",node.target);
				}
			} catch (e) {
			}
		}
	} catch (e) {
	}
}

//车辆复选框加沟
function addCheckBox(commno) {
	try {
		$("#"+commno).attr("checked",'true');
	} catch (e) {
	}
}
var countOpenAds=0;
function toOpenAds(op){
	countOpenAds++;
	if(countOpenAds%2!=0){
		isAdvanceQuery = true;
		//$("#carTree").css("padding-top","25px");
		$("#mobox").css("padding-top","0px");
		/**解决滚动条显示车辆不全问题**/
		treeListHeight("carTree","mobox","jian",150);
		$("#adSearch").show();
	}else{
		isAdvanceQuery = false;
		$("#carTree").css("padding-top","0px");
		$("#mobox").css("padding-top","0px");
		/**解决滚动条显示车辆不全问题**/
		if(op=="bubian"){
			treeListHeight("carTree","mobox","jia",0);
		}else{
			treeListHeight("carTree","mobox","jia",150);
		}
		$("#adSearch").hide();
	}
	
//	$("#adSearch").animate({height: 'toggle', opacity: 'toggle'}, 30);
}

/**指令**/
function gotoControl(terminalKindID,vehicleId,kind,registrationNo){
		var url=basePath+'command/index.jsp?terminalKindID='+terminalKindID+"&vehicleId="+vehicleId+"&kind="+kind;
		//parent.parent.parent.openDialog(url, 1200, 470,"["+registrationNo+"]指令");
		/**弹出窗体**/
		//隐藏快捷按钮
		parent.parent.parent.bottomFrameHideshow("controlIoc","none");
		/**openWindow方法在index.js[对应index2.jsp页面]**/
		parent.parent.parent.openWindow(url, 1200, 470,"["+registrationNo+"]指令","controlDiv","dialogFrame3",'controlIoc');
}
/**拍照**/
function gotoPhoto(terminalKindID,vehicleId,commandKindId,registrationNo){
	var url=basePath+'monitorCenter/photo.jsp?terminalKindID='+terminalKindID+"&vehicleId="+vehicleId+"&commandKindId="+commandKindId;
	//parent.parent.parent.openDialog(url, 1250, 530,"["+registrationNo+"]拍照");
	/**弹出窗体**/
	//隐藏快捷按钮
	parent.parent.parent.bottomFrameHideshow("photoDivIoc","none");
	/**openWindow方法在index.js[对应index2.jsp页面]**/
	parent.parent.parent.openWindow(url, 1250, 530,"["+registrationNo+"]拍照","photoDiv","dialogFrame5",'photoDivIoc');
	
}


/**
 * 快捷方式之文本下发
 * 
 * @param commandKindID
 * @param commandId
 * @param vehicleId
 */
function quicklyPubCommandCode(commandKindID,commandId,vehicleId,registrationNo){
	var src="command/quicklyGbIndex.jsp?commandKindID="+commandKindID+"&commandId="+commandId+"&vehicleId="+vehicleId;
	/**弹出窗体**/
	parent.parent.parent.bottomFrameHideshow("quicklyDivIoc","none");//隐藏快捷按钮
	/**openWindow方法在index.js[对应index2.jsp页面]**/
	parent.parent.parent.openWindow(src, 500, 260,"["+registrationNo+"]快捷指令-文本下发","quicklyDiv","dialogFrame4",'quicklyDivIoc');
}

/**车辆详细信息**/
function gotoVehicleInfo(vehicleId,registrationNo){
		var  url=basePath+'monitorCenter/vehicleInfo.jsp?vehicleId='+vehicleId;
		/**弹出窗体**/
		parent.parent.parent.bottomFrameHideshow("vehilceInfoIoc","none");//隐藏快捷按钮
		/**openWindow方法在index.js[对应index2.jsp页面]**/
		parent.parent.parent.openWindow(url, 800, 320,"["+registrationNo+"]详细信息","vehicleInfoDiv","dialogFrame2",'vehilceInfoIoc');
}

//轨迹回放入口
function gotoTrack(vehicleId,registrationNo){
	//innerip内网outerip外网 ljy
	if(ipType=="innerip"){
		//得到monitor.jsp里面的mapFrame框架对象
		var parentMapFrame=$("#frame", window.parent.frames["mapFrame"])
		//得到轨迹回放iframe对象
		var parentMapFrame2= parentMapFrame.contents().find("#monitor");
		var win=parent.frames["mapFrame"].window;
		//参数1标示是轨迹回放其他参数在 showTab2方法头部有解释 方法在group.js文件里面
		win.showTab2('.tab-hd',1,'.tab-bd','active','contrail',vehicleId,registrationNo);
	}else if(ipType=="outerip"){
		var url=basePath+"monitorCenter/P_trackMap.jsp?vehicleId="+vehicleId+"&registrationNo="+registrationNo;
		parent.mapFrame.location.href=url;
	}
	
}
function getHeight() {
	var height;
	var height;
	height =document.documentElement.clientHeight;//window.screen.availHeight;
	 var sys=getExplorerType();
	 if(sys.ie){
		 height=height-115;
	 }else if(sys.firefox){
		 height=height-115;
	 }else if(sys.chrome){
		 height=height-115;
	 }
	return height;
}
function getExplorerType(){
	  var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject)
        Sys.ie =true;
    else if (navigator.userAgent.indexOf("Firefox")>0)
        Sys.firefox =true;
    else if (window.MessageEvent && !document.getBoxObjectFor)
        Sys.chrome =true
    else if (window.opera)
        Sys.opera =true
    else if (window.openDatabase)
        Sys.safari = true
	return Sys;
}

/**单车跟踪ljy**/
function goGroup_attention(vehicleId){
	//得到monitor.jsp里面的mapFrame框架对象
	var parentMapFrame=$("#frame", window.parent.frames["mapFrame"])
	//得到轨迹回放iframe对象
	var parentMapFrame2= parentMapFrame.contents().find("#contrail");
	var win=parent.frames["mapFrame"].window;
	//参数1标示是轨迹回放其他参数在 showTab2方法头部有解释 方法在group.js文件里面
	win.showTab2('.tab-hd',2,'.tab-bd','active','scout',vehicleId,null);
}

 
function moveOperate(event){
	 var x=event.clientX;
	 var y=event.clientY;
	 var div = $("#vehicleTreeOperate");	 
	 var divx1 = $(div).offset().left;
     var divy1 = $(div).offset().top;
     var divx2 = divx1 + $(div).width();  
     var divy2 = divy1 + $(div).height(); 
     if( x < divx1 || x > divx2 || y < divy1 || y > divy2){  
    	 $("#vehicleTreeOperate").remove();
     }	
}
//车牌【用作锐敏视频监控页面】
var registrationNoV ="";
/**
 * 视频监控 ljy
 * @return
 */
function govideo(vehicleId,registrationNo){
	registrationNoV = registrationNo;
	//vehicleId=11658;
	var jsonParams = {
			vehicleId : vehicleId
		};
		$.ajax({
		  	url:"monitorCenter/getVideoInfo.action",
			type:"POST",
			dataType:"json",
			data:jsonParams,
			success : getvideoInfoBack
			,complete: function (XHR, TS) { XHR = null } 
		});
	
}
/**
 * 返回处理 ljy
 * @param data
 * @return
 */
function getvideoInfoBack(data) {
	//参数
	var paramArray = [];
	//alert("返回值："+data.paramvalue);
	
	if(null==data||data==""){
		alert("服务器忙,数据库参数设置为空！");
	}
	if(null==data.paramvalue||data.paramvalue==""){
		alert("数据库参数设置为空！");
	}else{
		paramArray=data.paramvalue.split(',');
//		/**锐明**/
//		var str ="TransmitIP=203.88.210.56,TransmitPort=17891,Kind=121,ID=dns:A33296,Channel=0&1&2&3";
//		/**G10**/
		//var str ="TransmitIP=121.33.255.142,TransmitPort=6213,TransmitPort_TCP=6226,ID=14000373571,Kind=815,Channel=1&2&3&4,RegistrationNO=桂A20607";
		//paramArray=str.split(',');
		//alert("长度："+paramArray.length);
		if(paramArray.length!=5&&paramArray.length!=7){
			alert("数据库参数设置格式不对！");
			return;
		}
		/**锐明**/
		if(paramArray.length==5){
			var TransmitIP=paramArray[0].split('=')[1];
			var TransmitPort=paramArray[1].split('=')[1];
			var Kind = paramArray[2].split('=')[1];
			var ID = paramArray[3].split('=')[1];
			var Channel = paramArray[4].split('=')[1];
			Channel = Channel.split("&").join("-");
			//alert("TransmitIPs:"+TransmitIP+"TransmitPort:"+TransmitPort+"Kind:"+Kind+"ID:"+ID+"Channel:"+Channel);
			var url = basePath+'jiankong/jiankong.jsp?TransmitIP='+TransmitIP+"&TransmitPort="+TransmitPort+"&Kind="+Kind+"&ID="+ID+"&Channel="+Channel;
			//parent.parent.parent.openDialog(url, 800, 500,"车辆监控");
			/**弹出窗体**/
			parent.parent.parent.bottomFrameHideshow("videoDivIoc","none");//隐藏快捷按钮
			/**openWindow方法在index.js[对应index2.jsp页面]**/
			parent.parent.parent.openWindow(url, 740, 500,"["+registrationNoV+"]车辆监控","videoDiv","dialogFrame6",'videoDivIoc');
		}
		/**顺达（g10）**/
		else if(paramArray.length==7){
			var TransmitIP=paramArray[0].split('=')[1];
			var TransmitPort=paramArray[2].split('=')[1];
			var ID = paramArray[3].split('=')[1];
			var Kind = paramArray[4].split('=')[1];
			var Channel = paramArray[5].split('=')[1];
			Channel = Channel.split("&").join("-");
			var RegistrationNO = paramArray[6].split('=')[1];
			//alert("注册服务器IP:"+TransmitIP+"TransmitPort:"+TransmitPort+"ID:"+ID+"Kind:"+Kind+"Channel:"+Channel+"RegistrationNO:"+RegistrationNO);
			//var url = basePath+'jiankong/jiankongSD.htm';
			var url = basePath+'jiankong/jiankongSD.jsp?TransmitIP='+TransmitIP+"&TransmitPort="+TransmitPort+"&ID="+ID+"&Kind="+Kind+"&Channel="+Channel;
			//parent.parent.parent.openDialog_jiankong(url, 800, 500,"["+RegistrationNO+"]车辆监控");
			/**弹出窗体**/
			parent.parent.parent.bottomFrameHideshow("videoDivIoc","none");//隐藏快捷按钮
			/**openWindow方法在index.js[对应index2.jsp页面]**/
			parent.parent.parent.openWindow(url, 740, 500,"["+RegistrationNO+"]车辆监控 - [G10]","videoDiv","dialogFrame6",'videoDivIoc');
		}
		
		
	}
	
}



/**
 * DIV设置共享对象
 */
var divSetting = {
		
	/**
	* 默认设置的几个值大小
	*/
	minWidth:0,// 最小宽度
	maxWidth:0,// 最大宽度
	minHeight:0,// 最小高度
	maxHeight:0,// 最高高度
	oriWidth:0,//原宽度
	oriHeight:0,// 原高度
	
	
	/**
	 * DIV或者其他空间大小复位
	 * 
	 * @param divId
	 */
	sizeReset:function(divId){
		$("#"+divId).css("width",divSetting.oriWidth);
		$("#"+divId).css("height",divSetting.oriHeight);
		$("#"+divId).show();
	},
	
	/**
	 * DIV或者其他控件大小最小化
	 * 
	 * @param divId
	 */
	sizeMin:function(divId){
		$("#"+divId).css("width",0);
		$("#"+divId).css("height",0);
		//$("#"+divId).hide();
	}
};
var checkboxSetting = {
		
	    /**
	     * 当前box选择状态
		*/
		checkboxCurrentState:false,
		
		/**
		 * 选中树
		 * 
		 * @param checkboxId
		 */
		checked : function(checkboxId) {
			$("#"+checkboxId).html("列表");
			checkboxSetting.checkboxCurrentState = true;
			$("#checkAll").hide();
		},
		
		/**
		 * 反选【选中车辆列表】
		 * 
		 * @param checkboxId
		 */
		unChecked : function(checkboxId) {
			$("#"+checkboxId).html("树形");
			checkboxSetting.checkboxCurrentState = false;
			$("#checkAll").show();
		}
}
/**
 * 教育平台车辆列表对象
 * <p>
 * 凡是涉及到对列表进行操作的方法、变量、对象都在此大对象中进行处理，
 * 不再公开其他方法
 * </p>
 * 
 * @author Pomelo(柚子.)
 * @since 2013-03-12
 * @version 1.0
 */
var educateCarList = {
		
		queryCar:function(){
			allCarList = new Array();
			currentPage=1;//执行查询重置页码
			/**
			 * 列表查询
			 */
			
			var name = $("#treeList").attr("name");
			totalCount=0;
			onlineCount=0;
			totalCountAll=0;
			trackBack="";
			if(name=='0'){
				educateCarList.treeInit();	
			}else{
				getGpsVehicle();			
			}
			// 查询完毕，清空查询条件
			//$("#registrationNo").val("");
		},
		/**
		 * 显示当前车辆数
		 * 
		 * @param HtmlId
		 */
		totalCountCar:function(HtmlId){
			
		},
		
		/**
		 * 树形-列表 切换
		 */
		switchTree_List:function(){
			
		},
		
		/**
		 * 初始化树形列表
		 */
		treeInit : function() {
			try {
				// 区域树
				divSetting.sizeMin("mobox");
				divSetting.sizeReset("carTree");
				var rno = $("#registrationNo").val();
				var queryAppend="";
				var var1="";
				var var2="";
				var var3="";
				var var4="";
				var var5="";
				var var6="";
				var url = "monitorCenter/getTreeVehicleOne.action?times=123";
				
				rno=lrtrim(rno);
				if(rno=="请输入车牌号"){
					rno="";
				}else{
					var1 = "registrationNo="+rno;
				}
				
				var workUnitName=$("#workUnitName").val()
				if(workUnitName!=''){
						workUnitName=lrtrim(workUnitName);
						var2="workUnitName="+workUnitName;
				}
				if(workUnitName=="请输入运输业户"){
					workUnitName="";
					var2="";
				}
				
				var simNo=$("#simNo").val()
				if(simNo!=''){
						simNo=lrtrim(simNo);
						var3="simNo="+simNo;
				}
				
				var vehicleTeam=$("#vehicleTeam").val()
				if(vehicleTeam!=''){
						vehicleTeam=lrtrim(vehicleTeam);
						var4="vehicleTeam="+vehicleTeam;
				}
				
				var driverName=$("#driverName").val()
				if(driverName!=''){
					driverName=lrtrim(driverName);
					var5="driverName="+driverName;
				}
				var tradeKind = $("#tradeKind option:selected").val(); 
				if(tradeKind==null || ''==tradeKind)tradeKind=0;
				var6="tradeKind="+tradeKind; 
				if(var1!=""){
					queryAppend += "&"+var1;
				}
				if(var2!=""){
					queryAppend += "&"+var2;
				}
				if(var3!=""){
					queryAppend += "&"+var3;
				}
				if(var4!=""){
					queryAppend += "&"+var4;
				}
				if(var5!=""){
					queryAppend += "&"+var5;
				}
				url+=queryAppend+"&"+var6;
				var action=0;
				var initExpend=false;
				$('#carTreeList').tree({
					url : encodeURI(encodeURI(url)),
					checkbox : true, // 复选框
					onlyLeafCheck:false,
					cascadeCheck:false,
					onClick:function(node){
						if($("#vehicleTreeOperate")) $("#vehicleTreeOperate").remove();
				    },
				    onExpand:function(node){
				    	var childs=$('#carTreeList').tree('getChildren',node.target), childNode;
				    	var ar=new Array();
				    	for(var i=0;i<childs.length;i++){
				    		childNode=childs[i];
				    		if(!$('#carTreeList').tree('isLeaf',childNode.target))continue;
				    		if($('#carTreeList').tree('getParent',childNode.target).id!=node.id) continue;
				    		ar.push(childNode.id.split("|")[1]);
				    		nodeMap.put(childNode.id.split("|")[1],childNode);
				    		if(CarList.indexOf(childNode.id.split("|")[1])!=-1){
				    			$('#carTreeList').tree('check',childNode.target);
				    		}
				    		/*if(node.checked){
								if(!nodeChecked(childNode,true)) break;
								$('#carTreeList').tree('check',childNode.target);
							}else{
								nodeChecked(childNode,false);
								$('#carTreeList').tree('uncheck',childNode.target);
							}*/
				    	}
				    	onLineTree(ar);
				    },
					onLoadSuccess:function(node1, data){
				    	if(!initExpend){ 
				    		setTimeout(function (){$('#carTreeList').tree('getRoot',null).target.childNodes[2].style.display="none";$('#carTreeList').tree('expand',$('#carTreeList').tree('getRoot',null).target);},2500);
					    	initExpend=true;
					    	}
				    	if(action==0) return;action=action-1;
						var childs=$('#carTreeList').tree('getChildren',node1.target),node;
						var ar=new Array();
						for(var i=0;i<childs.length;i++){
							node=childs[i];
							if($('#carTreeList').tree('isLeaf',node.target)){
								if($('#carTreeList').tree('getParent',node.target).id!=node1.id) continue;
								if(node1.checked){
									if(node.id.split("|")[2]=='b'){
										ar.push(node.id.split("|")[1])
									}
									nodeChecked(node,true);
									$('#carTreeList').tree('check',node.target);
								}else{
									nodeChecked(node,false);
									$('#carTreeList').tree('uncheck',node.target);
								}
							}else continue;
						}
						getGpsInfosForTree(ar);
					},
					onContextMenu:function(e,node){
						$('#carTreeList').tree('select',node.target);
						if($("#vehicleTreeOperate")) $("#vehicleTreeOperate").remove();
						if(!$('#carTreeList').tree('isLeaf',node.target)){
							return;
						}
						var src = e.target || window.event.srcElement; 
						var obj=document.getElementById("carTree");
						var xx=0;yy=0;
						while(src){
							yy+=src.offsetTop;
							xx+=src.offsetLeft;
							src=src.offsetParent;
						}
						while(obj){
							yy-=obj.offsetTop;
							xx-=obj.offsetLeft;
							obj=obj.offsetParent;
						}
						xx==0?xx=e.clientX:xx;
						showRightMenu(node.id,e.clientX,e.clientY,xx,yy-document.getElementById("carTree").scrollTop);
						if ( e && e.preventDefault ) e.preventDefault()
						else  e.returnValue = false;
						return ;
					},
					onCheck:function(node1,e){
						var ar=new Array();
						if($('#carTreeList').tree('isLeaf',node1.target)){
							if(node1.checked){
								if(node1.id.split("|")[2]=='b') ar.push(node1.id.split("|")[1])
								nodeChecked(node1,true);
							}else{
								nodeChecked(node1,false);
							}
							getGpsInfosForTree(ar);
							return;
						}
						var childs=$('#carTreeList').tree('getChildren',node1.target),node;
						if(node1.checked&&childs.length<=0){
							action+=1;
							$('#carTreeList').tree('expand',node1.target);
							return;
						}
						for(var i=0;i<childs.length;i++){
							node=childs[i];
							if($('#carTreeList').tree('isLeaf',node.target)){
								if($('#carTreeList').tree('getParent',node.target).id!=node1.id) continue;
								if(node1.checked){
									if(node.id.split("|")[2]=='b'){
										ar.push(node.id.split("|")[1])
									}
									nodeChecked(node,true);
									$('#carTreeList').tree('check',node.target);
								}else{
									nodeChecked(node,false);
									$('#carTreeList').tree('uncheck',node.target);
								}
							}else continue;
						}
						getGpsInfosForTree(ar);
						$('#carTreeList').tree('expand',node1.target);
					}
				});
			} catch (e) {
				alert(e);
			}
			getGpsVehicle();
			$("#moreVehicle").hide();
	},
	
	/**
	 * 设置对象的Html值
	 * 
	 * @param ElementId
	 * @param Value
	 */
	setElementHtml:function(ElementId,Value){
		$("#"+ElementId).html(Value);
	},
	
	/**
	 * 载入列表形式的车辆 ljy
	 */
	loadListCar:function(){

		var name = $("#treeList").attr("name");
		//是树
		if(name=="0"){
			$("#treeList").attr("name","1");
			$("#treeList").html("树形");
			
			try {
				$("#vehicleTreeOperate").remove();
			} catch (e) {}
			divSetting.sizeMin("carTree");
			divSetting.sizeReset("mobox");
			$("#moreVehicle").show();
			$("#checkAll").show();
		}
		//是列表
		else{
			$("#treeList").attr("name","0");
			$("#treeList").html("列表");
			
			divSetting.sizeMin("mobox");
			divSetting.sizeReset("carTree");
			$("#moreVehicle").hide();
			$("#checkAll").hide();
		}
		
		/**隐藏高级搜索**/
		countOpenAds=1;
		toOpenAds("bubian");//div高度保持不变
	}

};
/**
 * 那个树形列表的右键菜单
 * 
 */
function showRightMenu(id,x,y,xx,yy){
		var nId = id.split("|");
		var photo = "";
		var otherHtml='';
		var tableStarStr = '<div id="vehicleTreeOperate"  onmouseout="event.toElement.tagName==\'DIV\'?this.parentNode.removeChild(this):\'\';" style="border:gray 1px solid;background:#FFFFFF;" ><table id="treetable" cellpadding="-3" cellspacing="5" style="height:100%">';
		var tableEndStr  = '</table></div>';
		var videoHtml="";
		var txtCommandHtml="";
		var h=0;
		if(nId[3]=='Camera'&&nId[4]=='282'){//有拍照权限
				h+=25;
				photo = '<tr onclick= "gotoPhoto(\''+nId[5]+'\',\''+nId[1]+'\',\''+nId[4]+'\',\''+nId[7]+'\')" onmouseout="this.style.background=\'none\'" onmouseover="this.style.background=\'#CCCCCC\'">'
					+'<td >'
					+'<img   src="Images/ico/map_btn_01.gif"/>&nbsp;&nbsp;<label width="70" align="right">车辆拍照</label></td></tr>';
				/************************存值begin************************/
	        	photoBool ="true";
	        	var _4value=String(nId[5])+","+String(nId[1])+","+String(nId[4])+","+String(nId[7]);
	     		selectWhere[String(nId[1])+"_4"]=_4value;
		}else{
			photoBool = "false";
			/************************存值end************************/
		}
		if(nId[8]=='Video'){//有视频监控权限
			h+=25;
			videoHtml = '<tr onclick="govideo(\''+nId[1]+'\',\''+nId[7]+'\')" onmouseout="this.style.background=\'none\'" onmouseover="this.style.background=\'#CCCCCC\'">'
						 +'<td valign="center">'
						 +'<img src="Images/ico/video.gif" />&nbsp;&nbsp;<label width="70" align="right">视频监控</label></td></tr>';
			/************************存值begin************************/
			videoBool = "true";
			var _5value=String(nId[1])+","+String(nId[7]);
     		selectWhere[String(nId[1])+"_5"]=_5value;
		}else{
			videoBool = "false";
			/************************存值end************************/
		}
		if(nId[9]!='null'){//有文本下发权限
			h+=25;
			txtCommandHtml = '<tr onclick= "quicklyPubCommandCode(253,\''+nId[9]+'\',\''+nId[1]+'\',\''+nId[7]+'\')" onmouseout="this.style.background=\'none\'" onmouseover="this.style.background=\'#CCCCCC\'">'
				+'<td valign="center">'
				+'<img src="Images/ico/map_btn_05.gif"/>&nbsp;&nbsp;<label width="70" align="right">文本下发</label></td></tr>';
			/************************存值begin************************/
			quicklyPubCommandCodeBool="true";
			var _6value=String("253")+","+String(nId[9])+","+String(nId[1])+","+String(nId[7]);
     		selectWhere[String(nId[1])+"_6"]=_6value;
		}else{
			quicklyPubCommandCodeBool="false";
			/************************存值end************************/
		}
		otherHtml = 
			  "<tr onclick='gotoVehicleInfo(\""+nId[1]+"\",\""+nId[7]+"\")'  onmouseout='this.style.background=\"none\"' onmouseover='this.style.background=\"#CCCCCC\"'><td>"
			 +'<img src="Images/ico/map_btn_02.gif"  />&nbsp;&nbsp;<label width="70" align="right">车辆信息</label></td></tr>'
			 +'<tr onclick="gotoTrack(\''+nId[1]+'\',\''+nId[7]+'\')" onmouseout="this.style.background=\'none\'" onmouseover="this.style.background=\'#CCCCCC\'">'//- Td end  -1
			 +'<td  valign="center">'
		     +'<img src="Images/ico/map_btn_03.gif"    />&nbsp;&nbsp;<label width="70" align="right">轨迹回放</label></td></tr>'
		     +'<tr onclick="goGroup_attention(\''+nId[1]+'\')" onmouseout="this.style.background=\'none\'" onmouseover="this.style.background=\'#CCCCCC\'">'//- Td end  -2
		     +'<td  valign="center">'
		     +'<img src="Images/ico/onVehicl.png"   />&nbsp;&nbsp;<label width="70" align="right">单车跟踪</label></td></tr>'
		     +'<tr  onclick="gotoControl(\''+nId[5]+'\',\''+nId[1]+'\',\''+nId[6]+'\',\''+nId[7]+'\')" onmouseout="this.style.background=\'none\'" onmouseover="this.style.background=\'#CCCCCC\'">'//- Td end  -3
		     +'<td  valign="center">'
		     +'<img src="Images/ico/carzl.gif" />&nbsp;&nbsp;<label width="70" align="right">车辆指令</label></td></tr>';
		h+=100;
		$("#mobox").append(tableStarStr+otherHtml+photo+videoHtml+txtCommandHtml+tableEndStr);
		$("#vehicleTreeOperate").css("position","absolute");
		var w=document.getElementById("carTree").clientWidth-xx-83;
		var h1=document.getElementById("carTree").clientHeight-yy-h;
		if(w<0){
			x=x-83;
		}
		if(h1<0){
			y=y-h-10;
		}
		
		/************************************************存值begin************************************************/
        //轨迹回放存值
        var _1value=String(nId[1])+","+String(nId[7]);
		selectWhere[String(nId[1])+"_1"]=_1value;
		//指令存值
		var _2value=String(nId[5])+","+String(nId[1])+","+String(nId[6])+","+String(nId[7]);
		selectWhere[String(nId[1])+"_2"]=_2value;
		//车辆信息存值
		var _3value=String(nId[1])+","+String(nId[7]);
		selectWhere[String(nId[1])+"_3"]=_3value;
		
		/**权限存值**/
		selectWhere[String(nId[1])+"_44"]=String(photoBool)
		selectWhere[String(nId[1])+"_55"]=String(videoBool)
		selectWhere[String(nId[1])+"_66"]=String(quicklyPubCommandCodeBool)
		/***************************************************存值end************************************************/
		
		$("#vehicleTreeOperate").css("left", (x)+"px");
		$("#vehicleTreeOperate").css("top",(y)+"px"); 
		$("#vehicleTreeOperate").css("width", (83)+"px");
		$("#vehicleTreeOperate").css("height",(h)+"px"); 
		$("#vehicleTreeOperate").show();
}
//var con=false;
function nodeChecked(node,checked){
	var nId = node.id.split("|");
	if(nId[2]!='b') return true;
	var vehicleId = nId[1];
	if(!checked){
		if(CarList.indexOf(vehicleId)!=-1){
			CarList.splice(CarList.indexOf(vehicleId), 1);
		}
		parent.mapFrame.deleteCar(vehicleId);
		$("#"+vehicleId).attr("checked",false);
		return true;
	}
	/*if(CarList.length>=maxCarSzie){
		var  r;
		if(!con){
		con=parent.parent.parent.confirm("您已经订阅多于"+maxCarSzie+"辆车了，如果继续订阅可能导致系统变慢，是否继续?");}
		if(con){
			vehicleCallTrack(vehicleId);
			if(CarList.indexOf(vehicleId)==-1) CarList.push(vehicleId);
			nodeMap.put(nId[1],node);
		}else{
			return false;
		}
	 }else{*/
	     $("#"+vehicleId).attr("checked",true);
		 nodeMap.put(nId[1],node);
		// vehicleCallTrack(vehicleId);
		 if(CarList.indexOf(vehicleId)==-1) CarList.push(vehicleId);
	// }
	return true;
}
function onLineTree(ar){
	$.ajax({
	  	url:"monitorCenter/getGpsVehicleStatus.action?temp="+new Date(),
		type:"POST",
		async :false,
		dataType:"json",
		data:({vehicleIdStr:ar.join(","),datetimes:new Date()}),
		success : function(data){
			if(data=="false") return;
			$.each(data,function(key,values){//循环map
				var node=nodeMap.get(key);
				var text=node.text;
				if(node.text.indexOf("<img")!=-1)
					text=node.text.substring(0,node.text.indexOf("<img"));
				$('#carTreeList').tree('update', {
					target: node.target,
					checked:node.checked,
					id:node.id,
					state:node.state,
					iconCls:node.iconCls,
					//text:values?(text+"<font color='gree'>&nbsp;&nbsp;在线</font>"):(text+"<font color='red' >&nbsp;&nbsp;不在线</font>")
					text: values?(text+'<img width="12" height="13" src="Images/sx1.gif"/>'):(text+'<img  width="12" height="13" src="Images/xx1.gif"/>')
				});
			});
		}//getGpsVehicleStatusBack
	,complete: function (XHR, TS) { XHR = null } 
	});
}

/**
 * 修改list车辆列表和tree车辆列表的div高度
 * carTree tree车辆的div的id
 * mobox list车辆的div的id
 * type jia标示+ jian标示-
 * value 标示加减多少值
 * @return
 */
function treeListHeight(carTree,mobox,type,value){
	var carTreeHeight= $("#"+carTree).css("height").split("px")[0]; //树高度
	var moboxHeight= $("#"+mobox).css("height").split("px")[0]; //列表高度
	if(type=="jian"){
		if(carTreeHeight!=0)
		carTreeHeight=Number(carTreeHeight)-value;
		
		if(moboxHeight!=0)
		moboxHeight=Number(moboxHeight)-value;
	}else if(type=="jia"){
		if(carTreeHeight!=0)
		carTreeHeight=Number(carTreeHeight)+value;
		
		if(moboxHeight!=0)
		moboxHeight=Number(moboxHeight)+value;
	}
	//alert("carTreeHeight:"+carTreeHeight+" moboxHeight:"+moboxHeight);
	$("#"+carTree).css("height",carTreeHeight+"px");
	$("#"+mobox).css("height",moboxHeight+"px");
	
}
function cloneObj(obj){
    var objClone;
    if (obj.constructor == Object){
        objClone = new obj.constructor(); 
    }else{
        objClone = new obj.constructor(obj.valueOf()); 
    }
    for(var key in obj){
        if ( objClone[key] != obj[key] ){ 
            if ( typeof(obj[key]) == 'object' ){ 
                objClone[key] = cloneObj(obj[key]);
            }else{
                objClone[key] = obj[key];
            }
        }
    }
    objClone.toString = obj.toString;
    objClone.valueOf = obj.valueOf;
    return objClone; 
} 










