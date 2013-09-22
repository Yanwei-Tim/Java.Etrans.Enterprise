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

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.action.sys.log.LogActionTypes;
import com.etrans.bubiao.action.sys.log.LogUtil;
import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.Pub_UserGroup;
import com.etrans.bubiao.entities.VehicleGroup;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.bubiao.services.sys.CustomMapServices;
import com.etrans.bubiao.services.sys.UserManageServices;
import com.etrans.bubiao.services.sys.UserRoleServices;
import com.etrans.bubiao.services.sys.UserServices;
import com.etrans.bubiao.services.sys.VehicleGroupServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.Tools;
import com.etrans.common.util.encrypt.CsEncodeUtils;
import com.etrans.common.util.json.JSONUtil;
/**
 * @author yangzhen
 * @version 1.0
 * @brief 用户Action
 */

@Controller
@Namespace("/sys/userManage")
@Scope("prototype")
public class UserManageAction extends BaseAction{
	
	private static final long serialVersionUID = -306092009304943914L;
 
 	protected Logger log = LogManager.getLogger(this.getClass().getName());
 
 	
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
	
	
	@Autowired
	private VehicleGroupServices vehicleGroupServices;
	
	@Autowired
	private UserManageServices userManageServices;
	@Autowired
	private UserRoleServices  userRoleServices;

	private VehicleGroup vehicleGroupBean;
	@Autowired
 	private UserServices userServices; 
 
	private Pub_UserGroup role;
	

