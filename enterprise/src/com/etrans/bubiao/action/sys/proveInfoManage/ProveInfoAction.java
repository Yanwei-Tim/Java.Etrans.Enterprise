package com.etrans.bubiao.action.sys.proveInfoManage;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.action.sys.log.LogActionTypes;
import com.etrans.bubiao.action.sys.log.LogUtil;
import com.etrans.bubiao.entities.Result;
import com.etrans.bubiao.services.sys.proveInfoManage.ProveInfoManageServices;
import com.etrans.common.util.DateUtil;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.json.JSONUtil;

/**
 * 证件信息表管理Action
 * @author lujunyong
 * 2013-08-14
 */
@Controller
@Scope("prototype")
@Namespace("/proveInfoManage")
public class ProveInfoAction extends BaseAction{

	private static final long serialVersionUID = 3595832987485843371L;
	protected Logger log = LogManager.getLogger(this.getClass().getName());
	
	//证件信息表管理Services
	private ProveInfoManageServices proveInfoManageServices;

	public ProveInfoManageServices getProveInfoManageServices() {
		return proveInfoManageServices;
	}
	public void setProveInfoManageServices(
			ProveInfoManageServices proveInfoManageServices) {
		this.proveInfoManageServices = proveInfoManageServices;
	}
	
	
/*******************数据列表*****************************/	
	/**
	 * 查询证件信息列表
	 */
	@SuppressWarnings("unchecked")
	@Action(value="findProveInfoList")
	public void findProveInfoList(){
		try {
			Map params = FlexiGridUtil.parseParam(this.getGridParams());
			this.renderJSON(proveInfoManageServices.findProveInfoList(params,new Random().nextLong()));
			LogUtil.insertLog(LogActionTypes.READ, "成功", "证件信息管理", "", "查询证件信息");
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.insertLog(LogActionTypes.READ, "失败", "证件信息管理", "", "查询证件信息");
		}
		
		
	}
	
/*****************【新增】***********************/	
	/**
	 * 【新增】入口
	 */
	@SuppressWarnings("unchecked")
	@Action(value = "addProveInfo")
	public void addProveInfo() {
		try {
			/**新增参数**/
			String proveInfo = getParameter("proveInfo");
			Map obj = JSONUtil.fromJson(proveInfo, Map.class);
			
			/**车辆id验证【验证是否已经为这辆车设置了证件信息】begin**/
			Map<String,Object> paramMap = new HashMap<String,Object>();
			paramMap.put("vehicleID",obj.get("vehicleID"));//车辆id字符串
			paramMap.put("ProveNameID",obj.get("proveNameID"));//车辆id字符串
			boolean result = proveInfoManageServices.validateByVhicleID_Prove(paramMap);
			if(result){//存在就删除
				proveInfoManageServices.delProveInfoByVehicleID(paramMap);
			}
			/**车辆id验证【验证是否已经为这辆车设置了证件信息】end**/
			
			/**新增**/
			//obj.put("remark", "");//备注
			obj.put("entryTime", DateUtil.getCurrentTime("yyyy-M-dd HH:mm:ss")); //入库时间
			this.renderJSON(proveInfoManageServices.addProveInfo(obj));
			LogUtil.insertLog(LogActionTypes.INSERT, "成功", "证件信息管理", "", "新增证件信息");	
			
		} catch (Exception e) {
		e.printStackTrace();
		LogUtil.insertLog(LogActionTypes.INSERT, "失败", "证件信息管理", "", "新增证件信息");	
		}
		
	}

	
/*****************【修改】***********************/	
	/**
	 * 查询详细信息
	 */
	@Action(value = "findProveInfos")
	public void findProveInfos() {
		String id = getParameter("id"); 
		Map<String, Object> params = new HashMap<String,Object>();
		params.put("id", id);
		
		Result result = new Result();
		
		try {
			Map<String,Object> beanInfo = proveInfoManageServices.getProveInfos(params);
			result.setCode(1);
			result.setData(beanInfo);
			this.renderJSON(JSONUtil.toJson(result));
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.renderJSON(JSONUtil.toJson(result));
	}

	/**
	 * 执行修改
	 */
	@SuppressWarnings("unchecked")
	@Action(value = "updProveInfo")
	public void updProveInfo() {
		try {
			/**修改参数**/
			String proveInfo = getParameter("proveInfo");
			Map obj = JSONUtil.fromJson(proveInfo, Map.class);
			
			/**车辆id验证【验证是否已经为这辆车设置了证件信息】begin**/
//			Map<String,Object> paramMap = new HashMap<String,Object>();
//			paramMap.put("vehicleID",obj.get("vehicleID"));//车辆id
//			paramMap.put("id", obj.get("id"));//修改的信息id
//			paramMap.put("ProveNameID", obj.get("ProveNameID"));//修改的信息id
//			boolean result = proveInfoManageServices.validateByVhicleID_Prove2(paramMap);
//			if(result){//存在就删除
//				proveInfoManageServices.delProveInfoByVehicleID2(paramMap);
//			}
			/**车辆id验证【验证是否已经为这辆车设置了证件信息】end**/
			
			/**执行修改**/
			this.renderJSON(proveInfoManageServices.updProveInfoByID(obj));
			LogUtil.insertLog(LogActionTypes.UPDATE, "成功", "证件信息管理", "", "修改证件信息");	
		} catch (Exception e) {
			e.printStackTrace();
			LogUtil.insertLog(LogActionTypes.UPDATE, "失败", "证件信息管理", "", "修改证件信息");	
		}
	}
	
/*****************【删除】***********************/	
	/**
	 * 删除
	 */
	@Action(value = "delProveInfo")
	public void delProveInfo() {
		
		String id = getParameter("id");
		Map<String, Object> params = new HashMap<String,Object>();
		params.put("id", id);
		
		try {
			this.renderJSON(proveInfoManageServices.delProveInfoByID(params));
			LogUtil.insertLog(LogActionTypes.DELETE, "成功", "证件信息管理", "", "删除证件信息");	
		} catch (Exception e) {
			LogUtil.insertLog(LogActionTypes.DELETE, "失败", "证件信息管理", "", "删除证件信息");	
			e.printStackTrace();
		}	
		
	}
	
/*****************下拉框初始化begin***********************/	
	/**
	 * 得到证件名称列表数据
	 */
	@Action(value="findProveNameList")
	public void findProveNameList(){
		try {
			this.renderJSON(JSONUtil.toJson(proveInfoManageServices.getProveNameList()));
		} catch (Exception e) {
			e.printStackTrace();
			log.debug("得到证件名称列表数据出错！");
		}	
	}	
	
	
/*****************下拉框初始化end***********************/

	
/*****************是否有证件过期begin*********************/
	/**
	 * 得到证件过期数据列表
	 */
	@Action(value="findProveNameListBack")
	public void findProveNameListBack(){
		
		try {
			this.renderJSON(JSONUtil.toJson(proveInfoManageServices.getProveNameListBack()));
		} catch (Exception e) {
			e.printStackTrace();
			log.debug("得到证件过期数据列表出错！");
		}	
		
	}

/*****************是否有证件过期end***********************/
	
	
	
	
	
	
	
	
	
	
}
