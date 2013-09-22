/**    
 * SocketTemplate.java
 * Create on 2010-8-16
 * Copyright (c) 2010 by e_trans. 
 */
package com.etrans.bubiao.repository.parent;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.nio.channels.SocketChannel;
import java.util.ArrayList;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * @author dasuan
 * @version 1.0
 * @brief
 */

public class SocketTemplate {
	private Socket socket = null; // socket通道
	private String host; // 服务器IP
	private int port; // 服务器端口
	private String loginCommand; // MSC登陆指令
	private PrintWriter printWriter; // 输出
	private BufferedReader bufferedReader; // 输入
	private boolean isLogin = false;
	private ArrayList<MscSocketListener> listenerList = new ArrayList<MscSocketListener>();
	private final Log logger = LogFactory.getLog(SocketChannel.class.getName());
	
	public boolean isLogin() {
		return isLogin;
	}

	public void setLogin(boolean isLogin) {
		this.isLogin = isLogin;
	}
	
	/**
	 * 紧急重连
	 * @throws Exception 
	 */
	public void emergencyReload() throws Exception {
		logger.error("(上级信息通道)启动紧急重连！");
		reloadSocket();
	}
	public SocketTemplate(String host, int port	, String loginCommand) {
		this.host = host;
		this.port = port;
		this.loginCommand = loginCommand;
		sokectInit();
//		new Thread(new CheckMscSocket()).start();
//		new Thread(new CheckMSCThread()).start();
	}
	/**
	 * 增加监听者
	 * 
	 * @param listener
	 */
	public void addEventListener(MscSocketListener listener) {
		listenerList.add(listener);
	}
	/**
	 * 初始化连接
	 * */
	public void sokectInit() {
		try {
			closeSocket();// 关闭连接
			socket = new Socket(host, port);
			
			
			logger.info("------------------(上级信息通道)新建socket连接------------------");
		     printWriter = getWriter();
			 printWriter.println(loginCommand);// 登录MSC
			 isLogin = true;
		} catch (Exception e) {
			isLogin = false;
			closeSocket();// 关闭连接
			socket = null;
			logger.info("------------------(上级信息通道)新建上级信息通道的socket连接失败 -----------------" + e);
		}
	}

	/**
	 * 取socket连接
	 * */
	public Socket getSocket() {
		if (socket != null) {
			return socket;
		} else {
			return null;
		}
	}

	/**
	 * 输出流
	 * */
	public PrintWriter getWriter(){
		try {
			OutputStream socketOut = socket.getOutputStream();
			printWriter = new PrintWriter(socketOut, true);
		} catch (Exception e) {
			printWriter = null;
		}
		return printWriter;
	}

	/**
	 * 输入流
	 * */
	public BufferedReader getReader() {
		try {
			InputStream socketIn = socket.getInputStream();
			bufferedReader = new BufferedReader(new InputStreamReader(socketIn));
		} catch (Exception e) {
			bufferedReader = null;
		}
		return bufferedReader;
	}

	/**
	 * MSC重连
	 * @throws Exception 
	 */
	public void reloadSocket() throws Exception {
		try {
			for (MscSocketListener listener : listenerList) {
				if (listener != null) {
					listener.stopWork();
				}
			}
			sokectInit();
			if (isLogin) {
				for (MscSocketListener listener : listenerList) {
					if (listener != null) {
						listener.canWork(true);
						listener.starWork(this);
					}
				}
			}
		} catch (Exception e) {
			logger.error("(上级信息通道)的socket重连失败" + e);
			throw new Exception("(上级信息通道)连接失败!");
		}
	}
	
	/**
	 * 检查通道是否畅通
	 * 
	 * @throws Exception
	 */
	public void checkSocket() throws Exception {
		socket.sendUrgentData(0xFF);
	}
	/**
	 * 判断是否连接
	 */
	public boolean isConnect(){
		try {
			return this.socket.isConnected();
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 关闭连接
	 * */
	public void closeSocket() {
		if (socket != null) {
			try {
				isLogin = false;
				socket.close();
				socket = null;
			} catch (Exception s) {
				logger.error("------------(上级信息通道)关闭连接失败------------");
			}
		}
	}
	/**
	 * 监控MSC状态线程
	 * 
	 * @author Pomelo(柚子.)
	 * @since 2013-05-07
	 * @version 1.0
	 */
	class CheckMscSocket implements Runnable {
		@Override
		public void run() {
			logger.error("------------------------------已开启-(上级信息通道)监控线程------------------------------");
			boolean isNeedReLoad = false;
			while (true) {
				isNeedReLoad = false;
				if(isConnect()){
					try {
						checkSocket();
					} catch (Exception e) {
						logger.error("(上级信息通道)发送紧急数据失败，需要进行Web直连重连!");
						isNeedReLoad = true;
					}
				}else{
					isNeedReLoad = true;
				}
				if(isNeedReLoad){
					try {
						reloadSocket();
					} catch (Exception e) {
						logger.error("(上级信息通道)重连失败！"+e.getMessage());
					}
				}else{
					//logger.info("(上级信息通道)连接正常！");
				}
				try {
					Thread.sleep(10000);
				} catch (InterruptedException e) {
					logger.error("(上级信息通道)重连监控线程异常!"+e.getMessage());
				}
			}
		}
	}
	
	/**
	 * 心跳线程
	 * 
	 * @author Administrator
	 */
	class CheckMSCThread implements Runnable{
		/**
		 * 心跳线程启动方法
		 */
		public void run(){
			while (true){
				//每10秒发送一次心跳包
				try{
					if(isLogin){
						Thread.sleep(600000);
						getWriter().println("##1,9,12:12:12,NOOP");
					}else{
						Thread.sleep(600000);
					}
				}catch (Exception e) {
					logger.error("(上级信息通道)心跳包发送异常:"+e.getMessage());
				}				
			}
		}
	}

}
