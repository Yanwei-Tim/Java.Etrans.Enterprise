/**
 * UserRoleServices.java
 * Create on 2012-2-9上午11:11:13
 * Copyright (c) 2012 by e_trans.
 */
package com.etrans.bubiao.services.sys;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.etrans.bubiao.entities.Pub_UserGroup;
import com.etrans.bubiao.services.IbatisServices;

/**
 * 用户角色 Services
 * 
 * @author feltky
 * @version 1.0
 */
@Service
public class UserRoleServices<T> {

	@Autowired
	private IbatisServices ibatisServices;

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}

	/**
	 * 根据用户ID查询用户角色
	 * 
	 * @param userId
	 *            用户ID
	 * @return
	 * @throws Exception
	 */
	public List findRoles(Map param,long randoms) throws Exception {
		return this.ibatisServices.findIbatisList("findRoles", param);
	}

	/**
	 * 根据角色Id查找角色
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public Pub_UserGroup findRoleById(String id,long param) throws Exception {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		return ibatisServices.queryForObject(Pub_UserGroup.class, "findRoleById", params);
	}
 
	
	/**
	 * 新增用户权限[功能权限、]
	 * @return
	 * @throws Exception 
	 */
	public int addUserAuth(String roleType,String roleId,String auths,String isCommand) throws Exception{
		if (StringUtils.isEmpty(roleId))
			return -1;
		if(null == auths || (auths!=null && "".equalsIgnoreCase(auths))){
			Map<String,Object> delMap = new HashMap<String,Object>();
			 delMap.put("id", roleId);
			 delMap.put("UserGroupID", roleId);
			 // 先删除已有关系
			 if("2".equals(roleType)){
				 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleIdTA", delMap);
			 }else{
				 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleId", delMap);
			 }
			 if(!(isCommand!=null && isCommand.equals("1")))
			 ibatisServices.deleteIbatisObject("delCommandAuth", delMap);
			 ibatisServices.deleteIbatisObject("delVehicleGroupPurview", delMap);
			 return 1;
		}else{
			String[] ids = StringUtils.split(auths, ",");
			List<Map<String,Object>> functionRoleMap = new ArrayList<Map<String,Object>>();
			List<Map<String,Object>> commandRoleMap = new ArrayList<Map<String,Object>>();
			List<Map<String,Object>> vehicleRoleMap = new ArrayList<Map<String,Object>>();
			
			 for(String id:ids){
				 Map<String,Object> valueMap = new HashMap<String,Object>();
				 if(id.contains("f")){
					 valueMap.put("roleType", roleType);
					 valueMap.put("RoleID", roleId);
					 valueMap.put("FunctionID", id.split("\\|")[1]);
					 functionRoleMap.add(valueMap);
				 } 
				 if(id.contains("c")){
					 valueMap.put("UserGroupID", roleId);
					 valueMap.put("CommandKindID", id.split("\\|")[1]);
					 commandRoleMap.add(valueMap);
				 } 
				 if(id.contains("v")){
					 valueMap.put("UserGroupID", roleId);
					 valueMap.put("VehicleGroupID", id.split("\\|")[1]);
					 vehicleRoleMap.add(valueMap);
				 } 
			 }
			 try {
				 Map<String,Object> delMap = new HashMap<String,Object>();
				 delMap.put("id", roleId);
				 delMap.put("UserGroupID", roleId);
				 // 先删除已有关系
				 if("2".equals(roleType)){
					 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleIdTA", delMap);
				 }else{
					 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleId", delMap);
				 }
				 if(!(isCommand!=null && isCommand.equals("1")))
				 ibatisServices.deleteIbatisObject("delCommandAuth", delMap);
				 ibatisServices.deleteIbatisObject("delVehicleGroupPurview", delMap);
				 // 批量新增关系
				 if(functionRoleMap.size()>0)
				 ibatisServices.batchInsertIbatisObject("addRoleFunction", functionRoleMap);
				 if(commandRoleMap.size()>0)
				 ibatisServices.batchInsertIbatisObject("addCommandAuth", commandRoleMap);
				 if(vehicleRoleMap.size()>0)
				 ibatisServices.batchInsertIbatisObject("addVehicleGroupPurview", vehicleRoleMap);
				 return 1;
			} catch (Exception e) {
				throw new Exception("新增关系异常"+e.getMessage());
			}	
		}
	}
	/**
	 * @author zxs
	 * @return
	 * @throws Exception 
	 */
	public int addUserAuthNotIncludevechile(String roleType,String roleId,String auths,String isCommand) throws Exception{
		if (StringUtils.isEmpty(roleId))
			return -1;
		if(null == auths || (auths!=null && "".equalsIgnoreCase(auths))){
			Map<String,Object> delMap = new HashMap<String,Object>();
			 delMap.put("id", roleId);
			 delMap.put("UserGroupID", roleId);
			 // 先删除已有关系
			 if("2".equals(roleType)){
				 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleIdTA", delMap);
			 }else{
				 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleId", delMap);
			 }
			 if(!(isCommand!=null && isCommand.equals("1")))
			 ibatisServices.deleteIbatisObject("delCommandAuth", delMap);
			// ibatisServices.deleteIbatisObject("delVehicleGroupPurview", delMap);
			 return 1;
		}else{
			String[] ids = StringUtils.split(auths, ",");
			List<Map<String,Object>> functionRoleMap = new ArrayList<Map<String,Object>>();
			List<Map<String,Object>> commandRoleMap = new ArrayList<Map<String,Object>>();
			//List<Map<String,Object>> vehicleRoleMap = new ArrayList<Map<String,Object>>();
			
			 for(String id:ids){
				 Map<String,Object> valueMap = new HashMap<String,Object>();
				 if(id.contains("f")){
					 valueMap.put("roleType", roleType);
					 valueMap.put("RoleID", roleId);
					 valueMap.put("FunctionID", id.split("\\|")[1]);
					 functionRoleMap.add(valueMap);
				 } 
				 if(id.contains("c")){
					 valueMap.put("UserGroupID", roleId);
					 valueMap.put("CommandKindID", id.split("\\|")[1]);
					 commandRoleMap.add(valueMap);
				 } 
				 /*if(id.contains("v")){
					 valueMap.put("UserGroupID", roleId);
					 valueMap.put("VehicleGroupID", id.split("\\|")[1]);
					 vehicleRoleMap.add(valueMap);
				 } */
			 }
			 try {
				 Map<String,Object> delMap = new HashMap<String,Object>();
				 delMap.put("id", roleId);
				 delMap.put("UserGroupID", roleId);
				 // 先删除已有关系
				 if("2".equals(roleType)){
					 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleIdTA", delMap);
				 }else{
					 ibatisServices.deleteIbatisObject("DelRoleFunctionByRoleId", delMap);
				 }
				 if(!(isCommand!=null && isCommand.equals("1")))
				 ibatisServices.deleteIbatisObject("delCommandAuth", delMap);
				// ibatisServices.deleteIbatisObject("delVehicleGroupPurview", delMap);
				 // 批量新增关系
				 if(functionRoleMap.size()>0)
				 ibatisServices.batchInsertIbatisObject("addRoleFunction", functionRoleMap);
				 if(commandRoleMap.size()>0)
				 ibatisServices.batchInsertIbatisObject("addCommandAuth", commandRoleMap);
				/* if(vehicleRoleMap.size()>0)
				 ibatisServices.batchInsertIbatisObject("addVehicleGroupPurview", vehicleRoleMap);*/
				 return 1;
			} catch (Exception e) {
				throw new Exception("新增关系异常"+e.getMessage());
			}	
		}
	}

}
