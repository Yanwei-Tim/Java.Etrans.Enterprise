package com.etrans.bubiao.services.sys;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.entities.Result;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.common.util.ParamKey;
import com.etrans.common.util.json.JSONUtil;



@Service
public class SimCardServices{
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	
	/**
	 * 分页查询SIM卡信息,返回表格数据
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	public PageBean getSimCards(Map<String,Object> params) throws Exception {
		
		PageBean pageBean = new PageBean();
		
		List<Map<String,Object>> simCardList = this.getSimCardList(params);
		Long total = getSimCardsCount(params);
		
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(simCardList);
		pageBean.setTotal(total);
		
		return pageBean;
		
	}
	
	
	/**
	 * 分页查询SIM卡信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings({ "unchecked" })
	public List<Map<String,Object>> getSimCardList(Map params) throws Exception {
		
		List<Map<String,Object>> simCardList = new ArrayList<Map<String,Object>>();
		Boolean isSuper=(Boolean)params.get("isSuper");
		Boolean isWorkUnitSuperAdmin = (Boolean)params.get("isWorkUnitSuperAdmin");
		
		if(isSuper != null && isSuper == true){//超级用户
			simCardList = this.ibatisServices.queryForList(Map.class, "getSimCardsSQL",params);
		}else if(isWorkUnitSuperAdmin != null && isWorkUnitSuperAdmin == true){//企业管理员
			simCardList = this.ibatisServices.queryForList(Map.class, "getSimCardsSQL",params);
		}else{//普通用户
			simCardList = this.ibatisServices.queryForList(Map.class, "getUserSimCardsSQL",params);
		}
		return simCardList;
		
	}
	
	/**
	 * 查询SIM卡数量
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Long getSimCardsCount(Map<String,Object> params) throws Exception {
		
		Boolean isSuper=(Boolean)params.get("isSuper");
		Boolean isWorkUnitSuperAdmin = (Boolean)params.get("isWorkUnitSuperAdmin");
		if(isSuper != null && isSuper == true){
			return this.ibatisServices.findIbatisListCount("getSimCardsCountSQL", params);
		}else if(isWorkUnitSuperAdmin != null && isWorkUnitSuperAdmin == true){
			return this.ibatisServices.findIbatisListCount("getSimCardsCountSQL", params);
		}else{
			return this.ibatisServices.findIbatisListCount("getUserSimCardsCountSQL", params);
		}
		
		
		
	}
	
	/**
	 **新增SIM卡信息详细
	 */
	@Action(value = "createSimCard")
	public Object createSimCard(Map<String,Object> params) {
		
		return this.ibatisServices.insertIbatisObject("insertSimCardSQL", params);
	
	}
	
	 
	/**
	 * 由ID查询SIM卡详细
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	public String getSimCardById(Map<String,Object> whereMap) throws Exception {
		return	JSONUtil.toJson(this.ibatisServices.findIbatisList("getSimCardByIdSQL", whereMap));
		
	}
	
	/**
	 * 由ID修改SIM卡信息详细
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object updateSimCard(Map<String,Object> whereMap) throws Exception {
	
		return this.ibatisServices.updateIbatisObject("updateSimCardSQL", whereMap);
		
	}
	
	/**
	 * 由ID删除SIM卡信息
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object deleteSimCard(Map<String,Object> whereMap) throws Exception {
		
		//先删除终端号信息
		deleteTerminalInfo(whereMap);
		//再删除sim卡信息
		return this.ibatisServices.deleteIbatisObject("deleteSimCardSQL", whereMap);
	}
	
	/**
	 * 删除终端号信息
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	public Object deleteTerminalInfo(Map<String,Object> whereMap) throws Exception {
		return this.ibatisServices.deleteIbatisObject("deleteTerminalSQL_terminal", whereMap);
	}
	
	
	/**
	 * 验证不能有相同的电话号码
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
		@SuppressWarnings("unchecked")
		public Result checkPhoneNo(Map whereMap) throws Exception {
		Result result = new Result();
		List<Map<String,Object>> listInfo = ibatisServices.queryForList(Map.class, "checkPhoneNoSQL",whereMap);
		if(null!=listInfo){
			result.setData(listInfo.size());//数据
			result.setCode(1);//表示查询有数据
		}
		return result;
	}
		
		/**
		 * 验证不能有相同的卡编号
		 * @param whereMap
		 * @return 
		 * @return
		 * @throws Exception
		 */
			@SuppressWarnings("unchecked")
			public Result checkCode(Map whereMap) throws Exception {
			Result result = new Result();
			List<Map<String,Object>> listInfo = ibatisServices.queryForList(Map.class, "checkCodeSQL",whereMap);
			if(null!=listInfo){
				result.setData(listInfo.size());//数据
				result.setCode(1);//表示查询有数据
			}
			return result;
		}
	
}
