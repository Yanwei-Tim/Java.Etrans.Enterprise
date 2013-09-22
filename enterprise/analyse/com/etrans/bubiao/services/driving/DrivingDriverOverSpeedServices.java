package com.etrans.bubiao.services.driving;



import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.ParamKey;


@Service
public class DrivingDriverOverSpeedServices {

	@Autowired
	private IbatisServices ibatisServices;
	
	public void setIbatisServices(IbatisServices ibatisServices)
	{
		this.ibatisServices = ibatisServices;
	}
	
	/**
	 * 查询
	 * @param queryJSON
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public PageBean findDrivingDriverOverSpeeds(String queryJSON) throws Exception{
		PageBean pageBean = new PageBean();
		Map params = FlexiGridUtil.parseParam(queryJSON);
//		SessionUser user = UserContext.getLoginUser();
//		if(!UserContext.isBsRootUser()){
//			params.put("workUnitId", user.getWorkUnitID()); 
//		}
		
		params=UserContext.putUserParams(params);
		List<Map<String,Object>> listInfo =getDrivingDriverOverSpeed(params);
		Long total= this.getDrivingDriverOverSpeedCount(params);
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(listInfo);
		pageBean.setTotal(total);
		return pageBean;
		
	}
	
	
	public Long getDrivingDriverOverSpeedCount(Map<String,Object> params) throws Exception {
		return this.ibatisServices.findIbatisListCount("getDrivingDriverOverSpeedCountSQL", params);
		
	}
	
	
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getDrivingDriverOverSpeed(Map params) throws Exception {
		
		List<Map<String,Object>> TerminalList = this.ibatisServices.queryForList(Map.class, "getDrivingDriverOverSpeedSQL",params);
		return TerminalList;
		
	}
	
}
