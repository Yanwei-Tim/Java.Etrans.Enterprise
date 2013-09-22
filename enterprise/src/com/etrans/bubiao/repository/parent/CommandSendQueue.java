/**    
 * commandSendQueue.java
 * Create on 2010-8-17
 * Copyright (c) 2010 by e_trans. 
 */
package com.etrans.bubiao.repository.parent;

import java.util.concurrent.ConcurrentLinkedQueue;

import com.etrans.bubiao.sys.Constants;

/**
 * 指令发送队列
 * @author lihaiyan
 * @version 1.0
 */

public class CommandSendQueue {
	ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<String>();

	/**
	 * 将值存入队列中
	 * */
	public void produce(String message) {
//		while (queue.size() == Constants.CommandSendQueueMaxNum) {
//			 queue.poll();
//		}
		queue.add(message);
	}

	/**
	 * 取队列值,并删除所取值
	 * */
	public synchronized String consume() {
		this.notifyAll();//唤醒所有等待的线程
		String message = null;
		if (!queue.isEmpty()) {
			message = (String) queue.poll();
		}
		return message;
	}
	
	public  void clean(){
		queue.clear();
	}

}
