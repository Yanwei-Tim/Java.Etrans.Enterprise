/**    
 * AlarmHandleThread.java
 * Create on 2011-4-14
 * Copyright (c) 2010 by e_trans. 
 */
package com.etrans.bubiao.repository;

import java.util.HashMap;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.etrans.common.util.Base64ThreadLocal;
import com.etrans.common.util.ByteUtil;
import com.etrans.common.util.Command1792Util;
import com.etrans.common.util.HexUtil;
import com.etrans.common.util.Tools;

/**
 * 指令信息处理线程
 * @author lihaiyan
 * @version 1.0
 */
public class CommandResultHandleThread implements Runnable {
	private final static ThreadLocal<Base64ThreadLocal> base64Local = new ThreadLocal<Base64ThreadLocal>();
	private Random random = new Random();
	private HashMap<String,String> commandResultHashMap;// 指令回复数据储存map
	private HashMap<String,String> specialCommandResultMap;// 指令回复数据储存map(拍摄图片信息)
	private CommandResultQueue commandResultQueue;//指令回复数据队列
	private Queue<String> lowerFlatQueue;
	private ConcurrentHashMap<String, String>  billMap;//电子运单储存map,key=vehicleID,value=bill
	private static String filePath = Tools.getProjectPath().replaceAll("%20", " ") + "command/upload/";
	private final Log logger = LogFactory.getLog(CommandResultHandleThread.class.getName());
	Base64ThreadLocal base64;
	public CommandResultHandleThread(HashMap<String,String> commandResultHashMap, CommandResultQueue commandResultQueue,HashMap<String,String> specialCommandResultMap,Queue<String> lowerFlatQueue,ConcurrentHashMap<String, String>  billMap) {
		this.commandResultHashMap = commandResultHashMap;
		this.commandResultQueue = commandResultQueue;
		this.specialCommandResultMap = specialCommandResultMap;
		this.lowerFlatQueue=lowerFlatQueue;
		this.billMap=billMap;
	}

	public void run() {
		logger.error("---------指令回复数据处理线程启动web!---------");
		try {
			base64 = base64Local.get();
			if (base64 == null) {
				base64 = new Base64ThreadLocal();
				base64Local.set(base64);
			}

		} catch (Exception e) {
		  e.printStackTrace();
		}
			while (true) {
				try
				{    
					String message = commandResultQueue.consume();//指令回复
					if (StringUtils.isNotEmpty(message)) {
							System.out.println("指令回复#########"+message);
							String[] business = message.split(",");
							String decoderStr =base64.decoderMessage(business[3].toString());
							// 多媒体数据处理
							if (business[1].equals("10")) 
							{
								 String[] strTemp = decoderStr.split(",");
								 String fileName = business[2]; // 名称

								 //TODO 判断多媒体数据类型
								 String fileType=strTemp[7];
								 //String form = strTemp[8];//文件格式
								 if("0".equals(fileType)){//图像
									 fileType="jpg";
								 }else{//音频
									 fileType="avi";
								 }
								 Tools.byteArrayToImage(Tools.hexStringToBytes(strTemp[strTemp.length - 1]), fileName, fileType, filePath);
								// logger.error("拍照图片==============================================:" +"image|" + fileName + ".jpg|" + System.currentTimeMillis());
								 specialCommandResultMap.put(business[2], "image|" + fileName +"."+fileType+"|" + System.currentTimeMillis());
								 
							}else if(decoderStr.contains(",770,")||decoderStr.contains(",771,")|| decoderStr.contains(",2304,")||decoderStr.contains(",769,")||decoderStr.contains(",1793,")||decoderStr.contains(",2048,")){//数据透传、事件报告，电子运单,多媒体事件,驾驶员信息
								while(lowerFlatQueue.size()>100)
								 {
									 lowerFlatQueue.poll();
								 }
								if(decoderStr.contains(",1793,")){//电子运单
									String[] strArray=decoderStr.split("\\,");
									String aciiString=strArray[4];
									String stringHex=HexUtil.toStringHex(aciiString);
									try {
										lowerFlatQueue.add(decoderStr.replace(strArray[4], stringHex));
									} catch (Exception e) {
										lowerFlatQueue.add(strArray[0]+","+strArray[1]+","+strArray[2]+","+strArray[3]+","+stringHex);
									}
									billMap.put(strArray[0], stringHex);//key=vehicleID,value=bill
								}else {
									lowerFlatQueue.add(decoderStr);
								}
								if(decoderStr.contains(",770,")){
									String value=decoderStr + "|" + System.currentTimeMillis();
									commandResultHashMap.put("0302|"+business[2], value);
								}
							}else if(decoderStr.contains(",179,")){
								String[] oValue = decoderStr.split(",");
								String value="";
								if(oValue[4].contains("ACC") || oValue[4].contains("软件版本")){
									value=oValue[0]+","+oValue[1]+","+oValue[2]+","+oValue[3]+","+Tools.getNewArray(oValue,4,100,"，") + "|" + System.currentTimeMillis();
								}else{
									value=decoderStr + "|" + System.currentTimeMillis();
								}
								commandResultHashMap.put(business[2], value);
							}else if(decoderStr.contains(",1794,")){//主动上传
								String[] oValue = decoderStr.split(",");
								String[] nValue = oValue[4].split(";");
								//IC编号:3;车辆ID:2;驾驶员身份证编码:123456789012345678;时间:2013-07-23 10:36:45;驾驶员姓名:张;从业资格证编码:A1;发证机构名称:交通
								commandResultHashMap.put("driver"+business[2], nValue[4]+","+nValue[2]+","+nValue[5]+","+nValue[6]);
								lowerFlatQueue.add(decoderStr);
							}else if(decoderStr.contains(",1792,")){//行车记录仪
								String[] value1792 = decoderStr.split(",");
								String ndata = value1792[4].substring(2);
								Command1792Util commandUtil1792 = new Command1792Util(ndata);
								ndata = commandUtil1792.parseData();
								commandResultHashMap.put("0700|"+business[2], ",,,,"+ndata+"|" + System.currentTimeMillis());
							}else {
								String value=decoderStr + "|" + System.currentTimeMillis();
								String[] nValue = value.split(",");
								String[] showValue = nValue[4].split("\\|");
								if(showValue!=null && showValue.length==3){
									String replyFunctionNo = "0"+ByteUtil.DecimalToHex(nValue[2]);
									if(replyFunctionNo.equals("0104") 
											|| replyFunctionNo.equals("0201")  
											|| replyFunctionNo.equals("0700")
											|| replyFunctionNo.equals("0802")){
										commandResultHashMap.put(replyFunctionNo+"|"+business[2], value);
									} else if(nValue!=null && nValue.length==5){
										if(nValue[3].equals("终端通用应答")){
											commandResultHashMap.put(nValue[4].split("\\|")[0]+"|"+business[2], ",,,,"+showValue[1]+"|"+showValue[2]);
										}else{
											commandResultHashMap.put(business[2], value);
										}
									}else{
										commandResultHashMap.put(business[2], value);
									}
								}else{
									commandResultHashMap.put(business[2], value);
								}
								
							}
						    }else{

								Thread.sleep(1);
							}
				}catch(Exception e){
					  e.printStackTrace();
						logger.error("指令回复数据入HashMap出错:" + e);
				}
				
				}

	}
    
}
