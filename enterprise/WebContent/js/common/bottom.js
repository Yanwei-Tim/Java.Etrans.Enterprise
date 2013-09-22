$(function(){
	checkStatus();
	hideSpanAll();
})
	    
var hasAlarm=false; //是否有报警
var alarmAudioFlag =true ;// 是否播放告警声音
//function checkStatus(){
//	//alert(1);
//	isHaveAlarm();
//	isHaveHigherLevelMessage();
//	isHaveLowerLevelMessage();
//	getLinkStatus();
//	setTimeout("checkStatus()", 5000);
//	//setTimeout("checkStatus()", 3000);
//}
// 过检启用
function checkStatus(){
	//alert(1);
	isHaveAlarm();
	isHaveHigherLevelMessage();
	isHaveLowerLevelMessage();
	getLinkStatus();
	setTimeout("checkStatus()", 5000);
	//setTimeout("checkStatus()", 3000);
}
function openHistoryGps(basePath){
	var  url=basePath+'monitorCenter/tempGpsInfo.jsp';
	parent.parent.openDialog(url, 1200, 480,"轨迹信息");
}

function openAlarm(basePath){
	
	parent.parent.document.getElementById('mainIndexFrame').contentWindow.document.getElementById('topFrame').contentWindow.onClickModule1();
	
	var url=basePath+'monitorCenter/realTimeAlarm.jsp?mainFrame_index='+parent.mainFrame_index.window;
    parent.parent.openDialog(url, 1200, 500,"实时报警");	
	    
    //var params = new Array();
	//params[0]=parent.mainFrame.window;
	//window.showModalDialog(basePath+'monitorCenter/realTimeAlarm.jsp', params,'dialogWidth=1100px;dialogHeight=500px,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no'); 
}
function openBatchCommand(basePath){
	var  url=basePath+'command/batch/batchIndex.jsp';
	parent.parent.openDialog(url, 1200, 480,"批量下发指令");
}
	function openHigherLevelMessage(basePath)
		{
		var  url=basePath+'monitorCenter/higherLevelMessage.jsp';
		parent.parent.openDialog(url, 1100, 500,"上级信息");
			//var params = new Array();
			//window.showModalDialog(basePath+'monitorCenter/higherLevelMessage.jsp', params,'dialogWidth=1100px;dialogHeight=500px,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no'); 
		}
	function openplatForm(basePath)
	{
	var  url=basePath+'command_platform/index.jsp';
	parent.parent.openDialog(url, 1100, 450,"平台指令");
		//var params = new Array();
		//window.showModalDialog(basePath+'monitorCenter/higherLevelMessage.jsp', params,'dialogWidth=1100px;dialogHeight=500px,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no'); 
	}
	function openLowerLevelMessage(basePath)
	{
		var  url=basePath+'monitorCenter/lowerLerverMessage.jsp';
		parent.parent.openDialog(url, 1100, 500,"终端信息");
		//var params = new Array();
		//window.showModalDialog(basePath+'monitorCenter/lowerLerverMessage.jsp', params,'dialogWidth=1100px;dialogHeight=500px,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no'); 
	}
