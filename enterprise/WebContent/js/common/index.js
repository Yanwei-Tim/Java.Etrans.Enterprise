$(function(){
	setCookies();
	getUrgentAlarm();
	getUplineAndDownLinVehicle();
	getshowProveBack();
	if(isShowHandle && !isShowNotice){
		getSystemNoticeSet();
	}
	
	/**定时去查询有没有报警督办，和查岗信息**/
	initshowDivFrame();
})


function openDialog(src, width, height, title) {
	$("#dialogs").css("display", "block");
	$("#dialogFrame").attr("src", src);
	$("#dialogs").dialog({
		width : width,
		height : height,
		title : title,
		inline : true,
		minimizable : false,
		onClose:function(){
		$("#dialogFrame").attr("src", "");
		}
	});
}

var f = 0;
/**
 * 定时弹出报警督办、查岗信息处理窗口
 * @return
 */
function initshowDivFrame()
{
	$.ajax({
		url:"monitorCenter/isCgOrDb.action",
		type:"POST",
		dataType:"json",
		success:function(data){
//			alert("是否有报警督办，查岗信息数据查询后返回值："+data);
			if($.trim(data)=='true'){//有数据
				var  url=basePath+'monitorCenter/higherLevelMessage2.jsp';
				if(f>0){
					//隐藏快捷按钮【自动弹出的，报警督办，或者查岗信息】
					bottomFrameHideshow("showDivInfoIoc","none");
				}
				openWindow(url,1100,500,"查岗、报警督办信息","dialogs2","showDivFrame","showDivInfoIoc");
			}
	   }
	});
	
	//定时执行方法 20秒刷新一次
	setTimeout('initshowDivFrame()', 20000);
	f++;
}


/************************
 * 【车辆信息层打开】【ljy】
 * 创建时间：【2013-5-23】
 * 修改时间：【2013-5-23】
 * **********************
 * src ifrom的src
 * width 弹出框宽度
 * height 弹出框高度
 * title 弹出框标题
 * divid 弹出框index2.jsp页面的弹出框层id
 * ifromid 弹出框index2.jsp页面的弹出框层里面的ifrom的id
 * imageid bottom.js里面的快捷图片id【这个图片用作恢复最小话】
 ************************/
function openWindow(src, width, height, title,divid,ifromid,imageid){
	//alert("打开层");
	var onCollapsible=false;//是否显示折叠按钮
	$("#"+divid).css("display", "block");
	$("#"+ifromid).attr("src", src);
	$('#'+divid).window({   
	    width:width,   
	    height:height,
	    modal:false,
	    maximizable:false,
	    collapsible:onCollapsible,
	    title : title,
	    onClose:function(){
			//alert("关闭");
			$("#"+ifromid).attr("src", "");
			/**隐藏快捷按钮**/
			bottomFrameHideshow(imageid,"none");
			if(divid=="videoDiv"){//视频
				//alert("视频关闭！");
				document.getElementById('dialogFrame').contentWindow.clsoDeviceAll();
			}
		},
		onMinimize:function(){
			//alert("最小化");
			/**显示快捷按钮**/
			bottomFrameHideshow(imageid,"block");
		}
	});  
}

/**重新打开层【用作车辆信息层、指令层、文本下发层等】**/
function openDiv(id){
	$('#'+id).window('open');
}

/**显示或隐藏快捷图标【快捷图标在bottom.js页面】**/
function bottomFrameHideshow(id,type){
	var bottomFrame = this.window.mainIndexFrame.window.bottomFrame;
	bottomFrame.hideshow(id,type);
}


/**视频监控弹出框ljy [没用了]**/
function openDialog_jiankong(src, width, height, title) {
	//alert("打开视频监控！");
	$("#dialogs").css("display", "block");
	$("#dialogFrame").attr("src", src);
	$("#dialogs").dialog({
		width : width,
		height : height,
		title : title,
		inline : true,
		onClose:function(){
			//alert("关闭视频监控窗口！");
			$("#dialogFrame").attr("src", "");
			document.getElementById('dialogFrame').contentWindow.clsoDeviceAll();
		}
	});
}

function closeDialog(){
	$("#dialogFrame").attr("src", "");
	$('#dialogs').dialog('close');
}


	//获取紧急报警	
