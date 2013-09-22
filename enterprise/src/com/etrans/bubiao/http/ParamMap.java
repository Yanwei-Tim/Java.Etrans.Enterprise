/**
 * ParamMap.java
 * Create on 2012-1-10下午05:20:17
 * Copyright (c) 2012 by e_trans.
 */
package com.etrans.bubiao.http;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.etrans.common.util.json.JSONUtil;

/**
 * @author Ivan
 * @version 1.0
 * @brief Http 参数Map
 */
public class ParamMap
{

 
 /**
  * Where 条件集合
  */
 private  Map<String, Object> whereParam ;
 
 
 /**
  * Order 排序条件集合
  */
 private Map<String, Object> orderParam ;
 
 
 /**
  * 批量插入参数集合
  */
 private List<Map<String, Object>> batchParams ;
 
 
 /**
  * 请求参数Map集合
  */
 private Map<String, Object> map = new HashMap<String, Object>();
 
 
 
 
 
 /**
  * 
  *默认构造方法
  */
 public ParamMap()
 {
	 this.initWhereParam();
	 this.initOrderParam();
	
 }
 
 
 
 /**
  * 获取 where 条件集合的Map对象
  * @return the whereParam
  */
 public Map<String, Object> getWhereParam()
 {
	return whereParam;
 }
 
 
 /**
  * 获取 order 排序集合的Map 对象
  * @return the orderParam
  */
 public Map<String, Object> getOrderParam()
 {
	return orderParam;
 }
 
 
 /**
  * 添加批量插入参数集合
  * @param batchParams
  */
 public void putBatchParams(List<Map<String, Object>> batchParams)
 {
	this.batchParams = batchParams;
 }
 
 
 
 
 /**
  * 添加排序条件集合
  * @param orderParam
  */
 public void putOrderParam(Map<String, String> orderParam)
 {
	
	if(orderParam != null)
	{
	 
	 for (Entry<String, String> entry : orderParam.entrySet())
	 {
		this.orderParam.put(entry.getKey(), entry.getValue());
	 }
	}
	
 }
 

 
 /**
  * 添加Where条件集合
  * @param orderParam
  */
 public void putWhereParam(Map<String, Object> whereParam)
 {
	
	if(whereParam != null)
	{
	 
	 for (Entry<String, Object> entry : whereParam.entrySet())
	 {
		this.whereParam.put(entry.getKey(), entry.getValue());
	 }
	 
	}
	
 }
 
 

 /**
  * 添加查询统计总数的函数名到Where 条件集合中
  * @param totalName
  */
 public void putTotalName(String totalName)
 {
	this.map.put(ParamKey.TOTAL_NAME,totalName);
	
 }
 
 
 
 /**
  * 添加查询的函数名到Where 条件集合中
  * @param tableName
  */
 public void putTableName(String tableName)
 {
	this.map.put(ParamKey.TABLE_NAME,tableName);
	
 }
 
 /**
  * 添加查询的函数名到Where 条件集合中
  * @param tableName
  */
 public void putTableName_01(String tableName)
 {
	this.map.put(ParamKey.TABLE_NAME,tableName);
	
 }
 
 
 
 
 /**
  * 添加条件到Where条件集合中
  * @param keyObject
  * @param val
  */
 public void putToWhereParam(String key,Object val)
 {
	whereParam.put(key, val);
 }
 
 
 
 /**
  * 添加排序条件到 Order 条件集合中
  * @param keyObject
  * @param val
  */
 public void putToOrderParam(String key,Object val)
 {
	 orderParam.put(key, val);
 }
 
 
 
 /**
  * 添加参数到Map对象
  * @param key
  * @param obj
  */
 public void put(String key ,Object obj)
 {
	if(key != null)
	 map.put(key, obj);
 }
 
 
 
 /**
  * 获取
  * @param key
  * @return
  */
 public Object get(String key)
 {
	 return map.get(key);
 }
 
 
 
 /**
  * 移除
  * @param key
  */
 public void remove(String key)
 {
	  map.remove(key);
 }
 
 /**
  * 清除
  * @param key
  */
 public void clear()
 {
	  map.clear();
	  whereParam.clear();
	  orderParam.clear();
 }
 
 
 
 /**
  * Map 条件集合的长度
  * @return
  */
 public int size()
 {
	 return map.size();
 }
 
 
 
 /**
  * 转换成请求参数{“key1”:"val1","key2":"val2"}
  * @return
  */
 public  String asJson()
 {
	map.put(ParamKey.WHERE_PARAM, whereParam);
	map.put(ParamKey.ORDER_PARAM, orderParam);
	
	if(this.batchParams != null)
	{
	 map.put(ParamKey.SET_PARAM, batchParams);
	}
	
	String json = JSONUtil.toJson(map);
	return json;
	
 }
 
 
 
 /**
  * 初始化Where条件的Map对象
  */
 private  void initWhereParam()
 {
	
	 if(whereParam == null)
	 {
		whereParam = new HashMap<String, Object>();
	 }
 }
 
 
 
 /**
  * 初始化Order 条件集合的Map对象
  */
 private void initOrderParam()
 {
	if(orderParam == null)
	 {
	  orderParam = new HashMap<String, Object>();
	 }
	
 }


 
 
 
}
