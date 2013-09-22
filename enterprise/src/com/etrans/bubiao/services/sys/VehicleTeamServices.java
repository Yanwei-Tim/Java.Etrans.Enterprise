package com.etrans.bubiao.services.sys;

import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.common.util.ParamKey;
import com.etrans.common.util.json.JSONUtil;

@Service
public class VehicleTeamServices {
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	
	/**
	 * 分页查询车队信息,返回表格数据
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	public PageBean getVehicleTeams(Map<String,Object> params) throws Exception {
		
		PageBean pageBean = new PageBean();
		
		List<Map<String,Object>> VehicleTeamList = this.getVehicleTeamList(params);
		Long total = getVehicleTeamsCount(params);
		
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(VehicleTeamList);
		pageBean.setTotal(total);
		
		return pageBean;
		
	}
	
	
	/**
	 * 分页查询车队信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map<String,Object>> getVehicleTeamList(Map params) throws Exception {
		
		List<Map<String,Object>> VehicleTeamList = this.ibatisServices.queryForList(Map.class, "getVehicleTeamsSQL",params);
		return VehicleTeamList;
		
	}
	
	/**
	 * 查询车队数量
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Long getVehicleTeamsCount(Map<String,Object> params) throws Exception {
		return this.ibatisServices.findIbatisListCount("getVehicleTeamsCountSQL", params);
		
	}
	
	/**
	 **新增车队信息详细
	 */
	@Action(value = "createVehicleTeam")
	public Object createVehicleTeam(Map<String,Object> params) {
		
		return this.ibatisServices.insertIbatisObject("insertVehicleTeamSQL", params);
	
	}
	
	 
	/**
	 * 由ID查询车队详细
	 * @param whereMap
	 * @return
	 * @throws Exception
	 */
	public String getVehicleTeamById(Map<String,Object> whereMap) throws Exception {
		return	JSONUtil.toJson(this.ibatisServices.findIbatisList("getVehicleTeamByIdSQL", whereMap));
		
	}
	
	/**
	 * 由ID修改车队信息详细
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object updateVehicleTeam(Map<String,Object> whereMap) throws Exception {
	
		return this.ibatisServices.updateIbatisObject("updateVehicleTeamSQL", whereMap);
		
	}
	
	/**
	 * 由ID删除车队信息
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object deleteVehicleTeam(Map<String,Object> whereMap) throws Exception {
		return this.ibatisServices.deleteIbatisObject("deleteVehicleTeamSQL", whereMap);
		
	}
	
	/**
	 * 由ID修改车辆信息
	 * @param whereMap
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Object updateVehicle(Map<String,Object> whereMap) throws Exception {
		return this.ibatisServices.updateIbatisObject("updateVehicleByIDSQL", whereMap);
		
	}
	
	
}
