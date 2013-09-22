/**
 * UserAction.java
 * Create on 2012-2-8下午01:59:47
 * Copyright (c) 2012 by e_trans.
 */
package com.etrans.bubiao.action.sys;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

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
import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.Result;
import com.etrans.bubiao.entities.WorkUnit;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.bubiao.services.sys.CustomMapServices;
import com.etrans.bubiao.services.sys.EnterUserServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.encrypt.CsEncodeUtils;
import com.etrans.common.util.json.JSONUtil;
import com.etrans.common.util.web.Struts2Utils;
/**
 * @author Ivan
 * @version 1.0
 * @brief 用户Action
 */

@Controller
@Namespace("/sys/user")
@Scope("prototype")
public class EnterUserAction extends BaseAction{
	
	private static final long serialVersionUID = -306092009304943914L;
 
 	protected Logger log = LogManager.getLogger(this.getClass().getName());
 
 	/**
 	 * 用户信息Services
 	 */
 	@Autowired
 	private EnterUserServices enterUserServices; 
 	/**
 	 * IbatisServices
 	 */
	@Autowired
	private IbatisServices ibatisServices;
 	/**
 	 * 图层Services
 	 */
	@Autowired
	private CustomMapServices customMapServices;
	/**
	 * 工作单位列表
	 */
	private List<WorkUnit> workUnitList;
 
