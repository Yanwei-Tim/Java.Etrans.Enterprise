package com.etrans.bubiao.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etrans.common.util.HttpConfig;
import com.sun.java_cup.internal.runtime.virtual_parse_stack;

/**
 * 从TA获取接口数据服务
 * @author hgq
 *
 */
@Service
@SuppressWarnings("unchecked")
public class TaService extends BaseServices{
	
	/**
	 * 设置配置服务路径
	 */
	private void SetHttpConfig() {
		 httpClient.addServerURL(prepareServerURL());
	}
	
	/**
	 * 重设配置路径
	 * @return
	 */
	private  List<String> prepareServerURL()
	{
		String config="/httpTAService_config.properties";
		return HttpConfig.getServiceHttpConfig(config);
	}
	
	@Autowired
	private IbatisServices ibatisServices;

	public IbatisServices getIbatisServices() {
		return ibatisServices;
	}

	public void setIbatisServices(IbatisServices ibatisServices) {
		this.ibatisServices = ibatisServices;
	}
	
	public List<HashMap<String, String>> getDataFromMysql(Map<String, Object> paramMap,String strSql)
	{
		try 
		{
			SetHttpConfig();
			List<HashMap<String, String>> list =(List<HashMap<String, String>>)super.queryAsServiceResult(strSql, paramMap).getData();
			return list;
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}

}
