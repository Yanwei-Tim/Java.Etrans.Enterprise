var alarmTypeHashMap =null;
$(function() {
	$.messager.defaults={ok:"确定",cancel:"取消"};  
	var width= getWidth();
	 var height=getHeight();
		initAlarmType("alarmTypeSelect");
		initAlarmSource("sourceSelect");
	  $("#alarmMsgInfoList").flexigrid( {
		url : 'query/alarmMsgInfo/getHistoryAlarmMscInfo.action',
		dataType : 'json',
		params : getParams(),// 设置查询参数
	colModel : [
		{
			display : '外部报警信息ID',
			name : 'infoID',
			width : 80,
			sortable : false,
			hide:true,
			align : 'center'
		},
		{
			display : '报警ID',
			name : 'ID',
			width : 80,
			sortable : false,
			hide:true,
			align : 'center'
		},
		{
			display : '车辆ID',
			name : 'vehicleID',
			width : 80,
			sortable : false,
			hide:true,
			align : 'center'
		},
		{
			display : '通讯类型',
			name : 'kind',
			width : 80,
			sortable : false,
			hide:true,
			align : 'center'
		},
		{
			display : '开始报警时间',
			name : 'beginTime',
			width : 120,
			sortable : false,
			hide:true,
			align : 'center'
		},
		{
			display : '本段开始报警时间',
			name : 'startTime',
			width : 120,
			sortable : false,
			hide:true,
			align : 'center'
		},
		{
			display : '报警类型id',
			name : 'alarmKindID',
			width : 80,
			sortable : false,
			hide:true,
			align : 'center'
		},{
			display : '报警类型',
			name : 'alarmName',
			width : 120,
			sortable : false,
			align : 'center'
		},
			{
			display : '报警时间',
			name : 'alarmTime',
			width : 150,
			sortable : true,
			align : 'center'
		},
		{
			display : '报警次数',
			name : 'alarmCount',
			width : 70,
			sortable : true,
			align : 'center'
		},
		{
			display : '车牌号码',
			name : 'registrationNo',
			width : 120,
			sortable : true,
			align : 'center'
		},
		 {
			display : '车牌颜色',
			name : 'registrationNOColor',
			width : 70,
			sortable : false,
			align : 'center'
		},
		{
			display : '所属单位',
			name : 'workunitName',
			width : 200,
			sortable : false,
			align : 'center'
		},
		{
			display : '报警来源',
			name : 'sourceId',
			handlefunction : 'getSourceColumn',
			paramcolnames : ['sourceId'],
			width : 120,
			sortable : false,
			align : 'center'
		},
		{
			display : '经度',
			name : 'longitude',
			width : 120,
			sortable : false,
			align : 'center'
		},
		{
			display : '纬度',
			name : 'latitude',
			width : 120,
			sortable : false,
			align : 'center'
		},
		{
			display : '速度',
			name : 'speed1',
			width : 120,
			sortable : false,
			align : 'center'
		},
		{
			display : '报警位置',
			name:'araddess',
			width : 250,
			sortable : false,
			align : 'center'
		}
//		,
//		{
//			display : '报警位置',
//		    handlefunction : 'getAddressColumn',
//			paramcolnames : ['ID','longitude','latitude'],
//			name:'id',
//			width : 250,
//			sortable : false,
//			align : 'center'
//		}
		,{
			display : '是否处理',
			name : 'isHandle',
			handlefunction : 'getIsHandleColumn',
			paramcolnames : ['ID','vehicleID','alarmKindID','beginTime','startTime','isHandle','alarmCount'],
			width :500,
			sortable : false,
			align : 'center'
		}
		],
		
		sortname : "ID",//第一次加载数据时排序列
		sortorder : "desc",//第一次加载数据时排序类型
		usepager : true,//是否分页，默认为true。
		showTableToggleBtn : true,//是否显示收起/打开按钮,默认不显示。
		useRp : true,//是否可以动态设置每页显示的结果数，默认为false。
		checkbox : true,//是否要多选框,默认为false。
		rp : 8,//每页记录数，默认为10
		singleSelect:false,
		width : 'auto',//表格宽度
		height : getHandleHeight()-20//表格高度
	});
	
	//按钮绑定点击事件
    $('#searchBtn').bind('click').bind('click', doSearch);
    $('#exportBtn').bind('click', toExportExl);
    $('#adSearchBtn').bind('click', toOpenAds);
	  $("#btnHandleAlarm").click(toHandleAlarm);
	  $("#cancelBtn").click(hide);
    
});