	/**
	 * 新增企业用户信息
	 */
 	@Action("createEnterUser")
	public void createEnterUser() {
 		try {
		Map<String, Object> insertParamMap = getParameterMap();
		
		SessionUser user = UserContext.getLoginUser();
		insertParamMap.put("CreateUserId",UserContext.getLoginUser().getUserID());
		insertParamMap.put("IsSuperUser","0");  // 不管是企业管理还是普通管理员此标志都为0,预留的超级管理员为1
		insertParamMap.put("IsShowHandle","0");  //  添加是否显示操作指示默认为0
		insertParamMap.put("IsShowNotice","0"); 
		insertParamMap.remove("PasswordA");
		insertParamMap.put("Password", CsEncodeUtils.Encrypt(insertParamMap.get("Password").toString()));
		insertParamMap.put("Status", "0");
		insertParamMap.put("CreateTime", new Date());
		/*// 企业管理员创建用户直接取管理员所在企业ID
		if(!UserContext.isBsRootUser())*/
		//insertParamMap.put("WorkUnitID",insertParamMap.get("WorkUnitID"));
		Object insertId = ibatisServices.insertIbatisObject("addEnterUserSQL", insertParamMap);	
		LogUtil.insertLog(LogActionTypes.INSERT, "成功", "企业用户信息", "", "新增企业用户");
	    if(insertId!=null){
	    	Map<String, Object> map = new HashMap<String, Object>();
	    	map.put("id", insertParamMap.get("WorkUnitID").toString());
	    	map.put("AdminUserID", insertId);
	    	ibatisServices.updateIbatisObject("updateAdminUserIDS", map);
	    }
//			// 更新企业表的AdminId
//			String id=String.valueOf(insertId);
//		    enterUserServices.setUserId(Long.parseLong(id));
//			Integer oldUserId = enterUserServices.updateWorkUnitAdminId(
//					Long.parseLong(String.valueOf(insertId)),
//					Long.parseLong((String)insertParamMap.get("WorkUnitID"))
//			);
			String menuIcoIds="4,19,8,15,9,17,5,6";
			String menuIds="56,72,92,323,335,328,497,492";
			String nameMenus="车辆监控,车辆信息管理,企业信息管理,历史报警查询,历史图片查询,车辆报警统计,企业用户管理,兴趣点设置";
			String[] arrMenuIcoIds=menuIcoIds.split(",");
			String[] arrMenuIds=menuIds.split(",");
			String[] arrnameMenuNames=nameMenus.split(",");
			
			List<Map<String, Object>> paramsMapList=new ArrayList<Map<String, Object>>();
			for(int i=0;i<arrMenuIcoIds.length;i++){
				   Map<String, Object> MenuMap = new HashMap<String, Object>();
				    MenuMap.put("userId",insertId);
				    MenuMap.put("functionMenuId", arrMenuIds[i]);
				    MenuMap.put("name", arrnameMenuNames[i]);
				    MenuMap.put("menuIocId", arrMenuIcoIds[i]);
				    paramsMapList.add(MenuMap);
			}
				
			ibatisServices.batchInsertIbatisObject("addUserMenuSQL", paramsMapList);	
			
			customMapServices.addPub_CustomMapLayer("默认图层",3, (Integer)insertId);
			this.renderText("SUCCESS");
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.INSERT, "失败", "企业用户信息", "", "新增或更换企业管理员");
			e.printStackTrace();
			log.error(e.getMessage());
			this.renderText("FAIL");
		}
	}
	/**
	 * 查询工作单位列表
	 */
	@Action(value = "workUnitList")
 	public void workUnitList(){
		try {
			workUnitList = ibatisServices.queryForList(WorkUnit.class, "getAllWorkUnit",new HashMap());
		} catch (Exception e) {
			log.error(e.getMessage());
		}
 	}
 	
	/**
	 * 更新用户信息
	 */
	@Action(value = "editEnterUser")
	public void editEnterUser() {
		Result result = new Result();
		String flag="成功";
		try {			
			Map<String, Object> paramMap = new HashMap<String, Object>();
			paramMap.put("ID",getParameter("id"));
			paramMap.put("Name", getParameter("name"));
			paramMap.put("UserName", getParameter("username"));
			paramMap.put("IsSuperUser", "0");
			paramMap.put("Status", "0");
			paramMap.put("RunTime", getParameter("RunTime"));
			paramMap.put("OverTime", getParameter("OverTime"));
			paramMap.put("OverTime", getParameter("OverTime"));
			
			if(!UserContext.isBsRootUser()){
				paramMap.put("workUnitId",UserContext.getLoginUser().getWorkUnitID());
				
			}else{
				paramMap.put("workUnitId",getParameter("workUnitId"));
				
			}
			int j=ibatisServices.updateIbatisObject("updateUserSQL", paramMap);	
			if(j!=0){
				
				Map<String, Object> map2 = new HashMap<String, Object>();
				map2.put("id", getParameter("workUnitID2").toString());
				map2.put("AdminUserID", null);
				ibatisServices.updateIbatisObject("updateAdminUserIDS", map2);
				
				Map<String, Object> map = new HashMap<String, Object>();
		    	map.put("id", paramMap.get("workUnitId").toString());
		    	map.put("AdminUserID", paramMap.get("ID").toString());
		    	ibatisServices.updateIbatisObject("updateAdminUserIDS", map);
			}
			
			
			result.setCode(0);			
		} catch (Exception e) {
			log.error(e.getMessage());
			result.setMsg("网络繁忙,请重试!");
			 flag="失败";
		}finally{
			LogUtil.insertLog(LogActionTypes.INSERT, flag, "企业用户信息", "", "修改企业用户");
		}
		this.renderJSON(result);
	}

	/**
	 * 修改密码
	 */
	@Action(value = "passwordUpdate")
	public void passwordUpdate() {
		String flag="成功";
		try {
			String password = this.getParameter("txtPassword");
			System.out.println("password=" + password);
			String MD5Str =CsEncodeUtils.Encrypt(password);
			//String MD5Str = MD5Util.getMD5String(password);
			Map<String, Object> mapParam = new HashMap<String, Object>();
			SessionUser user = UserContext.getLoginUser();
			user.setPassword(MD5Str);
			mapParam.put("ID", user.getUserID());
			mapParam.put("Password", MD5Str);
			enterUserServices.updatePassword(mapParam);
			this.renderText("true");
		} catch (Exception e) {
			log.error("更改用户密码失败!" + e.getMessage());
			flag="失败";
			this.renderText("false");
		}finally{
			LogUtil.insertLog(LogActionTypes.INSERT, flag, "用户信息", "", "修改用户");
		}
	}
	
	/**
	 * 检查当前创建的用户所在企业是否已经存在企业管理员
	 */
	@Action(value="checkWorkUnitAdmin")
	public void checkWorkUnitAdmin(){
		String flag = "true";
		try {
			SessionUser user = UserContext.getLoginUser();
			//if("admin".equals(user.getUserName())){
				String workUnitId = this.getParameter("WorkUnitID");
				HashMap<String,Object> map = new HashMap<String,Object>();
				map.put("id", workUnitId);
				WorkUnit workUnit = ibatisServices.queryForObject(WorkUnit.class, "getWorkUnitById", map);
				if(workUnit!=null){
					if(workUnit.getAdminUserId()!=null && workUnit.getAdminUserId().length()>0){
						flag = "false";
					}
				}
			//}			
		} catch (Exception e) {
			log.error(e.getMessage());
			flag = "false";
		}
		this.renderText(flag);
	}
	
	/**
	 * 检查密码
	 */
	@Action(value="checkUserPassword")
	public void checkUserPassword(){
		try{
		String password = this.getParameter("txtOddPassword");
		SessionUser user = UserContext.getLoginUser();
		
		if(CsEncodeUtils.Encrypt(password).equalsIgnoreCase(user.getPassword())){
		//if(MD5Util.getMD5String(password).equalsIgnoreCase(user.getPassword())){
			this.renderText("true");
		}else{
			this.renderText("false");
		}
		}catch(Exception e){
			log.error(e.getMessage());
		}
	}
	/**
	 * 验证名称是否存在
	 */
	@Action(value = "checkUserName")
	public void checkUserName() {
		try {
			String id = getParameter("id");
			String name = getParameter("name");			
			
	        Map<String,Object> paramMap = new HashMap<String,Object>();
	        paramMap.put("id", id);
			paramMap.put("name", name);
			
			List<HashMap>  list = new ArrayList<HashMap>();
			HashMap mapUser =enterUserServices.getPubUserByName(paramMap);
			Result result = new Result();
			
			if(mapUser!=null && mapUser.size()>0){
				list.add(mapUser);
				result.setCode(1);				
				result.setMsg("登录名已存在！");
			}else{
				result.setCode(1);
			}
			result.setData(list.size());
			this.renderJSON(result);
		}catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	
	 /**
	 * 查询企业用户列表分页查询
	 */
	@Action(value = "findEnterUsers")
	public void findEnterUsers() {	
		try {
			Map<String,Object> params = FlexiGridUtil.parseParam(this.getGridParams());
			
			SessionUser user = UserContext.getLoginUser();
			
			params.put("userId",user.getUserID());
			
			
			//超级管理员
			if(UserContext.isBsRootUser()){
				params.put("IsSuperUser","");
			} 
			//企业管理员
			else if(user != null&&user.isWorkUnitSuperAdmin()){
				params.put("IsSuperUser","1");
				params.put("workunitid",user.getWorkUnitID());
				
			}//普通用户
			else{
				params.put("IsSuperUser","3");
				params.put("createUserId",user.getUserID());
			}
			
			this.renderJSON(JSONUtil.toJson(enterUserServices.findEnterUsers(params)));
			LogUtil.insertLog(LogActionTypes.READ, "成功", " 企业用户管理", "", "查询企业用户信息");
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.READ, "失败", " 企业用户管理", "", "查询企业用户信息");
			e.printStackTrace();
		}
		
		
	}
 
	 /**
	  * 查询单个用户
	  */
	 @Action("findUser")
	 public void findUser(){
		try{
			Map<String,Object> map = getParameterMap();
			map.put("nouse", new Random().nextLong());
			HashMap user = ibatisServices.queryForObject(HashMap.class, "findUserById", map);
			this.renderJSON(user);
		}catch (Exception e){
			log.error("查询单个用户异常,"+e.getMessage());
		}	
	 }

	 /**
	  * 删除用户
	  */
	@Action("deleteUser")
	public void deleteUser() {
		try {
			this.ibatisServices.deleteIbatisObject("delEnterUserSQL", getParameterMap());
			
			this.ibatisServices.deleteIbatisObject("delUserRole", getParameterMap());
			String isSuper = getParameter("isSuper");
//			long  workUnitId = Long.parseLong(getParameter("WorkUnitID"));
			
			// 如果被删除的用户是企业管理员，则需要将企业管理员置空
			if("1".equals(isSuper)){
//				String id=String.valueOf(getParameter("id"));
//			    enterUserServices.setUserId(Long.parseLong(id));
//				enterUserServices.updateWorkUnitAdminId(null,workUnitId);
				
				this.ibatisServices.deleteIbatisObject("delEnt_User_MenuSQL", getParameterMap());
				this.ibatisServices.updateIbatisObject("del_PubWorkUnit", getParameterMap());
				
			}
			customMapServices.delPubCustomMapLayer(getParameter("id"));
			this.renderText("SUCCESS");
		} catch (Exception e) {
			log.error(e.getMessage());
			this.renderText("FAIL");
		}
	} 
 
	 /**
	  * 重置密码
	  */
	 @Action(value = "passwordEdit")
	public void passwordEdit(){
     try {
		String id = getParameter("id");
		String password = getParameter("password");
 
		// 设置修改条件和修改参数
		Map<String,Object> paramMap = new HashMap<String,Object>();		
		paramMap.put("ID", id);
		paramMap.put("Password", CsEncodeUtils.Encrypt(password));
	//	paramMap.put("Password", MD5Util.getMD5String(password));
		
			ibatisServices.updateIbatisObject("passwordUpdateSql", paramMap);
			this.renderJSON("true");
		}catch (Exception e) {
			log.error(e.getMessage());
			this.renderJSON("false");
		}
	} 
	 
	
	 
@Action(value="setIsShowHandle")	 
public  void setIsShowHandle(){
	try {
		String isShowHandlestr = getParameter("isShowHandle");
		SessionUser user = UserContext.getLoginUser();
		Long userId=user.getUserID();
		int isShowHandle=Integer.parseInt(isShowHandlestr);
		enterUserServices.updateShowHandle(userId, isShowHandle);
		this.renderText("SUCCESS");
	} catch (Exception e) {
		log.error(e.getMessage());
		this.renderJSON("false");
	}
	
}
	 
	public List<WorkUnit> getWorkUnitList() {
		return workUnitList;
	}
	
	public void setWorkUnitList(List<WorkUnit> workUnitList) {
		this.workUnitList = workUnitList;
	}
 
}

