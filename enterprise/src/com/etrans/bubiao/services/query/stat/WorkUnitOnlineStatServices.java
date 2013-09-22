package com.etrans.bubiao.services.query.stat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.http.ParamKey;
import com.etrans.bubiao.http.ParamMap;
import com.etrans.bubiao.http.Result;
import com.etrans.bubiao.services.BaseServices;
import com.etrans.bubiao.services.IbatisServices;
import com.etrans.bubiao.services.TaService;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.HttpConfig;
import com.etrans.common.util.RateUtil;
import com.etrans.common.util.json.JSONUtil;
import com.etrans.common.util.web.RowNumUtil;
import com.sun.org.apache.xml.internal.utils.IntVector;


@Service
public class WorkUnitOnlineStatServices extends BaseServices{
	
	/**
	 * 设置配置服务路径
	 */
	private void SetHttpConfig() {
		 httpClient.addServerURL(prepareServerURL());
	}
	
	/**
	 * 重设配置路径
	 * @return
	 */
	private  List<String> prepareServerURL()
	{
		String config="/httpTAService_config.properties";
		return HttpConfig.getServiceHttpConfig(config);
	}
	
	
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	
	@Autowired
	private TaService taService;
	
	/**
     * 企业车辆在线统计
     * @param queryJSON
     * @return
     * @throws Exception
     */
	public PageBean getWorkUnitOnline (Map<String,Object> params) throws Exception {
		
		PageBean pageBean = new PageBean();
		List<Map<String,Object>> ls = this.getWorkUnitOnlineList(params);
		Long total = this.getWorkUnitOnlineCount(params);
		pageBean.setPage((Integer)params.get(ParamKey.PAGE));
		pageBean.setRows(ls);
		pageBean.setTotal(total);
		return pageBean;
		
	}
	
	
	/**
     * 企业车辆在线统计图
     * @param queryJSON
     * @return
     * @throws Exception
     */
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getOnlinePercentCharts (Map params) throws Exception {
		
		List<Map<String,Object>> ls = this.ibatisServices.queryForList(Map.class, "onlinePercentChartSQL",params);
		return ls;
		
	}
	
	/**
	 * 导出到EXCEL
	 * @param queryJSON
	 * @param fromPage
	 * @param toPage
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public  List<Map<String, Object>>  onlinePercentExportExl(Map param) throws Exception{
		List<Map<String,Object>> rows = this.ibatisServices.queryForList(Map.class, "onlinePercentSQL",param);
		return rows;
		
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getWorkUnitOnlineList(Map params) throws Exception {
		List<Map<String,Object>> ls = this.ibatisServices.queryForList(Map.class, "onlinePercentSQL",params);
		return ls;
		
	}
	
	
	public Long getWorkUnitOnlineCount(Map<String,Object> params) throws Exception {
		return this.ibatisServices.findIbatisListCount("onlinePercentCountSQL", params);
		
	}
	
	
	/**
     * TA数据--企业车辆在线统计
     * @param queryJSON
     * @return
     * @throws Exception
     */
	public String getWorkUnitOnline_mysqlTA (String queryJSON) throws Exception {
		//httpTAservers
		SetHttpConfig();
		ParamMap param = FlexiGridUtil.parseJSONParamStr(queryJSON);
		SessionUser user = UserContext.getLoginUser();
	
		if(user != null){
			if(UserContext.isBsRootUser()){//是否是超级管理员
				param.putToWhereParam("isSuper", true);
			}else if(user.isWorkUnitSuperAdmin()){//是否为企业管理员
				String fullId = user.getWorkUnitFullId();
				param.putToWhereParam("fullId", fullId);
				param.putToWhereParam("isWorkUnitSuperAdmin", true);
			}else{//普通用户
				String userId=String.valueOf(user.getUserID());
				Map<String, Object>paramMap=new HashMap<String, Object>();
				paramMap.put("userId", userId);
				//普通用户时查询到的车辆
				List<Map<String,Object>> vehicleList=getVehicleList(paramMap);
				if(vehicleList!=null || "".equals(vehicleList)){
					String vehiclestr="";
					String vehicleID=null;
					for(int i=0; i<vehicleList.size(); i++){
						vehiclestr +=vehicleList.get(i).get("vehicleid").toString()+",";
					}
					vehicleID=vehiclestr.substring(0, vehiclestr.length()-1);
					param.putToWhereParam("vehicle_list",String.valueOf(vehicleID));
			 }
				
			}
		 }
		param.putTableName("workUnitPercentTASQL");
		param.putTotalName("workUnitPercentCountTASQL");
		
		//GA查询数据开始行数和结束行数
		String pageGA = (String)param.getWhereParam().get(ParamKey.PAGE);
		String pageSizeGA = (String)param.getWhereParam().get(ParamKey.PAGE_SIZE);
		//TA 查询数据开始行数和结束行数
		String page = (String)param.getWhereParam().get(ParamKey.PAGE);
		String pageSize = (String)param.getWhereParam().get(ParamKey.PAGE_SIZE);
		int count = Integer.parseInt(page);
		Integer fromRow=0;
		if(count==1){
			fromRow= RowNumUtil.getFromRowNum(page, "0");
		}else{
			fromRow= RowNumUtil.getFromRowNum(page, pageSize)-1;
		}
		Integer toRow = Integer.parseInt(pageSize);
		param.putToWhereParam("fromRow", fromRow);
		param.putToWhereParam("toRow", toRow);
		
//		//GA查询数据开始行数和结束行数
//		Integer fromRowGA = RowNumUtil.getFromRowNum(pageGA, pageSizeGA);
//		Integer toRowGA = RowNumUtil.getToRowNum(pageGA, pageSizeGA);
//		param.putToWhereParam("fromRowGA", fromRowGA);
//		param.putToWhereParam("toRowGA", toRowGA);
//		
//		String resultJSON=this.queryDateAsPageJson(param);
//		Map<String,Object> result = JSONUtil.fromJson(resultJSON,Map.class);
//		List<Map<String,Object>> rows = (List<Map<String,Object>>)result.get("rows");
//		if(rows != null && rows.size()>0){
//			rows = getWorkUnitList(param,rows);
//		}
		return this.queryDateAsPageJson(param);
	}
    
/**查询当前企业基础信息*/
	public List<Map<String,Object>> getWorkUnitList(ParamMap param,List<Map<String,Object>> rows) throws Exception {
		Integer fromRow = (Integer)param.getWhereParam().get("fromRowGA");
		Integer toRow = (Integer)param.getWhereParam().get("toRowGA");
		String workUnitNameWhere = (String)param.getWhereParam().get("workUnitNameWhere");
		  Map mapParam=new HashMap();
		  mapParam.put("workUnitNameWhere", workUnitNameWhere);
		  mapParam.put("fromRow", fromRow);
		  mapParam.put("toRow", toRow);
		for(Map<String,Object> row : rows){
			//获取企业ID
			Integer unitIDs = (Integer)row.get("id");
			String  unitID=unitIDs.toString();
			String workunitName=getItemByName(unitID,mapParam);
			row.put("workunitName", workunitName);
		}
		return rows;
	}
	