function getIsHandleColumn(id,vehicleId,alarmKindId,beginTime,startTime,IsHandle,alarmCount){
	var handleStr ="未处理";
	if(IsHandle==true||IsHandle=='true'){
	 handleStr="<span id=dealAlarm"+id+"><a href='javascript:void(0)' onclick='showDealAlarmInfo("+id+","+vehicleId+ ","+alarmKindId+ ",\""+beginTime+ "\",\""+startTime+"\",\""+alarmCount+"\")'>显示处理信息</a></span>";
	}
	return handleStr;
}
function getAddressColumn(id,lng,lat){
	var addressStr="<a href='javascript:void(0)' onclick='showAddress("+id+","+lng+ ","+lat+")'>显示位置</a><span id=address"+id+"></span>";
	return addressStr;
}
function getSourceColumn(sourceId){
	var sourceDesc="其它";
	if(sourceId==1){
		sourceDesc="车载终端";
	}else if(sourceId==2){
		sourceDesc="企业监控平台";
	}else if(sourceId==3){
		sourceDesc="政府监管平台";
	}else if(sourceId==10){
		sourceDesc="平台";
	}
	return sourceDesc;
}
function showAddress(id,lng,lat){
	  $("#address" + id).html("->正在加载报警地点...");
	 var param={
    		 date:new Date(),
             lnglat:lng+","+lat
	 }
     $.post("monitorCenter/getAddressRepeat.action", param, function(back) {
        var data=back;//back.responseXML;
        try{
        	if(data.status=="ok"){
        		$("#address" + id).html("->"+data.result.district_text);
			}else{
				$("#address" + id).html(data.result.error);
			}
        	
        }catch(e){
        	$("#address" + id).html('->因网络不畅，数据加载未完成，请稍后再试!');
        }
	     
	},"json");	
 
}
/**
 * 多条件查询方法
 */
function doSearch() 
{
	// 重置表格的某些参数
	$("#alarmMsgInfoList").flexOptions({
				newp : 1,// 设置起始页
				params : getParams()// 设置查询参数
			}).flexReload();// 重新加载
	document.getElementsByName("vehicleIds")[0].value="";
	document.getElementsByName("registrationNO")[0].value="";

}

function getParams(){
		var registrationNo = $("#registrationNO").val();
	   registrationNo=lrtrim(registrationNo);
	   var workunitName = $("#workUnitNameParam").val();
	   workunitName=lrtrim(workunitName);
	var alarmTypeSelect  = $("#alarmTypeSelect").val();
	var alarmSourceSelect  = $("#sourceSelect").val();
	var endTime  = $("#endDate").val();
	var beginTime  = $("#startDate").val();
	var isDoWith = $("input[name=isDoWith]:checked").val();
	
	var vehicleIds = null;
	if(registrationNo==""){
		vehicleIds="";
	}else{
		vehicleIds=$("#vehicleIds").val();
	}
	
	//查询参数
	var params = [{
		name : '@VehicleIds',
		value : vehicleIds
	} ,{
		name : '@StartTime',
		value : beginTime
	} ,{
		name : '@EndTime',
		value : endTime
	} ,{
		name : '@RegistrationNo',
		value : registrationNo
	},{
		name : '@AlarmType',
		value : alarmTypeSelect
	},{
		name : '@WorkUnitName',
		value : workunitName
	},{
		name : '@IsDoWith',
		value : isDoWith
	},{
		name : '@SourceId',
		value : alarmSourceSelect
	}];
	return params;
}

	

/**
 * 导出方法入口
 */
function toExportExl(){
	exportExl('alarmMsgInfoList','query/alarmMsgInfo/historyAlarmMscInfoExportExl.action');
}
function toOpenAds(){
	var adSearch=$("#adSearch");
	adSearch.animate({height: 'toggle', opacity: 'toggle'}, 10);
	var adSearchBtn=$("#adSearchBtn");
	if(adSearchBtn.html()=='高级搜索'){
		adSearchBtn.html("收起高级搜索");
	}else{
		adSearchBtn.html("高级搜索");
	}
}

/**
 * 新增加方法入口
 */
function toHandleAlarm(){
	$("#submitBtn").unbind("click");
	show();
	$('#submitBtn').bind('click', doCreate);
}

/**
 * 执行后台方法新增数据
 */
