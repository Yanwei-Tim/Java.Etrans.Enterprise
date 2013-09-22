/**    
 * AlarmHandleThread.java
 * Create on 2011-4-14
 * Copyright (c) 2010 by e_trans. 
 */
package com.etrans.bubiao.repository;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.etrans.common.util.Base64ThreadLocal;
import com.etrans.common.util.Tools;

/**
 * 报警信息处理线程
 * @author lihaiyan
 * @version 1.0
 */
public class AlarmHandleThread implements Runnable {
	private final static ThreadLocal<Base64ThreadLocal> base64Local = new ThreadLocal<Base64ThreadLocal>();
	private HashMap<String, Queue<String>> alarmHashMap;// 报警数据储存map  格式：<车辆ID，<报警集合>>
	private AlarmQueue alarmQueue;// // 报警数据队列
	private Queue<String> queue = new LinkedList<String>();// 每辆车的报警队列
	private final Log logger = LogFactory.getLog(AlarmHandleThread.class.getName());
	Base64ThreadLocal base64;
	public AlarmHandleThread(HashMap<String, Queue<String>> alarmHashMap, AlarmQueue alarmQueue) {
		this.alarmHashMap = alarmHashMap;
		this.alarmQueue = alarmQueue;
	}

	public void run() {
		try {
			base64 = base64Local.get();
			if (base64 == null) {
				base64 = new Base64ThreadLocal();
				base64Local.set(base64);
			}

		} catch (Exception e) {
		  e.printStackTrace();
		}
		logger.error("---------报警数据处理线程启动!---------");
			while (true) {
				/*
				 * sendBody := Format('%d,' +                     //车辆ID                     4
                     '%s,' +                     //报警时间                   8
                     '%s,' +                     //报警开始时间               8
                     '%s,' +                     //报警本段开始报警时间       8
                     '%d,' +                     //报警类型：1:紧急报警 2:超速 3:疲劳，...                               4
                     '%d,' +                     //报警来源：1:车载终端；2:企业监控平台；3:政府监管平台；5:PA; 9：其它。
                     '%s,' +                     //报警来源名称
                     '%d,' +                     //外部报警信息ID                                                        4
                     '%s,' +                     //如：疲劳门限、休息时间、当前驾驶时间。 各种报警参数各不相同           N
                     '%.6f,'+                    //经度            1/1E6      4
                     '%.6f,'+                    //纬度            1/1E6      4
                     '%d,' +                     //传感器速度      1km        1
                     '%d,' +                     //GPS速度         1km        1
                     '%d,' +                     //传感器里程      0.1km      4
                     '%d,' +                     //GPS里程         0.1km      4
                     '%d,' +                     //方向            2dec       1
                     '%d,' +                     //本段报警次数               2
                     '%d,' +                     //累计报警次数               4
                     '%s',                       //状态字 32位               32      sum = 57 + 32 + N
				 */
				try{
					String message = alarmQueue.consume();//报警数据
					if (StringUtils.isNotEmpty(message)) {
						
							String[] business = message.split(",");
							String decoderStr =base64.decoderMessage(business[3].toString());
							// 判断原有队列
//							queue = getHashMapQueue(alarmHashMap.get(business[2]));
//							queue.add(decoderStr + "=====" +business[4]);//业务流水号,业务代码，业务内容,业务描述 |当前毫抄数
//							alarmHashMap.put(business[2], queue);		
							// 过检专用—————————————————— Star
//							queue = getHashMapQueue(alarmHashMap.get(business[2]));
							if(queue.size()>=Tools.realAlarmMaxCount)queue.poll();//车辆ID-报警时间-报警类型+"====="+business[2]+"-"+
							queue.add(decoderStr + "=====" +business[4]+"====="+business[2]);//业务流水号,业务代码，业务内容,业务描述 |当前毫抄数
//							alarmHashMap.put(business[2], queue);								
							// 过检专用—————————————————— End
				    }else{

						Thread.sleep(1);
					}
				}catch(Exception e){
					  e.printStackTrace();
						logger.error("报警数据入HashMap出错:" + e);
				}
				
				}

	}
    
	public Queue<String> getQueue() {
		return queue;
	}

	/**
	 * 是否可以加入新的数据
	 * 
	 * @param oriData
	 * @param nData
	 * @return
	 */
	public boolean isCanAdd(String[] oriData,String nData){
		boolean returnFlag = true;
		for(String oriDdataStr:oriData){
			System.out.println(oriDdataStr);
			System.out.println(oriDdataStr.split("=====")[0]);
			if(nData.equalsIgnoreCase(oriDdataStr.split("=====")[0])){
				returnFlag = false;
				break;
			}
		}
		return returnFlag;
	}
	/**
	 * 判断businessHashMap中的队列
	 * @param queueTemp ,businessHashMap中的队列
	 * @return Queue<String>
	 * */
	public Queue<String> getHashMapQueue(Queue<String> queueTemp) {
		if (null == queueTemp) {
			return new LinkedList<String>();
		} else {
			while (queueTemp.size() >= (Tools.maxMessageNum)) { // 空出一位放新数据
				queueTemp.poll();
			}
			return queueTemp;
		}
	}
	
}
