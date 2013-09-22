/*
 * formValidator for jQuery - terry form validator
 * author : lizhi.wang
 * date: 2012-03-22
 */
(function(jQuery) {

	var regexRule = {
			"isnotnull":{"regex":"none","alertText":"请输入"},
			"length":{"regex":"none","alertText1":"请输入","alertText2":"到","alertText3":"字符"},
			"ajaxAction":{"regex":"none","alertText":"已存在此条件的记录，请重新输入"},
			"ajaxLoad":{"regex":"none","alertText":"正在验证..."},
			"confirmpwd":{"regex":"none","alertText":"两次密码输入不一致"},
			"mobilephone":{"regex":/(^0?[1][358][0-9]{9}$)/,"alertText":"请输入有效手机号码"},
			"phone":{"regex":/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,"alertText":"请输入有效电话号码"},
			"email":{"regex":/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/,"alertText":"请输入有效邮件地址"},
			"ip":{"regex":/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,"alertText":"请输入有效IP"},
			"url":{"regex":/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,"alertText":"请输入有效网址"},
			"chinese":{"regex":/^[\u4e00-\u9fa5]+$/,"alertText":"请输入中文"},
			"chinaid":{"regex":/\d{17}[\d|X]|\d{15}/,"alertText":"请输入有效身份证号码"},
			"zipcode":{"regex":/^[1-9]\d{5}$/,"alertText":"请输入有效邮政编码"},
			"qq":{"regex":/^[1-9]\d{4,9}$/,"alertText":"请输入有效QQ号码"},
			"integer":{"regex":/^[\-\+]?\d+$/,"alertText":"请输入有效整数"},
			"onlyNumber":{"regex":/^[0-9]+$/,"alertText":"请输入数字"},
			"onlyNL":{"regex":/^[0-9a-zA-Z]+$/,"alertText":"请输入字母或数字"},
			"onlyLetter":{"regex":/^[a-zA-Z]+$/,"alertText":"请输入英文字母"},
			"noSpecialCaracters":{"regex":/^[0-9a-zA-Z\u4e00-\u9fa5]+$/,"alertText":"请输入中英文或数字"},
			"noselect":{"regex":"none","alertText":"请选择有效项"},
			"noselectmult":{"regex":"none","alertText":"请至少选择一个有效项"},
			"radio":{"regex":"none","alertText":"请选择一个单选框"},
			"checkbox":{"regex":"none","alertText":"请至少选择一个复选框"},
			"regexCustom":{"regex":"none","alertText":"请输入正确匹配值"}
	};
	
	/**
	 * 为DIV或FORM或TABLE绑定其包含的表单验证
	 */
	function formValidation(formid){
		bindOrTrigger(formid,0);
	}
	;
	
	/**
	 * 验证表单是否能提交
	 * @returns {Boolean}
	 */
	function canSubmit(formid){
		var haveError = true;
		$("#" + formid + " .errorMsg").each(function(i) {
			var disp = $(this).css('display');
			if(disp != 'none'){
				haveError = false;
				return false;
			}
		});
		if(haveError == false){
			return haveError;
		}
		bindOrTrigger(formid,1);
		
		$("#" + formid + " .errorMsg").each(function(i) {
			var disp = $(this).css('display');
			if(disp != 'none'){
				haveError = false;
			}
		});
		
		return haveError;
	}
	;
	
	/**
	 * 为表单绑定或是立即触发事件
	 * @param bindOrTrigger 0-绑定、1-立即触发
	 */
	function bindOrTrigger(formid,bindOrTrigger){
		if(bindOrTrigger == 0){
			$("#" + formid + " :input[formCheck='true']").each(function(i) {
				var formtype = this.type;
				if(formtype == "text" || formtype == "password" || formtype == "textarea"){
					$(this).bind('blur',formOnBlur);
				}
				if (formtype == "radio" || formtype == "checkbox" ){
					var checkboxId = $(this).attr("id");
					var callerName = $(this).attr("name");
					$("input[name='"+callerName+"']").each(function(i){
						$(this).bind('click',{id:checkboxId},checkboxOnClick);
					});
				}
				if (formtype == "select-one"){
					$(this).bind('change',selectOnChange);
				}
				if (formtype == "select-multiple"){
					$(this).bind('change',selectMultOnChange);
				}
			});
		}
		
		if(bindOrTrigger == 1){
			$("#" + formid + " :input[formCheck='true'][required='required']").each(function(i) {
				var formtype = this.type;
				if(formtype == "text" || formtype == "password" || formtype == "textarea"){
					$(this).trigger('blur',formOnBlur);
				}
				if (formtype == "radio" || formtype == "checkbox" ){
					var checkId = $(this).attr("id");
					noChecked(formtype,checkId);
				}
				if (formtype == "select-one"){
					var selectId = $(this).attr("id");
					noSelect(selectId);
				}
				if (formtype == "select-multiple"){
					var selectId = $(this).attr("id");
					noSelectMult(selectId);
				}
			});
		}
	}
	;

	/**
	 * blur事件处理
	 */
	function formOnBlur(){
		
		var id = $(this).attr("id");
		var val = $(this).val();
		var errorMsg = "";
		
		//不能为空
		var required = $(this).attr("required");
		if(required == true || required == "required"){
			
			if(isNotNull($.trim(val)) == false){
				var requiredError = $(this).attr("requiredError");
				errorMsg = requiredError == null ? regexRule.isnotnull.alertText : requiredError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}else{
			hideMsg(id);
		}
		
		//长度限制
		var textLength = $(this).attr("textLength");
		if(textLength && textLength != ""){
			var textl = textLength.split("-");
			if(isLength($.trim(val),textl[0],textl[1]) == false){
				var valLengthError = $(this).attr("valLengthError");
				errorMsg = valLengthError == null ? regexRule.length.alertText1 + textl[0] + regexRule.length.alertText2 + textl[1] + regexRule.length.alertText3 : valLengthError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//邮箱格式
		var email = $(this).attr("email");
		if(email == "true" || email == "email"){
			if(isEmail(val) == false){
				var emailError = $(this).attr("emailError");
				errorMsg = emailError == null ? regexRule.email.alertText : emailError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//手机号码
		var mobilephone = $(this).attr("mobilephone");
		if(mobilephone == "true" || mobilephone == "mobilephone"){
			if(isMobilephone(val) == false){
				var mobilephoneError = $(this).attr("mobilephoneError");
				errorMsg = mobilephoneError == null ? regexRule.mobilephone.alertText : mobilephoneError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//电话号码
		var phone = $(this).attr("phone");
		if(phone == "true" || phone == "phone"){
			if(isPhone(val) == false){
				var phoneError = $(this).attr("phoneError");
				errorMsg = phoneError == null ? regexRule.phone.alertText : phoneError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//IP地址
		var ip = $(this).attr("ip");
		if(ip == "true" || ip == "ip"){
			if(isIp(val) == false){
				var ipError = $(this).attr("ipError");
				errorMsg = ipError == null ? regexRule.ip.alertText : ipError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//中文
		var chinese = $(this).attr("chinese");
		if(chinese == "true" || chinese == "chinese"){
			if(isChinese(val) == false){
				var chineseError = $(this).attr("chineseError");
				errorMsg = chineseError == null ? regexRule.chinese.alertText : chineseError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//身份证
		var chinaid = $(this).attr("chinaid");
		if(chinaid == "true" || chinaid == "chinaid"){
			if(isChinaId(val) == false){
				var chinaidError = $(this).attr("chinaidError");
				errorMsg = chinaidError == null ? regexRule.chinaid.alertText : chinaidError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//邮编
		var zipcode = $(this).attr("zipcode");
		if(zipcode == "true" || zipcode == "zipcode"){
			if(isZipcode(val) == false){
				var zipcodeError = $(this).attr("zipcodeError");
				errorMsg = zipcodeError == null ? regexRule.zipcode.alertText : zipcodeError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//QQ
		var qq = $(this).attr("qq");
		if(qq == "true" || qq == "qq"){
			if(isQQ(val) == false){
				var qqError = $(this).attr("qqError");
				errorMsg = qqError == null ? regexRule.qq.alertText : qqError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//数字
		var onlyNumber = $(this).attr("onlyNumber");
		if(onlyNumber == "true" || onlyNumber == "onlyNumber"){
			if(isOnlyNumber(val) == false){
				var onlyNumberError = $(this).attr("onlyNumberError");
				errorMsg = onlyNumberError == null ? regexRule.onlyNumber.alertText : onlyNumberError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//整数
		var integer = $(this).attr("integer");
		if(integer == "true" || integer == "integer"){
			if(isInteger(val) == false){
				var integerError = $(this).attr("integerError");
				errorMsg = integerError == null ? regexRule.integer.alertText : integerError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//字母
		var onlyLetter = $(this).attr("onlyLetter");
		if(onlyLetter == "true" || onlyLetter == "onlyLetter"){
			if(isOnlyLetter(val) == false){
				var onlyLetterError = $(this).attr("onlyLetterError");
				errorMsg = onlyLetterError == null ? regexRule.onlyLetter.alertText : onlyLetterError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//字母或数字
		var onlyNL = $(this).attr("onlyNL");
		if(onlyNL == "true" || onlyNL == "onlyNL"){
			if(isOnlyNL(val) == false){
				var onlyNLError = $(this).attr("onlyNLError");
				errorMsg = onlyNLError == null ? regexRule.onlyNL.alertText : onlyNLError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		
		//中英文或数字
		var noSpecialCaracters = $(this).attr("noSpecialCaracters");
		if(noSpecialCaracters == "true" || noSpecialCaracters == "noSpecialCaracters"){
			if(isNoSpecialCaracters(val) == false){
				var noSpecialCaractersError = $(this).attr("noSpecialCaractersError");
				errorMsg = noSpecialCaractersError == null ? regexRule.noSpecialCaracters.alertText : noSpecialCaractersError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//两次密码相同
		var confirmpwd = $(this).attr("confirmpwd");
		if(confirmpwd && confirmpwd != ""){
			if(confirmPassword(confirmpwd,val) == false){
				var confirmpwdError = $(this).attr("confirmpwdError");
				errorMsg = confirmpwdError == null ? regexRule.confirmpwd.alertText : confirmpwdError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
		
		//AJAX后台验证
		var ajaxAction = $(this).attr("ajaxAction");
		if(ajaxAction && ajaxAction != ""){
			//显示正在加载信息
			showAjax(id,regexRule.ajaxLoad.alertText);

			//设置错误信息
			var ajaxActionError = $(this).attr("ajaxActionError");
			errorMsg = ajaxActionError == null ? regexRule.ajaxAction.alertText : ajaxActionError;
			
			//设置AJAX查询参数
			var ajaxData = {name:val};
			var ajaxDataId = $(this).attr("ajaxDataId");
			if(ajaxDataId && ajaxDataId != ""){
				var idparam = $("#" + ajaxDataId).val();
				if(idparam && idparam != ""){
					ajaxData.id = idparam;
				}
			}
			
			$.ajax({
			    type : "POST",
			    async : false,
			    url : ajaxAction,
			    data : ajaxData,
			    dataType : "JSON",
			    success : function(data) {
			    	if(data.code == '1'){
			    		var count = data.data;
			    		if(count > 0){
			    			showError(id,errorMsg);
			    			return;
			    		}else{
			    			hideMsg(id);
			    		}
			    	}else{
			    		showError(id,"服务器忙，请重试");
		    			return;
			    	}
			    },
			    error : function(data) {
			    	showError(id,"服务器忙，请重试");
			    }
		    });
		}
		
		//正则表达式
		var regexCustom = $(this).attr("regexCustom");
		if(regexCustom && regexCustom != ""){
			var reg = eval(regexCustom);
			if(testReg(val,reg) == false){
				var regexCustomError = $(this).attr("regexCustomError");
				errorMsg = regexCustomError == null ? regexRule.regexCustom.alertText : regexCustomError;
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}
	}
	;

	/**
	 * select-one on change 事件
	 */
	function selectOnChange(){
		
		var id = $(this).attr("id");
		var val = $(this).val();
		var errorMsg = "";
		var noselect = $(this).attr("noselect");
		if(noselect && noselect != ""){
			if(val == null || val == "" || val == "-1" || val == noselect){
				var requiredError = $(this).attr("requiredError");
				errorMsg = requiredError == null ? regexRule.noselect.alertText : requiredError;
				showError(id,errorMsg);
			}else{
				hideMsg(id);
			}
		}
	}
	;

	/**
	 * 提交时验证select是否选择。
	 * @param selectID
	 */
	function noSelect(selectID){
		
		var val = $("#" + selectID).val();
		var errorMsg = "";
		var noselect = $("#" + selectID).attr("noselect");
		if(noselect && noselect != ""){
			if(val == null || val == "" || val == "-1" || val == noselect){
				var requiredError = $("#" + selectID).attr("requiredError");
				errorMsg = requiredError == null ? regexRule.noselect.alertText : requiredError;
				showError(selectID,errorMsg);
			}else{
				hideMsg(selectID);
			}
		}
	}
	;

	/**
	 * select-multiple on change 事件
	 */
	function selectMultOnChange(){
		
		var id = $(this).attr("id");
		var errorMsg = "";
		var requiredError = $(this).attr("requiredError");
		errorMsg = requiredError == null ? regexRule.noselectmult.alertText : requiredError;
		
		var noselect = $(this).attr("noselect");
		var isError = false;
		if(noselect && noselect != ""){
			if($("#" + id + " option:selected").length==1){
				$("#" + id + " option:selected").each(function(){
					var selectedVal = $(this).val();
					if(selectedVal == noselect){
						isError = true;
					}
				});
			}
		}
		
		if(isError == true){
			showError(id,errorMsg);
		}else{
			hideMsg(id);
		}
		
	}
	;

	/**
	 * 提交时验证select-multiple是否选择。
	 * @param selectID
	 */
	function noSelectMult(selectID){
		
		var id = $("#" + selectID).attr("id");
		var errorMsg = "";
		
		var required = $("#" + selectID).attr("required");
		var requiredError = $("#" + selectID).attr("requiredError");
		errorMsg = requiredError == null ? regexRule.noselectmult.alertText : requiredError;
		
		if(required == true || required == "required"){
			if($("#" + id + " option:selected").length==0){
				showError(id,errorMsg);
				return;
			}else{
				hideMsg(id);
			}
		}else{
			hideMsg(id);
		}
		
		var noselect = $("#" + selectID).attr("noselect");
		var isError = false;
		if(noselect && noselect != ""){
			if($("#" + id + " option:selected").length==1){
				$("#" + id + " option:selected").each(function(){
					var selectedVal = $(this).val();
					if(selectedVal == noselect){
						isError = true;
					}
				});
			}
		}
		
		if(isError == true){
			showError(id,errorMsg);
		}else{
			hideMsg(id);
		}
	}
	;

	/**
	 * 复选框CLICK事件
	 */
	function checkboxOnClick(event){
		
		var id = event.data.id;
		var required = $("#" + id).attr("required");
		
		if(required == true || required == "required"){
			var errorMsg = "";
			var requiredError = $("#" + id).attr("requiredError");
			
			var callerName = $("#" + id).attr("name");
			if($("input[name='"+callerName+"']:checked").size() == 0) {
				errorMsg = requiredError == null ? regexRule.checkbox.alertText : requiredError;
				showError(id,errorMsg);
			}else{
				hideMsg(id);
			}
		}
		
	}
	;

	/**
	 * 单选框、复选框提交表单时验证
	 */
	function noChecked(formtype,checkId){
		
		var required = $("#" + checkId).attr("required");
		
		if(required == true || required == "required"){
			var errorMsg = "";
			var requiredError = $("#" + checkId).attr("requiredError");
			
			var callerName = $("#" + checkId).attr("name");
			if($("input[name='"+callerName+"']:checked").size() == 0) {
				if(formtype == "radio"){
					errorMsg = requiredError == null ? regexRule.radio.alertText : requiredError;
				}
				if(formtype == "checkbox"){
					errorMsg = requiredError == null ? regexRule.checkbox.alertText : requiredError;
				}
				showError(checkId,errorMsg);
			}else{
				hideMsg(checkId);
			}
		}
		
	}
	;

	/**
	 * 显示提示信息
	 * @param id
	 * @param msg
	 * @param type 0-显示红色框、1-显示灰色框
	 * @param closeable 能否关闭
	 */
	function showMsg(id,msg,type,closeable){
		var spanid = id;
		$("#" + spanid).css('display','');
		$("#" + spanid).html("");
		
		var prompt = $('<div>');
		prompt.addClass("formError");
		if(type == 1){
			prompt.addClass("blackPopup");
		}
		if(closeable == true || closeable == "true"){
			prompt.css({
				"cursor": "pointer"
		    });
			prompt.click(function(){
				hideMessage(spanid);
			});
		}
		
		var promptContent = $('<div>').addClass("formErrorContent").html(msg);
		promptContent.appendTo(prompt);
		if (!$.browser.msie) {
			$("#" + spanid).css('vertical-align','top');
		}
		$("#" + spanid).css('position','relative').append(prompt.css('position','absolute'));
		//ljy
		prompt.css({
//	        "top": -16,
	        "left": 5,
	        "marginTop": 0,
	        "opacity" : 0.8
	    });
	}
	;

	/**
	 * 显示错误提示信息
	 * @param id
	 * @param errorMsg
	 */
	function showError(id,errorMsg){
		showMsg(id + "span",errorMsg,0,false);
	}
	;

	/**
	 * 显示AJAX提示信息
	 * @param id
	 * @param ajaxMsg
	 */
	function showAjax(id,ajaxMsg){
		showMsg(id + "span",ajaxMsg,1,false);
	}
	;

	/**
	 * 去掉提示信息
	 * @param id
	 */
	function hideMsg(id){
		var spanid = id + "span";
		hideMessage(spanid);
	}
	;
	
	/**
	 * 去掉提示信息
	 * @param id
	 */
	function hideMessage(spanid){
		$("#" + spanid).html("");
		$("#" + spanid).css('display','none');
	}
	;

	/**
	 * 验证输入是否为空
	 * @param str
	 * @returns {Boolean}
	 */
	function isNotNull(str) {
		if (str.length < 1) {
			return (false);
		} else {
			return (true);
		}
	}
	;

	/**
	 * 验证输入字符的位数
	 * @param str
	 * @param min
	 * @param max
	 * @returns {Boolean}
	 */
	function isLength(str, min, max) {
		if (str.length <= max && str.length >= min) {
			return true;
		} else {
			return false;
		}
	}
	;

	/**
	 * 验证是否邮箱地址
	 * @param str
	 * @returns
	 */
	function isEmail(str){
		var reg = regexRule.email.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否手机号码
	 * @param str
	 * @returns
	 */
	function isMobilephone(str){
		var reg = regexRule.mobilephone.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否电话号码
	 * @param str
	 * @returns
	 */
	function isPhone(str){
		var reg = regexRule.phone.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否有效IP
	 * @param str
	 * @returns
	 */
	function isIp(str){
		var reg = regexRule.ip.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否中文
	 * @param str
	 * @returns
	 */
	function isChinese(str){
		var reg = regexRule.chinese.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否有效身份证
	 * @param str
	 * @returns
	 */
	function isChinaId(str){
		var reg = regexRule.chinaid.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否有效邮政编码
	 * @param str
	 * @returns
	 */
	function isZipcode(str){
		var reg = regexRule.zipcode.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否有效QQ
	 * @param str
	 * @returns
	 */
	function isQQ(str){
		var reg = regexRule.qq.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否全部为数字
	 * @param str
	 * @returns
	 */
	function isOnlyNumber(str){
		var reg = regexRule.onlyNumber.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否为整数
	 * @param str
	 * @returns
	 */
	function isInteger(str){
		var reg = regexRule.integer.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否全部为字母
	 * @param str
	 * @returns
	 */
	function isOnlyLetter(str){
		var reg = regexRule.onlyLetter.regex;
		return testReg(str,reg);
	}
	;
	
	/**
	 * 验证是否全部为字母或数字
	 * @param str
	 * @returns
	 */
	function isOnlyNL(str){
		var reg = regexRule.onlyNL.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 验证是否全部为中英文和数字
	 * @param str
	 * @returns
	 */
	function isNoSpecialCaracters(str){
		var reg = regexRule.noSpecialCaracters.regex;
		return testReg(str,reg);
	}
	;

	/**
	 * 正则表达式验证
	 * @param str
	 * @param reg
	 * @returns {Boolean}
	 */
	function testReg(str, reg) {
		if(str == ""){
			return (true);
		}
		if (reg.test(str)) {
			return (true);
		} else {
			return (false);
		}
		return (false);
	}
	;

	/**
	 * 验证两次密码是否一致
	 * @param pwdid
	 * @param val
	 * @returns {Boolean}
	 */
	function confirmPassword(pwdid,val){
		var password = $("#" + pwdid).val();
		if(password == val){
			return true;
		}
		else{
			return false;
		}
	}
	;

	/**
	 * FORM或DIV验证初始化方法
	 */
	jQuery.fn.validation = function(options) {

		var options = jQuery.extend({},options);
		
		var form = $(this);
		if(!form[0]) return false;
		
		return this.each(function() {
			var formId = $(this).attr("id");
			formValidation(formId);
	    });
		
	};

	/**
	 * 返回FORM或DIV验证结果
	 */
	jQuery.fn.beforeSubmit = function(options) {
		var flag = false;
		var form = $(this);
		if(!form[0]) return false;
		
		flag = canSubmit(form[0].id);
		return flag;
		
	};
	
	/**
	 * 显示提示或错误信息
	 */
	jQuery.fn.showMessage = function(options) {
		
		var options = jQuery.extend({
			type : "message",//message-提示信息、error-错误信息,默认为message
			closeable : true, //提示框能否关闭，默认为true；为true时，当点击提示框时关闭。
			text : ""//提示信息内容
		},options);
		
		var type = options.type;
		
		var span = $(this);
		if(!span[0]) return false;
		
		return this.each(function() {
			var spanId = $(this).attr("id");
			//type 0-显示红色框、1-显示灰色框
			if(type && type == "error"){
				showMsg(spanId,options.text,0,options.closeable);
			}else{
				showMsg(spanId,options.text,1,options.closeable);
			}
	    });
		
	};
	
	/**
	 * 关闭提示或错误信息
	 */
	jQuery.fn.closeMessage = function(options) {
		
		var options = jQuery.extend({},options);
		
		var span = $(this);
		if(!span[0]) return false;
		
		return this.each(function() {
			var spanId = $(this).attr("id");
			hideMessage(spanId);
			
	    });
		
	};

})(jQuery);