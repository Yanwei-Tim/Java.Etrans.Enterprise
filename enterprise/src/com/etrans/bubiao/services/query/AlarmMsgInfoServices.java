package com.etrans.bubiao.services.query;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.http.HttpException;
import com.etrans.bubiao.http.ParamKey;
import com.etrans.bubiao.http.ParamMap;
import com.etrans.bubiao.http.Result;
import com.etrans.bubiao.services.BaseServices;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.web.RowNumUtil;

/**
 * 报警查询Services
 * @author lihaiyan
 * @version 1.0
 */
@Service
public class AlarmMsgInfoServices
{
    
	@Autowired
	private IbatisServices ibatisServices;
	
	/**
	 * 描述：分页获取历史报警
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @return List<HashMap<String, String>> 报警信息
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public PageBean getHistoryAlarmMscInfo(String queryJSON,SessionUser sessionUser) throws Exception{
		Map setParamsMap=FlexiGridUtil.parseJSONParamForProcedure(queryJSON);
		String userId = String.valueOf(sessionUser.getUserID());
		if(UserContext.isBsRootUser()){//超级管理员
			userId="-1";
		}
		else{
			if(sessionUser.isWorkUnitSuperAdmin()){//企业管理员
				userId="0";
				
			}
		}
		
		String vehicleIds = null;
		if(setParamsMap.get("@VehicleIds").equals("")){
			vehicleIds=null;
		}else{
			vehicleIds = setParamsMap.get("@VehicleIds").toString();
		}
		
		System.out.println("=============================车牌ID--"+vehicleIds);
		setParamsMap.put("@FullID", sessionUser.getWorkUnitFullId());
		setParamsMap.put("@UserId",userId);
		setParamsMap.put("@IsExport","1");
		setParamsMap.put("@VehicleIds", vehicleIds);
		String page = (String)setParamsMap.get(ParamKey.PAGE);
		String pageSize = (String)setParamsMap.get(ParamKey.PAGE_SIZE);
		Integer fromRow = RowNumUtil.getFromRowNum(page, pageSize);
		Integer toRow = RowNumUtil.getToRowNum(page, pageSize);
		setParamsMap.put("@FromRow",String.valueOf(fromRow));
		setParamsMap.put("@ToRow",String.valueOf(toRow));
		List<Map<String,Object>> rows =null;
		try{
			rows= this.ibatisServices.queryForList(Map.class, "getHistoryAlarmMscInfoSQL",setParamsMap);
		}catch (Exception e) {
			e.printStackTrace();
		}
		PageBean pageBean=new PageBean();
		pageBean.setPage(Integer.valueOf(page));
		if(rows!=null&&rows.size()>0){
			 pageBean.setRows(rows);
			 Long totalLong=Long.valueOf(String.valueOf((rows.get(0).get("total"))));
			 pageBean.setTotal(totalLong);
		}
		return pageBean;
		
		
	}
	
	
	/**
	 * 描述：导出历史报警
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @return List<HashMap<String, String>> 报警信息
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public  List<Map<String, Object>>  getHistoryAlarmMscInfoExportExl(String queryJSON,SessionUser sessionUser,String fromPage,String toPage) throws Exception{
		
		Map setParamsMap=FlexiGridUtil.parseJSONParamForProcedure(queryJSON);
		String userId = String.valueOf(sessionUser.getUserID());
		if(UserContext.isBsRootUser()){//超级管理员
			userId="-1";
		}
		else{
			if(sessionUser.isWorkUnitSuperAdmin()){//企业管理员
				userId="0";
				
			}
		}
		setParamsMap.put("@FullID", sessionUser.getWorkUnitFullId());
		setParamsMap.put("@UserId",userId);
		setParamsMap.put("@IsExport","2");
		String pageSize = (String)setParamsMap.get(ParamKey.PAGE_SIZE);
		Integer fromRow = RowNumUtil.getFromRowNum(fromPage, pageSize);
		Integer toRow = RowNumUtil.getToRowNum(toPage, pageSize);
		setParamsMap.put("@FromRow",String.valueOf(fromRow));
		setParamsMap.put("@ToRow",String.valueOf(toRow));
		List<Map<String,Object>> rows = this.ibatisServices.queryForList(Map.class, "getHistoryAlarmMscInfoSQL",setParamsMap);
		return rows;
		
	}
	/**
	 * 描述：新增报警处理
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @version Copyright (c) 2012 by e_trans.
	 */
    public void addDealAlarm(Map<String,Object> params) {
    		this.ibatisServices.insertIbatisObject("insertDealAlarmSQL", params);
		
	
	}
    
    /**
	 * 描述：获取处警信息
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @return List<HashMap<String, Object>> 处警信息
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public  List<Map<String, Object>>  queryDealAlarmInfo(Map setParamsMap){
		
		List<Map<String,Object>> rows = this.ibatisServices.queryForList(Map.class, "getDealAlarmInfoSQL",setParamsMap);
		return rows;
		
	}


	public IbatisServices getIbatisServices()
	{
		return ibatisServices;
	}


	public void setIbatisServices(IbatisServices ibatisServices)
	{
		this.ibatisServices = ibatisServices;
	}
	
	

}