	/**
	 * 通过企业id获取企业信息
	 * @param list
	 * @param id
	 * @return
	 */
	public  String getItemByName(String unitId,Map mapParam) throws Exception{
          SessionUser user = UserContext.getLoginUser();
        
		if(user != null){
			if(UserContext.isBsRootUser()){//是否是超级管理员
				mapParam.put("isSuper", true);
			}else if(user.isWorkUnitSuperAdmin()){//是否为企业管理员
				String fullId = user.getWorkUnitFullId();
				mapParam.put("fullId", fullId);
//				mapParam.put("isWorkUnitSuperAdmin", true);
			}else{//普通用户
				String userId=String.valueOf(user.getUserID());
				mapParam.put("userId", userId);
			}
		}
//		mapParam.put("unitID", UnitID);
		List<Map<String,Object>> result = this.ibatisServices.queryForList(Map.class, "getUnitNameTA",mapParam);
		if(result != null && result.size()>0 && unitId != null){
			for(int i=0; i<result.size(); i++){
				Integer workunitID=(Integer) result.get(i).get("workunitID");
				String workunitIDstr=workunitID.toString();
				String workunitName=(String) result.get(i).get("workUnitName");
				if(workunitID!=null && workunitIDstr.equals(unitId)){
					return workunitName;
				}
			}
		}
		
		return null;
	}
	
	
	
	/**
	 * 查询普通用户的车辆
	 * */
	public List<Map<String,Object>> getVehicleList(Map params) throws Exception {
		List<Map<String,Object>> list = this.ibatisServices.queryForList(Map.class, "getVehicleIdstatMySQL",params);
		return list;
	}
	
	
	/**TA数据企业车辆在线率导出**/
public List<Map<String,Object>> workUnitOnlineMysqlTAListExportExl (String queryJSON,String fromPage,String toPage) throws Exception {
	    SetHttpConfig();
		ParamMap param = FlexiGridUtil.parseJSONParamStr(queryJSON);
		SessionUser user = UserContext.getLoginUser();
		if(user != null){
			if(UserContext.isBsRootUser()){//是否是超级管理员
				param.putToWhereParam("isSuper", true);
			}else if(user.isWorkUnitSuperAdmin()){//是否为企业管理员
				String fullId = user.getWorkUnitFullId();
				param.putToWhereParam("fullId", fullId);
				param.putToWhereParam("isWorkUnitSuperAdmin", true);
			}else{//普通用户
				String userId=String.valueOf(user.getUserID());
				Map<String, Object>paramMap=new HashMap<String, Object>();
				paramMap.put("userId", userId);
				//普通用户时查询到的车辆
				List<Map<String,Object>> vehicleList=getVehicleList(paramMap);
				if(vehicleList!=null || "".equals(vehicleList)){
					String vehiclestr="";
					String vehicleID=null;
					for(int i=0; i<vehicleList.size(); i++){
						vehiclestr +=vehicleList.get(i).get("vehicleid").toString()+",";
					}
					vehicleID=vehiclestr.substring(0, vehiclestr.length()-1);
					param.putToWhereParam("vehicle_list",String.valueOf(vehicleID));
			 }
				
			}
		 }
		param.putTableName("workUnitPercentTASQL");
		
		//查询数据开始行数和结束行数
		String page = fromPage;//开始页
		String endPage = toPage;//结束页
		String pageSize = (String)param.getWhereParam().get(ParamKey.PAGE_SIZE);
		int startCount = Integer.parseInt(page);//开始行
		int endCount = Integer.parseInt(endPage);//结束行
		
		Integer fromRow=0;
		Integer toRow = 0;
		if(startCount==1){
			fromRow= RowNumUtil.getFromRowNum(page, "0");
		    toRow = RowNumUtil.getToRowNum(toPage, pageSize);
		}else{
			int i=Integer.parseInt(pageSize);
			fromRow=(startCount-1)*i ;
			if(endCount-startCount==0){
				toRow=i;
			}else{
				toRow = i*(endCount-startCount+1);
			}
			
		}
		param.putToWhereParam("fromRow", fromRow);
		param.putToWhereParam("toRow", toRow);
		Result result = this.queryPageAsResult(param);
		List<Map<String,Object>> rows = (List<Map<String,Object>>)result.getData();
		return rows;
		
	}
}