function getUrgentAlarm(){
   var alarmType=1;//紧急报警
   var showUrgentAlarm=$.cookie("showUrgentAlarm");
   if(showUrgentAlarm=="true"){
	   var urgentAlarmList='<table cellpadding="0" cellspacing="0" class="form">';
	   urgentAlarmList+='<tr><th width="10%">序号</th><th  width="40%">车牌号</th><th  width="50%">报警时间</th></tr>';
	   var totalCount=0;
		$.ajax({
			url:"monitorCenter/findRealTimeAlarms.action",
			type:"POST",
			dataType:"json",
			data:{"alarmType":alarmType,"registrationNo":"","alarmSourceNo":"ty"},
			success:function(data){
			$(data).each(function(i,n){
				try{
					var registrationNo=n.registrationNo;
					var alarmTime=n.alarmTime;
					 totalCount=i+1;
					urgentAlarmList+='<tr><td nowrap="nowrap"  align="left">'+totalCount+'</td><td nowrap="nowrap"  align="left">'+registrationNo+'</td><td nowrap="nowrap"  align="left">'+alarmTime+'</td></tr>';
				}catch(e){
					alert(e);
				}
			});	
			urgentAlarmList+='</table>';
			if(totalCount>0){
				 $.messager.show({
						title:'紧急报警',
						width:800,
						height:250,
						msg:urgentAlarmList,
						timeout:2000,
						showType:'show'
					});
			}
			
		   }
			
		});
   }
	setTimeout("getUrgentAlarm()", 10000);
} 

function getUplineAndDownLinVehicle(){
	var showUpdwonLineVehicle=$.cookie("showUpdwonLineVehicle");
	if(showUpdwonLineVehicle=="true"){
		var vehicleList='<iframe src="common/updownLine.jsp" id="mainFrame"  name="mainFrame" width="100%" height="100%"  frameborder="0" scrolling="auto"></iframe>';
		$.messager.show({
				title:'上下线车辆',
				width:600,
				height:400,
				msg:vehicleList,
				showSpeed:1000,
				timeout:5000,
				showType:'show'
			});
	}
	 setTimeout("getUplineAndDownLinVehicle()", 60000);
}

/***检测是否有证件过期提醒***/
function getshowProveBack(){
	var  showProveBack=$.cookie("showProveBack");
	if(showProveBack=="true"){
		
		var proveBackList='<table cellpadding="0" cellspacing="0" class="form">';
		   proveBackList+='<tr><th width="10%">车牌号</th><th  width="35%">证件类型</th><th  width="35%">过期时间</th><th  width="20%">操作</th></tr>';
		   var totalCount=0;
			$.ajax({
				url:"proveInfoManage/findProveNameListBack.action",
				type:"POST",
				dataType:"json",
				data:{"type":"null"},//没用到参数
				success:function(data){
				$(data).each(function(i,n){
					try{
						var registrationNO=n.registrationNO;//车牌号码
						var proveName=n.proveName;//证件名称【类型】
						var endTime = n.endTime; //过期时间
						var id = n.id; //信息id
						 totalCount=i+1;
						 if(resources!=null){
							 //判断访问权限
							 if(resources.indexOf("|updProveInfo|")!=-1){
								 proveBackList+='<tr><td nowrap="nowrap"  align="count">'+registrationNO+'</td><td nowrap="nowrap"  align="count">'+proveName+'</td><td nowrap="nowrap"  align="count">'+endTime+'</td><td nowrap="nowrap"  align="count">'+"<a style='cursor:hand; cursor:pointer;' onMouseOut='style.color=\"#000000\"'    onMouseMove='style.color=\"#0000FF\"' onclick='onProveInfoOnclick("+id+")'>操作管理</a>"+'</td></tr>';
							 }else{
								 proveBackList+='<tr><td nowrap="nowrap"  align="count">'+registrationNO+'</td><td nowrap="nowrap"  align="count">'+proveName+'</td><td nowrap="nowrap"  align="count">'+endTime+'</td><td nowrap="nowrap"  align="count"></td></tr>';
							 }
						 }else{
							 proveBackList+='<tr><td nowrap="nowrap"  align="count">'+registrationNO+'</td><td nowrap="nowrap"  align="count">'+proveName+'</td><td nowrap="nowrap"  align="count">'+endTime+'</td><td nowrap="nowrap"  align="count"></td></tr>';
						 }
						
					}catch(e){
						alert(e);
					}
				});	
				proveBackList+='</table>';
				if(totalCount>0){
					 $.messager.show({
							title:'证件过期提醒！',
							width:800,
							height:250,
							msg:proveBackList,
							timeout:10000,
							showType:'show'
						});
				}
				
			   }
				
			});
		
	}else{
	}
	//60秒检测一次
	setTimeout("getshowProveBack()", 60000);
}

