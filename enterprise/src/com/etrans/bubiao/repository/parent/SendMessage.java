/**    
 * MessageHandle.java
 * Create on 2010-7-30
 * Copyright (c) 2010 by e_trans. 
 */
package com.etrans.bubiao.repository.parent;

import java.io.PrintWriter;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 发送上级信息指令
 * @author lihaiyan
 * @author Pomelo(柚子.)
 * @version 1.0
 */
public class SendMessage implements Runnable  ,MscSocketListener{
	/**
	 * 指令发送队列
	 */
	private CommandSendQueue commandSendQueue; 
	/**
	 * socket连接模板
	 */
	private SocketTemplate socketTemplate; 
	/**
	 * 日志输出对象
	 */	
	private final Log logger = LogFactory.getLog(SendMessage.class.getName());
	/**
	 * 写入流
	 */	
	private PrintWriter pw = null;
	/**
	 * 是否可以工作标志
	 */
	public boolean isCanWorkFlag = true;
	
	/**  
	 * 发送消息构造
	 * 
	 * @param socketTemplate
	 * @param commandSendQueue
	 */
	public SendMessage(SocketTemplate socketTemplate, CommandSendQueue commandSendQueue) {
		this.socketTemplate = socketTemplate;
		this.commandSendQueue = commandSendQueue;
	}

	/**
	 * 停止接收信息处理工作
	 * 
	 * @return boolean true, stop is OK,false stop is failed
	 */
	@Override
	public void stopWork() {
		canWork(false);		
		logger.error("---------停止接收来自(上级信息通道)的数据---------");
	}
	
	/**
	 * 是否可以进行工作
	 * 
	 * @param workFlag boolean
	 */
	public void canWork(boolean workFlag){
		isCanWorkFlag = workFlag;
	}
	
	/**
	 * 重新开始接收信息
	 * 
	 * @param socketTemplate SocketTemplate
	 */
	@Override
	public void starWork(SocketTemplate socketTemplate) {
		this.socketTemplate = socketTemplate;
		pw = this.socketTemplate.getWriter();
		logger.error("---------重新建立发送通道(上级信息通道)---------");
	}
	
	/**
	 * 线程初始化
	 * */
	public void run() {
		logger.error("---------(上级信息通道)发送线程启动!---------");
		String message = "";
		pw = this.socketTemplate.getWriter();
		while (true) {
			try {
				if (isCanWorkFlag & socketTemplate.isLogin()) {
					message = commandSendQueue.consume();
					if (!StringUtils.isEmpty(message)) {
						MessageHandle(pw, message);
					} else {
						Thread.sleep(500);
					}
				}
			} catch (Exception e) {
				logger.error("(上级信息通道)发送指令失败,错误信息: " + message + "e:" + e);
			}
		}
	}

 
	/**
	 * 发送指令
	 * */
	public void MessageHandle(PrintWriter pw, String message) {
		try {
			pw.println(message.replaceAll("\r\n", "").replaceAll("\r", "").replaceAll("\n", ""));
		} catch (Exception e) {
			this.commandSendQueue.produce(message);
		    logger.error("(上级信息通道)发送指令失败,错误信息: " + message + "e:" + e);
		}
	}
}