	/**
	 * 新增普通用户
	 */
 	@Action("createUser")
	public void createUser() {
 		String jsonString = "false";
 		try {
		Map<String, Object> insertParamMap =  new HashMap<String,Object>();
		String name=getParameter("name");
		String userName=getParameter("userName");
		String password=getParameter("password");
		String runTime=getParameter("runTime");
		String overTime=getParameter("overTime");
		String workUnitId=getParameter("workUnitId");
		insertParamMap.put("Name", name);
		insertParamMap.put("UserName", userName);
		insertParamMap.put("RunTime", runTime);
		insertParamMap.put("OverTime", overTime);
		insertParamMap.put("WorkUnitID", workUnitId);
		insertParamMap.put("IsSuperUser","0");  // 不管是企业管理还是普通管理员此标志都为0,预留的超级管理员为1
		insertParamMap.put("IsShowHandle","0");  //  添加是否显示操作指示默认为0
		insertParamMap.put("IsShowNotice","0"); 
		insertParamMap.put("CreateUserId",UserContext.getLoginUser().getUserID());
		insertParamMap.put("Status", "0");
		insertParamMap.put("CreateTime", new Date());
		insertParamMap.put("Password", CsEncodeUtils.Encrypt(password));
		
		Map<String, Object> roleinsertParamMap =  new HashMap<String,Object>();
		roleinsertParamMap.put("name", userName+"角色");
		roleinsertParamMap.put("abbre",userName);
		roleinsertParamMap.put("workUnitId", workUnitId);
		roleinsertParamMap.put("status", "0");
		roleinsertParamMap.put("innerPurviewGroupId", "0");
		roleinsertParamMap.put("userId", UserContext.getLoginUser().getUserID());
		roleinsertParamMap.put("createDate",  new Date());
		roleinsertParamMap.put("isUseDataPurview", "0");
		roleinsertParamMap.put("privilegeLevelId", "0");
		
		Map<String, Object> gMap =  new HashMap<String,Object>();
		gMap.put("workId", workUnitId);
		String groupId="";
		List<HashMap<String, String>> vehicleGroupList = ibatisServices.findIbatisList("getWorkUnitVehicleGroupSQL",gMap);
		if(!vehicleGroupList.isEmpty()){
            Map<String,String> mapId=vehicleGroupList.get(0);
            groupId=String.valueOf(mapId.get("id"));
		}
		
		
		Map<String, Object> paramMap =  new HashMap<String,Object>();
		String userId=getParameter("userId").trim();
		String roleIds=getParameter("roleId").trim();
		if(!userId.isEmpty() && roleIds!="0"){
			paramMap.put("ID", userId);
			List<HashMap<String, String>> userList = ibatisServices.findIbatisList("findUserByIdListsSQL", paramMap);
			if(!userList .isEmpty()){
				insertParamMap.put("ID", userId);
				ibatisServices.updateIbatisObject("updateUserPTSQL", insertParamMap);	
				jsonString = userId.trim()+"@"+groupId.trim()+"@"+roleIds.trim()+"@"+userName.trim();
			}
		}else{
			Object insertId = ibatisServices.insertIbatisObject("addUserSQL", insertParamMap);
			Object role = ibatisServices.insertIbatisObject("addRoleSQL", roleinsertParamMap);
			Integer id=(Integer)insertId;
			Integer roleId=(Integer)role;
			if(id>0){
				customMapServices.addPub_CustomMapLayer("默认图层",3, id);
				LogUtil.insertLog(LogActionTypes.INSERT, "成功", "用户信息", "", "新增普通用户信息");
			}
			if(roleId>0){
				//新增用户角色信息
				Map<String, Object> roleparamMap =  new HashMap<String,Object>();
				roleparamMap.put("usergroupId", roleId);
				roleparamMap.put("userId", id);
				ibatisServices.insertIbatisObject("addUserRole", roleparamMap);
			}
			jsonString = id.toString().trim()+"@"+groupId.trim()+"@"+roleId.toString().trim()+"@"+userName.trim();
		}
		
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.INSERT, "失败", "用户信息", "", "新增普通用户信息");
			e.printStackTrace();
			log.error(e.getMessage());
		}
		Tools.writeToOutputStream(jsonString, "新增用户信息json字符串写到输出流", ServletActionContext.getResponse());	
	}
 	
 	/**
	 * 新增角色
	 */
 	@Action("createRole")
	public void createRole() {
 		String jsonString = "false";
 		try {
			
			Map<String, Object> insertParamMap =  new HashMap<String,Object>();
			String name=getParameter("name");
			String shortRoleName=getParameter("shortRoleName");
			String workUnitId=getParameter("workUnitId");
			String userId=getParameter("userId");
			
			insertParamMap.put("name", name);
			insertParamMap.put("abbre", shortRoleName);
			insertParamMap.put("workUnitId", workUnitId);
			insertParamMap.put("status", "0");
			insertParamMap.put("innerPurviewGroupId", "0");
			insertParamMap.put("userId", UserContext.getLoginUser().getUserID());
			insertParamMap.put("createDate",  new Date());
			insertParamMap.put("isUseDataPurview", "0");
			insertParamMap.put("privilegeLevelId", "0");
			
			
			
		Map<String, Object> paramMap =  new HashMap<String,Object>();
		String roleId=getParameter("roleId").trim();
		if(roleId!=null && roleId.length()>0){
			paramMap.put("id", roleId);
			List<HashMap<String, String>> roleList = ibatisServices.findIbatisList("findRoleListById", paramMap);
			if(roleList != null && roleList.size()>0){
				insertParamMap.put("id", roleId);
				ibatisServices.updateIbatisObject("updateRoleSQL", insertParamMap);	
				jsonString = roleId.trim();
			}
		}else{
			//新增角色信息
            Object insertId = ibatisServices.insertIbatisObject("addRoleSQL", insertParamMap);
			Integer id=(Integer)insertId;
			if(id>0){
				//新增用户角色信息
				Map<String, Object> roleparamMap =  new HashMap<String,Object>();
				roleparamMap.put("usergroupId", id.toString());
				roleparamMap.put("userId", userId);
				ibatisServices.insertIbatisObject("addUserRole", roleparamMap);
				LogUtil.insertLog(LogActionTypes.INSERT, "成功", "角色信息", "", "新增角色信息");
				jsonString = id.toString().trim();
			}
			
		}
		
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.INSERT, "失败", "角色信息", "", "新增角色信息");
			e.printStackTrace();
			log.error(e.getMessage());
		}
		Tools.writeToOutputStream(jsonString, "新增角色信息json字符串写到输出流", ServletActionContext.getResponse());	
	}
 
 	
 	/**
 	 * 车辆分组树形
 	 */
 	@Action(value="getWorkUnitVehicleList")
	public void getWorkUnitVehicleList(){
		try {
			HashMap<String,Object> mapParam = new HashMap<String,Object>();
				
			mapParam.put("workId", getParameter("workId"));
			
			SessionUser user = UserContext.getLoginUser();
			//超级管理员
			if(UserContext.isBsRootUser()){
				mapParam.put("id", "-1");
			} 
			//企业管理员
			else if(user != null&&user.isWorkUnitSuperAdmin()){
				mapParam.put("id", "-1");
			}//普通用户
			else{
				mapParam.put("id",  getParameter("groupId"));	
			}
			//List<Map> listGroup = ibatisServices.queryForList(Map.class, "getVehicleByGroupIdSQL", mapParam);
			this.renderJSON(vehicleGroupServices.workVehicleGroupTree(mapParam));
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
 	
 	@Action(value="createVehicleGroup")
 	public void createVehicleGroup() {
 		String jsonString = "false";
 		try {
 		    // 车辆、车组关系
 			String vehicles =getParameter("vehicles");
 			String roleId=getParameter("roleId");
 			String vehicleGroupId=getParameter("vehicleGroupId");
 			String[] vehclesArys = null;
 			if(!vehicles.isEmpty()){
 				vehclesArys = vehicles.split(",");
 			}
 			if(!vehicleGroupId.isEmpty()){
 				HashMap<String,Object> delMap = new HashMap<String,Object>();
 				delMap.put("vehicleGroupId", vehicleGroupId);
 				ibatisServices.deleteIbatisObject("delVehicleGroupPurviewByIdSQL", delMap);
 				ibatisServices.deleteIbatisObject("delGroupVehicleByIdSQL", delMap);
 				ibatisServices.deleteIbatisObject("delVehicleGroupByIdSQL", delMap);
 			}
 			//新增车组
 			long nVehicleGroupID = vehicleGroupServices.addVehicleGroup(vehicleGroupBean);
 			//新增车组与车辆关系
 			vehicleGroupServices.addGroupVehicle(vehclesArys,nVehicleGroupID);
 			
 			HashMap<String,Object> vehicleRoleMap = new HashMap<String,Object>();
 			vehicleRoleMap.put("UserGroupID", roleId);
 			vehicleRoleMap.put("VehicleGroupID", nVehicleGroupID);
 			
 			//新增车组角色
 			ibatisServices.insertIbatisObject("addVehicleGroupPurview", vehicleRoleMap);
 			
 			
 			jsonString =String.valueOf(nVehicleGroupID);
 			Tools.writeToOutputStream(jsonString, "新增车组信息json字符串写到输出流", ServletActionContext.getResponse());
 		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
		}
 		
 		 
		
 	}
 	
 	
 	public Pub_UserGroup getRole() {
		return role;
	}

	public void setRole(Pub_UserGroup role) {
		this.role = role;
	}

	@Action(value="saveAuthority")
	public void saveAuthority(){
 		String jsonString = "false";
		String roleId = getParameter("roleId");
		String auths = getParameter("auths");
		try {
			int id=userManageServices.addUserAuth(roleId, auths);
			if(id==1){
				jsonString="true";
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		Tools.writeToOutputStream(jsonString, "新增权限信息json字符串写到输出流", ServletActionContext.getResponse());	
	 	   
	}

 	
 	/**
 	 * 车辆分组树形
 	 */
 	@Action(value="getWorkUnitVehicleLists")
	public void getWorkUnitVehicleLists(){
		try {
			HashMap<String,Object> mapParam = new HashMap<String,Object>();
		    
			String IsShow= getParameter("IsShow").trim();
			mapParam.put("workId", getParameter("workId"));
			mapParam.put("IsShow", IsShow);
			if(IsShow.equals("1")){
				mapParam.put("vehicleGroupID", getParameter("groupId"));
			}
			
			SessionUser user = UserContext.getLoginUser();
			//超级管理员
			if(UserContext.isBsRootUser()){
				mapParam.put("IsSuperUser",  "1");
			} 
			//企业管理员
			else if(user != null&&user.isWorkUnitSuperAdmin()){
				mapParam.put("IsSuperUser",  "1");	
			}//普通用户
			else{
				mapParam.put("IsSuperUser",  "2");
				mapParam.put("userId",  UserContext.getLoginUser().getUserID());
			}
//			List<Map> listGroup = ibatisServices.queryForList(Map.class, "getVehicleByGroupIdsSQL", mapParam);
//			System.out.println("---:"+listGroup.toString());
			this.renderJSON(vehicleGroupServices.workVehicleGroupTree(mapParam));
			//System.out.println("===:"+vehicleGroupServices.buildJsonVehicleGroup(listGroup).toString());
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
 	
	/**
	 * 修改车辆分组
	 */
	@Action(value="updateVehicleGroups")
	public void updateVehicleGroups(){
		try {	
			// 车辆、车组关系
			String vehicles = this.getParameter("vehicles");
			String[] vehclesArys = null;
			if(vehicles!=null && vehicles.length()>0)vehclesArys = vehicles.split(",");
			//车组信息
			ibatisServices.update("updateVehicleGroup",vehicleGroupBean);
			ibatisServices.delete("delGroupVehicleByGroupId", vehicleGroupBean);
			vehicleGroupServices.addGroupVehicle(vehclesArys,vehicleGroupBean.getId());
			super.renderJSON("true");
			LogUtil.insertLog(LogActionTypes.UPDATE, "成功", "车辆组管理", "", "修改车辆分组");
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.UPDATE, "失败", "车辆组管理", "", "修改车辆分组");
			e.printStackTrace();
			log.error(e.getMessage());
			super.renderJSON("false");
		}
	}
	@Action(value="saveRoleAuth")
	public void saveRoleAuth(){
		String roleId = getParameter("roleId");
		String roleType = getParameter("roleType");
		String auths = getParameter("auths");
		String isCommand = getParameter("isCommand");
		String userid= getParameter("userid");
		try {
			userRoleServices.addUserAuthNotIncludevechile(roleType,roleId, auths,isCommand);
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("le", "-2");
			map.put("UserId", userid);
			ibatisServices.deleteIbatisObject("delUserAllMenuSQL",map );
			List<Map> list = ibatisServices.queryForList(Map.class, "findMenusForIndex", map);
			List<Map<String,Object>> functionRoleMap = new ArrayList<Map<String,Object>>();
			java.util.Set<String> set = new java.util.TreeSet<String>();
			for(int i=0;i<list.size();i++){
				Map mapNode=list.get(i);
				map= new HashMap<String,Object>();
				String id=mapNode.get("ID").toString().trim();
				if(id.equals("495")) continue;
				if(!set.add(id))continue;
				String name=mapNode.get("function_name").toString().trim();
				if(name.length()>6){
					name=name.substring(0,6);
				}
				map.put("functionMenuId", id);
				map.put("userId", userid);
				map.put("name", name);
				map.put("menuIocId", functionRoleMap.size()+1);
				functionRoleMap.add(map);
				if(functionRoleMap.size()==8) break;
			}
			ibatisServices.batchInsertIbatisObject("addUserMenuSQL", functionRoleMap);
			this.renderText("true");
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	@Action(value="rollback")
	public void rollback(){
		String userId1=getParameter("userId");
		String roleId=getParameter("roleId");
		
		String userId=getParameter("Id");
		String vehicleGroupId=getParameter("vehicleGroupId");
		Map<String,Object> map=null;
		try {
			if(!userId.isEmpty()){
		    map = new HashMap<String, Object>();
			map.put("id", userId);
			this.ibatisServices.deleteIbatisObject("delUserSQL", map);
			this.ibatisServices.deleteIbatisObject("delUserRole", map);
			map=new HashMap<String, Object>();map.put("UserId", userId);
			ibatisServices.deleteIbatisObject("delUserAllMenuSQL",map );
			customMapServices.delPubCustomMapLayer(userId);
			}
			ibatisServices.delete("delRoles", role);
			if(!vehicleGroupId.isEmpty()){
				HashMap<String,Object> delMap = new HashMap<String,Object>();
 				delMap.put("vehicleGroupId", vehicleGroupId);
 				ibatisServices.deleteIbatisObject("delVehicleGroupPurviewByIdSQL", delMap);
 				ibatisServices.deleteIbatisObject("delGroupVehicleByIdSQL", delMap);
 				ibatisServices.deleteIbatisObject("delVehicleGroupByIdSQL", delMap);
			}
			
			if(!userId1.isEmpty() && !roleId.isEmpty()){
				map = new HashMap<String, Object>();
				map.put("id", userId1);
				this.ibatisServices.deleteIbatisObject("delUserSQL", map);
				this.ibatisServices.deleteIbatisObject("delUserRole", map);
				map.clear();
				
				map=new HashMap<String, Object>();map.put("UserId", userId1);
				ibatisServices.deleteIbatisObject("delUserAllMenuSQL",map );
				customMapServices.delPubCustomMapLayer(userId1);
				map.clear();
				
				map=new HashMap<String, Object>();map.put("roleIs", roleId);
				ibatisServices.deleteIbatisObject("delRoleSQL",map );
				
			}
			LogUtil.insertLog(LogActionTypes.DELETE, "成功", " 用户管理", "", "删除用户信息");
			this.renderJSON("true");
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			LogUtil.insertLog(LogActionTypes.DELETE, "失败", " 用户管理", "", "删除用户信息");
			this.renderJSON("true");
		}
	}
	
	/**
	 * 新增企业管理员
	 */
	@Action("createWorkUser")
	public void createWorkUser() {
 		String jsonString = "false";
 		try {
		Map<String, Object> insertParamMap =  new HashMap<String,Object>();
		String name=getParameter("name");
		String userName=getParameter("userName");
		String password=getParameter("password");
		String runTime=getParameter("runTime");
		String overTime=getParameter("overTime");
		String workUnitId=getParameter("workUnitId");
		insertParamMap.put("Name", name);
		insertParamMap.put("UserName", userName);
		insertParamMap.put("RunTime", runTime);
		insertParamMap.put("OverTime", overTime);
		insertParamMap.put("WorkUnitID", workUnitId);
		insertParamMap.put("IsSuperUser","0");  // 不管是企业管理还是普通管理员此标志都为0,预留的超级管理员为1
		insertParamMap.put("IsShowHandle","0");  //  添加是否显示操作指示默认为0
		insertParamMap.put("IsShowNotice","0"); 
		insertParamMap.put("CreateUserId",UserContext.getLoginUser().getUserID());
		insertParamMap.put("Status", "0");
		insertParamMap.put("CreateTime", new Date());
		insertParamMap.put("Password", CsEncodeUtils.Encrypt(password));
		
		Object insertId = ibatisServices.insertIbatisObject("addUserSQL", insertParamMap);
		
		 if(insertId!=null){
		    	Map<String, Object> map = new HashMap<String, Object>();
		    	map.put("id", insertParamMap.get("WorkUnitID").toString());
		    	map.put("AdminUserID", insertId);
		    	ibatisServices.updateIbatisObject("updateAdminUserIDS", map);
		  }
		 
		 String menuIcoIds="4,19,8,15,9,17,5,6";
			String menuIds="56,72,92,323,335,328,497,555";
			String nameMenus="车辆监控,车辆信息管理,企业信息管理,历史报警查询,历史图片查询,车辆报警统计,企业用户管理,图层管理";
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
			
			LogUtil.insertLog(LogActionTypes.INSERT, "成功", "用户信息", "", "新增企业管理员信息");
		
			jsonString ="true";
		
		
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.INSERT, "失败", "用户信息", "", "新增企业管理员信息");
			e.printStackTrace();
			log.error(e.getMessage());
		}
		Tools.writeToOutputStream(jsonString, "新增用户信息json字符串写到输出流", ServletActionContext.getResponse());	
	}
	
	
	@Action(value = "getUserList")
	public void getUserList() {	
		try {
			Map<String,Object> params = FlexiGridUtil.parseParam(this.getGridParams());
			
			SessionUser user = UserContext.getLoginUser();
			
			params.put("userId",user.getUserID());
			
			
			//超级管理员
			if(UserContext.isBsRootUser()){
				params.put("IsSuperUser","1");
			} 
			//企业管理员
			else if(user != null&&user.isWorkUnitSuperAdmin()){
				params.put("IsSuperUser","2");
				params.put("workunitid",user.getWorkUnitID());
				
			}//普通用户
			else{
				params.put("IsSuperUser","3");
				params.put("createUserId",user.getUserID());
			}
			
			this.renderJSON(JSONUtil.toJson(userManageServices.getfindUsers(params)));
			LogUtil.insertLog(LogActionTypes.READ, "成功", " 用户管理", "", "查询用户信息");
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.READ, "失败", " 用户管理", "", "查询用户信息");
			e.printStackTrace();
		}
		
		
	}
	
	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}


	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}


	public CustomMapServices getCustomMapServices() {
		return customMapServices;
	}


	public void setCustomMapServices(CustomMapServices customMapServices) {
		this.customMapServices = customMapServices;
	}

	 
	public VehicleGroupServices getVehicleGroupServices() {
		return vehicleGroupServices;
	}

	public void setVehicleGroupServices(VehicleGroupServices vehicleGroupServices) {
		this.vehicleGroupServices = vehicleGroupServices;
	}
	
	public VehicleGroup getVehicleGroupBean() {
		return vehicleGroupBean;
	}

	public void setVehicleGroupBean(VehicleGroup vehicleGroupBean) {
		this.vehicleGroupBean = vehicleGroupBean;
	}
	
	public UserManageServices getUserManageServices() {
		return userManageServices;
	}

	public void setUserManageServices(UserManageServices userManageServices) {
		this.userManageServices = userManageServices;
	}

 
}
