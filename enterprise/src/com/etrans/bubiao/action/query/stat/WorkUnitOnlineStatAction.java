package com.etrans.bubiao.action.query.stat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.http.HttpException;
import com.etrans.bubiao.http.ParamKey;
import com.etrans.bubiao.services.query.stat.WorkUnitOnlineStatServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.FlexiGridUtil;
import com.etrans.common.util.chart.Chart;
import com.etrans.common.util.chart.ChartData;
import com.etrans.common.util.chart.Data;
import com.etrans.common.util.json.JSONUtil;
import com.etrans.common.util.web.RowNumUtil;

@Controller
@Scope("prototype")
@Namespace("/query/stat")
public class WorkUnitOnlineStatAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	/**
	 *企业车辆在线统计	
	 */
	@Action(value = "findWorkUnitOnlineList")
	public void findWorkUnitOnlineList() {
		try {
			Map<String,Object> params = FlexiGridUtil.parseParam(this.getGridParams());
			if(params==null){
				params = new HashMap<String,Object>();
			}
			SessionUser user = UserContext.getLoginUser();
			if(user != null){
				if(UserContext.isBsRootUser()){//是否是超级管理员
					params.put("isSuper", true);
				}else if(user.isWorkUnitSuperAdmin()){//是否为企业管理员
					String fullId = user.getWorkUnitFullId();
					params.put("fullId", fullId);
				}else{//普通用户
					params.put("userId", UserContext.getLoginUserID());
				 }
					
				}
			params.put(params.get("sortname")+"Order","");
			
			this.renderJSON(JSONUtil.toJson(workUnitOnlineStatServives.getWorkUnitOnline(params)));
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	/**
	 * 企业车辆在线率统计导出EXECL表格
	 */
	@Action(value = "findWorkUnitOnlineListExportExl")
	public void findWorkUnitOnlineListExportExl() {
		
		try {
			// 导出数据时的开始页数
			String fromPage = getParameter("frompage");
			// 导出数据时的结束页数
			String toPage = getParameter("topage");
			
			Map<String,Object> params = FlexiGridUtil.parseParam(this.getGridParams());

			String pageSize = String.valueOf(params.get(ParamKey.PAGE_SIZE));
			Integer fromRow = RowNumUtil.getFromRowNum(fromPage, pageSize);
			Integer toRow = RowNumUtil.getToRowNum(toPage, pageSize);
			params.put("@FromRow",String.valueOf(fromRow));
			params.put("@ToRow",String.valueOf(toRow));

			SessionUser user = UserContext.getLoginUser();
			if(user != null){
				if(UserContext.isBsRootUser()){//是否是超级管理员
					params.put("isSuper", true);
				}else if(user.isWorkUnitSuperAdmin()){//是否为企业管理员
					String fullId = user.getWorkUnitFullId();
					params.put("fullId", fullId);
				}else{//普通用户
					params.put("userId", UserContext.getLoginUserID());
				 }
					
				}
		
			params.put(params.get("sortname")+"Order","");
			
			String[] titleArray = {};
			titleArray = new String[7];
			titleArray[0]="所属单位";
			titleArray[1]="车辆总数";
			titleArray[2]="上线车辆总数";
			titleArray[3]="车辆上线率";
			titleArray[4]="车辆下线率";
			titleArray[5]="车辆在线率";
			titleArray[6]="车辆离线率";
			
			String[] columnArray = {};
			columnArray = new String[7];
			columnArray[0]="workUnitName";
			columnArray[1]="total";
			columnArray[2]="upLineVehicleCount";
			columnArray[3]="upLineRate";
			columnArray[4]="contactLossRate";
			columnArray[5]="onLineRate";
			columnArray[6]="offLineRate";
			
			List<Map<String,Object>>  rows = workUnitOnlineStatServives.onlinePercentExportExl(params);
			exportExl("uplinePercent", titleArray, columnArray, rows);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 统计图
	 * 
	 * @return
	 */
	@Action(value="getWorkUnitOnlineListCharts")
	public void getWorkUnitOnlineListCharts() {
		try{
			Map<String,Object> params = new HashMap<String,Object>();
			String startDate = this.getParameter("startDate");
			String endDate = this.getParameter("endDate");
			String workUnitNameWhere = this.getParameter("workUnitNameWhere");
			
			params.put("startDate",startDate);
			params.put("endDate",endDate);
			params.put("workUnitId", UserContext.getLoginUser().getWorkUnitID());
			params.put("workUnitNameWhere",workUnitNameWhere);
			SessionUser user = UserContext.getLoginUser();
			if(user != null){
				if(UserContext.isBsRootUser()){//是否是超级管理员
					params.put("isSuper", true);
				}else if(user.isWorkUnitSuperAdmin()){//是否为企业管理员
					String fullId = user.getWorkUnitFullId();
					params.put("fullId", fullId);
				}else{//普通用户
					params.put("userId", UserContext.getLoginUserID());
				 }
					
				}
			
			List<Map<String,Object>>  rows = workUnitOnlineStatServives.getOnlinePercentCharts(params);
			Chart charts = ChartData.chartSet("企业车辆在线率统计", "单位名称", "在线车辆总数");
			if (rows!=null && 0 < rows.size()) {
				
				List<Data> dataList = new ArrayList<Data>();
				for (Map<String, Object> obj : rows) {
					dataList.add(new Data(String.valueOf(obj.get("workUnitName").toString().trim()), String.valueOf(obj.get("upLineCount"))));
				}
				String jsons = new ChartData().jsonData(charts, dataList);
				this.renderText(jsons);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
/**********************************************TA数据 ---企业车辆在线统计*/
	@Action(value = "workUnitOnlineList_mysqlTA")
	public void workUnitOnlineList_TA() {
		try {
			this.renderJSON(workUnitOnlineStatServives.getWorkUnitOnline_mysqlTA(this.getGridParams()));
		} catch (HttpException e) {
			System.out.println("ErrorCode : " + e.getStatusCode());
			System.out.println("ErrorCode : " + e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@Action(value = "workUnitOnlineMysqlTAListExportExl")
	public void workUnitOnlineMysqlTAListExportExl() {
		
		// 导出数据时的开始页数
		String fromPage = getParameter("frompage");
		// 导出数据时的结束页数
		String toPage = getParameter("topage");
		
		try {
			
			String[] titleArray = {};
			titleArray = new String[7];
			titleArray[0]="所属单位";
			titleArray[1]="车辆总数";
			titleArray[2]="上线车辆总数";
			titleArray[3]="车辆上线率";
			titleArray[4]="车辆下线率";
			titleArray[5]="车辆在线率";
			titleArray[6]="车辆离线率";
			
			String[] columnArray = {};
			columnArray = new String[7];
			columnArray[0]="UnitName";
			columnArray[1]="total";
			columnArray[2]="vehicleUplinetotal";
			columnArray[3]="upLineRate";
			columnArray[4]="contactLossRate";
			columnArray[5]="onLineRate";
			columnArray[6]="offLineRate";
			
			List<Map<String,Object>> rows = workUnitOnlineStatServives.workUnitOnlineMysqlTAListExportExl(this.getGridParams(),fromPage,toPage);
			exportExl("flatFormAlarmVehicleList", titleArray, columnArray, rows);
			
		} catch (HttpException e) {
			System.out.println("ErrorCode : " + e.getStatusCode());
			System.out.println("ErrorCode : " + e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Autowired
	private WorkUnitOnlineStatServices workUnitOnlineStatServives;

	public WorkUnitOnlineStatServices getWorkUnitOnlineStatServives() {
		return workUnitOnlineStatServives;
	}

	public void setWorkUnitOnlineStatServives(
			WorkUnitOnlineStatServices workUnitOnlineStatServives) {
		this.workUnitOnlineStatServives = workUnitOnlineStatServives;
	}



	
	
	

}
