/**    
 * CommandRepositoryImpl.java
 * Create on 2010-7-30
 * Copyright (c) 2010 by e_trans. 
 */
package com.etrans.bubiao.repository.parent;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

import org.springframework.core.task.TaskExecutor;

import com.etrans.bubiao.services.monitorCenter.MonitorCenterServices;
import com.etrans.bubiao.sys.Constants;
import com.etrans.common.util.web.Struts2Utils;



/**
 * （809）
 * @author lihaiyan
 * @version 1.0
 * @brief 指令操作,网络传输处理层
 */

public class ParentCommandRepositoryImpl implements ParentCommandRepository {
	private SocketTemplate socketTemplate; // socket连接模板
	private CommandSendQueue commandSendQueue; // 指令发送队列
	private Queue<String> flatQueue = new LinkedList<String>();
	private CommandResultQueue commandResultQueue;// 指令回复数据接收队列
	private BusinessQueue businessQueue;// 业务数据接收队列
	private TaskExecutor taskExecutor; // 线程池
	private HashMap<String, String> commandResultHashMap;// 指令回复数据存储Map
	private MonitorCenterServices monitorCenterServices;
	private Map<String,String> vehicleMap;
	private SendMessage sendMessage;
	private ReceivedMessage receivedMessage;
	public ParentCommandRepositoryImpl(
										SocketTemplate socketTemplate
										,TaskExecutor taskExecutor
										,CommandSendQueue commandSendQueue
										,CommandResultQueue commandResultQueue
										,HashMap<String, String> commandResultHashMap
										,BusinessQueue businessQueue
										,MonitorCenterServices monitorCenterServices) {
		this.socketTemplate = socketTemplate;
		this.taskExecutor = taskExecutor;
		this.commandSendQueue = commandSendQueue;
		this.commandResultQueue = commandResultQueue;
		this.commandResultHashMap = commandResultHashMap;
		this.businessQueue = businessQueue;
		this.monitorCenterServices = monitorCenterServices;
		
		//
		getReceivedMessage(); // 启动接收线程
		sendMessage(); // 启动发送线程
		commandResultHandleThread();//指令回复处理线程
		businessHandleThread();//业务处理线程
		socketTemplate.addEventListener(sendMessage);
		socketTemplate.addEventListener(receivedMessage);
	}
	
	/**
	 * 处理(报文、查岗)线程
	 * */
	private void businessHandleThread()
	{
		taskExecutor.execute(new BusinessHandleThread(businessQueue ,flatQueue,monitorCenterServices));
	}
	
	/**
	 * 根据终端号获取车辆信息
	 * 
	 * @param vehicleId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getVehicleMessage(String vehicleId)
	{
		vehicleMap =(Map<String,String>) Struts2Utils.getSessionAttribute(Constants.USER_VEHICLE);
		String getVehicleMessage = vehicleMap.get(vehicleId);
		return getVehicleMessage;
	}
	
	/**
	 * 发送线程
	 * */
	private void sendMessage() {
		try {
			taskExecutor.execute(sendMessage = new SendMessage(socketTemplate, commandSendQueue));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	

	/**
	 * 接收线程   报文、查岗、指令回复、督办报警
	 * */
	private void getReceivedMessage() {
		try {
			taskExecutor.execute(receivedMessage = new ReceivedMessage(socketTemplate,businessQueue,commandResultQueue,commandSendQueue));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 指令回复数据处理线程
	 * */
	private void commandResultHandleThread()
	{
		taskExecutor.execute(new CommandResultHandleThread(commandResultHashMap, commandResultQueue,vehicleMap,monitorCenterServices));
	}
	

	/**
	 * 将发送指令插入发送队列
	 * @param message 要插入的指令队列
	 * */
	public void insertCommandSendQueue(String message) throws Exception {
		this.commandSendQueue.produce(message);
	}
	
	/**
	 * 通过车辆ID获取指令回复数据
	 * 
	 * @param vehicleId
	 * @return 此车辆的指令回复
	 * */
	public String getCommandResult(String vehicleId) throws Exception
	{
		return this.commandResultHashMap.get(vehicleId);
	}
	
	@Override
	public MonitorCenterServices getMonitorCenterServices() throws Exception {
		return this.monitorCenterServices;
	}

	

	public Queue<String> getFlatQueue()
	{
		return flatQueue;
	}

	/**
	 * 判断是否连接
	 */
	public boolean isConnect(){
		try {
			return this.socketTemplate.isConnect();
		} catch (Exception e) {
			return false;
		}
	}
	
}