package com.etrans.bubiao.action.query;

import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.etrans.bubiao.action.BaseAction;
import com.etrans.bubiao.action.sys.log.LogActionTypes;
import com.etrans.bubiao.action.sys.log.LogUtil;
import com.etrans.bubiao.auth.SessionUser;
import com.etrans.bubiao.entities.PageBean;
import com.etrans.bubiao.http.HttpException;
import com.etrans.bubiao.services.command.CommandServices;
import com.etrans.bubiao.services.query.AlarmMsgInfoServices;
import com.etrans.bubiao.sys.UserContext;
import com.etrans.common.util.Base64;
import com.etrans.common.util.Tools;
/**
 * @author lihaiyan
 * @version 1.0
 * @brief
 */

@Controller
@Scope("prototype")
@Namespace("/query/alarmMsgInfo")
@ParentPackage("authPkg")
public class AlarmMsgInfoAction extends BaseAction
{
    @Autowired
	private AlarmMsgInfoServices alarmMsgInfoServices;
    
	@Autowired
	private CommandServices commandServices;

    
    
    /**
	 * 描述：获取历史报警
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@Action(value = "getHistoryAlarmMscInfo")
	public void getHistoryAlarmMscInfo(){
		

		try
		{
			SessionUser user = UserContext.getLoginUser();
			PageBean resultJSON=alarmMsgInfoServices.getHistoryAlarmMscInfo(this.getGridParams(),user);
			List<Map<String, Object>>   rows=resultJSON.getRows();
			 if(rows!=null && rows.size()>0){
				 for(Map<String, Object> map:rows){
					    String longitude=String.valueOf(map.get("longitude"));
						String latitude=String.valueOf(map.get("latitude"));
						//System.out.println("===================="+longitude+"=="+latitude);
						String araddess=Tools.getLocationBaidu(latitude, longitude);
						//System.out.println("====================百度取地址："+araddess);
						
					 if(araddess!=null){
						 map.put("araddess", araddess);
					 }else{
						 map.put("araddess", "");
					 }
				 }
			 }
			this.renderJSON(resultJSON);
			LogUtil.insertLog(LogActionTypes.READ, "成功", "历史报警查询", "", "历史报警查询");
		} catch (HttpException e)
		{
			LogUtil.insertLog(LogActionTypes.READ, "失败", "历史报警查询", "", "历史报警查询");
			System.out.println("ErrorCode : " + e.getStatusCode());
			System.out.println("ErrorCode : " + e.getMessage());
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		
	}
	

	/**
	 * 描述：导出报警
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@Action(value = "historyAlarmMscInfoExportExl")
	public void historyAlarmMscInfoExportExl()
	{

		// 导出数据时的开始页数
		String fromPage = getParameter("frompage");
		// 导出数据时的结束页数
		String toPage = getParameter("topage");
		 SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		try
		{
			SessionUser user = UserContext.getLoginUser();
			List<Map<String, Object>> alarmModels = alarmMsgInfoServices.getHistoryAlarmMscInfoExportExl(this.getGridParams(), user, fromPage, toPage);
		    String [] titleArray={"报警类型","报警时间","报警次数","车牌号","车辆颜色","所属单位","报警来源","经度","纬度","速度","报警位置","是否处理"};
			List<Object> list = new ArrayList<Object>();
			if (alarmModels != null)
			{
				for (Map<String,Object> a : alarmModels)
				{
					List<Object> tempList = new ArrayList<Object>();
					tempList.add(a.get("alarmName"));
					tempList.add(formatter.format(a.get("alarmTime")));
					tempList.add(a.get("alarmCount"));
					tempList.add(a.get("registrationNo"));
					tempList.add(a.get("registrationNOColor"));
					tempList.add(a.get("workunitName"));
				    Integer sourceId=(Integer)a.get("sourceId");
				    String sourceDesc="其它";
				    if(sourceId==1){
				    	sourceDesc="车载终端";
				    }else if (sourceId==2)
					{
				    	sourceDesc="企业监控平台";	
					}else if (sourceId==3)
					{
						sourceDesc="政府监管平台";
					}else if (sourceId==10)
					{
						sourceDesc="平台";
					}
				    tempList.add(sourceDesc);
					String longitude=String.valueOf(a.get("longitude"));
					String latitude=String.valueOf(a.get("latitude"));
//				    String latlonString=longitude+","+latitude;
//				    if(StringUtils.isEmpty(longitude)||StringUtils.isEmpty(latitude)){
//
//					    latlonString="未能获取位置";
//				    }
//				    tempList.add(latlonString);
					
				    tempList.add(a.get("longitude"));
				    tempList.add(a.get("latitude"));
				    tempList.add(a.get("speed1"));
				    //报警位置
				    String araddess=Tools.getLocationBaidu(latitude, longitude);
				    System.out.println("====================百度取地址："+araddess);
				    tempList.add(araddess);
				    String isHandleString=String.valueOf(a.get("isHandle"));
					if("true".equals(isHandleString)){
						tempList.add("已处理");
					}else{
						tempList.add("未处理");
					}
					
					list.add(tempList);
				}
			}

			HttpServletResponse response = ServletActionContext.getResponse();
			OutputStream outputStream = null;
			try 
			{
				outputStream = response.getOutputStream();// 取得输出流
				response.reset();// 清空输出流
				response.setHeader("Content-disposition", "attachment; filename=AlarmMsgInfo.xls");// 设定输出文件头
				response.setContentType("application/msexcel");// 定义输出类型
				Tools.createExcel(outputStream, titleArray, list);
				LogUtil.insertLog(LogActionTypes.READ, "成功", "历史报警导出", "", "历史报警导出");
			} catch (Exception e)
			{
				LogUtil.insertLog(LogActionTypes.READ, "失败", "历史报警导出", "", "历史报警导出");
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
			e.printStackTrace();
			System.out.println("ErrorCode : " + e.getMessage());
			this.renderJSON("");
		}
	}
	
	 /**
	 * 描述：获取历史报警
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@Action(value = "addDealAlarm")
	public void addDealAlarm(){
			String content = getParameter("content");
			String vehicleId = getParameter("vehicleId");
			String beginTime = getParameter("beginTime");
			String startTime = getParameter("startTime");
			String alarmKindID = getParameter("alarmKindID");
			String alarmCount = getParameter("alarmCount");
			String kind = getParameter("kind");
			String infoID = getParameter("infoID");
			String handleValue=getParameter("handleValue");
//			String alarmId=getParameter("alarmId");
			SessionUser user= UserContext.getLoginUser();
			Map<String, Object> setParamMap = new HashMap<String, Object>();
			setParamMap.put("content",content);
			setParamMap.put("vehicleId", vehicleId);
			setParamMap.put("transactMan", user.getUserID());
			setParamMap.put("beginTime",beginTime);
			setParamMap.put("startTime", startTime);
			setParamMap.put("alarmKindID", alarmKindID);
			setParamMap.put("alarmCount", alarmCount);
			try {
				alarmMsgInfoServices.addDealAlarm(setParamMap);
				this.renderJSON("true");
			} catch (Exception e) {
				e.printStackTrace();
			}
			try{//主动上报报警处理结果
				StringBuffer sendMessage = new StringBuffer();
				StringBuffer base64String=new StringBuffer();
				base64String.append(kind)
				            .append(",")
				            .append(vehicleId)
				            .append(",")
				            .append(infoID)
				            .append(",")
				            .append(handleValue);
				int sendSequence = this.commandServices.getSendSequence();
				sendMessage.append("##");
				sendMessage.append(sendSequence).append(",");
				sendMessage.append("7014,0,");
				sendMessage.append(Base64.encoderMessage(base64String.toString()).replaceAll("\\n", "").replaceAll("\\r", ""));
				this.commandServices.insertPlatFormCommandSendQueue(sendMessage.toString());
			}catch(Exception e){
				e.printStackTrace();
			}
	}
	
	/**
	 * 描述：处理报警
	 * 
	 * @author lihaiyan
	 * @since Create on 2012-5-16
	 * @version Copyright (c) 2012 by e_trans.
	 */
	@Action(value = "queryDealAlarmInfo")
	public void queryDealAlarmInfo()
	{
		String vehicleId = getParameter("vehicleId");
		String beginTime = getParameter("beginTime");
		String id = getParameter("id");
		String startTime = getParameter("startTime");
		String alarmKindID = getParameter("alarmKindId");
		String alarmCount = getParameter("alarmCount");
		SessionUser user= UserContext.getLoginUser();
		Map<String, Object> setParamMap = new HashMap<String, Object>();
		setParamMap.put("vehicleId", vehicleId);
		setParamMap.put("beginTime",beginTime);
		setParamMap.put("startTime", startTime);
		setParamMap.put("alarmKindID", alarmKindID);
		setParamMap.put("alarmCount", alarmCount);
		setParamMap.put("id", id);
		try
		{
		
			List<Map<String, Object>> dealAlarmInfos = alarmMsgInfoServices.queryDealAlarmInfo(setParamMap);
			this.renderJSON(dealAlarmInfos);

		} catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("ErrorCode : " + e.getMessage());
			this.renderJSON("");
		}
	}
	
	public AlarmMsgInfoServices getAlarmMsgInfoServices()
	{
		return alarmMsgInfoServices;
	}

	public void setAlarmMsgInfoServices(AlarmMsgInfoServices alarmMsgInfoServices)
	{
		this.alarmMsgInfoServices = alarmMsgInfoServices;
	}
    
    
}