function doCreate(){
	var flag = $("#addForm").beforeSubmit();
	if(flag){
	var rows=$("#alarmMsgInfoList").getSelectedRows();
	var alarmId="";
	var vehicleId="";
	var alarmKindID="";
	var beginTime="";
	var startTime="";
	var alarmCount="";
	var kind="";
	var infoID="";
	
	 if(rows.length<=0){
		$.messager.alert('提示信息','请至少选择一条报警信息！','info'); 
		return;
	}
	 
		var content= $("#content").find("option:selected").text();
		var handleConent=$("#handleConent").val();
		content+=";"+handleConent;
		var  handleValue=$("#content").val();
		$(rows).each(function(i, n) {
			var row=new Object;
		    $('td:nth-child(2)', n).each(function(i) { 
		    	infoID=$(this).children('div').text();
		    });
		    $('td:nth-child(3)', n).each(function(i) { 
		    	alarmId=$(this).children('div').text();
	        });   
  	        $('td:nth-child(4)', n).each(function(i) { 
  	            vehicleId=$(this).children('div').text();
  	        });
  	        $('td:nth-child(5)', n).each(function(i) { 
	            kind=$(this).children('div').text();
	        });
  	        $('td:nth-child(6)', n).each(function(i) { 
  	            beginTime=$(this).children('div').text();
  	        });
  	        $('td:nth-child(7)', n).each(function(i) { 
  	        	startTime=$(this).children('div').text();
  	        });
  	        $('td:nth-child(8)', n).each(function(i) { 
  	        	alarmKindID=$(this).children('div').text();
  	        });
  	        $('td:nth-child(11)', n).each(function(i) { 
  	        	alarmCount=$(this).children('div').text();
  	        });
	     	var jsonParams = {
	     			vehicleId : vehicleId,
	     			beginTime : beginTime,
			        startTime : startTime,
			        alarmKindID : alarmKindID,
			        alarmCount : alarmCount,
			        content:content,
			        handleValue:handleValue,
			        kind:kind,
			        infoID:infoID,
			        alarmId:alarmId,
			        datetimes : new Date()
	     	};
	     	$.ajax({
			    type : "POST",
			    url : "query/alarmMsgInfo/addDealAlarm.action",
			    data : jsonParams,
			    dataType : "JSON",
			    success : function(data) {
			    	hide();
			    },
			    error : function(data) {
			    	$.messager.alert('提示信息','因网络不畅，操作失败 ，请稍后再试！','info'); 
			    }
	     	});
		});
	$("#alarmMsgInfoList").flexReload();
	}
}

function showDealAlarmInfo(id,vehicleId,alarmKindId,beginTime,startTime,alarmCount){
//	alert(id+"#"+vehicleId+"#"+alarmKindId+"#"+beginTime+"#"+startTime+"#"+alarmCount);
	 $("#dealAlarm" + id).html("->正在加载处警信息...");
	 var param={
    		 date:new Date(),
             vehicleId:vehicleId,
             alarmKindId:alarmKindId,
             beginTime:beginTime,
             startTime:startTime,
             alarmCount:alarmCount,
             id : id
	 }
	 var dealAlarmInfo="<a href='javascript:void(0)' onclick='putAway("+id+","+vehicleId+ ","+alarmKindId+ ",\""+beginTime+ "\",\""+startTime+"\",\""+alarmCount+"\")'>收起处理内容</a><br/>";
 	$.ajax({
		url:"query/alarmMsgInfo/queryDealAlarmInfo.action",
		type:"POST",
		dataType:"json",
		data: param,
		success:function(data){
		$(data).each(function(i,n){
			var transactMan=n.userName;
			var transactTime=n.transactTime;
			var content=n.content;
			
			dealAlarmInfo+='处警人："'+transactMan+'" 处警时间： '+transactTime+' 处警内容:'+content+"<br/>";
		});
	  $("#dealAlarm" + id).html(dealAlarmInfo);
	   }
		
	});
}
 function putAway(id,vehicleId,alarmKindId,beginTime,startTime,alarmCount){
	 var dealAlarmInfo="<span id=dealAlarm"+id+"><a href='javascript:void(0)' onclick='showDealAlarmInfo("+id+","+vehicleId+ ","+alarmKindId+ ",\""+beginTime+ "\",\""+startTime+"\",\""+alarmCount+"\")'>显示处理信息</a></span>";;
	 $("#dealAlarm"+ id).html(dealAlarmInfo);
 }
function showDiaoLog(id){
	$("#"+id).animate({height: 'show', opacity: 'show'}, 10);
}
	
function hideDiaoLog(id){
$("#"+id).animate({height: 'hide', opacity: 'hide'}, 10);
}