/**
 * 证件提醒点击跳转到操作管理页面
 * id 证件信息管理模块的数据id
 **/
function onProveInfoOnclick(id){
	document.getElementById('mainIndexFrame').contentWindow.document.getElementById('topFrame').contentWindow.proveInfoOnclick(id);
}


/**设置cookeies**/
function setCookies(){
	var  showUpdwonLineVehicle=$.cookie("showUpdwonLineVehicle");
	if(showUpdwonLineVehicle=="null"||showUpdwonLineVehicle==null){
		$.cookie("showUpdwonLineVehicle","false",{"expires":30,"path":"/"});
	}
	var  showUrgentAlarm=$.cookie("showUrgentAlarm");
	if(showUrgentAlarm=="null"||showUrgentAlarm==null){
		$.cookie("showUrgentAlarm","false",{"expires":30,"path":"/"});
	}
	
	/**证件过期提醒设置**/
	var  showProveBack=$.cookie("showProveBack");
	if(showProveBack=="null"||showProveBack==null){
		$.cookie("showProveBack","true",{"expires":30,"path":"/"});
	}
	
}
/**显示系统公告**/
function getSystemNoticeSet(){
	openDialog("basicBlue/systemNotice/systemNoticePage.jsp",480, 415, '系统公告');

}

/**首页操作指示*/
function showHandle(){
	document.getElementById("guide-step").style.display = "block";
	showSearchTip();
	setSearchTip();
}

/**显示隐藏图片的div层*/
function getShowHideDiv(){
	  var div = document.getElementById("showHideDiv");
      if (div.style.display == "block") {
          div.style.display = "none";
      } else if (div.style.display == "none") {
          div.style.display = "block"
      }
}

/**显示终端信息*/
function openIcon(basePath,id){
	//mainIndexFrame为index3的iframe的id， bottomFrame为在index3页面里bottom的bottomFrame的id
	if(id=="openLowerLevelMessage"){
	 document.getElementById('mainIndexFrame').contentWindow.document.getElementById('bottomFrame').contentWindow.openLowerLevelMessage(basePath);
	}else if(id=="openHigherLevelMessage"){
	 document.getElementById('mainIndexFrame').contentWindow.document.getElementById('bottomFrame').contentWindow.openHigherLevelMessage(basePath);	
	}else if(id=="setSystemNotice"){
	 document.getElementById('mainIndexFrame').contentWindow.document.getElementById('bottomFrame').contentWindow.setSystemNotice(basePath);	
	}else if(id=="setParams"){
     document.getElementById('mainIndexFrame').contentWindow.document.getElementById('bottomFrame').contentWindow.setParams(basePath);	
	}else if(id=="showHandle"){
	  //菜单跳转到首页
	 document.getElementById('mainIndexFrame').contentWindow.document.getElementById('topFrame').contentWindow.addModule('mainFrame_index','../common/main.jsp','首页');	
	 //改变一级菜单的样式
	 document.getElementById('mainIndexFrame').contentWindow.document.getElementById('topFrame').contentWindow.cssTitleOn('首页');  
	 showHandle();	
	}else if (id=="showVehicleHandle"){
		//菜单跳转到车辆监控
      document.getElementById('mainIndexFrame').contentWindow.document.getElementById('topFrame').contentWindow.addModule('mainFrame','../monitorCenter/monitor.jsp?parenId=56','车辆监控');	
      //改变一级菜单的样式
      document.getElementById('mainIndexFrame').contentWindow.document.getElementById('topFrame').contentWindow.cssTitleOn('车辆监控');  
      showVehicleHandle();		
	}else if(id=="systemHelp"){
		window.open(basePath+'common/help/frame.htm',"_blank");  	
	}
	document.getElementById("showHideDiv").style.display = "none";
}

/**显示车辆监控的操作指示*/
function showVehicleHandle(){
	document.getElementById("vehicleMonitoring-step").style.display = "block";
	showVehicleSearchTip();
	setSearchTipVehicle();
}