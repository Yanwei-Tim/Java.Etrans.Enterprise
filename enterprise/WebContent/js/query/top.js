$(document).ready(function() {
	
	/**默认快捷方式选中第一项**/
	$(".tab-hd").each(function(){
		$(this).children().eq(0).addClass("active");
	});
	/**添加点击事件**/
	$("#menuls li").bind("click", onClickMenuLi);
	/**添加快捷标签点击事件**/
	addclickTitle();
	//隐藏图片
	hideImage("mainFrame_index_image");
	
	/**默认显示首页**/
	//实际用
	addModule('mainFrame_index','../common/main.jsp','首页');
	//过检
	//addModule('mainFrame','../monitorCenter/monitor.jsp?parenId=56','车辆监控');
	
	//过检用开放 parent.onloadW();
	//parent.onloadW();
	
});

/**
 * 快捷标签点击事件
 * @return
 */
function onClickModule(){
	//模块id
	var name = $(this).attr("name");
	//alert("显示模块："+name);
	openModeule(name);
	/**设置样式**/
	$(this).addClass("active").siblings().removeClass("active");
	var text = $(this).text();
	//alert(text);
	cssTitleOn(text);
	
	/**样式**/
//	topTitle(text);
}


/**
 * 先删除模块,添加模块
 * name 模块名称，模块id
 * src 连接地址
 * text 显示名称text
 **/
function addModule(name,src,text){
//	alert("1:"+name+" 2:"+src+" 3:"+text);
	/**先删除模块**/
	parent.deleteIframe(name);
	/**添加模块**/
	//父窗体对象【index3.jsp页面对象】
	var mainjsp = "<div id='"+name+"' style=' width: 100%; height: 100%;'>"+
	"<iframe  src='"+src+"' id=\""+name+"\" name='"+name+"' width='100%' style='border: 0px;' marginwidth='0' height='100%' frameborder='0' scrolling='no' ></iframe>"
	+"</div>";
	$("#mainjsp",window.parent.document).append(mainjsp);
	//显示首页模块，其他模块隐藏
	parent.blackIframe(name);
	
	/**先删除快捷标签**/
	deleteTitle(text);
	/**添加快捷标签**/
	addTitle(text,name);
	
}

/**
 * 显示已经加载的模块
 * name 要显示的模块id
 * @return
 */
function openModeule(name){
	parent.blackIframe(name);
}


/**
 * 功能描述：切换菜单
 * 
 * @author llq
 * @since Create on 2012-2-7
 * @version Copyright (c) 2012 by e_trans.
 */
function onClickMenuLi() {
	var url = $(this).attr("url");
	var parentId = $(this).attr("parentId");
	//parent.window.document.getElementById("mainFrame").src = url+"?parentId="+parseInt(parentId);
	
	/**添加一个模块并且显示当前添加的模块**/
	var src =url+"?parentId="+parseInt(parentId);
	var index = $(this).attr("index");
	var name ="iframe_"+index;
	var textName = $(this).text();//显示名称
	textName=$.trim(textName);
	if(textName=='车辆监控'){
		name="mainFrame";
	}
	if(textName=='首页'){
		name="mainFrame_index";
	}
	addModule(name,src,textName);
	
	/**样式**/
	$("#menuls li").each(function(i, n) {
		$(this).removeAttr("class");
	});
	$(this).attr("class", "btn_hit");
	
	/**样式**/
//	topTitle(textName);
}

/**
 * 重新设置一级菜单的选中样式
 * @return
 */
function cssTitleOn(name){
	$("#menuls li").each(function(i) {
		var text  = $(this).text();
		text = $.trim(text);
		if(text==name){
			$(this).attr("class", "btn_hit");
		}else{
			$(this).removeAttr("class");
		}
	});
}


/**
 * 删除快捷标签
 * @param name 显示名称
 * @return
 */
function deleteTitle(name){
	
	$('#titleDiv div').each(function(i){
		var text  = $(this).text();
//		alert("快捷标签名称："+text);
		if(text==name){
			$(this).remove();
		}else{
			$(this).removeClass("active");
		}
	}
	);
	
}

/**
 * 添加快捷标签
 * @param name 名称
 * @return text 显示字段
 */
function addTitle(text,name){
	var str ="<div class='active' name='"+name+"' id='"+name+"' style='width:80px;'><span><img id='"+name+"_image"+"' name='"+name+"' alt='"+$.trim(text)+"' src='Images/ico/x.gif' width='8' height='8' title='删除'/></span><em>"+$.trim(text)+"</em></div>";
	$("#titleDiv").append(str);
	/**添加事件**/
	addclickTitle();
	addOnmouseoverOrout();
	addImageClickClose();
	//隐藏图片
	hideImage(name+"_image");
}

/**
 * 给快捷标签点击事件添加点击事件
 * @return
 */
function addclickTitle(){
	$("titleDiv div").attr('click', '').unbind('click');
	/**添加快捷标签点击事件**/
	$("#titleDiv div").bind("click", onClickModule);
}

/**添加移入移出事件**/
function addOnmouseoverOrout(){
	//先解除事件
	$("#titleDiv div").attr('mouseover', '').unbind('mouseover');
	$("#titleDiv div").attr('mouseout', '').unbind('mouseout');
	
	$("#titleDiv div").bind("mouseover", addOnmouseoverTitleModule);
	$("#titleDiv div").bind("mouseout", addOnmouseoutTitleModule);
}

