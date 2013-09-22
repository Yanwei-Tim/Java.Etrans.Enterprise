/**
 * InitSelectAction.java
 * Create on 2012-4-26 15:31:34
 * Copyright (c) 2012 by e_trans.
 */
package com.etrans.bubiao.action.sys;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.services.sys.TreeServices;
import com.etrans.bubiao.sys.UserContext;

@Controller
@Scope("prototype")
@Namespace("/sys/tree")
public class TreeAction extends BaseAction {

	private static final long serialVersionUID = 1L;
	
	@Autowired
	private TreeServices treeServices;

	
	
	public TreeServices getTreeServices() {
		return treeServices;
	}



	public void setTreeServices(TreeServices treeServices) {
		this.treeServices = treeServices;
	}



	/**
	 *行业类型树
	 */
 	@Action(value = "getTradeKindTreeList")
	public void getTradeKindTreeList() {
		try {
			String json=null;
			String id = this.getParameter("id");
			json = this.treeServices.getTradeKindTree(id);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	/**
	 *车队
	 */
 	
	@Action(value = "getVehicleTeamTree")
	public void getVehicleTeamTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String workUnitId = this.getParameter("workUnitId");
			String teamNames = this.getParameter("teamNames");
			if(workUnitId.length()==0){
				SessionUser user = UserContext.getLoginUser();
				//超级管理员
				if(!UserContext.isBsRootUser()){
					workUnitId=String.valueOf(user.getWorkUnitID());
				} 
			}
			json = this.treeServices.getVehicleTeamTree(id,workUnitId,teamNames);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	/**
	 *终端号码
	 */
 	
	@Action(value = "getTerminalTree")
	public void getTerminalTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String workUnitId = this.getParameter("workUnitId");
			String terminalNames = this.getParameter("terminalNames");
			if(workUnitId.length()==0){
				SessionUser user = UserContext.getLoginUser();
				//超级管理员
				if(!UserContext.isBsRootUser()){
					workUnitId=String.valueOf(user.getWorkUnitID());
				} 
			}
			json = this.treeServices.getTerminalTree(id,workUnitId,terminalNames);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
	/**
	 *终端类型
	 */
 	@Action(value = "getTerminalKindIDTree")
	public void getTerminalKindIDTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String terminalKindName = this.getParameter("terminalKindName");
			json = this.treeServices.getTerminalKindIDTree(id,terminalKindName);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
	/**
	 *sim卡号码
	 */
 	@Action(value = "getSimTree")
	public void getSimTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String simName = this.getParameter("simName");
			String workUnitId = this.getParameter("workUnitId");
			if(workUnitId.length()==0){
				SessionUser user = UserContext.getLoginUser();
				//超级管理员
				if(!UserContext.isBsRootUser()){
					workUnitId=String.valueOf(user.getWorkUnitID());
				} 
			}
			json = this.treeServices.getSimTree(id,workUnitId,simName);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	/**
	 *司机
	 */
 	@Action(value = "getDriverTree")
	public void getDriverTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String workUnitId = this.getParameter("workUnitId");
			String dirver = this.getParameter("dirver");
			if(workUnitId.length()==0){
				SessionUser user = UserContext.getLoginUser();
				//超级管理员
				if(!UserContext.isBsRootUser()){
					workUnitId=String.valueOf(user.getWorkUnitID());
				} 
			}
			json = this.treeServices.getDriverTree(id,workUnitId,dirver);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	/**
	 *司机
	 */
 	@Action(value = "getSecondDriverTree")
	public void getSecondDriverTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String workUnitId = this.getParameter("workUnitId");
			String secondDriver = this.getParameter("secondDriver");
			if(workUnitId.length()==0){
				SessionUser user = UserContext.getLoginUser();
				//超级管理员
				if(!UserContext.isBsRootUser()){
					workUnitId=String.valueOf(user.getWorkUnitID());
				} 
			}
			json = this.treeServices.getSecondDriverTree(id,workUnitId,secondDriver);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	

	/**
	 *车牌颜色
	 */
 	@Action(value = "getRegistrationNoColorTreeList")
	public void getRegistrationNoColorTreeList() {
		try {
			String json=null;
			String id = this.getParameter("id");
			json = this.treeServices.getRegistrationNoColorTree(id);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	/**
	 *用途
	 */
 	@Action(value = "getUsagesTree")
	public void getUsagesTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String vehicleUsages=this.getParameter("vehicleUsages");
			json = this.treeServices.getUsagesTree(id,vehicleUsages);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
 	
 	/**
	 *品牌
	 */
 	@Action(value = "getBandTree")
	public void getBandTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			json = this.treeServices.getBandTree(id);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
 	
 	/**
	 *厂商
	 */
 	@Action(value = "getManufactoryTree")
	public void getManufactoryTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			json = this.treeServices.getManufactoryTree(id);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
 	
 	/**
	 *车辆类型
	 */
 	@Action(value = "getVehicleKindTree")
	public void getVehicleKindTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String kindNames = this.getParameter("kindNames");
			json = this.treeServices.getVehicleKindTree(id,kindNames);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	/**
	 *车牌类型
	 */
 	@Action(value = "getRegistrationNoKindTree")
	public void getRegistrationNoKindTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			String vehicleRCKinds = this.getParameter("vehicleRCKinds");
			json = this.treeServices.getRegistrationNoKindTree(id,vehicleRCKinds);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	/**
	 *车辆颜色
	 */
 	@Action(value = "getVehicleColorTree")
	public void getVehicleColorTree() {
		try {
			String json=null;
			String id = this.getParameter("id");
			json = this.treeServices.getVehicleColorTree(id);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	
 	/**
 	 * 区域
 	 */
 	@Action(value = "getAreaTreeList")
	public void getAreaTreeList() {
		try {
			String ids = this.getParameter("id");
			String json=null;
			String id=null;
			Map<String,Object> sqlWhere= new HashMap<String,Object>();
			if(ids!="null" && ids!=null){
				String[] ary = ids.split("\\|");
				String []str=new String[2];
				 for (int i = 0; i < ary.length; i++){ 
					 str[i]=ary[i];
				 }
                  
				 sqlWhere.put("parentFullId", str[1]);
				 id=str[1];
				
			}
			json = this.treeServices.getAreaTreeList(sqlWhere,id);
			this.renderJSON(json);
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	 
 	
	/**
 	 * 模糊区域树形查询
 	 */
 	@Action(value = "getAreaTreeLists")
	public void getAreaTreeLists() {
		try {
			String ids = this.getParameter("id");
			String json=null;
			String id=null;
			String level=null;
			String name=this.getParameter("areaNames");
			Map<String,Object> sqlWhere= new HashMap<String,Object>();
			 sqlWhere.put("name", name);
			if(ids!="null" && ids!=null){
				String[] ary = ids.split("\\|");
				String []str=new String[3];
				 for (int i = 0; i < ary.length; i++){ 
					 str[i]=ary[i];
				 }
                  
				 sqlWhere.put("parentFullId", str[1]);
				 id=str[1];
				 level=str[2];
				
			}
			json = this.treeServices.getAreaTreeLists(sqlWhere,id,level);
			this.renderJSON(json);
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
 	
 	
	/**
 	 * 企业
 	 */
 	@Action(value = "getWorkUnitTreeList")
	public void getWorkUnitTreeList() {
		try {
			String id = this.getParameter("id");
			String json=null;
			json = this.treeServices.getWorkUnitTreeList(id);
			this.renderJSON(json);
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	/**
 	 * 车辆
 	 */
 	@Action(value = "getVehicleTreeList")
	public void getVehicleTreeList() {
		try {
			String json=null;
			SessionUser user = UserContext.getLoginUser();
			String registrationNo = this.getParameter("registrationNo");
			json = this.treeServices.getVehicleTreeList(user,registrationNo);
			this.renderJSON(json);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
}