/**
		* 是否有报警
		*/
		function isHaveAlarm()
		{
			$.ajax({
				url:"monitorCenter/isHaveAlarm.action",
				type:"POST",
				success:function(msg){
					if(msg =="true")
					{
						hasAlarm=true;
					  $("#imgAlarm").attr('src',"Images/ico/hot.gif");
					  if(alarmAudioFlag){
					  	 playvoice('wav_alarm'); // 播放报警声音
					  }else{
					  	stopvoice("wav_alarm");
					  }
					}
					else if(msg=="false")
					{
						hasAlarm=false;
						stopvoice("wav_alarm");
						$("#imgAlarm").attr('src',"Images/ico/footer_i_01_02.jpg");
						
					}
				}
				,complete: function (XHR, TS) { XHR = null } 
			});
		}
		
		/**
		* 是否有上级信息
		*/
		function isHaveHigherLevelMessage()
		{

			$.ajax({
				url:"monitorCenter/isPlatFormInfo.action",
				type:"POST",
				success:function(msg){
					if(msg =="true")
					{
					  $("#imgMessage").attr('src',"Images/ico/footer_i_02_02.jpg");
					}
					else if(msg=="false")
					{
						$("#imgMessage").attr('src',"Images/ico/footer_i_02.jpg");
						
					}
				}
			,complete: function (XHR, TS) { XHR = null }
			});
		}
		

		/**
		* 是否有下级信息
		*/
		function isHaveLowerLevelMessage()
		{

			$.ajax({
				url:"monitorCenter/isLowerPlatFormInfo.action",
				type:"POST",
				success:function(msg){
					if(msg =="true")
					{
					  $("#imgLowerMessage").attr('src',"Images/ico/footer_i_02_02.jpg");
					}
					else if(msg=="false")
					{
						$("#imgLowerMessage").attr('src',"Images/ico/zdxx.jpg");
						
					}
				}
			,complete: function (XHR, TS) { XHR = null }
			});
		}
		
		/**
		* 获取链路状态
		* 
		*/
		function getLinkStatus()
		{

			$.ajax({
				url:"command/getLinkStatus.action",
				type:"POST",
				success:function(msg){
				 $("#linkStatus").html(msg);
				}
				,complete: function (XHR, TS) { XHR = null }
			});
		}
// 播放声音
function playvoice(p_id) {
	var node = document.getElementById(p_id);
	if (node != null && alarmAudioFlag) {
		//wav_alarm.settings.playCount=10;
		wav_alarm.controls.play();
	}
}

// 停止播放声音
function stopvoice(p_id) {
	try {
		var node = document.getElementById(p_id);
		if (node != null) {
			wav_alarm.controls.stop();
		}
	} catch (e) {
	}
}

// 设置播放告警声音标识
function setAlarmAudioFlag() {
	if(alarmAudioFlag){//原来是播放声音
	alarmAudioFlag=false;
	stopvoice('wav_alarm'); // 停止播放报警声音
	 $("#imgWav").attr('src',"Images/ico/footer_i_03_02.jpg");
	
	}else{//原来是关闭报警声音
		alarmAudioFlag=true;
		if(hasAlarm){
		   playvoice('wav_alarm'); // 播放报警声音
		}
	 $("#imgWav").attr('src',"Images/ico/footer_i_03.jpg");
	}
}


function setParams(basePath)
{
	var  url=basePath+'common/system.jsp';
	parent.parent.openDialog(url, 300, 200,"弹窗设置");
}

/**重新打开层**/
function setparams2(divid,imageId){
	//alert("重新打开车辆信息层");
	hideshow(imageId,"none");
	parent.parent.openDiv(divid);
}

/**隐藏或则显示**/
function hideshow(id,type){
	//alert("laiel"+"type:"+type);
	if(type=="block"){
		$("#"+id).css("display", "block");
		$("#"+id+"2").show();
	}else if(type=="none"){
		$("#"+id).css("display", "none");
		$("#"+id+"2").hide();
	}
}
/**隐藏所有的快捷按钮**/
function hideSpanAll(){
	$("#vehilceInfoIoc2").hide();
	$("#controlIoc2").hide();
	$("#quicklyDivIoc2").hide();
	$("#photoDivIoc2").hide();
	$("#videoDivIoc2").hide();
}

/***系统公告设置**/
function setSystemNotice(basePath)
{
var  url=basePath+'basicBlue/systemNotice/systemNoticeHistory.jsp';
parent.parent.openDialog(url, 600, 560,"系统公告历史信息");

}

/**隐藏显示小图标**/
function openShowHideIcon(){
   parent.parent.getShowHideDiv();
}