/**关闭按钮点击事件*/
function addImageClickClose(){
	//先解除事件
	$("#titleDiv span img").attr('click', '').unbind('click');
	$("#titleDiv span img").bind("click", addImageClickCloseModule);
}


/**
 * 用户退出
 */
function goUrl(url) {
	if (confirm("您确定要注销吗？")){
		top.location = url;
	}
}

//显示图片
function showImage(id){
//	alert("鼠标移入了。"+"id: "+id);
	$("#"+id).css("visibility","visible");
}

//隐藏图片
function hideImage(id){
//	alert("鼠标移出了。");
	$("#"+id).css("visibility","hidden");
}

/**显示图片**/
function addOnmouseoverTitleModule(){
	//alert("鼠标移入了。");
	var name = $(this).attr("name");
	$("#"+name+"_image").css("visibility","visible");
}

/**隐藏图片**/
function addOnmouseoutTitleModule(){
	//alert("鼠标移出了。");
	var name = $(this).attr("name");
	$("#"+name+"_image").css("visibility","hidden");
}

/**关闭点击事件**/
function addImageClickCloseModule(){
	var text = $(this).attr("alt");
	var name = $(this).attr("name");
//	alert("模块总数:"+parent.ModuleSize());
	if((Number(parent.ModuleSize())>1)&&(Number(TitleSize())>1)){
		deleteTitle(text);//删除快捷标题
		parent.deleteIframe(name);//删除内容模块
		//显示最后一个模块
		parent.lastlyModule();
		//设置样式
		addImageClickCloseModuleCss(Number(parent.ModuleSize())-1);
	}else{
		alert("不能删除最后一项！");
	}
}


/**设置样式**/
function addImageClickCloseModuleCss(ind){
//	alert("ind:"+ind+" name:"+name);
	$('#titleDiv div').each(function(i){
			if(i==ind){
				$(this).addClass("active").siblings().removeClass("active");
				cssTitleOn($(this).text());
			}
		}
	);
}


/**
 * 设置快捷标题的左边div宽度
 * @return
 */
function topTitle(text){
		if(text=='车辆监控'){
			$("#titleLeftDiv").width("258px");
		}else{
			$("#titleLeftDiv").width("214px");
		}
}
	

/**快捷标签总数**/
function TitleSize(){
	var countSize = $("#titleDiv div").size();
	return countSize;
}


/**
 * 验证是否选中车辆监控页面
 * @return 选中了返回true，没选中返回false
 */
function selectTitleValidate(){
	var result = 0;
	$('#titleDiv div').each(function(i){
		var text  = $(this).text();
//		alert("快捷标签名称："+text);
		if(text=="车辆监控"){
			var re = $(this).hasClass("active");
//			alert("ffffffff:  "+re);
			if(re){
				result=1;
			}
		}
	}
	);
	
	
	if(result==1){
		return true;
	}else if(result==0){
		return false;
	}
}

/**
 * 验证是否存在车辆监控选项
 * @return 存在true，不存在false
 */
function selectTitleValidateOK(){
	var result = 0;
	$('#titleDiv div').each(function(i){
		var text  = $(this).text();
		if(text=="车辆监控"){
				result=1;
		}
	}
	);
	
	if(result==1){
		return true;
	}else if(result==0){
		return false;
	}
}


function onClickModule1(){
	if(!selectTitleValidate()){
		openModeule("mainFrame");
		cssTitleOn('车辆监控');
	}
	
	if(!selectTitleValidateOK()){
		addModule('mainFrame','../monitorCenter/monitor.jsp?parenId=56','车辆监控');
	}
	
	$('#titleDiv div').each(function(i){
		var text  = $(this).text();
		if(text=="车辆监控"){
			/**css**/
			$(this).addClass("active").siblings().removeClass("active");
		}
	}
	);
}





/*********用作证件信息过期提醒begin************/

var moduleName="基础管理";//如果改名了，需要修改此名称【头部一级菜单名称】
var moduleName2="基础信息";//如果改名了，需要修改此名称【左边二级菜单名称】
var moduleName3URL="/sys/proveManage/proveInfo.jsp";//如果改名了，需要修改此名称【左边三级菜单URL】
var moduleParenId=7; //模块父id

/**
 *证件信息过期提醒 行 信息点击 “操作管理”
 */
function proveInfoOnclick(id){
	
	var src = '../sys/platformManagementMain.jsp?parentId='+parseInt(moduleParenId)+"&moduleName2="+moduleName2+"&moduleName3URL="+moduleName3URL+"&id="+id;
	var name ="iframe_"+getIndexValue(moduleName);
	addModule(name,src,moduleName);
	cssTitleOn(moduleName);
	
}

/**
 * 根据名称找到一级菜单的 index属性值
 * @return
 */
function getIndexValue(name){
	var result ="";
	$("#menuls li").each(function(i) {
		var text  = $(this).text();
		text = $.trim(text);
		if(text==name){
			result= $(this).attr("index");
		}
	});
	
	return result;
}


/*********用作证件信息过期提醒end**************/



