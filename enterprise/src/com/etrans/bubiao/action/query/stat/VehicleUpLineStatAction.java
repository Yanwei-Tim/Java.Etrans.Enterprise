package com.etrans.bubiao.action.query.stat;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.services.query.stat.VehicleUpLineStatService;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.DateUtil;
import com.etrans.common.util.Tools;
import com.etrans.common.util.json.JSONUtil;

@Controller
@Scope("prototype")
@Namespace("/query/stat")
public class VehicleUpLineStatAction extends BaseAction{

	/**  描述  */    
	
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private VehicleUpLineStatService  vehicleUpLineStatServices;



	public VehicleUpLineStatService getVehicleUpLineStatServices() {
		return vehicleUpLineStatServices;
	}


	public void setVehicleUpLineStatServices(
			VehicleUpLineStatService vehicleUpLineStatServices) {
		this.vehicleUpLineStatServices = vehicleUpLineStatServices;
	}


	@Action(value = "findVehicleUplineList")
	public void findVehicleUplineList(){
		try {
			SessionUser user = UserContext.getLoginUser();
			log.error(DateUtil.getCurrentTime("yyyy-M-dd HH:mm:ss")+"-----------安全管理--》【车辆上线统计】Action--》【查询数据列表】【开始】----------------");
			this.renderJSON(JSONUtil.toJson(vehicleUpLineStatServices.getVehicleUpLineInfo(this.getGridParams(),user)));
		} catch (Exception e) {
			log.error("安全管理--》【车辆上线统计】Action--》查询数据列表报错！报错信息如下："+e.getMessage());
			e.printStackTrace();
		}finally{
			log.error("-----------安全管理--》【车辆上线统计】Action--》【查询数据列表】【结束】----------------");
		}
		
	}
	
	
	@Action(value = "VehicleUplineListExportExl")
	public void VehicleUplineListExportExl()
	{

		// 导出数据时的开始页数
		String fromPage = getParameter("frompage");
		// 导出数据时的结束页数
		String toPage = getParameter("topage");

		try
		{
			SessionUser user = UserContext.getLoginUser();
			List<Map<String, Object>> vehicleModels = vehicleUpLineStatServices.getVehicleUpLineExportExl(this.getGridParams(), user, fromPage, toPage);
		    String [] titleArray={"车牌","车辆颜色","部门","上传数","每分钟上传数","最新时间"};
			List<Object> list = new ArrayList<Object>();
			if (vehicleModels != null)
			{
				for (Map<String,Object> a : vehicleModels)
				{
					List<Object> tempList = new ArrayList<Object>();
					tempList.add(a.get("registrationNo"));
					tempList.add(a.get("registrationNOColor"));
					tempList.add(a.get("unitname"));
					tempList.add(a.get("num_vilide"));
					tempList.add(a.get("timeNumber"));
					tempList.add(a.get("gps_time"));
					list.add(tempList);
				}
			}

			HttpServletResponse response = ServletActionContext.getResponse();
			OutputStream outputStream = null;
			try 
			{
				outputStream = response.getOutputStream();// 取得输出流
				response.reset();// 清空输出流
				response.setHeader("Content-disposition", "attachment; filename=VehicleUplineInfo.xls");// 设定输出文件头
				response.setContentType("application/msexcel");// 定义输出类型
				Tools.createExcel(outputStream, titleArray, list);
				
			} catch (Exception e)
			{
				log.error("安全管理--》【车辆上线统计】Action--》导出数据报错！报错信息如下："+e.getMessage());
				e.printStackTrace();
			} finally
			{
				if (outputStream != null)
				{
					try
					{
						outputStream.close();
					} catch (IOException e)
					{
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e)
		{
			log.error("安全管理--》【车辆上线统计】Action--》导出数据报错！报错信息如下："+e.getMessage());
			e.printStackTrace();
			this.renderJSON("");
		}
	}

     
	@Action(value = "VehicleSectionUplineListExportExl")
	public void VehicleSectionUplineListExportExl()
	{

		// 导出数据时的开始页数
		String fromPage = getParameter("frompage");
		// 导出数据时的结束页数
		String toPage = getParameter("topage");

		try
		{
			SessionUser user = UserContext.getLoginUser();
			List<Map<String, Object>> vehicleModels = vehicleUpLineStatServices.getVehicleUpLineExportExl(this.getGridParams(), user, fromPage, toPage);
		    String [] titleArray={"部门","上线车辆数","上传数","每分钟上传数","最新时间","车辆数","上传率"};
			List<Object> list = new ArrayList<Object>();
			if (vehicleModels != null)
			{
				for (Map<String,Object> a : vehicleModels)
				{
					List<Object> tempList = new ArrayList<Object>();
					tempList.add(a.get("unitname"));
					tempList.add(a.get("vehicleCount"));
					tempList.add(a.get("sum_Vilide"));
					tempList.add(a.get("timeNumber"));
					tempList.add(a.get("gps_time"));
					tempList.add(a.get("VehicleSum"));
					tempList.add(a.get("vilideRate"));
					list.add(tempList);
				}
			}

			HttpServletResponse response = ServletActionContext.getResponse();
			OutputStream outputStream = null;
			try 
			{
				outputStream = response.getOutputStream();// 取得输出流
				response.reset();// 清空输出流
				response.setHeader("Content-disposition", "attachment; filename=VehicleUplineInfo.xls");// 设定输出文件头
				response.setContentType("application/msexcel");// 定义输出类型
				Tools.createExcel(outputStream, titleArray, list);
				
			} catch (Exception e)
			{
				log.error("安全管理--》【车辆上线统计】Action--》导出数据报错！报错信息如下："+e.getMessage());
				e.printStackTrace();
			} finally
			{
				if (outputStream != null)
				{
					try
					{
						outputStream.close();
					} catch (IOException e)
					{
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e)
		{
			log.error("安全管理--》【车辆上线统计】Action--》导出数据报错！报错信息如下："+e.getMessage());
			e.printStackTrace();
			this.renderJSON("");
		}
	}	
	
}
