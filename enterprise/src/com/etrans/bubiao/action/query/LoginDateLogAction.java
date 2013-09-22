package com.etrans.bubiao.action.query;


import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.action.sys.log.LogActionTypes;
import com.etrans.bubiao.action.sys.log.LogUtil;
import com.etrans.bubiao.services.query.LoginDateLogServices;
import com.etrans.common.util.FlexiGridUtil;

/**
 * 登录日志Action
 * @author Administrator
 *
 */
@Controller
@Scope("prototype")
@Namespace("/query/log")
public class LoginDateLogAction extends BaseAction {
	
	private static final long serialVersionUID = 1L;
	
	protected Logger log = LogManager.getLogger(this.getClass().getName());
	
	@Autowired
	private LoginDateLogServices loginDateLogServices;
	
	public LoginDateLogServices getLoginDateLogServices() {
		return loginDateLogServices;
	}
	
	public void setLoginDateLogServices(LoginDateLogServices loginDateLogServices) {
		this.loginDateLogServices = loginDateLogServices;
	}

	/**
	 * 查询登录日志列表
	 */
	@Action(value = "getLoginLog")
	public void getLoginLog() {
		try {
			this.renderJSON(loginDateLogServices.getLoginLog(this.getGridParams(),new Random().nextLong()));
			LogUtil.insertLog(LogActionTypes.READ, "成功", "查询登录日志", "", "查询登录日志");
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.READ, "失败", "查询登录日志", "", "查询登录日志");
			e.printStackTrace();
			log.error("查询登录日志异常！"+e.getMessage());
		}
		
	}
	
	
	/**
	 * 导出终端列表到EXCEL
	 */
	@Action(value = "ToLoginLogExportExl")
	public void ToLoginLogExportExl() {
		
		Map<String,Object> params = FlexiGridUtil.parseParam(this.getGridParams());
		params = this.getExportParams(params);
		try {
			
			String[] titleArray = {};
			titleArray = new String[7];
			titleArray[0]="用户名";
			titleArray[1]="登录时间";
			titleArray[2]="登录主机";
			titleArray[3]="登录ip";
			titleArray[4]="登录状态";
			
			
			
			
			String[] columnArray = {};
			columnArray = new String[7];
			columnArray[0]="name";
			columnArray[1]="LogonTime";
			columnArray[2]="LogonHost";
			columnArray[3]="LogonIP";
			columnArray[4]="IsLogin";
			
			
			
			
			List<Map<String,Object>> rows = loginDateLogServices.getLoginLogList(params);
			exportExl("LoginLogList", titleArray, columnArray, rows);
			LogUtil.insertLog(LogActionTypes.READ, "成功", "登录日志", "", "导出登录日志信息");
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.READ, "失败", "登录日志", "", "导出登录日志信息");
			e.printStackTrace();
		}
	}

	
}
